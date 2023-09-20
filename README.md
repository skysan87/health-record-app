## setup

### global setup

```bash
# nodeバージョン指定(バージョン管理ツールは任意)
$ nodebrew ls-remote
$ nodebrew install v18.18.0
$ nodebrew list
$ nodebrew use v18.18.0
$ node -v

# pnpm
$ npm install -g pnpm
$ pnpm -v
```

## コマンド

```bash
# ローカルサーバ実行
pnpm nuxt:dev
```