---
title: "[HPC4CAE] プロセッサの性能指標"
images: [images/logo.png]

date: 2020-08-18

tags: ["HPC4CAE", "HPC"]

draft: true
emoji: true
mathjax: true
---

## はじめに
現在のプロセッサでは，浮動小数点の積，または和を1秒で何回できるかで性能が議論される．
プロセッサが理論上1秒間に何回計算できるかを理論性能（またはピーク性能）とよぶ．
これはFLOPS (Flopating Point Operation Per Sec) という単位で書かれる．

「そんなの調べればどこかに載ってるよ！」と思うかもしれないがそれは違う．
現在のプロセッサにはいくつかの高速化機構が搭載されていて，それぞれプログラムを改良しないとその機構を利用することができない．
本記事ではそれぞれの高速化機構を紹介し，自分のプロセッサの理論性能が計算できるようになることを目指す．
これは機構をどのように採用するかが違うだけで，IntelでもARMでもGPUなどのアクセラレータでも計算方法はすべて同じである．


計算機は何GFLOPSなのかを知り，自分のプログラムの実行時間と比較することで，

* 自分のプログラムが速いのか遅いのか
* 理論上何秒くらいでプログラムを実行できるのか
* 現在のプログラムには高速化の余地があるのか

などを知ることができ，目指すべきゴールを定めることができる．
高速化機構を利用するプログラムは外注するとしても，
そもそもアルゴリズムのオーダ的に達成できなかったりマシンを買い換えればあっさり解決するということはよくあることなので，
ざっくりと計算できることは役に立つはずである．

本記事ではCPUの"理論性能"に着目して解説する．
実際のほとんどの場面では様々な要因によって理論性能は出ないが，それについては別の記事で解説することにする．

また，初心者向けの記事であるため，初心者がやらなそうな黒魔術的な例外については触れない．
詳しい皆様には，「こういうことをしないと並列化できない」←「いやいやこういう黒魔術が」などというコメントは混乱を生むだけなのでぐっと我慢していただきたい．

## プロセッサの性能を決めるもの
プロセッサは積や和を行う命令を1サイクルに1回実行できる．
厳密には1サイクルに1回ではなくパイプラインによって隠蔽されていたり，条件分岐が起きると色々と問題が起きるわけだが，
今回は"理論性能"の話なのでそういった複雑なことは起きず，1サイクルに1回実行できるものとする．

現在のプロセッサにおいてピーク性能を求める計算式に関係している要素は次の3つである．

1. 動作周波数
2. 浮動小数点演算ユニット（FPU）の同時演算数
3. コア数

プロセッサは1秒に動作周波数だけ処理を行うことができる．
そのため特に並列化などを行わない場合においても，動作周波数と同じ程度の浮動小数点演算を実行することは期待できる．
多くのCPUでは3GHzくらいなので，何もしなくても3GFLOPS程度ということである．
1コアで使うことはあまりないがGPUでも同じことで，大体800MHzとか1GHzとかで，800GFLOPSとか1GFLOPSとかである．


### FPU内の並列化
FPU（Floating Point Unit）は浮動小数点数に対する処理を実行する演算器で，演算コア内に搭載されている．
本論文では主に浮動小数点数に対する加算，乗算，積和を行うことのできるものを指す．
演算器は命令発行ポートから命令を受け取ることでそれぞれの計算を行う．
SIMD命令やFMA命令とよばれる命令を用いることで
1命令で同時処理するデータ数を増加させることで計算時間を短縮することができる．
それぞれについて以降で述べる．

\subsubsection{FMA命令}
Fused Multiply-Add（FMA）命令はIEEE Std. 754-2008 \cite{ieee754-2008}に規定されたFMA演算を行う積和演算の1つである．
積和演算は$x \times y + z$を行う演算で，
FMA演算は$x \times y$の結果を丸めずにケチ表現を含む106 bitの中間レジスタに保持し，
加算に利用することで精度よく積和演算を行える \cite{ieee754-2008}．
これを1命令で行う命令をFMA命令，実行する演算器をFMA演算器とよぶ．
なお，ケチ表現は正規化された仮数部の最上位ビットを省略した表現を意味する．

なお，FMA演算はC99やC++11から``fma''という関数で提供されており \cite{fma_c}
ハードウェアでFMA命令が使えない場合はソフトウェアによる実装が利用できるが，
ハードウェアによる実装と比べ10～20倍の時間がかかるため，
本論文ではFMA演算器が搭載されていることを前提とする．

積を行う命令と同じサイクル数で命令を実行できるため，
DGEMMのような積と和の回数がほぼ等しい演算では2倍の性能が期待できる．
FMA命令を利用する方法は次の3つである．

* アセンブリ言語を用いてFMA命令を記述する
* C99やC++11の``fma''関数 \cite{fma_c}を利用する
* コンパイル時にコンパイラに対しFMA命令を自動生成するオプションを与える

これらのどれも行っていない場合，FMA命令は使用されていないと思ってよい．

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\subsubsection{SIMD命令}
SIMD（Single Instruction Streaming Multiple Data Streaming）は，
1命令で複数のデータに対して同時処理（SIMD演算）を行う．
SIMD命令を用いて処理を並列化することをSIMD化とよび，
SIMD命令で同時に処理することのできる数をSIMD長とよぶ．

SIMD命令を実行するための機構は一般的に複数のデータに対する演算を同時に実行できる演算器およびレジスタを用いて実装され，
同時処理する複数のデータを格納できるレジスタ（SIMDレジスタ）にデータを格納し，
専用の演算器（SIMD演算器）に対して専用の命令（SIMD命令）を用いて複数のデータに対する同時処理をう．
SIMD命令はSIMDレジスタに対するロード，ストア，演算用の命令群（命令セット）が型ごとに実装されている．
ほとんどのSIMD命令は倍精度などの命令と同じ時間で実行できるため，
単位時間あたりのデータ処理量が向上することでSIMD命令を用いない場合と比べて性能が同時処理数分だけ向上する．

SIMD長が4のSIMD命令を用いたSIMD化の基本的なフローは次のようになる．
\begin{enumerate}
	\item メモリからSIMDレジスタに対して連続な同一の型の4個のデータを読み込む命令（以下，ロード命令）を用いてSIMDレジスタに読み込み，
	\item SIMDレジスタの4個のデータに対して1つのSIMD命令を用いた演算を行い，
	\item レジスタ内の4個の計算結果をメモリの連続した領域に格納する命令 （以下，ストア命令）を用いて格納する．
\end{enumerate}

SIMD命令の制約としてレジスタ内の複数のデータに対して1つの命令で一括して処理を行うため，
レジスタ内の特定のデータのみ異なる処理を行ったり，異なる型のデータをSIMDレジスタに格納することはできない．
また，異なる型のデータが格納されたSIMDレジスタ同士の処理を行うことはできない．
ロードやストアの対象となるデータが連続に配置されていない場合は
``gather''や``scatter''とよばれる非連続領域からのデータ集約や拡散のための特殊な命令を用いるか，
ロード命令やストア命令を用いるためにユーザがデータを連続した領域に再配置する必要があるため性能が低下する．

SIMD命令を利用する方法は次の4つである．
\begin{enumerate}
	\item アセンブリ言語を用いる
	\item アセンブリ言語のニーモニックとほぼ1対1の組み込み関数を用いる
	\item コンパイル時にコンパイラに対しSIMD命令を自動生成するオプションを与える
	\item OpenMP \cite{omp} などのフレームワークに実装されているコンパイラへの指示句を用いる
\end{enumerate}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\subsection{マルチコアによる並列化}
マルチコアは1つのプロセッサ（またはチップ，パッケージともよばれる）内に複数のコアを搭載する技術である\cite{pata-henne}．
各コアは命令発行ユニットやレジスタ，演算器をもつ．

スレッドという単位に処理を分割し，各演算コアにスレッドを割り当てることで処理を高速化でき，
均等に処理を分割できれば最大でコア数分の高速化が期待できる．
本論文ではコアに対し最大1つのスレッドを割り当てることとし，
複数のスレッドに処理を分割して複数のコアに処理を割り当てて並列化することをマルチスレッド化とよぶ．
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

マルチスレッド化を行う場合，
OpenMP \cite{OpenMP}やPOSIX thread（pthread） \cite{pthread}を用いるのが一般的である．
pthreadはスレッド生成，終了，スレッド間のデータのやりとりなどを制御することのできるライブラリである．
OpenMPはマルチスレッド化を行うためのフレームワークで，
プログラムの並列化箇所にコンパイラへの指示句を入れることでマルチスレッド化を行う．行