import { DownloadIcon, PlusCircle } from "lucide-react";
import { ThemeToggle } from "../themeToggler/themeToggler";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const Header = ({ onDownload, hasActiveSession }) => {
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
          onClick={() => (window.location.href = "/")}
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
        {/* <img
					loading="lazy"
					src="https://cdn.builder.io/api/v1/image/assets/TEMP/217c60fc484a9a22baec4180958a7a0b25fa86a5e9babd05ff7fddd146d09788?placeholderIfAbsent=true&apiKey=e2f2768db341417fbc7b84021ea53a05"
					alt="User avatar"
					className="object-contain shrink-0 w-10 aspect-square rounded-[35px]"
				/> */}
      </nav>
      <section className="flex gap-10">
        {/* <div className="flex gap-2.5 items-center my-auto">
					<img
						loading="lazy"
						src="https://cdn.builder.io/api/v1/image/assets/TEMP/9daf320c587397942d38a60070226a51811ed3763d8241425792a0a9ba90be77?placeholderIfAbsent=true&apiKey=e2f2768db341417fbc7b84021ea53a05"
						alt=""
						className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
					/>
					<div className="flex flex-col justify-center items-start self-stretch p-1.5 my-auto w-16 bg-gray-200 border border-gray-200 border-solid rounded-[92px]">
						<div className="flex shrink-0 w-7 bg-white h-[22px] rounded-[58px]"></div>
					</div>
				</div> */}
        <nav className="flex items-center gap-6">
          {/* <img
						loading="lazy"
						src="https://cdn.builder.io/api/v1/image/assets/TEMP/b487ca6f08969e08df46dfeb91700e13bb332bacfe2f80e08b9406d0777a0da3?placeholderIfAbsent=true&apiKey=e2f2768db341417fbc7b84021ea53a05"
						alt="Navigation icon 1"
						className="object-contain shrink-0 w-10 rounded aspect-square"
					/>
					<img
						loading="lazy"
						src="https://cdn.builder.io/api/v1/image/assets/TEMP/862fa7cae5c6ff708f193c4f1e7cd41686bee8997bf9a3653c7513cbe13cea9e?placeholderIfAbsent=true&apiKey=e2f2768db341417fbc7b84021ea53a05"
						alt="Navigation icon 2"
						className="object-contain shrink-0 w-10 rounded aspect-square"
					/> */}
          {/* <img
						loading="lazy"
						src="https://cdn.builder.io/api/v1/image/assets/TEMP/0272a9d33bde378b9f704c79b85dbd9a1a3c8538ecdc90b12d476a4808b7b51a?placeholderIfAbsent=true&apiKey=e2f2768db341417fbc7b84021ea53a05"
						alt="Navigation icon 3"
						className="object-contain shrink-0 w-10 rounded aspect-square"
					/> */}
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
                {isChatActive && (
                  <DownloadIcon className="text-card-foreground" size={20} />
                )}
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
