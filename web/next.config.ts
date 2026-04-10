import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Evita que o Next use um `package-lock.json` fora do projeto (ex.: pasta do utilizador) como raiz do tracing. */
const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
