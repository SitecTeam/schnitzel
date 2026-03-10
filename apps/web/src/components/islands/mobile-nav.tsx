import { Youtube, Instagram, Menu, X, ArrowRight } from "lucide-react";
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
  // pathname: string;
  navItems: NavItem[];
}

export default function MobileNav({
  isHome,
  // pathname,
  navItems,
}: MobileNavProps) {
  const textColor = isHome ? "text-primary-foreground" : "text-secondary";

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
      <SheetContent side="top" className="h-dvh border-none bg-primary pb-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage: `
        linear-gradient(to right, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
      `,
            backgroundSize: "38.5px 38.5px",
          }}
          aria-hidden="true"
        ></div>
        <SheetTitle className="sr-only">Mobile navigation menu</SheetTitle>
        <SheetDescription className="sr-only">
          Use this menu to navigate between sections of the site.
        </SheetDescription>
        {/* Top bar — matches header height exactly */}
        <div className="flex h-16 items-center justify-end px-4 md:px-8">
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close navigation menu"
              className="bg-primary text-primary-foreground hover:bg-transparent"
            >
              <X className="size-7" />
            </Button>
          </SheetClose>
        </div>

        {/* Nav links — vertically centered */}
        <nav className="z-10 flex flex-1 flex-col items-start justify-center gap-12 px-6 md:px-8">
          {navItems.map(item => (
            <SheetClose key={item.href} asChild>
              <a
                href={item.href}
                className={cn(
                  "flex h-20 w-full items-center justify-between bg-primary-foreground px-3 py-2 text-primary uppercase transition-opacity hover:opacity-75"
                  // pathname === item.href &&
                  //   "underline decoration-2 underline-offset-8"
                )}
              >
                <Typography tag="h4" variant="h1">
                  {item.name}
                </Typography>
                <ArrowRight className="size-12 shrink-0" />
              </a>
            </SheetClose>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-4 md:px-8">
          <div className="flex items-center gap-5 text-primary-foreground">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://schnitzelshow.podbean.com/"
              className="flex size-10.5 items-center justify-center"
              aria-label="Podbean Link"
            >
              <WifiSvg fill="currentColor" className="size-7" />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.youtube.com/@schnitzelsnow"
              className="flex size-10.5 items-center justify-center"
              aria-label="YouTube Link"
            >
              <Youtube className="size-7" />
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/schnitzelsnow"
              className="flex size-10.5 items-center justify-center"
              aria-label="Instagram Link"
            >
              <Instagram className="size-7" />
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
