## sqlite-wasmの設定

* ドキュメント

https://sqlite.org/wasm/doc/tip/api-oo1.md

* ホスティング設定(vite)

https://github.com/sqlite/sqlite-wasm?tab=readme-ov-file#usage-with-vite

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  optimizeDeps: {
    exclude: ['@sqlite.org/sqlite-wasm'],
  },
});
```