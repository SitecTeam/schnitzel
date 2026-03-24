import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Typography from "../typography";
type CustomTooltipProps = {
  children: React.ReactNode;
  text: string | undefined | null;
};
const CustomTooltip = ({ children, text }: CustomTooltipProps) => {
  return !text ? (
    children
  ) : (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="hidden bg-[#7492B2] px-2 py-1 text-primary-foreground lg:block">
          <Typography
            variant="body-sm"
            tag="span"
            className="lg:text-[12px] lg:leading-[24px]"
          >
            {text}
          </Typography>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
export { CustomTooltip };
