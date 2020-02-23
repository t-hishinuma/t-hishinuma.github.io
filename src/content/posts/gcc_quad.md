---
title: "gccの4倍精度の使い方と性能 [gcc quadruple precision]"
images: [images/logo.png]

date: 2020-02-23

tags: ["HPC", "Multi-precision", "Programming"]

draft: false
emoji: true
mathjax: true
---
2011年，5月のリリースでgcc4.6から4倍精度が入った．
昔のブログで軽く使い方を書いたが他のサイトに情報があまり増えてなかったし，私の記事もできが悪かったのでこっちに移転したので改めてまとめてみた．

簡単な使い方としては，
[libquadmath][quad]を使うことになる．

`__float128` 型を宣言して使う．倍精度を代入して使うこともできる．
4倍精度数を表現したい場合には後ろに `q` をつけて使う．

四則演算子や代入なども使えるが，`printf`だけはchar型の配列に変換してから使う必要がある．
適当なサンプルは以下のとおり：

```c
#include<quadmath.h>
#include<stdio.h>
int main(){
char str[128];
__float128 a;

a = 1.2345678901234567890q;

quadmath_snprintf(str,128,"%.40Qf",a);
printf("%s",str);

return (0);
}
```

``` sh
$ g++ -lquadmath -m128bit-long-double test.c
```

こんな感じに作れる．I/Oがなければ同じプログラムでtemplate使って共通化できるが，
I/Oだけは色々調べたがどうしようもなさそうだった．

試しに内積を実装して時間を測ってみた．\
コードは[ここ][1]においた．

出力を外に出せば，普通に倍精度と共通化してtemplateで作れた．

gcpで16コアのHaswellマシンを借りて実行してみた．\
あんまり参考にはならないが `Intel(R) Xeon(R) CPU @ 2.30GHz`とのこと．

gccは`gcc version 8.2.1 20180905 (Red Hat 8.2.1-3)`\
OSは`CentOS Linux release 8.0.1905 (Core)`

**表 各ベクトルサイズにおける倍精度と4倍精度の実行時間 [ms]**

|      | double | quad |
|------|--------|------|
| 10^3 | 0.028  | 0.48 |
| 10^6 | 0.98   | 7.11 |
| 10^9 | 6487   | 907  |

まぁ7~8倍くらい時間がかかるが，並列化も簡単でコードも倍精度から移行するのはあまり難しくはない．

[1]: https://github.com/t-hishinuma/gcc_quad_test
[quad]: https://gcc.gnu.org/onlinedocs/libquadmath/ 
