---
title: "gcloud cloud sdkを使いやすいように環境を整理した"
images: [images/logo.png]

date: 2020-05-03

tags: ["HPC", "Software"]

draft: false
emoji: true
mathjax: true
---

# はじめに
ちょっと前にすぐに導入方法とかコマンドを忘れて仕方がないので，
bashrcに関数作ってGCPでよく使うコマンドを整理したので，忘れないうちにここに書いておく．

テスト用なんかでマシンを立てて，ペペッとコマンド流したいときにやるための：
- マシン一覧取得
- マシン起動・停止
- マシン接続
- マシン削除

という作業を瞬殺する

バイナリをtar.gzで落としてくるのでちゃんと動くか不安だったが，CygwinとWindows上のVM Ubuntu18.04と実機のCentOS8では動いた．\
WSLとMac？しらないけど動くんじゃない

# google cloud sdkのinstall

くわしいことは[公式](https://cloud.google.com/sdk/install?hl=ja)

`yum` とか `apt` でも入るって公式には書いてあるけどgoogleの認証情報を渡すコマンドをシステムに入れるのもなあとか思いながら(たぶん認証情報はユーザの場所に置かれるんだろうけど)，tar.gzがあったのでそっちを使うことにした．

まず落としてきて，

```
wget https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-280.0.0-linux-x86_64.tar.gz
```

入れたら解凍して `/bin` にパス通す．

`sh ./install.sh` すればいいって公式には書いてあるけど，どこに入るのかよくわかんないから信じずに自分でパスを通しているポンコツが私です．

```
gcloud components update
```

するとupdateされるので知らんけどとりあえずやる

# 初期設定
```
gcloud init
```

するとgoogleアカウントの認証がはじまる．
なんか適当にやってるとURLが出てくるのでコピってブラウザに貼ると認証する．

```
gcloud compute instances list
```

とかやるとマシンのリストが出てくれば勝ち

#  使う

上で書いた`gcloud compute instances list`とか，\
`gcloud compute instances start` とか\
やれば良いんだけどコマンドが長くてカロリーの無駄．
新しいマシンを作る設定とかは更に長くてオプションも多いし疲れる．

ってことでbashrcに関数作って纏めた．

```
alias glist='gcloud compute instances list'
alias gssh_up='gcloud compute config-ssh'

gstart() {gcloud compute instances start $1; gcloud compute config-ssh}
gstop() {gcloud compute instances stop $1}

gtest_up(){
	gcloud compute instances create $1 \
		--boot-disk-auto-delete \
		--maintenance-policy TERMINATE \
		--preemptible \
		--zone us-central1-a \
		--image-family ubuntu-2004-lts --image-project ubuntu-os-cloud \
		--custom-cpu 8 \
		--custom-memory 16 \
		--boot-disk-size 10 \
}
```

`gtest_up` は与えられた引数の名前のマシンはubuntu20.04LTSの8 core, 16 GBのマシンをHDD 10GBで構築する

設定の中ははお好みで変えて下さい (とくにzoneとかは自分の好きな所に)．

マシン設定や，皆が大好きなお金の話にもう少し触れておくと，

- `apt update -y` したあとに実際使える`/` の容量は8.1GB
- プリエンティブが有効なので，(2020/05/05現在で)1時間あたり$0.068で7円くらい
- この料金はコア数の分がほとんどなので ($0.05くらい)，さらにメモリをケチることはあんまり効果がない

という感じです．\
コア多めにしてるのはビルドが速くなることを期待しています．

ちなみに `gssh_up`でやってる `gloud compute config-ssh` っていうのが最高で，
起動中のマシンのIPとかを調べてきて`.ssh/config` に追記してくれるコマンドです．

`gtest_up goma` して`gssh_up` するとこんなふうに追記される．

```bash
Host goma.us-central1-a.hishinuma-project
    HostName XXXXXXXXXXXX
    IdentityFile /home/gusta/.ssh/google_compute_engine
    UserKnownHostsFile=XXXXXXXXXXXXXXXXXXX
    HostKeyAlias=XXXXXXXXXXXXXXXXXXXXXXX
    IdentitiesOnly=yes
    CheckHostIP=no
```

あとは `ssh goma.us-central1-a.hishinuma-project` するだけ

完璧や！

ちなみに`gtest_up`の中に`gssh_up`を入れてみたら作成直後だと変なIPを取ってきてダメでした．
`sleep` とか入れるのが良いと思います．

まとめると，
- `glist` してリスト見る
- `gtest_up goma` してサーバを建てる
- `sleep 60` // 起動待ち
- `gssh_up` `sshd_config` を更新する
- sshする // ここにコマンド与えて全自動にしてる
- `gdel goma` でマシン殺す

こんな感じにすると1時間7円かかるけど8コアマシンでテストを全自動にできて幸せ
