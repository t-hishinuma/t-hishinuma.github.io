---
title: "Implementation and Evaluation of BLAS on PEZY-SC/SC2 Processor"
images: [images/logo.png]

date: 2020-02-19

emoji: true
mathjax: true
tags: ["PEZY"]
---

# Abstract
We have been developing the power-efficient super computer ZettaScaler series. We adopted three novel technologies, MIMD ultra-manycore processor called “PEZY-SC series, high density server board “Brick”, and direct liquid immersion cooling system. They enable us to realize high performance, low power consumption, and space miniaturization at a same time.
A 1st generation processor “PEZY-SC”has 1024 MIMD core, and a 2nd generation processor “PEZY-SC2” has 2048 MIMD core. For a high performance numerical simulation, we implement the BLAS on the PEZY-SC/SC2 processor that called “PZBLAS.”
We provide an OpenCL-Like programming environment that named “PZCL” in order to use the PEZY-SC/SC2 processor easily. The “PZBLAS” has two interfaces. A 1st interface is “PZC interface” that is same interface as CBLAS interface. A user does not need rewrite program using the CBLAS. However, it needs to communicate the PEZY-SC/SC2 processor from the Intel Xeon processor in each calling function. A 2nd interface is “PZCL interface” that is OpenCL-like one. It can avoid extra-communications in exchange for rewriting program.
In this talk, we introduce our systems and performance tuning techniques. And we evaluate these performances, the difference of each interface, and the power-efficiency.

# Links
[SIAM PP18](https://archive.siam.org/meetings/pp18/)

[Conference Program (with all abstracts)](https://archive.siam.org/meetings/pp18/PP18_program_abstracts-01-16-18.pdf)
