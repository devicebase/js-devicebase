import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'DeviceBase',
      // Not supporting iife for now
      formats: ['es', 'umd'],
      fileName: (format) => {
        return `devicebase.${format}.js`
      },
    },
    rollupOptions: {
      external: [/^node:/],
      output: {
        globals: {
          'node:buffer': 'Buffer',
          'node:process': 'process',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
    outDir: 'dist',
  },
})
