---
title: "数値計算用のベンチマークを取れるコンテナを作っている (OpenBLAS, cuBLAS, fftw, cufft)"
images: [images/logo.png]

date: 2020-05-04

tags: ["HPC", "Software", "Programming"]

draft: false
emoji: true
mathjax: true
---

# TL; DR

検索するとCineBenchやゲーム系のベンチマークとかいう何をやっているのか良くわからん結果ばっかりで数値計算の役に立たないのしかでてこない．

STREAMとDGEMM/SGEMMとFFTをCPUとGPUで回してくれるだけでいいんだ！と思うんだけど，冷静に考えるとそういうライブラリってベンチマーク機能が付いてるわけじゃない (てかSTREAMって使いにくいよね．．．)．

ベンチマーク結果はIntelとかNvidiaも出しているけど，アーキごとに項目が整っているとは言いにくい．\
数値計算の結果は少ない人数しか興味がなかったのは昔の話で，最近は機械学習の人とかもBLASとかFFTの結果を知りたいはずだから需要がある気がしてるんだけど，統一されたベンチマークがでてくる気配はない．

ベンチマークは比較に意味があるので多くの人が回してくれることが望ましいけど，
我々みたいに自分でOpenBLASだのcuBLASだとfftwだの落としてビルドして，自分でC++でベンチマークコード書いて，自分でsedとかawkとか叩いてgnuplotで整形できる人ばっかりじゃないはず．

**そうだ．コンテナ使って数値計算ライブラリの評価が簡単にやれるやつ作ろう．と思い立ってから早かった手作りベンチマークコンテナ**

**最近はDockerでGPGPUするのも簡単になったしUbuntu 20.04ではDockerがaptで入るようになったしな！**

あ，名前は **numa_benchmark**にしました．\
NUMerical  linear  Algebra Benchmarkの略であってhishinumaとは関係ありません．本当です．


# で，どうやって使うの

コードはここにおいて作ってる．ちゃんとCPUとGPUの両方に対応してる．

[https://github.com/t-hishinuma/numa_benchmark](https://github.com/t-hishinuma/numa_benchmark)

コンテナ内に中に`run`ってコマンドが仕込んであって，実行するとそれを回してくれるようにした．かんたん．

`run`するとOpenBLASをビルドしていろんなサイズでベンチマークしてくれる．

いまは `dot` と `gemm` のベンチマークだけけど，
だいたいコンテナ落とす時間も含めて10分くらいで終わるんじゃないかな．
機能面はこれから増やしていくつもり (STREAMはdotがあるからいいかな．．？いいよね．．？)．

DockerHubにも上げてあるので，サイズとかデフォルト設定でいい人は
```
docker run hishinumat/numa_benchmark run
```

するだけで簡単にベンチマークしてyaml形式で標準出力に結果を出してくる．

サイズとか色々変えたい人はgitからconfigを落としてきて，書き換えて，configのある場所をdockerにマウントすればそのとおりに実行される．\
`$PWD` のマウントで良ければ `make benchmark` すればdockerコマンド打たなくてよい

```
git clone git@github.com:t-hishinuma/numa_benchmark.git
# vim benchmark_config # if need to change
make benchmark
```

自分でconfigを食わせた場合は結果は`result/`に出てくる．
せっかくの仮想化だから，pythonのライブラリなんかもコンテナに混ぜて，yamlを元にmatplotlibでプロットしたpngとhtmlも出力してくれるようにした．

でもコードはPythonなんもわからんおじさんすぎてあまりにも適当．\
この辺手伝ってくれる人が居たらとても喜びます

結果はこんな感じで，だいたい欲しい情報はでていると思う．
```
- {"type" : "blas3", "func" : "sgemm", "arch" : "cpu", "# of threads" : 4, "size" : 200, "time [s]" : 0.00050887, "perf [GFLOPS]" : 31.4422}
- {"type" : "blas3", "func" : "sgemm", "arch" : "cpu", "# of threads" : 4, "size" : 400, "time [s]" : 0.00470929, "perf [GFLOPS]" : 27.1803}
- {"type" : "blas3", "func" : "sgemm", "arch" : "cpu", "# of threads" : 4, "size" : 600, "time [s]" : 0.00149058, "perf [GFLOPS]" : 289.82}
- {"type" : "blas3", "func" : "sgemm", "arch" : "cpu", "# of threads" : 4, "size" : 800, "time [s]" : 0.00314846, "perf [GFLOPS]" : 325.238}
- {"type" : "blas3", "func" : "sgemm", "arch" : "cpu", "# of threads" : 4, "size" : 1000, "time [s]" : 0.00637455, "perf [GFLOPS]" : 313.748}
```

## GPUも動くんやで

GPUも動く．そう`numa_benchmark`ならね．．

あ，でもNvidia Driverとかnvidia-container-runtimeとかは各自で落としてください．

Dockerに`--gpus all` 付けた場合はGPUでも動く．(nvidia-smiの存在を見てる)

```
make benchmark-gpu
```

かんたんヽ(｀▽´)/


# 結果の共有・upload

結果の共有やアップロード方法は悩んでいるところだが，とりあえずcurlでyamlを送りつけると可視化してくれるサーバをGCP無料枠に作った．

[http://34.67.228.30/](http://34.67.228.30/)

githubのリポジトリに上がってる`upload.sh`にyamlを食わせるとcurlでuploadしてくれます．
今は私の仮想マシンの結果が上がってると思う．

**セキュリティとかグダグダだから気にする人はupしちゃだめ**

今は3時間くらいで作ったのでまじでなんにもしてないです．落ちたり漏洩したらまずい人は触れないで下さい．

こういうのS3的なのとかを使ってmodernに作りたいけどあんまり詳しくて泣いてる30歳の夜．(これも誰か教えて)

作り方・方針・ベンチマーク対象・出力・サーバ構築と悩みのタネが多いプロジェクトなので，
使ってコメントとか貰えるととても喜びます．コメントは[Twitter][2]でもメールでもOKです．

[1]: [https://www.cs.virginia.edu/stream/](https://www.cs.virginia.edu/stream/)
[2]: https://twitter.com/Hishinuma_t
