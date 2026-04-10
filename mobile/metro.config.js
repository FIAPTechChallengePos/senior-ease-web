const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

/**
 * O bundle web pode resolver o ESM do Zustand (.mjs), onde `zustand/middleware` usa
 * `import.meta.env` (Redux DevTools). O runtime web do Expo não trata `import.meta` nesse
 * contexto → "Cannot use 'import.meta' outside a module". Forçamos os .js CommonJS.
 */
function resolveZustandToCjs(moduleName) {
  if (moduleName === "zustand") {
    return path.join(__dirname, "node_modules", "zustand", "index.js");
  }
  if (moduleName.startsWith("zustand/")) {
    const sub = moduleName.slice("zustand/".length);
    return path.join(__dirname, "node_modules", "zustand", `${sub}.js`);
  }
  return null;
}

const upstreamResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const filePath = resolveZustandToCjs(moduleName);
  if (filePath) {
    return { type: "sourceFile", filePath };
  }
  if (typeof upstreamResolveRequest === "function") {
    return upstreamResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
