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
            entry: resolve(__dirname, 'src', 'metagrid-widget.ts'),
            formats: ['es', 'cjs'],
            fileName: (ext) => `metagrid-widget.${ext}.js`,
        },
        target: 'es2015',
        sourcemap: true
    }
});
