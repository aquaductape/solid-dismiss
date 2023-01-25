import { defineConfig, UserConfigExport } from "vite";
import solidPlugin from "vite-plugin-solid";
import base62 from "./utils/base62";

let id = 0;

const shared = ({ add = {} }: { add?: UserConfigExport } = {}) => {
  return defineConfig({
    base: "/solid-dismiss/",
    plugins: [solidPlugin()],
    build: {
      target: "esnext",
      outDir: "../demo-dist",
    },
    server: {
      port: 3000,
      fs: {
        // Allow serving files from one level up to the project root
        allow: [".."],
      },
    },
    ...add,
  });
};

const buildConfig: UserConfigExport = {
  css: {
    modules: {
      generateScopedName: () => {
        const className = `a-${base62(id)}`;
        id++;
        return className;
      },
    },
  },
};

export default ({ command }: { command: "serve" | "build" }) => {
  if (command === "build") {
    // two classNames are being added for some reason
    // return shared({ add: buildConfig });
    return shared();
  }
  return shared();
};
