import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginBasicSsl } from '@rsbuild/plugin-basic-ssl';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginBasicSsl()
  ],
  source: {
    define: {
      'process.env.RSBUILD_WS_URL': JSON.stringify(process.env.RSBUILD_WS_URL),
      'process.env.RSBUILD_WS_PUBLIC_PATH': JSON.stringify(process.env.RSBUILD_WS_PUBLIC_PATH),
      'process.env.RSBUILD_WS_PROTECTED_PATH': JSON.stringify(process.env.RSBUILD_WS_PROTECTED_PATH),
      'process.env.RSBUILD_REST_URL': JSON.stringify(process.env.RSBUILD_REST_URL),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.RSBUILD_SSE_PUBLIC_PATH': JSON.stringify(process.env.RSBUILD_SSE_PUBLIC_PATH),
      'process.env.RSBUILD_SSE_PROTECTED_PATH': JSON.stringify(process.env.RSBUILD_SSE_PROTECTED_PATH),
    },
    alias: {
      '@': './src',
    },
  },
  server: {
    port: 4113,
    host: 'localhost',
    strictPort: true
  },
});