import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { VisuallyHidden } from "./ui/visually-hidden";
import { About } from "./About";
import { AudioLines } from "lucide-react";

interface LogoProps {
    isCollapsed: boolean;
}

const Logo = React.forwardRef<HTMLButtonElement, LogoProps>(({ isCollapsed }, ref) => {
  return (
    <Dialog aria-describedby={undefined}>
      {isCollapsed ? (
        <DialogTrigger asChild>
          <button ref={ref} className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-blue-700 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50">
            <AudioLines className="h-5 w-5" />
          </button>
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <button ref={ref} className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-600 text-white shadow-sm">
              <AudioLines className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold leading-5 text-slate-950">MeetFlow</span>
              <span className="block truncate text-xs leading-4 text-slate-500">Private meeting intelligence</span>
            </span>
          </button>
        </DialogTrigger>
      )}
      <DialogContent>
        <VisuallyHidden>
          <DialogTitle>About MeetFlow</DialogTitle>
        </VisuallyHidden>
        <About />
      </DialogContent>
    </Dialog>
  );
});

Logo.displayName = "Logo";

export default Logo;
