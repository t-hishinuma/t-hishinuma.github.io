---
title: "pzqd: PEZY-SC2 Acceleration of Double-Double Precision Arithmetic Library for High-Precision BLAS."
images: [images/logo.png]

date: 2020-02-19

emoji: true
mathjax: true
tags: ["Paper", "Multi-Precision", "PEZY", "with_review"]
---

# Download PDF [![](https://storage.googleapis.com/numa_blog/etc/icon_pdf.png)][1] 

[1]: https://storage.googleapis.com/numa_blog/publications/icces2019.pdf

# Citation (bibtex)

```
@inproceedings{hishinuma2019pzqd,
	title={pzqd: PEZY-SC2 Acceleration of Double-Double Precision Arithmetic Library for High-Precision BLAS},
	author={Hishinuma, Toshiaki and Nakata, Maho},
	booktitle={International Conference on Computational \& Experimental Engineering and Sciences},
	pages={717--736},
	year={2019},
	organization={Springer}
}
```

# Abstract

We implemented pzqd, a high precision arithmetic library for the PEZY-SC2 that is based on Hida \etal{}'s QD library. PEZY-SC2 is an MIMD (multiple instruction stream, multiple data stream) -type many-core processor. We optimized matrix-matrix multiplication (Rgemm) in double-double precision (DD) on the PEZY-SC2. Porting the CPU code to PEZY-SC2 code is relatively easy because PEZY-SC2 is a MIMD-type processor; it runs all the threads independently. As a proof of concept, we ported pzqd with minimal modifications to the original QD library; pzqd can treat a DD type variable in a unified way on the host CPU and the PEZY-SC2. The performance of our implementation of Rgemm in DD (DD-Rgemm) on the PEZY-SC2 attained 75\% of the peak performance of DD, which is 20 times faster than an Intel Xeon E5-2618L v3, even including the communication time between the host CPU and the PEZY-SC2. The most important technique for optimizing the DD-Rgemm on the PEZY-SC2 is to make use of the high-speed scratch-pad memory (local memory) installed in each core. We stored the 2x2 DD block matrices and other temporary variables in local memory by reducing the number of threads to increase the local memory size per thread as they occupy local memory even for this block size.

# Links

[The International Conference on computational & Experimental Engineering and Sciences](http://www.iccesconf.org/)

[Springer](https://link.springer.com/chapter/10.1007/978-3-030-27053-7_61)
