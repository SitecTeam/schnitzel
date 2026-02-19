import type { PropsWithChildren } from "react";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const textVariants = cva("", {
  variants: {
    variant: {
      "display-lg": "font-anton text-[128px] leading-[140px]",
      "display-md": "font-anton text-[112px] leading-[124px]",
      h1: "font-anton text-[96px] leading-[110px]",
      h2: "font-anton text-[64px] leading-[77px]",
      h3: "font-anton text-[48px] leading-[58px]",
      h4: "font-anton text-[40px] leading-[50px]",
      h5: "font-anton text-[32px] leading-[40px]",
      h6: "font-anton text-[24px] leading-[31px]",
      subtitle: "font-anton text-[20px] leading-[28px]",
      "body-xl": "font-inter text-[24px] leading-[38px]",
      "body-lg": "font-inter text-[20px] leading-[32px]",
      "body-md": "font-inter text-[18px] leading-[29px]",
      "body-sm": "font-inter text-[16px] leading-[27px]",
      caption: "font-inter text-[15px] leading-[24px]",
      "button-regular": "font-inter text-[16px] leading-[27px] font-bold",
      "button-lg": "font-inter text-[18px] leading-[29px] font-bold",
    },
    fontWeight: {
      light: "font-light",
      regular: "font-normal",
      bold: "font-bold",
    },
    uppercase: {
      true: "uppercase",
    },
    textMargin: {
      heading: "md:ml-[--mX1-tablet] xl:ml-[--mX1-desktop]",
      small: "ml-[--mXmin-mobile] md:ml-[--mX1-tablet] xl:ml-[--mX1-desktop]",
      middle:
        "md:mx-[--mX2-tablet] xl:ml-[--mX2-desktop] xl:mr-[--mX3-desktop]",
      large:
        "ml-[--mXmin-mobile] md:ml-[--mX3-tablet] md:mr-[--mX2-tablet] xl:ml-[--mX3-desktop] xl:mr-[--mX2-desktop]",
    },
  },
  defaultVariants: {
    variant: "body-md",
  },
});

type HTMLTextElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
type TextVariantProps = VariantProps<typeof textVariants>;

type TypographyProps = PropsWithChildren<
  TextVariantProps & {
    tag?: HTMLTextElement;
    className?: string | undefined;
    id?: string | undefined;
  }
>;

const Typography = ({
  children,
  tag = "p",
  className,
  id,
  ...variants
}: TypographyProps) => {
  const calculatedClassName = cn(textVariants({ ...variants, className }));
  const Element = tag;
  return (
    <Element id={id} className={calculatedClassName}>
      {children}
    </Element>
  );
};

export default Typography;
