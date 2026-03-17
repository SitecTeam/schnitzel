import type { CollectionConfig } from "payload";

export const Episodes: CollectionConfig = {
  slug: "episodes",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["episodeNumber", "title", "status", "publishedAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "episodeNumber",
      type: "number",
      required: true,
      label: "Episode Number",
      index: true,
    },
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "Slug",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      label: "Short Description / Excerpt",
    },
    {
      name: "content",
      type: "richText",
      label: "Show Notes (full body)",
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      label: "Cover Image",
    },
    {
      name: "youtubeUrl",
      type: "text",
      label: "YouTube URL",
      validate: (value: string | null | undefined) => {
        if (!value) {
          // Allow empty values; required-ness can be controlled separately if needed
          return true;
        }
        try {
          const url = new URL(value);
          if (url.protocol !== "https:") {
            return "YouTube URL must use https://";
          }
          const hostname = url.hostname.toLowerCase();
          const isYoutubeDomain =
            hostname === "youtu.be" ||
            hostname === "youtube.com" ||
            hostname.endsWith(".youtube.com");
          if (!isYoutubeDomain) {
            return "YouTube URL must be from youtube.com or youtu.be";
          }
          return true;
        } catch {
          return "YouTube URL must be a valid URL";
        }
      },
    },
    {
      name: "podbeanUrl",
      type: "text",
      label: "Podbean Embed",
      admin: {
        description:
          "Paste the episode ID (e.g. pb-abc12-def456), the player URL (https://www.podbean.com/player-v2/?i=…), or the full <iframe> embed code from Podbean's Share button.",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Published At",
      index: true,
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      index: true,
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      admin: {
        position: "sidebar",
      },
    },
  ],
};
