import type { CollectionConfig } from "payload";

export const Episodes: CollectionConfig = {
  slug: "episodes",
  admin: {
    useAsTitle: "title",
    defaultColumns: [
      "episodeNumber",
      "title",
      "guestName",
      "status",
      "publishedAt",
    ],
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
      name: "guestName",
      type: "text",
      required: true,
      label: "Guest Name",
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
      name: "audioUrl",
      type: "text",
      label: "Audio URL (mp3 or embed link)",
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Published At",
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
