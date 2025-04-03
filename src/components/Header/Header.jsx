import { DownloadIcon, PlusCircle } from "lucide-react";
import { ThemeToggle } from "../themeToggler/themeToggler";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const Header = ({ onDownload, hasActiveSession, onNewChat }) => {
  const handleDownloadClick = async () => {
    if (!hasActiveSession) return alert("No active session found!");
    await onDownload();
  };

  return (
    <header className="flex justify-between overflow-hidden flex-wrap gap-10 p-4 bg-card border border-border border-solid shadow-2xl max-md:px-5">
      <nav className="flex items-center gap-6 text-base font-semibold leading-none text-neutral-900 ml-3">
        <Button
          variant={"outline"}
          id="newChat"
          onClick={() => onNewChat()}
          className="flex gap-1 items-center justify-center rounded-2xl"
        >
          <div className="flex gap-2 justify-center items-center">
            <PlusCircle className="" size={16} />

            <span className="self-stretch sm:text-sm text-xs font-mediummy-auto ">
              <span className="sm:block hidden">New chat</span>
              <span className="sm:hidden block">Chat</span>
            </span>
          </div>
        </Button>
      </nav>
      <section className="flex gap-10">
        <nav className="flex items-center gap-6">
          <ThemeToggle />
          <Tooltip>
            <TooltipTrigger>
              <div
                className={` flex items-center ${
                  !hasActiveSession
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={handleDownloadClick}
              >
                <DownloadIcon className="text-card-foreground" size={20} />
              </div>
            </TooltipTrigger>
            <TooltipContent>Download conversation</TooltipContent>
          </Tooltip>
        </nav>
      </section>
    </header>
  );
};

export default Header;
