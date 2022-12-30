---
title: "tmuxでAlt+矢印キーでペインサイズを変更する"
images: [images/logo.png]

date: 2020-08-22

tags: ["Software"]

draft: false
emoji: true
mathjax: true
---

よく忘れるので書いておきます

```
bind-key -n M-Up resize-pane -U 5
bind-key -n M-Down resize-pane -D 5
bind-key -n M-Left resize-pane -L 5
bind-key -n M-Right resize-pane -R 5
```

tmuxも色々カスタマイズできるけど，基本的に必須なのはこれくらいですかね．．
