---
title: "Webサイトをgithub pages + Hugoに移行した話"
images: [images/logo.png]

date: 2020-02-21

tags: ["雑記", "Web"]

draft: false
emoji: true
mathjax: true
---
# TL; DR

github pagesとHugoでWebページを移行したぜ！

# はじめに
要するにWebページを新しい技術(?)を試しつつ作った．

なんでこんな事を始めたかというと，いま2つのWebページを持っていて，それぞれ:
1. 筑波大学の[学籍番号のWebページ][slis]で業績整理
1. はてなブログに色々[書いていた][hatena]

いくつもWebサイトを抱えるのは正直嫌だったのと，大学の方は卒業すると(卒業できれば)消えてしまう．
いろいろ調べたり考えたりして新しくしたよっていう話．

はてなブログをProにすることも考えたが，Wordpressのサービスだけを利用するのに月額1008円．
そんなのWordpressのSaaSの代金としては信じがたい価格のように思えた
(だってconohaとかさくらインターネットで他のことにも使える2 coreくらいのVPSが借りられてしまう)ので，
Google Domainsで年額1400円のドメイン取って，github pages (無料) + Hugoで静的Webサイトを作ってみた．

それぞれ簡単に説明すると，HugoはMarkdownからhtmlを生成するツールで，
HTMLを直接書かなくていいから楽だというもの．
記事はmarkdownで書いて，全体設定はtomlファイルで指定すると，Hugoコマンドがうまいことhtmlを生成してくれる．

github pagesというのはgithubのトップディレクトリにindex.htmlがあればWebページを公開してくれるというサービスで，独自のドメインも設定できる．
独自のドメインにこだわらなければ完全に無料で使える．
そうそう超えないだろうけどgithub pagesには[いくつかの制限][git_limit]がある．
執筆している2020年2月の時点では：
> GitHub Pages サイトには、次の使用制限があります:
> GitHub Pages ソースリポジトリには、1GB の推奨上限があります。詳しい情報については、「私のディスク容量はいくつですか？」を参照してください。
> 公開されたGitHub Pagesのサイトは1GB以上であってはなりません。
> GitHub Pages サイトには、月当たり 100GB のソフトな帯域幅制限があります。
> GitHub Pages サイトには、時間当たり 10 ビルドのソフトな制限があります。

とのことだが，まぁ基本的にいらぬ心配だろう．

このページは既にMarkdownごと[私のgithub](https://github.com/t-hishinuma/t-hishinuma.github.io)に置かれていて，
例えばこのページは `src/content/posts/hugo_web.md` から生成されて `/posts`に生成されているはずである．
これなら万が一，github pagesの容量や制限がかかったとしても，手元にHTMLはあるのでサーバ借りて移すだけで簡単であろうというわけである．

# 実際どうなの (正直良くない点)

今のところ悪くはないが，静的HTMLなのでWordpressと比べると当然だけど出来ないことはある．
1. Blogにコメント欄などをつけられない
2. 業績一覧などをテーブルにして並び替えたり抽出したりできない
3. ブラウザから記事をかけない
4. 細かい調整やjsとの連携がきつい．

1,2は大きい問題ではあるが，ドメイン代の月100円そこらだけで運用できていて，
3も `git push` するだけなことを考えると，このくらいは諦めるべきだろう．
あと，記事の作りやすい環境はVS codeあたりで構築できる気もする．嫌いだから使わないけど．

万が一，容量などの問題でgithub pagesに何らかの問題が出て，
自前のVPS等に移行する事を考えても，まぁgithubで完結する形でWebページを作ることに意味はあるだろう．

4はちょっと困っている．私の使っているテンプレートがHTMLの埋め込みができないのもあって，
素のMarkdownになるので色とかフォントとか細かく変えられないし，cssはテンプレートの中なのでいじるのが面倒くさい．
同様の理由でjsを埋め込むのも面倒で，そのあたりを弄ろうと思うと無限に時間がかかりそうな感じである．\
あとcssなどの配置や設定方法もテンプレートによって違うので，結構イライラさせられることもあると思う．

実際私は好みのカスタマイズができるテンプレートに当たるまで10個くらい入れたり消したりした．
運良く見つかったこのテンプレートではGoogle analyticsや上下左右のメニューバーがtomlから設定できて便利だったが，
デザインは良くても何にもいじれないみたいなものも多かった．この辺はちょっと面倒くさい．

# おすすめ？

まぁ悪くはない．軽いしデバッグしやすい．\
でも初心者には勧めない．HugoのGUIツールは多分ないので少なくともWSLが欲しくなると思うし，
サーバとかドメインとか全くわからんぞって人にはおすすめしない．

メモ書きみたいなものを書いたりする程度ならおすすめできる．
コードがgithubに上がっているからバックアップとか作業の中断がしやすいというのもGood.

# 作業記録
まぁ調べればすぐ出てくるが，簡単な作業記録を書いておく．

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

## 画像の貼り方
画像はパス指定が面倒くさいし，後でサイズが増えてくるのも嫌なのでgoogle cloud storageに置いてURLをもらうことにした．\
画像に大量のアクセスがあるとお金がかかるけど，まぁ大きな画像を置くわけでもないので気にしないことにする．

## 生成されたWebサイトの性能
ここでgoogleのPageSpeed Insightの結果を御覧ください．

![speed](https://storage.googleapis.com/numa_blog/blog_photo/website_speed.png)

やった～～～～～～～\
githubとgoogle cloud storageの速度が少し不安だったが無事100点であった．
ということで，ここで楽しく過ごしていこうと思う．


[hatena]:http://numa0323.hatenablog.jp/
[slis]:http://www.slis.tsukuba.ac.jp/~s1530534/index.html
[hugo]:https://github.com/gohugoio/hugo/releases
[theme]:https://themes.gohugo.io/
[1]:https://blog.pepese.com/entry/hugo-basics/
[2]:https://themes.gohugo.io/minimo/
[cloud]:https://noi-labo.com/hugo-shortcode-for-optimized-images-cloudinary/
[git_limit]: https://help.github.com/ja/github/working-with-github-pages/about-github-pages