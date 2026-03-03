import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    mimeTypes: ["image/*", "video/*", "application/pdf"],
    // sharp is not available in Cloudflare Workers — disable image manipulation
    crop: false,
    focalPoint: false,
    // Use native fetch instead of undici to reduce "diagnostic channel" noise
    // in Cloudflare observability logs (safe — Workers blocks private IPs by default)
    skipSafeFetch: true,
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
};
