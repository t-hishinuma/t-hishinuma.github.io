---
title: "Webサイトをgithub pages + Hugoに移行した話"
images: [images/logo.png]

date: 2020-02-19

tags: ["雑記", "web"]

draft: true
emoji: true
mathjax: true
---

# はじめに
Webページを新しくした．

今，2つのWebページを持っていて，いくつもWebサイトを抱えるのは正直嫌だったのと，大学の方は卒業すると(卒業できれば)消えてしまう．
1. 筑波大学の[学籍番号のWebページ][slis]で業績整理
1. はてなブログに色々[書いていた][hatena]


はてなブログをProにすることも考えたが，Wordpressのサービスだけを利用するのに月額1008円．
そんなのSaaSの代金としては信じがたい価格だったので，
Google Domainsで年額1400円のドメイン取って，github io (無料) + Hugoで静的Webサイトを作ってみた．

それぞれ簡単に説明すると，HugoはMarkdownからhtmlを生成するツールで，
HTMLを直接書かなくていいから楽だというもの．\
github ioというのはgithubのトップディレクトリにindex.htmlがあればWebページを公開してくれるというサービスで，独自のドメインも設定できる．
独自のドメインにこだわらなければ完全に無料で使えるが，
あまりに大量のトラフィックがあるとgithubから怒られるらしい(どう考えてもいらぬ心配)．

このページは既に[私のgithub](https://github.com/t-hishinuma/t-hishinuma.github.io)に置かれていて，
例えばこのページは `src/content/posts/hugo\_web.md` から生成されて `/posts`に生成されているはずである．

これなら万が一，github pagesの容量や制限がかかったとしても，手元にHTMLはあるのでサーバ借りて移すだけで簡単であろうというわけである．

今のところ悪くはないが，静的HTML+CLIなのでWordpressと比べると当然のように出来ないことはある．
1. Blogにコメント欄などをつけられない
2. 業績一覧などをテーブルにして並び替えたり抽出したりできない
3. ブラウザから記事をかけない

1,2は大きい問題ではあるが，ドメイン代の月100円そこらだけで運用できていて，
3も `git push` するだけなことを考えると，このくらいは諦めるべきだろう．
あと，記事の作りやすい環境はVS codeあたりで構築できる気もする．嫌いだから使わないけど．

万が一，容量などの問題でgithub pagesに何らかの問題が出て，
自前のVPS等に移行する事を考えても，まぁgithubで完結する形でWebページを作ることに意味はあるだろう．

# 作業記録
まぁ調べればすぐ出てくるので細かいことはあまり書かないが，
簡単な作業記録を書いておく．

読者には，Hugoを使ってのWebサイトの作成手順，
Update作業の流れみたいなものを掴んで，「ああ簡単そうだ」くらいの心象をもってもらえたら幸いである．

* Hugoについては[ここ][1]を参考にした
* このページのテーマには[minimo][2]を使った

## Hugoインストール
基本的な流れはMarkdownで書かれた記事やyaml or toml形式のconfigを書いて，`hugo` コマンドでHTMLを生成する．

hugoのバージョン0.6を使った．
```shell
$ hugo version
Hugo Static Site Generator v0.60.1-96066756 linux/amd64 BuildDate: 2019-11-29T14:57:23Z
```
Hugoのインストールは[公式github][hugo]にdebファイルが置いてあるので，最新版をwgetしてきて`sudo dpkg -i hogehoge.deb`すれば簡単に入る．
Windows用にexeも置いてあるようだが，こっちは試していない．

`yum`でも入るようだがCentOS7では随分バージョンが古かった．
Webサイトのテーマが新しいバージョンを要求するものが多いので，
最新版を公式から落としてくることを勧める．

## hugo new site
はじめに`hugo new site [dir/]`コマンドでテンプレートサイトを作る．

次にそのディレクトリにある`themes/`にgithubからテーマを探してきてcloneし，
テーマに入っている (と思う)サンプルを参考にWebページを作る．

テーマは公式が[ここ][theme]にまとめてくれている．

`config.toml`か`config.yaml`にサーバ全体の設定 (Menuとかfaviconとか)を書き，
`static/`に画像など，`contents/`にMarkdownファイルなどを置く．
(このあたりはテンプレートにもよるのかもしれない)．

## hugo, hugo server 
`hugo`コマンドを実行するだけでHTMLが生成される．

Hugoはgoで書かれてて速度がウリとのことで，**このサイト程度なら0.08秒でHTMLを作れた．**
ここは流石というべきか(なお環境はgcp, 2core, 4GB)．

生成したHTMLは`hugo server` コマンドを使えば指定されたポート(default :1313)にWebサーバを立てて結果を確認できる．
`--watch`をつければファイル更新を監視してくれるので，
サーバ立てっぱなしで編集して`:w`するとWebサーバも勝手に直っている
(なお`:w`以外の保存方法は認めていない)．

ただし挙動から見るに，`hugo server`は`hugo`コマンドで生成したサイトを見ているわけではなく，
どこか一時領域にserver用のファイルが別にあるようで (要調査)，
serverだけ打ってアクセスできてもHTMLが最新になっていないことに注意が必要．

`hugo server`コマンドは引数なしでも使えるが，外部アクセスの場合はIPなどを渡さないといけないので，
自動でIP取得してサーバを立ててくれるように，以下のようなMakefileで作業した
(本当は`build`に依存関係を書こうと思ったがHTMLの生成が速いので気にしないことにした．)．

```makefile
all:  build

build:
	hugo

server:  
	$(eval IP := $(shell ip -f inet -o addr show eth0|cut -d\  -f 7 | cut -d/ -f 1))
	hugo server -p 1313 --buildDrafts --watch --baseUrl=${IP} --bind=0.0.0.0
```

作業開始とともにtmuxの適当な窓で`make server`してMarkdownとブラウザを行ったり来たりして，
作業が終わったら`Ctrl-C`でサーバを止め，`make; git add...`していく流れになる．

## 生成されたWebサイトの性能
ここでgoogleのPageSpeed Insightの結果を御覧ください．

![speed](https://storage.cloud.google.com/numa_blog/blog_photo/website_speed.png?hl=ja)

やった～～～～～～～

## 画像の貼り方
画像はパス指定が面倒くさいし，後でサイズが増えてくるのも嫌なのでgoogle storageに置いてURLをもらうことにした．\
画像に大量のアクセスがあるとお金がかかるけど，まぁ大きな画像を置くわけでもないので気にしないことにする．

[hatena]:http://numa0323.hatenablog.jp/
[slis]:http://www.slis.tsukuba.ac.jp/~s1530534/index.html
[hugo]:https://github.com/gohugoio/hugo/releases
[theme]:https://themes.gohugo.io/
[1]:https://blog.pepese.com/entry/hugo-basics/
[2]:https://themes.gohugo.io/minimo/
[cloud]:https://noi-labo.com/hugo-shortcode-for-optimized-images-cloudinary/
