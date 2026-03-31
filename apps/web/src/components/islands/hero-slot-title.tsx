import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { textVariants } from "@/components/typography";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type TextVariantProps = VariantProps<typeof textVariants>;

interface HeroSlotTitleProps {
  text: string;
  className?: string;
  variant?: TextVariantProps["variant"];
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

export default function HeroSlotTitle({
  text,
  className,
  tag = "h1",
  variant = "display-md",
}: HeroSlotTitleProps) {
  const Tag = tag;
  const [triggered, setTriggered] = useState(false);
  const words = text.split(/\s+/);

  useEffect(() => {
    const handler = () => setTriggered(true);
    window.addEventListener("hero-title-trigger", handler);
    return () => window.removeEventListener("hero-title-trigger", handler);
  }, []);

  return (
    <Tag
      className={cn(
        textVariants({ variant }),
        "flex flex-wrap gap-x-[0.25em] uppercase",
        className
      )}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span
          key={i}
          className="relative inline-flex overflow-hidden"
          aria-hidden="true"
        >
          {/* Original text — slides up and out */}
          <motion.span
            initial={{ y: "0%" }}
            animate={triggered ? { y: "-180%" } : undefined}
            transition={{
              duration: 0.5,
              delay: i * 0.02,
              ease: "easeInOut",
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
          {/* Clone — slides up into view */}
          <motion.span
            initial={{ y: "180%" }}
            animate={triggered ? { y: "0%" } : undefined}
            transition={{
              duration: 0.7,
              delay: i * 0.02,
              ease: "easeInOut",
            }}
            className="absolute inset-0 inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
