---
title: "AVX2を用いた倍精度BCRS形式疎行列と倍々精度ベクトル積の高速化"
images: [images/logo.png]

date: 2019-12-19

emoji: true
mathjax: true
tags: ["paper"]
---

# Download PDF [![](https://storage.googleapis.com/numa_blog/etc/icon_pdf.png)][ACS48] 

[ACS48]: https://storage.googleapis.com/numa_blog/publications/ACS48.pdf 

# Citation (bibtex)

```
@article{hishinuma2014acs,
	title={AVX2 を用いた倍精度 BCRS 形式疎行列と倍々精度ベクトル積の高速化},
	author={菱沼利彰 and 藤井昭宏 and 田中輝雄 and 長谷川秀彦},
	journal={情報処理学会論文誌コンピューティングシステム (ACS)},
	volume={7},
	number={4},
	pages={25--33},
	year={2014}
}
```

# Abstract

高精度演算を用いることでKrylov部分空間法の収束を改善できるが，高精度演算はコストが高いことが知られている．高精度演算の1つに，倍精度を2つ組み合わせて4倍精度演算を行う倍々精度演算がある．我々は，IntelのSIMD拡張命令であるAVX2を用いてBCRS形式の倍精度疎行列と倍々精度ベクトルの積（DD-SpMV）の高速化を行った．AVX2を用いたCRS形式のDD-SpMVでは，各行で端数処理などを必要とするが，BCRS形式は端数処理をなくし，メモリアクセスを改善できる．しかし，BCRS形式は演算量が増加する．本論文では，AVX2に適したBCRS形式のブロックサイズと，増加した演算量と端数処理の削減，メモリアクセスの改善効果のトレードオフについて示した．実験の結果，AVX2に最も適したブロックサイズは4×1であることが分かった．また，メモリアクセスの改善効果はサイズの大きい問題ほど有効で，行列サイズが10 5以上のとき，演算量が3.3倍以上になるケースにおいても，BCRS4×1にすることでCRS形式の実行時間を約45%に短縮できることを確認した．

# Links

[情報処理学会論文誌 コンピューティングシステム](https://acs.hpcc.jp/)

[情報処理学会 電子図書館](https://ipsj.ixsq.nii.ac.jp/ej/?action=pages_view_main&active_action=repository_view_main_item_detail&item_id=107509&item_no=1&page_id=13&block_id=8)
