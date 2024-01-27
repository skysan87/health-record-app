## setup

### global setup

```bash
# node
$ devbox add nodejs@18
# pnpm
$ devbox add nodePackages.pnpm@latest

# devbox起動
$ devbox shell

# バージョン確認
(devbox) $ node -v
(devbox) $ pnpm -v

# devboxの終了
(devbox) $ exit
```

## コマンド

```bash
# ローカルサーバ実行
pnpm nuxt:dev
```