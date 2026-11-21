# LUNA AI ATELIER

さいたま市・大宮周辺の小さなお店向け制作サービスのサイト（静的HTML / GitHub Pages）。

- `index.html` … トップ（サービス・料金・FAQ・お問い合わせ）
- `works/` … 架空のお店の制作サンプル（整骨院・美容室・板金）
- `column/` … お役立ちコラム（1記事1テーマ）
- `assets/` … 共通CSS・画像

## 公開前のメモ
- いまは全ページに `<meta name="robots" content="noindex">` が入っています（プレオープン）。検索に出してOKになったら、`index.html`・`column/`・`privacy.html` からこの行を消し、サーチコンソールに `sitemap.xml` を送信します。
- `works/` のサンプルは架空のお店なので、noindex のままにしておきます。
