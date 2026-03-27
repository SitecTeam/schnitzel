import { motion } from "motion/react";
import { textVariants } from "@/components/typography";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type TextVariantProps = VariantProps<typeof textVariants>;

interface AnimatedTitleProps {
  title: string;
  className?: string;
  variant?: TextVariantProps["variant"];
  uppercase?: TextVariantProps["uppercase"];
}

export default function AnimatedTitle({
  title,
  className,
  variant = "display-md",
  uppercase = true,
}: AnimatedTitleProps) {
  const words = title.split(/\s+/);

  return (
    <h1
      className={cn(
        textVariants({ variant, uppercase }),
        "flex flex-wrap",
        className
      )}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: i * 0.08,
            ease: [0.33, 1, 0.68, 1], // power3.out equivalent
          }}
          className="mr-[0.25em] inline-block last:mr-0"
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}
