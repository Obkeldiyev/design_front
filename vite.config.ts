import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "node-server",
  },
  vite: {
    server: {
      allowedHosts: ["card24.uz", "www.card24.uz", "localhost"],
      host: "0.0.0.0",
    },
  },
});
