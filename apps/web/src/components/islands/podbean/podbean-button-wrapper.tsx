import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PodbeanButtonWrapperProps = {
  handlePlay: () => void;
  hasEpisode: boolean;
  isPlayerVisible: boolean;
  children: React.ReactNode;
  className?: string;
};

const PodbeanButtonWrapper = ({
  handlePlay,
  hasEpisode,
  isPlayerVisible,
  className,
  children,
}: PodbeanButtonWrapperProps) => (
  <Button
    onClick={handlePlay}
    variant="primary"
    size="lg"
    disabled={!hasEpisode}
    className={cn(
      "flex cursor-pointer items-center justify-start",
      isPlayerVisible && "hidden",
      className
    )}
    aria-label="Play podcast episode"
  >
    {children}
  </Button>
);

export default PodbeanButtonWrapper;
