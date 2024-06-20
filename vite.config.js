import { defineConfig } from 'vite'

export default defineConfig({
    base: './', // This ensures assets are linked correctly for GitHub Pages
    resolve: {
        alias: {
            'three': 'three'
        }
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    three: ['three']
                }
            }
        }
    }
})