import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '', // 空文字列を指定して相対パスに設定
  build: {
    outDir: 'dist',  // ビルド成果物をdocsフォルダに出力
  },
})
