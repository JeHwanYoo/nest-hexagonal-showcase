import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage/e2e',
      include: [
        '**/*.service.ts',
        '**/*.port.ts',
        '**/*.controller.ts',
        '**/*.repository.ts',
      ],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.{idea,git,cache,output,temp}/**',
        'src/app.controller.ts',
        'src/app.service.ts',
      ],
    },
  },
  plugins: [swc.vite()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
