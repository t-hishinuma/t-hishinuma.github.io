---
title: "混合精度疎行列計算ライブラリDD-AVX\_v3のv1.0をリリースした"
images: [images/logo.png]

date: 2020-09-06

tags: ["HPC", "Multi-precision", "Programming", "Software"]

draft: false
emoji: true
mathjax: true
---


# はじめに
**DD-AVX\_v3という名前なのにv1.0とはこれいかに？**

ま，まぁとりあえずリリースしたんじゃよ

githubから落としてこられる↓

https://github.com/t-hishinuma/DD-AVX_v3

# DD-AVX\_v3ってなに？
一言でいうとSIMDで高速化した倍精度とDouble-Double精度のSparse BLAS．

混合精度のKrylov部分空間法をいかに簡単かつ高速に実装できるかを考えて作ったライブラリ．

悪条件な問題を解こうとしたとき，高精度演算を使うことで丸め誤差による近似解の収束の影響を抑えて早く収束できる．
ただ，例えば行列は他のライブラリから降ってくるので倍精度でよいとか，
残差の計算は別に倍精度でも良いとか，様々な理由ですべてを倍々精度にしなくても良いというシチュエーションがある．

しかし，変数の精度をどうすれば効率的に計算できるのかはよくわからないし，
普通に考えれば独自型と標準型を組み合わせたコードで変数の型をコロコロ変えるのは吐き気がするレベルで面倒くさい．


私は博士に進学する前は高精度なシミュレーションをやりたいと思ったものだが，
**倍精度とDDを組み合わせたKrylov部分空間法を簡単に作るのがそもそも面倒臭すぎる**
ということで始まったのがDD-AVXライブラリで，色々とI/Fを変えているうちにv3になってしまったということである．

DD型を簡単に扱う方法はHida先生の[QDライブラリ](https://www.davidhbailey.com/dhbsoftware/)の `dd_real` 型を使うことになるのだが，
ベクトルや行列を `std::vector<dd_real>` のようにして宣言することになる．

このときメモリレイアウト的には下のようなAoS型になる．
これが倍精度と組み合わせて混合精度演算をしたり，並列化をしようとしたときに非常に遅くなる．
そこでSoA型にしようとなるのだが，これは `std::vector` のようなベクトルを簡単に使うI/Fが利用できなくなる．

![](https://storage.googleapis.com/numa_blog/dd-avx-soa.png)

**じゃあSoA型に気合で `std::vector` っぽい主要機能を全部書いてやればいいやんけ**

ということでDD-AVX\_v3では5つのクラスを提供している．
### Scalar
* d_real (alias of double)
* dd_real (provided by the QD Library)
### Vector
* d_real_vector
* dd_real_vector
### Sparse matrix (CRS format)
* d_real_SpMat

スカラやベクタの四則演算レベルから基本的な機能を実装してある．
これらはD/DDのキャストや代入などもサポートしているため，
連立一次方程式ソルバをtemplateで実装すれば同じI/Fで倍精度とDD型を使える．

内部ではすべての方の組み合わせに対してAVX / AVX2のintrinsicsを使って最適化してあるため，
どの変数を入れてもDDにキャストされるわけではなく，ちゃんと入力に応じたDDのアルゴリズムが呼ばれるようになっている．

ちなみにaxpyの内部実装はこんな感じ↓

https://github.com/t-hishinuma/DD-AVX_v3/blob/master/src/vector/blas/axpy.cpp


具体的にはBLAS Lv.1のaxpyを様々な精度で呼ぶサンプルを見るとわかりやすい．\
いかに狂気の産物かがわかると思う．

https://github.com/t-hishinuma/DD-AVX_v3/blob/master/test/vector_blas/axpy.cpp


```c++
template<typename ALPHA, typename X, typename Y>
void test(size_t N)
{
	ALPHA alpha = rand();
	X x;
	Y y;

	for(int i=0; i<N; i++){
		x.push_back(rand());
		y.push_back(rand());
    }

    dd_avx::axpy(alpha, x, y);
}

int main(int argc, char** argv){
	size_t N = atoi(argv[1]);

	test<dd_real, dd_real_vector, dd_real_vector>(N);
	test<dd_real, dd_real_vector, d_real_vector>(N);
	test<dd_real, d_real_vector, dd_real_vector>(N);
	test<dd_real, d_real_vector, d_real_vector>(N);
	test<d_real, dd_real_vector, dd_real_vector>(N);
	test<d_real, dd_real_vector, d_real_vector>(N);
	test<d_real, d_real_vector, dd_real_vector>(N);
	test<d_real, d_real_vector, d_real_vector>(N);

	return 0;
}
```

このとおり，すべての組み合わせに対してテストが作成してあり，それぞれちゃんと動作する．
また，このテストはgithub actionsによって自動的にテストされるようになっている．

https://github.com/t-hishinuma/DD-AVX_v3/actions

今回のv1.0では共役勾配法のサンプルも載せてある．

https://github.com/t-hishinuma/DD-AVX_v3/blob/master/sample/cg.cpp

今回のv1.0ではSpMVのみだが，今後のv1.1では転置疎行列ベクトル積を実装したり，BiCG法のサンプルを載せたりする予定である．
また，CRSだけでは操作性が悪いため，密行列やCOO形式なども実装していきたいと思っている．

ちゃんとマルチスレッドとSIMDを利用しているため，性能も倍精度とDDで2倍程度しか変わらない．

今回，黙々と開発するのが辛くなってきたのでgithubにあげてちゃんとリリースノートも書いてREADMEも英語にしてみた．
誰か使ってみて，よかったらgithubのstarをくれたら嬉しい．
