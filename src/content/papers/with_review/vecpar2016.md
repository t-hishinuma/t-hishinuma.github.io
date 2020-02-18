---
title: "SIMD Parallel Sparse Matrix-Vector and Transposed-Matrix-Vector Multiplication in DD Precision"
images: [images/logo.png]

date: 2019-12-19

emoji: true
mathjax: true
tags: ["paper"]
---

# Download PDF [![](https://storage.googleapis.com/numa_blog/etc/icon_pdf.png)][1] 
[1]: https://storage.googleapis.com/numa_blog/publications/VECPAR_2016.pdf

# Citation (bibtex)

```
edings{hishinuma2016vecpar,
	title={SIMD parallel sparse matrix-vector and transposed-matrix-vector multiplication in DD precision},
	author={Hishinuma, Toshiaki and Hasegawa, Hidehiko and Tanaka, Teruo},
	booktitle={International Conference on Vector and Parallel Processing},
	pages={21--34},
	year={2016},
	organization={Springer}
}
```

# Abstract

We accelerate a double-precision sparse matrix and DD vector multiplication (DD-SpMV) and its transposition and DD vector multiplication (DD-TSpMV) using SIMD AVX2.
AVX2 requires changing the memory access pattern to allow four consecutive 64-bit elements to be read at once.
In our previous research, DD-SpMV in CRS using AVX2 needed non-continuous memory load, processing for the remainder, and the summation of four elements in the AVX2 register. These factors degrade the performance of DD-SpMV.
In this paper, we compare the storage formats of DD-SpMV and DD-TSpMV for AVX2 to eliminate the performance degradation factors in CRS.
Our result indicates that BCRS4x1, whose block size fits the AVX2 register's length, is effective for DD-SpMV and DD-TSpMV.

# Links

[VECPAR2016](http://vecpar.fe.up.pt/2016/)

[Springer](https://link.springer.com/chapter/10.1007/978-3-319-61982-8_4)
