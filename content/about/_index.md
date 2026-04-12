---
linkTitle: "About"
title: "菱沼 利彰 (Toshiaki Hishinuma)"
images: [images/logo.png]
weight: 1
date: 2021-05-07
menu: {main, sidebar}
draft: false
emoji: true
mathjax: true
---

{{< text center >}}
# 菱沼 利彰 / Toshiaki Hishinuma
**Ph.D. in Informatics | CTO & Principal HPC Engineer**
{{< /text >}}

## 📋 概要 / Summary
HPC（ハイパフォーマンスコンピューティング）ソフトウェアエンジニアとして、インフラストラクチャからライブラリ開発まで幅広く手がけています。
線形代数計算の加速、特にスパース行列演算の最適化を専門とし、SIMD, CUDA, OpenCL, OpenMP Offloading などの技術を用いて多様なハードウェア上での性能を極限まで引き出す開発に従事してきました。
現在は SB Intuitions 株式会社にて CTO として大規模言語モデル（LLM）向けの超並列計算基盤の構築と開発をリードしています。

---

## ⏳ 経歴 / Career Timeline
{{< mermaid >}}
graph TD
    A[2013: 工学院大学 卒業] --> B[2015: 工学院大学 修士修了]
    B --> C[2017: PEZY Computing]
    C --> D[2019: RICOS / 筑波大学 博士課程]
    D --> E[2020: 筑波大学 博士号取得]
    E --> F[2022: OPPO 日本研究所]
    F --> G[2023: Braid Technologies]
    G --> H[2024 - Present: SB Intuitions]
{{< /mermaid >}}

---

## 🛠 スキル / Skills

| カテゴリ | 技術スタック / 経験 |
| :--- | :--- |
| **Languages** | C/C++ (expert), x86/64 asm, Python, Rust, Fortran, Go, Ruby |
| **Parallelization** | SIMD (AVX512, SVE, NEON), OpenMP, MPI, pthread |
| **Accelerators** | NVIDIA GPU (CUDA), SX-Aurora TSUBASA, A64fx, PEZY-SC2, Xeon Phi |
| **Domains** | Sparse Matrix, BLAS/LAPACK, Krylov Subspace Methods, CAE (OpenFOAM) |
| **Infrastructure** | Linux (Ubuntu, RHEL), Docker, KVM, CI/CD (GitHub Actions, GitLab-CI) |

---

## 💼 職務経歴 / Work Experience
* **2026.04 - 現在**: CTO & プロダクト開発本部 本部長、プリンシパルHPCエンジニア \
  [SB Intuitions株式会社](https://www.sbintuitions.co.jp/)
* **2025.08 - 2026.03**: プリンシパルHPCエンジニア、技術開発部 部長 \
  [SB Intuitions株式会社](https://www.sbintuitions.co.jp/)
* **2024.02 - 2025.07**: シニアHPCエンジニア / Computing PF部 部長 \
  [SB Intuitions株式会社](https://www.sbintuitions.co.jp/)
* **2023.01 - 2024.01**: Software Engineer \
  Braid Technologies Inc.
* **2022.07 - 2022.12**: Software Engineering Adviser \
  天進技術株式会社 (OPPO日本研究所)
* **2019.05 - 2022.06**: 主任研究員 / 研究員 \
  株式会社 科学計算総合研究所 (RICOS)
* **2017.04 - 2019.04**: ソフトウェアエンジニア \
  株式会社 PEZY Computing

---

## 🎓 学歴 / Education
* **2020.03**: 筑波大学 図書館情報メディア研究科 博士後期課程 修了 (**博士（情報学）**)
* **2015.03**: 工学院大学 工学研究科 修理 (**修士（情報学）**)
* **2013.03**: 工学院大学 情報学部情報デザイン学科 卒業

---

## 🚀 主要開発プロジェクト / OSS Development

{{< text center >}}
### [monolish](https://github.com/ricosjp/monolish)
**MONOlithic LInear equation Solvers for Highly-parallel architecture**
HPCエンジニアとアプリケーションエンジニアのギャップを埋めるべく設計された、C++製モノリシック数値計算ライブラリ。
各ベンダーのライブラリ（MKL, CUDA, OpenBLAS等）を統合し、ビルドからDocker展開までをサポート。
{{< /text >}}

{{< text center >}}
### [DD-AVX](https://github.com/t-hishinuma/DD-AVX_v3)
**High Precision Sparse Matrix Operations Accelerated by SIMD**
SIMDで加速された高精度BLASおよびスパースBLASライブラリ。
AVX512, AVX2 等を駆使し、高速かつ精度の高いクリロフ部分空間法の実現を支援。
{{< /text >}}

---

## ℹ️ その他 / Others
* **所属**: 情報処理学会 (IPSJ) 正会員 / HPC研究会 (SIG-HPC) 運営委員
* **資格**: 基本情報技術者, 普通自動車免許
* **誕生**: 1990年3月23日
* **プライバシーポリシー**: [こちら](about/privacy)
