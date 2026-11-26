# LUNA AI ATELIER

さいたま市・大宮周辺の小さなお店向け制作サービスのサイト（静的HTML / GitHub Pages）。

- `index.html` … トップ（サービス・料金・FAQ・お問い合わせ）
- `works/` … 制作サンプル（工事・飲食店・宝石・子ども支援NPO・高齢者支援NPO・花屋）
- `column/` … お役立ちコラム（1記事1テーマ）
- `assets/` … 共通CSS・画像

## 公開前のメモ
- いまは全ページに `<meta name="robots" content="noindex">` が入っています（プレオープン）。検索に出してOKになったら、`index.html`・`column/`・`privacy.html` からこの行を消し、サーチコンソールに `sitemap.xml` を送信します。
- `works/` のサンプルは架空のお店なので、noindex のままにしておきます。

## 独自ドメイン
- 公開先は `https://atelier.lunaaiagents.com/`（`CNAME` ファイルで指定）。
- DNS（Cloudflare）に `atelier` → `lunacoagents.github.io` の CNAME レコード（プロキシはオフ＝DNSのみ）を入れてから、この設定を main に入れます。
- 旧URL `https://lunacoagents.github.io/luna-ai-atelier/` は GitHub が新しいドメインへ自動で転送します。
