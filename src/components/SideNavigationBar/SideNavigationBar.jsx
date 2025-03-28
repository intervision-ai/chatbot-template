import axios from "axios";
import {
  ChevronDown,
  ChevronUp,
  EllipsisVertical,
  ListCheck,
  Loader2,
  PowerIcon,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BsClockHistory } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import config from "../../config.json";

import toast from "react-hot-toast";
import { MdMenuOpen } from "react-icons/md";
import { useAuth } from "../../contexts/authContext";
import { useChat } from "../../contexts/chatContext";
import { useTheme } from "../../store/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdownMenu";

const RecentChats = ({ userEmail, onChatSelect }) => {
  const [recentChats, setRecentChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState();
  const [activeSession, setActiveSession] = useState(null);
  const [scrollState, setScrollState] = useState({
    canScrollUp: false,
    canScrollDown: false,
  });

  const scrollContainerRef = useRef(null);
  const { sessionId, updateSessionId } = useChat();
  useEffect(() => {
    const fetchChats = async () => {
      // if (!userEmail) {
      //   setIsLoading(false);
      //   return;
      // }
      if (!userEmail) {
        return;
      }
      try {
        setIsLoading(true);
        const response = await axios.post(config.apiUrls.getChatHistory, {
          email: userEmail,
        });
        setRecentChats(response.data);
      } catch (err) {
        setError("Failed to load recent chats");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [userEmail]);

  useEffect(() => {
    const checkScroll = () => {
      const element = scrollContainerRef.current;
      if (element) {
        const canScrollUp = element.scrollTop > 0;
        const canScrollDown =
          element.scrollHeight > element.clientHeight &&
          element.scrollTop < element.scrollHeight - element.clientHeight;

        setScrollState({ canScrollUp, canScrollDown });
      }
    };

    const element = scrollContainerRef.current;
    if (element) {
      element.addEventListener("scroll", checkScroll);
      checkScroll();
    }

    return () => {
      if (element) {
        element.removeEventListener("scroll", checkScroll);
      }
    };
  }, [recentChats]);
  const deleteChatHistoty = (selectedChatsessionId) => {
    const payload = {
      sessionid: selectedChatsessionId,
      email: userEmail?.toLowerCase(),
    };
    axios
      .post(config.apiUrls.deleteHistory, payload)
      .then((response) => {
        toast.success("Deleted!");
        setRecentChats((prevChats) =>
          prevChats.filter((chat) => chat.sessionId !== selectedChatsessionId)
        );
        if (sessionId === selectedChatsessionId) {
          window.location.reload();
        }
      })
      .catch((err) => {
        toast.error(err?.message || "Something went wrong");
      });
  };
  const ScrollIndicator = ({ direction }) => (
    <div
      className={`absolute left-0 right-0 h-8 pointer-events-none
        ${
          direction === "up"
            ? "top-0 bg-gradient-to-b"
            : "bottom-0 bg-gradient-to-t"
        }
        from-neutral-950 to-transparent
        transition-opacity duration-200
        ${
          direction === "up"
            ? scrollState.canScrollUp
              ? "opacity-100"
              : "opacity-0"
            : scrollState.canScrollDown
            ? "opacity-100"
            : "opacity-0"
        }`}
    >
      <div className="flex justify-center">
        {direction === "up" ? (
          <ChevronUp className="w-6 h-6 mb-2 text-background" />
        ) : (
          <ChevronDown className="w-6 h-6 mt-2 text-background" />
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full">
      {isLoading || recentChats.length === 0 ? null : (
        <div className="pr-4 py-3 pl-8">
          <h2 className="flex gap-3 items-center text-base font-semibold text-muted">
            <BsClockHistory />
            Recent Chats
          </h2>
        </div>
      )}

      <div className="flex-1 overflow-hidden relative w-64">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-full space-y-4">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
            <p className="text-neutral-400 text-sm">Loading chats...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full px-4">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        ) : recentChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            {/* <MessageCircle className="w-8 h-8 text-neutral-600 mb-2" /> */}
            <p className="text-neutral-400 text-sm">No recent chats</p>
          </div>
        ) : (
          <div className="relative h-full">
            {/* <ScrollIndicator direction="up" /> */}
            <div
              ref={scrollContainerRef}
              className="sidemenu-scrollbar overflow-y-auto max-h-[calc(100vh-15rem)]  px-4"
            >
              {recentChats.map((chat, index) => (
                <div
                  key={index}
                  onClick={() => {
                    onChatSelect(chat.sessionId);
                    setActiveSession(chat.sessionId);
                    updateSessionId(chat.sessionId);
                  }}
                  onMouseEnter={() => {
                    setHoveredIndex(index);
                  }}
                  onMouseLeave={() => {
                    setHoveredIndex(null);
                  }}
                  className={` mb-1 flex items-center gap-1 pl-4 py-2 rounded-xl hover:bg-neutral-200 hover:text-gray-800 transition-colors duration-200 group cursor-pointer ${
                    activeSession === chat.sessionId
                      ? "bg-neutral-200 text-gray-800"
                      : "text-neutral-200"
                  }`}
                >
                  <ListCheck
                    className={`flex-shrink-0 group-hover:text-primary transition-colors duration-200 ${
                      activeSession === chat.sessionId && "text-primary"
                    }`}
                    size={18}
                  />
                  <span className="text-base font-normal whitespace-nowrap truncate leading-relaxed">
                    {chat.Input_query}
                  </span>
                  <div
                    className={`${
                      hoveredIndex === index || activeSession === chat.sessionId
                        ? "visible"
                        : "invisible"
                    }`}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="pr-2 py-1 outline-none"
                        autoFocus={false}
                      >
                        <EllipsisVertical size={18} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => deleteChatHistoty(chat.sessionId)}
                        >
                          <Trash2 className="text-destructive" />
                          <span className="text-destructive">Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
            {/* <ScrollIndicator direction="down" /> */}
          </div>
        )}
      </div>
    </div>
  );
};

const SideNavigationBar = ({ onChatSelect }) => {
  const { theme } = useTheme();
  const { user, isAuthenticated, signOut } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  // const [user, setUser] = useState();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  console.log(user);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const authenticated = await oktaAuth.isAuthenticated();
  //       setIsAuthenticated(authenticated);
  //       setUser(authenticated ? await oktaAuth.getUser() : null);
  //     } catch (error) {
  //       console.error("Auth check failed:", error);
  //       setIsAuthenticated(false);
  //     }
  //   };

  //   checkAuth();
  // }, [oktaAuth]);

  const isActive = (path) => {
    if (path === "/") return location.pathname === path;
    return location.pathname.includes(path);
  };

  const handleResize = () => {
    if (window.innerWidth <= 1024) {
      setIsSidebarVisible(false);
    } else {
      setIsSidebarVisible(true);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onSelectFromHistory = (sessionId) => {
    onChatSelect(sessionId);
    if (window.innerWidth <= 1024) {
      setIsSidebarVisible(false);
    }
  };
  if (!isAuthenticated) return "";
  return (
    <>
      <div
        className={`fixed inset-0 bg-transparent bg-opacity-50 transition-opacity duration-300 h-screen ${
          isSidebarVisible
            ? "opacity-100 z-40"
            : "opacity-0 pointer-events-none"
        } lg:hidden`}
        onClick={() => setIsSidebarVisible(false)}
      ></div>
      <div
        className={` flex flex-col h-screen bg-sidebar  sm:relative absolute transition-all duration-300 z-50 ${
          isSidebarVisible ? "w-64" : "w-0"
        }`}
      >
        <div
          className={`absolute z-50  ${
            isSidebarVisible ? "-right-0 top-5" : "-right-7 top-5 sm:top-5"
          }`}
        >
          <button
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
            className="text-background z-20"
          >
            {isSidebarVisible ? (
              <MdMenuOpen
                className="text-white transition-transform  z-20"
                size={28}
              />
            ) : (
              <MdMenuOpen
                className="text-card-foreground transition-transform rotate-180"
                size={28}
              />
            )}
          </button>
        </div>
        <div className="flex overflow-hidden flex-col grow pb-1 w-full bg-sidebar">
          <div className="flex flex-col items-center">
            <header className="h-[108px] mb-4 pt-2 pl-4 w-full font-semibold leading-tight  text-background">
              <div className="items-start  ">
                <div className=" my-auto relative w-full pr-10">
                  {theme === "dark" ? (
                    <img
                      loading="lazy"
                      src={"/images/dark-logo.png"}
                      alt="logo"
                      className="object-contain white shrink-0 self-stretch my-auto w-48"
                    />
                  ) : (
                    <img
                      loading="lazy"
                      src={"/images/dark-logo.png"}
                      alt="logo"
                      className="object-contain white shrink-0 self-stretch my-auto w-48"
                    />
                  )}
                </div>
              </div>
            </header>

            {/* <hr className="w-full p-0" /> */}
            <RecentChats
              userEmail={user?.email?.toLowerCase()}
              onChatSelect={onSelectFromHistory}
            />
          </div>
        </div>

        {!user && isSidebarVisible && (
          <div className="flex flex-col justify-center items-center border-t border-border p-4 fixed bottom-0 bg-sidebar w-60 transition-opacity duration-300">
            <Loader2 className="h-5 w-6 text-primary animate-spin" />
            <p className="text-secondary text-sm">Loading user...</p>
          </div>
        )}
        {user && isSidebarVisible && (
          <div className="border-t border-border p-4 fixed bottom-0 bg-sidebar w-[252px] transition-opacity duration-300">
            <div
              className="flex items-start justify-between cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              {/* User Info */}
              <div className="flex items-center w-[92%]">
                <img
                  src={
                    user?.picture ||
                    `https://www.gravatar.com/avatar/${user?.name}?d=mp`
                  }
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full mr-1"
                />
                <div className="">
                  <p className="text-sm font-medium text-muted">
                    {user?.name || user?.email?.split("@")[0] || ""}
                  </p>
                  <p className="text-xs text-muted-foreground w-[190px] overflow-hidden">
                    <span className="inline-block hover:translate-x-[-20%]  transition-transform duration-300">
                      {" "}
                      {user?.email?.toLowerCase() || ""}
                    </span>
                  </p>
                </div>
              </div>
              {/* Dropdown Icon */}
              <ChevronDown
                size={20}
                className={`${
                  isOpen ? "rotate-180" : ""
                } transition-transform text-secondary`}
              />
            </div>

            {/* Dropdown Content */}
            {isOpen && (
              <div className="mt-4 bg-sidebar rounded-lg shadow-lg">
                <button
                  onClick={async () => {
                    setIsLogoutLoading(true);
                    await signOut();
                    setIsLogoutLoading(false);
                  }}
                  className="w-full text-left text-base px-4 py-2 rounded-lg bg-primary text-background flex items-center"
                >
                  {isLogoutLoading && (
                    <div className="flex justify-center w-full items-center">
                      <Loader2 className="h-5 w-5 text-white animate-spin" />
                    </div>
                  )}
                  {!isLogoutLoading && (
                    <>
                      <PowerIcon className="mr-2" size={16} /> Logout
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SideNavigationBar;
