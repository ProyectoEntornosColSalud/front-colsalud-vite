// vite.config.js
import {defineConfig} from 'vite';
import {viteStaticCopy} from 'vite-plugin-static-copy'

export default defineConfig({
    base: '/',
    plugins: [
        viteStaticCopy({
            targets: [
                { src: 'src/pages/**/*.html', dest: 'src/pages' }
            ]
        })
    ]
});
