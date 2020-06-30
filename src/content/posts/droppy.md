---
title: "ブラウザからサーバにファイルをuploadするためにdroppyを試す"
images: [images/logo.png]

date: 2020-06-29

tags: ["Software"]

draft: false
emoji: true
mathjax: true
---

# はじめに
サーバ上で作業をしていて，手元のファイルをupload / downloadしたいことがよくあると思う．
大きいファイルを1回送るくらいならやるんだが，
たとえばgnuplotやLaTex, Doxygenと格闘しているときなんかは
サーバ上で生成された画像をdownloadしたり，手元でAdobeなどで作った画像を何度もUploadするようなシチュエーションが生まれる．

閲覧は一過性のもので，セキュリティとかは気にしないことにする

Downloadや閲覧はあんまり問題にならなくて，httpサーバを立てればいいので
1. nginxをdockerであげてみたり ([dockerhub](https://hub.docker.com/_/nginx))
1. cargoで入れられてディレクトリを一発で公開できるやつを使ったり ([basic-http-server](https://github.com/brson/basic-http-server))

他にもやりようはいくらでもある．

ちなみに2.は
```
cargo install basic-http-server
basic-http-server -x -a 0.0.0.0:8080"
```
で現在いるディレクトリがhttpで公開されてこんな風に見える


![simple-http](images/simple-http.png)

問題はuploadである．特に↑の画像みたいなスクリーンショットをmarkdownに貼るなんてやろうと思った日には
スクリーンショットをファイルに保存してターミナル開いてscpするとかしないといけないので発狂しそうになる．

# droppy
結論から言うと[droppy](https://github.com/silverwind/droppy)というのが軽くて良さそうだということが分かった．

これ自体はnpmのライブラリなのでnode.jsを入れなきゃいけないかと思ったらちゃんとdockerが公開されていた．
なんとdocker imagesで確認すると99.5 MBしかない．

root権限でuploadなんかされたらたまったもんじゃないので，ユーザをちゃんと指定してあげることにして，次のようにすればOK．
configのフォルダをマウントしてオプションを色々設定できるみたいだけど，ディレクトリ一覧が見れてちょっとuploadできればいいのでデフォルトに任せた．

```
docker run -p 8080:8989 -v $PWD:/files/ -e UID=$(id -u) -e GID=$(id -g) silverwind/droppy
```

見た目はこんな感じ．画面分割もできる．
![droppy](images/droppy.png)

上げるとユーザ名を聞かれるが，適当なユーザ名とパスワードを入れるとログインできる．
aとかbとかでいい．真面目にやる場合はconfigで設定するんだと思う．

いいところ
* ドラッグアンドドロップでファイルやディレクトリを送れる
* スクリーンショットを取ってペーストボタンを押すとちゃんとファイルとして保存される (素晴らしい！)
* 画像などはブラウザ上で閲覧できる
* テキストファイルなどはエディタが出てきて編集できる
* ディレクトリ作成，ファイル削除，リネームなどの簡単な作業ができる
* docker imagesで確認すると99.5 MBしかない．

悔しいところ
* PDFの閲覧をしようとすると中に組み込まれてる謎のビューアが立ち上がるが，日本語のPDFは文字化けして死んだ
* ファイルを開くとエディタが上がるがエディタが選べない (実は選べるのかも)
* 実行可能ファイルやシェルスクリプト，Makefileの実行などはできない

日本語PDFの閲覧で文字化けするのはちょっと致命的だったが，ダウンロードするかsimple-http-serverで見ればよいのでなんとかならんこともない．
こういうブログみたいなのを書くときには結構便利そうな感じがした．
