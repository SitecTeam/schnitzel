import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Packages with Cloudflare Workers (workerd) specific code
  // Read more: https://opennext.js.org/cloudflare/howtos/workerd
  // wrangler must be external so webpack doesn't try to bundle it — the
  // payload.config.ts dynamically imports wrangler via getPlatformProxy and
  // bundling it breaks the import in the Next.js server context.
  serverExternalPackages: ["jose", "pg-cloudflare", "wrangler"],

  webpack: webpackConfig => {
    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };

    return webpackConfig;
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
