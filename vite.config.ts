import { defineConfig } from 'vite'
import { resolve } from 'path'
import eslint from 'vite-plugin-eslint'

export default defineConfig({
    plugins: [eslint({fix:true})],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src', 'index.ts'),
            formats: ['es', 'cjs'],
            fileName: (ext) => `index.${ext}.js`,
        },
        target: 'es2015',
        sourcemap: true
    }
});
