---
title: "日本語のLatexファイルをtextlintで文書校閲しようとした話"
images: [images/logo.png]

tags: ["雑記", "markdown"]

draft: true
emoji: true
mathjax: true
#cover: "/favicon.ico"
---

# はじめに
D論を書いている．
約140ページ，Latexも10ファイルくらいに分かれているものを，まさか目grepするわけにもいかない．

数ページであればMS Wordに貼って，latexの記号部分は手で削除なり，どっかのオンライン校閲ソフトにかけるが，
140ページもそんな事やってたら日が暮れてしまう．(日が暮れるどころか年が暮れてしまう．そんな1月締め切りを迎えた現在12月14日．)

PandocなりでMarkdownやらに変換する事も考えたが，
MarkdownとLatexの変換は(記法によっては)不可逆で，同じものになってくれないので，
結局はMarkdownの修正を手作業でLatexに反映させないといけない．

そんななか，Qiitaの[記事][ja-textlint]にtextlintにlatexを食わせる[プラグイン][plugin]
があると書いてあった．

色々npmでほげほげ試行錯誤して環境が汚れると嫌なので，
GCPでUbuntu 19.10のイメージを新たに作って，
まっさらな状態からtextlint + latexプラグイン+ 校閲プラグインを全部入れてみて，
色々実験したので，その結果を整理してまとめる．

[ja-textlint]: https://qiita.com/kn1cht/items/948a051cb374de13f9a7
[plugin]: https://github.com/fgborges/textlint-plugin-latex2e

# 導入
# npm

aptでnpmを入れる

```sh
sudo apt update -y
sudo apt install -y npm
```

そのままだとnpmはroot権限の場所にインストールしにいくので，
パスを`~/.node_modules_global`に変える．

npmもnpmを使って`~/.node_modules_global`にインストールし直す．
whichでnpmがhomeの方を指しているか確認してOKなら終わり．

```sh
cd ~ && mkdir .node_modules_global
npm config set prefix=$HOME/.node_modules_global
npm install npm --global
export PATH="$HOME/.node_modules_global/bin:$PATH"
```

## textlint

[ここ][lint-inst]を参考にtextlintを入れる．

```bash
npm i -g textlint
```
[lint-inst]: https://efcl.info/2015/09/10/introduce-textlint/

## 適当な日本語ルール
いくつかの日本語のルールをnpmコマンドで入れる．

```bash
sudo npm i -g textlint-rule-max-ten textlint-rule-spellcheck-tech-word textlint-rule-no-mix-dearu-desumasu
```

## textlint

# Todo
このブログも，公開前にtextlintで自動的に校閲されるようにしたい．
本当はpushをトリガーとして自動でやってくれるのがいいのだが．

日本語textlint環境のDockerを作ったほうがいい気がする．
これはまた今度かな．．（D論終わってやるのか？そんなこと？

