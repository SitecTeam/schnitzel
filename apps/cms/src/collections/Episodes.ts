import type { CollectionConfig, PayloadRequest } from "payload";

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
      index: true,
      label: "Slug",
      admin: {
        position: "sidebar",
        components: {
          Field: {
            path: "@/components/SlugInput#SlugInput",
            clientProps: { useAsSlug: "title" },
          },
        },
      },
      validate: async (
        value: string | null | undefined,
        { req, id }: { req: PayloadRequest; id?: string | number | null }
      ) => {
        if (!value) return "Slug is required.";
        const existing = await req.payload.find({
          collection: "episodes",
          where: { slug: { equals: value } },
          limit: 1,
          depth: 0,
        });
        if (
          existing.docs.length > 0 &&
          String(existing.docs[0].id) !== String(id)
        ) {
          return `Slug "${value}" is already in use by another episode. Please choose a different slug.`;
        }
        return true;
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
      required: true,
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
      label: "Podbean Embed Link",
    },
    {
      name: "music",
      type: "textarea",
      label: "Music Credits",
      admin: {
        description:
          "Music credits shown in episode show notes (displayed in primary pink colour).",
      },
    },
    {
      name: "thanksTo",
      type: "text",
      label: "Thanks To",
      admin: {
        description: "Acknowledgement line shown below the music credits.",
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
