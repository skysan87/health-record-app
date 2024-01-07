## setup

### global setup

```bash
# nodeバージョン指定(バージョン管理ツールは任意)
$ volta install node@18.19.0
$ volta list node
# プロジェクトで利用するバージョンを指定(package.jsonに設定)
$ volta pin node@18.19.0
$ node -v

# pnpm
$ volta install pnpm
$ pnpm -v

# volta
# golobalとプロジェクトの指定バージョンが異なる場合
volta run --node v18.19.0 pnpm install cal-heatmap -F @health-record/web
```

## コマンド

```bash
# ローカルサーバ実行
pnpm nuxt:dev
```