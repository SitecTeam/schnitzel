import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { textVariants } from "@/components/typography";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type TextVariantProps = VariantProps<typeof textVariants>;

interface AnimatedTitleProps {
  text: string;
  className?: string;
  variant?: TextVariantProps["variant"];
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

export default function AnimatedTitle({
  text,
  className,
  tag = "h1",
  variant = "h1",
}: AnimatedTitleProps) {
  const Tag = tag;
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "0px 0px -100px 0px",
  });
  const words = text.split(/\s+/);

  return (
    <Tag
      ref={ref}
      className={cn(
        textVariants({ variant }),
        "flex flex-wrap gap-x-[0.25em] uppercase",
        className
      )}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{
            clipPath: "polygon(0 0, 125% 0, 125% 0, 0 0)",
            filter: "blur(1px)",
            y: "60%",
          }}
          animate={
            isInView
              ? {
                  clipPath: "polygon(0 0, 125% 0, 125% 125%, 0 125%)",
                  filter: "blur(0px)",
                  y: "0%",
                }
              : undefined
          }
          transition={{
            duration: 0.6,
            delay: i * 0.04,
            ease: "easeInOut",
          }}
          className="inline-block will-change-transform"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
