---
title: "scpで圧縮転送，踏み台など"
images: [images/logo.png]

date: 2020-08-22

tags: ["Software"]

draft: false
emoji: true
mathjax: true
---

# はじめに
以下の記事は昔のブログに書いてて，忘れたら見に行ってたんだけど，昔のブログはそろそろ潰そうかと思っているので，ここに書き直す．

* ファイルを圧縮して高速転送．トラフィックを減らす．\
`scp -C file usr@name:~/`

* 暗号化方式を変える(ローカルで暗号化は雑でいいから早く送りたいなど)\
`scp -c arcfour128 file usr@name:~/`


* 踏み台経由の転送\
`scp -o 'ProxyCommand ssh 192.168.0.1 -W %h:%p' file user@name:~/`

以上です．おやすみ．
