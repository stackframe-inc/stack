import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import sharedConfig from '../../vitest.shared'

export default defineConfig({
  ...sharedConfig,
  plugins: [react()],
  test: {
    environment: 'node',
    testTimeout: 20_000,
    globalSetup: './tests/global-setup.ts',
    setupFiles: [
      "./tests/setup.ts",
      "./tests/js/setup.ts",
    ],
    snapshotSerializers: ["./tests/snapshot-serializer.ts"],
  },
})
