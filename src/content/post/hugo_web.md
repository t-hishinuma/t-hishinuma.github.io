---
title: "Webサイトをgithub pages + Hugoに移行した話"

date: 2019-12-05T05:00:48+09:00
lastmod: 2019-12-05T05:01:48+09:00

tags: ["雑記", "web"]

draft: false
emoji: true
mathjax: true
#cover: "/favicon.ico"
---

# はじめに
D論の現実逃避でWebページを新しくした．

まぁ現実逃避だけじゃないよっていう言い訳はあって，今のWebサイトが，
* 筑波大学の[学籍番号のWebページ][slis]で業績整理
* はてなブログに色々[書いていた][hatena]

だったが，いくつもWebサイトを抱えるのは正直嫌だったし，大学の方は卒業すると(卒業できれば)消えてしまう．

はてなブログをProにすることも考えたが，Wordpressのサービスだけを利用するのに月額1008円．
そんなのSaaSの代金としては信じがたい価格だったので，
Google Domainsで年額1400円のドメイン取って，github pages (無料) + Hugoで静的Webサイトを作ってみた．

これなら万が一，github pagesの容量や制限がかかったとしても，手元にHTMLはあるのでサーバ借りて移すだけで簡単であろうというわけである．

今のところ悪くはないが，静的HTML+CLIなのでWordpressと比べると当然のように出来ないことはある．
1. Blogにコメント欄などをつけられない
2. 業績一覧などをテーブルにして並び替えたり抽出したりできない
3. ブラウザから記事をかけない

1,2は大きい問題ではあるが，ドメイン代の月100円そこらだけで運用できていて，
更新も `git push` するだけなことを考えると，このくらいは諦めるべきだろう．

万が一，容量などの問題でgithub pagesに何らかの問題が出て，
自前のVPS等に移行するなら上記を作ってもいいかもしれない．

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
Hugoのインストールは[公式github][hugo]にdebファイルが置いてあるので，`dpkg -i`すれば簡単に入る．
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
`hugo`コマンドを押すだけでHTMLが生成される．

Hugoはgoで書かれてて速度がウリとのことで，**このサイト程度なら0.08秒でHTMLを作れた．**
ここは流石というべきか(なお環境はgcp, 2core, 4GB)．

生成したHTMLは`hugo server` コマンドを使えば指定されたポート(default :1313)にWebサーバを立てて結果を確認できる．
どうやら`hugo server`コマンドはファイル更新を監視しているので，
サーバ立てっぱなしで編集して`:wq`するとWebサーバも勝手に直っている
(なお`:wq`以外の保存方法は認めていない)．

挙動から見るに，`hugo server`は`hugo`コマンドで生成したサイトを見ているわけではなく，
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
ここでgoogleのPageSpeed Insightの結果を御覧ください

![speed](/images/website_speed.png)

やった～～～～～～～

[hatena]:http://numa0323.hatenablog.jp/
[slis]:http://www.slis.tsukuba.ac.jp/~s1530534/index.html
[hugo]:https://github.com/gohugoio/hugo/releases
[theme]:https://themes.gohugo.io/
[1]:https://blog.pepese.com/entry/hugo-basics/
[2]:https://themes.gohugo.io/minimo/
