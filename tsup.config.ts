export default {
  entry: ["src/index.ts", "src/client.ts"],
  format: ["cjs", "esm"],
  dts: false,
  clean: true,
  external: ["better-auth", "zod", "@better-fetch/fetch"],
};
