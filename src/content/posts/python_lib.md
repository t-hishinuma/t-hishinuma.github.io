---
title: "機械学習をPythonでやるのは速いのか"
images: [images/logo.png]

date: 2020-06-12

tags: ["雑記", "Multi-precision", "Programming"]

draft: true
emoji: true
mathjax: true
---

# はじめに
[弊社][ricos]は機械学習を使った強い人が沢山いて，はぁはぁなるほど機械学習かあ，などと思って，論文などを眺めたりする機会が最近ちょくちょくある．

といっても私はHPCの人なので数式を見せられた瞬間に計算量を電卓で数え始めてしまう病気が邪魔をして式が何をやっているのかは読んでも一向に頭に入ってこないのだが，
まぁ値なんてものは中に何が入ってようが計算時間には関係ないからね！些細な問題だよ！

まぁとりあえず行列やベクトルに対してどういう計算をするのかはわかった．確かに計算時間はかかるだろう．
何や知らんけどつまり行列演算とベクトル演算が速けりゃいいんだ．簡単だね．

じゃあPythonなんかで使うライブラリはそういう演算をどういう風に実装してるのって言う話をここ数日調べてたので書いておくかとなって今に至る．

# 必要な演算
密行列だけなら比較的簡単でBLASを叩けばいいということになる．

行列計算といえばBLASである．
BLASというのは行列やベクトルの演算の中でよく使うものをまとめてパッケージにしたもので，1979年から続くFortranのライブラリである．
今ではBLASといえば1979年に作られたBLASのことを指すのではなく，BLASと同じI/F，機能を持ったライブラリの規格のことを指す事が多い．

多くのアーキテクチャごとにBLASは開発されており，GPU向けにはcuBLAS, CPU向けにはintelのMKLやオープンソースのOpenBLASがある．
OpenBLASの[x86_64向けのソースコードのディレクトリ][OpenBLAS]を見ればわかるが，
重たい関数はアーキテクチャごとに分かれて実装されており，たとえば[SkylakeのDGEMM(行列積)の一部][skylake-dgemm]を見ても，行列積だけに何百，何千行ものアセンブリがかかれており，
かなりの工数をかけて最適化されていることがわかる．

はっきり言ってこれに性能で勝つのは無理である．一部の人外は除き，普通の人はおとなしくBLASを使っておくのが絶対によい
つまり，PythonだろうとなんだろうとBLASを呼ぶだけなのだから，言語の性能云々は問題にならず，特に改良の余地はない．
BLASは大体I/Fが同じだからアーキテクチャによってリンクするライブラリを変えるだけでいい．

ただ，機械学習はそう簡単な問題ではなかった，
行列を操作する処理，例えば行操作，列操作，対角に対する処理，値全体にフィルタを掛けるような処理などが入っていて，
どうもBLASだけでは足りないようだ (BLASに何が入っているのかは各自調べてほしいが，基本的に行列積，行列ベクトル積，ベクトルの内積みたいな演算だと思ってていい)．

また，どうやら[疎行列][sparse]に対する操作や演算も必要らしい．
疎行列の機能はBLASに含まれていない上に，BLASのような統一されたインターフェースが定義されていない．
[Eigen][Eigen]やMKLに機能があるものの，インタフェースが違うので呼び分けるにしてものような一部のBLASとは違うソフトを呼ぶか，自分で実装することになる．

つまり必要な演算というのは，
1. 密行列に対する演算 
1. 行列操作 (行，列，対角を取り出したり行列ノルムを取ったり) 
1. 疎行列に対する演算

1.はBLASにあるが，2., 3.はない．こいつらがどうなっているのかという話．

理想としては，
サイズを調べたりするような機能はPythonで書いてあってもいいが，ボトルネックとなりうる (つまりfor文を含むO(N)以上の)処理は，
C/C++/Fortranで書いてあるライブラリを呼んでいる，または自前でC/C++/Fortranのコードを抱えてOpenMPなどで並列化されていることが望ましい．

で，Pythonで使うような線形代数ライブラリや機械学習ライブラリはこいつらをどうやって実装しているのかという話になる．
PythonはnumpyやScipyを使えばCと同じ性能が出るんだぜみたいなPythonがすごいんだかnumpyがすごいんだかBLASがすごいんだか分からんポンコツ記事が沢山出回っているが，
行列積が支配的なコードだけちょこっと調べて何でも速いかのような妄想を植え付けてくるのはちょっと問題である．
どこがどういう実装になっているのかをちゃんと確かめることにした．

# Scipy, numpyによる密行列演算
いわゆる行列と行列の積 (gemm)や行列とベクトルの積 (gemv)の実装について調べる．

結論としては(まぁ知ってたけど)BLASをちゃんと呼んでいた．コードがどこにあるのかを一応貼っておく．
ちなみに私はコードは読んでいるがnumpyもscipyもロクに使ったことはないので，「BLASを呼ぶコードが含まれていて，どうやら呼ばれていそう」ということは調べたが，
ビルド条件などによって違う分岐に行ったりするかもしれないので，読者の環境で必ずBLASが呼ばれていることまでは保証できない．


* numpyのBLAS呼び出し: https://github.com/numpy/numpy/blob/de06954b19a6c0980d48e4397adabfd15d808660/numpy/core/src/common/cblasfuncs.c
* Scipyのgemmコード: https://github.com/scipy/scipy/blob/544fc98b6f47f93e52dd5e0654087c8f25b59c99/scipy/linalg/fblas_l3.pyf.src
* SCipyのgemvコード: https://github.com/scipy/scipy/blob/544fc98b6f47f93e52dd5e0654087c8f25b59c99/scipy/linalg/fblas_l2.pyf.src

ということで，gemm, gemvについては改良の余地はないと言っていいだろう．

# Scipy, numpyによる密行列の操作


# Tensorflow?
https://github.com/tensorflow/tensorflow/tree/master/tensorflow/core/kernels


[ricos]: https://www.ricos.co.jp/
[OpenBLAS]: https://github.com/xianyi/OpenBLAS/tree/develop/kernel/x86_64
[skylake-dgemm]: https://github.com/xianyi/OpenBLAS/blob/develop/kernel/x86_64/dgemm_kernel_8x8_skylakex.c
[Eigen]: http://eigen.tuxfamily.org/
[sparse]: https://dziganto.github.io/Sparse-Matrices-For-Efficient-Machine-Learning/


