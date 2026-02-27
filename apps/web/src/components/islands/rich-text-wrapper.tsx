import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import Typography from "../typography";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

interface RichTextWrapperProps {
  data?: SerializedEditorState | null;
}

const RichTextWrapper = ({ data }: RichTextWrapperProps) => {
  if (!data) {
    return null;
  }

  return (
    <RichText
      data={data}
      className="my-16 lg:max-w-240"
      converters={({ defaultConverters }) => ({
        ...defaultConverters,
        // Basic text elements
        paragraph: ({ node, nodesToJSX }) => {
          const children = nodesToJSX({ nodes: node.children });
          return (
            <Typography
              variant="body-xl"
              className="my-6 text-center text-pretty text-secondary"
            >
              {children}
            </Typography>
          );
        },
        // Headings
        heading: ({ node, nodesToJSX }) => {
          const children = nodesToJSX({ nodes: node.children });
          const tag = node.tag;
          const variant = node.tag as "h1" | "h2" | "h3" | "h4" | "h5";

          return (
            <Typography variant={variant} tag={tag} className="text-secondary">
              {children}
            </Typography>
          );
        },
        link: ({ node, nodesToJSX }) => {
          const children = nodesToJSX({ nodes: node.children });

          return (
            <a
              href={node.fields.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "xl:pr-6"
              )}
            >
              {children}
            </a>
          );
        },
        // Lists
        list: ({ node, nodesToJSX }) => {
          const children = nodesToJSX({ nodes: node.children });
          const ListTag = node.listType === "number" ? "ol" : "ul";

          return (
            <ListTag className="list-disc text-secondary">{children}</ListTag>
          );
        },
        listitem: ({ node, nodesToJSX }) => {
          const children = nodesToJSX({ nodes: node.children });
          return (
            <li className="mb-2">
              <Typography tag="span">{children}</Typography>
            </li>
          );
        },
        // Links

        // Images
        upload: ({ node }) => {
          const image = node.value as {
            url?: string | null;
            alt?: string | null;
          };
          return (
            <div className="relative max-h-[37.5rem] min-h-[22.375rem] w-full overflow-hidden rounded-xl lg:min-h-[37.5rem]">
              <img
                src={image.url || ""}
                alt={image.alt || "Episode image"}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw"
                loading="lazy"
                decoding="sync"
              />
            </div>
          );
        },
        // Blockquotes
        quote: ({ node, nodesToJSX }) => {
          const children = nodesToJSX({ nodes: node.children });
          return (
            <blockquote className="border-l-4 border-white pl-4 italic">
              <Typography>{children}</Typography>
            </blockquote>
          );
        },
        text: ({ node }) => {
          let className = "";
          if (node.format & 1) className += "font-bold ";
          if (node.format & 2) className += "italic ";
          if (node.format & 8) className += "underline ";
          if (node.format & 16) className += "line-through ";
          if (node.format & 32) className += "uppercase ";

          return <span className={className}>{node.text}</span>;
        },
      })}
    />
  );
};

export default RichTextWrapper;
