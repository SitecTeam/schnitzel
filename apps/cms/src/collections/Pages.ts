import type { CollectionConfig, PayloadRequest } from "payload";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
  },
  access: {
    read: () => true,
  },
  fields: [
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
          collection: "pages",
          where: { slug: { equals: value } },
          limit: 1,
          depth: 0,
        });
        if (
          existing.docs.length > 0 &&
          String(existing.docs[0].id) !== String(id)
        ) {
          return `Slug "${value}" is already in use by another page. Please choose a different slug.`;
        }
        return true;
      },
    },
    {
      name: "content",
      type: "richText",
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "status",
      type: "select",
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
