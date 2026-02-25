import { Youtube, Instagram, Play, Menu, X } from "lucide-react";
import LogoSvg from "@/assets/svgs/logo.svg?react";
import WifiSvg from "@/assets/svgs/wifi.svg?react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Typography from "@/components/typography";

interface NavItem {
  name: string;
  href: string;
}

interface MobileNavProps {
  isHome: boolean;
  pathname: string;
  navItems: NavItem[];
}

export default function MobileNav({
  isHome,
  pathname,
  navItems,
}: MobileNavProps) {
  const textColor = isHome ? "text-primary-foreground" : "text-secondary";
  const bgColor = isHome ? "bg-secondary" : "bg-primary-foreground";

  return (
    <Sheet>
      {/* Burger trigger */}
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation menu"
          className={cn("ml-auto hover:bg-transparent lg:hidden", textColor)}
        >
          <Menu className="size-7" />
        </Button>
      </SheetTrigger>

      {/* Full-screen overlay from top */}
      <SheetContent
        side="top"
        className={cn("h-dvh border-none pb-10", bgColor)}
      >
        <SheetTitle className="hidden" />
        <SheetDescription className="hidden" />
        {/* Top bar — matches header height exactly */}
        <div className="flex h-16 items-center justify-between px-4 md:px-8">
          <SheetClose asChild>
            <a href="/">
              <LogoSvg />
            </a>
          </SheetClose>
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close navigation menu"
              className={cn("hover:bg-transparent", textColor)}
            >
              <X className="size-7" />
            </Button>
          </SheetClose>
        </div>

        {/* Nav links — vertically centered */}
        <nav className="flex flex-1 flex-col items-start justify-center gap-8 px-4 md:px-8">
          {navItems.map(item => (
            <SheetClose key={item.href} asChild>
              <a
                href={item.href}
                className={cn(
                  "transition-opacity hover:opacity-75",
                  textColor,
                  pathname === item.href &&
                    "underline decoration-2 underline-offset-8"
                )}
              >
                <Typography tag="span" variant="h4">
                  {item.name}
                </Typography>
              </a>
            </SheetClose>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-4 md:px-8">
          {isHome ? (
            <div className={cn("flex items-center gap-6", textColor)}>
              <WifiSvg fill="currentColor" className="size-7" />
              <Youtube className="size-7" />
              <Instagram className="size-7" />
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="primary" asChild>
                <a
                  href="https://schnitzelshow.podbean.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography tag="span" variant="subtitle">
                    Listen Now
                  </Typography>
                  <Play className="size-4" />
                </a>
              </Button>
              <Button variant="secondary" asChild>
                <a
                  href="https://www.youtube.com/@schnitzelsnow"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography tag="span" variant="subtitle">
                    Watch On Youtube
                  </Typography>
                  <Play className="size-4" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
