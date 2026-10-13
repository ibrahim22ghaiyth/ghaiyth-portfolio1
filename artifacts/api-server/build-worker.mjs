import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import { readFile } from "node:fs/promises";

globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(artifactDir, "../..");
const templatePath = path.resolve(repoRoot, "artifacts/portfolio/dist/public/index.html");
const d1Entry = path.resolve(repoRoot, "lib/db/src/d1.ts");
const d1ConnectionString = path.resolve(repoRoot, "lib/db/src/connection-string-d1.ts");

function extractAssetTags(template) {
  return (template.match(/<(?:script|link)[^>]+(?:><\/script>|\/?>)/g) || [])
    .filter((tag) => tag.includes("/assets/"))
    .join("\n");
}

const workerAliasesPlugin = {
  name: "worker-aliases",
  setup(build) {
    build.onResolve({ filter: /^@workspace\/db$/ }, () => ({ path: d1Entry }));
    build.onResolve({ filter: /^@workspace\/db\/d1$/ }, () => ({ path: d1Entry }));
    build.onResolve({ filter: /^@workspace\/db\/connection-string$/ }, () => ({ path: d1ConnectionString }));
    build.onResolve({ filter: /^@workspace\/db\/schema$/ }, () => ({
      path: path.resolve(repoRoot, "lib/db/src/schema-sqlite/index.ts"),
    }));
    build.onResolve({ filter: /^pino$/ }, () => ({
      path: path.resolve(artifactDir, "stubs/pino.mjs"),
    }));
    build.onResolve({ filter: /^pino-http$/ }, () => ({
      path: path.resolve(artifactDir, "stubs/pino-http.mjs"),
    }));
  },
};

const virtualTemplatePlugin = {
  name: "virtual-client-template",
  setup(build) {
    build.onResolve({ filter: /^virtual:client-template$/ }, () => ({
      path: "virtual:client-template",
      namespace: "virtual-client-template",
    }));

    build.onLoad({ filter: /.*/, namespace: "virtual-client-template" }, async () => {
      const template = await readFile(templatePath, "utf8");
      const assetTags = extractAssetTags(template);
      return {
        contents: [
          `export const template = ${JSON.stringify(template)};`,
          `export const assetTags = ${JSON.stringify(assetTags)};`,
        ].join("\n"),
        loader: "js",
      };
    });
  },
};

async function buildWorker() {
  const distDir = path.resolve(artifactDir, "dist");
  const outfile = path.join(distDir, "worker.mjs");

  await esbuild({
    entryPoints: [path.resolve(artifactDir, "src/worker.ts")],
    bundle: true,
    format: "esm",
    target: "es2022",
    platform: "node",
    conditions: ["workerd", "worker", "browser"],
    outfile,
    logLevel: "info",
    sourcemap: false,
    minify: false,
    legalComments: "none",
    mainFields: ["module", "main"],
    banner: {
      js: `import { createRequire as __bannerCrReq } from 'node:module';
try {
  globalThis.require = __bannerCrReq(import.meta.url);
} catch {
  globalThis.require = __bannerCrReq("/");
}
`,
    },
    plugins: [workerAliasesPlugin, virtualTemplatePlugin],
  });

  console.log(`[worker] Built ${outfile}`);
}

buildWorker().catch((err) => {
  console.error(err);
  process.exit(1);
});
