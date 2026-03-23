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
    {
      name: "focalX",
      type: "number",
      label: "Focal Point X (%)",
      min: 0,
      max: 100,
      defaultValue: 50,
      admin: {
        description:
          "Horizontal focus: 0 = left edge, 50 = center, 100 = right edge",
        step: 1,
      },
    },
    {
      name: "focalY",
      type: "number",
      label: "Focal Point Y (%)",
      min: 0,
      max: 100,
      defaultValue: 50,
      admin: {
        description:
          "Vertical focus: 0 = top edge, 50 = center, 100 = bottom edge",
        step: 1,
      },
    },
  ],
};
