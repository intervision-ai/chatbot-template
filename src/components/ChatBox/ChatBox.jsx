import axios from "axios";
import { FileText, PaperclipIcon } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
// import { useAuth } from "react-oidc-context";
// import logo from "../../assets/images/small-logo.png";
import { useOktaAuth } from "@okta/okta-react";
import { useLayoutEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import config from "../../config.json";
import { useTheme } from "../../store/theme";
import Accordion from "../accordion/accordion";
import Header from "../Header/Header";
import Message from "../Message/Message";
import { RightDrawer } from "../rightpanel/rightDrawer";

const fileCategories = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "DOCX",
  "text/plain": "TXT",
  // Add more mappings as needed
};

const ChatBox = forwardRef((props, ref) => {
  // const config = useConfig();
  const { theme } = useTheme();
  console.log(theme);

  const defaultSuggestion = config.AppLevelConstants.defaultQuestions;
  const [latestSessionId, setLatestSessionId] = useState("");
  const [sessionStatus, setSessionStatus] = useState("new");
  const [message, setMessage] = useState("");
  const [chatSession, setChatSession] = useState([]);
  const [submitForm, setSubmitForm] = useState(false);
  const [rightPanelContent, setRightPanelContent] = useState("");
  const [showRightPanelContent, setShowRightPanelContent] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  // const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [base64Files, setBase64Files] = useState([]);
  const [panelSize, setPanelSize] = useState([100, 0]);
  const chatContainerRef = useRef(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { oktaAuth } = useOktaAuth();

  useEffect(() => {
    console.log(chatSession);
  }, [chatSession]);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await oktaAuth.isAuthenticated();
        setIsAuthenticated(authenticated);
        setUser(authenticated ? await oktaAuth.getUser() : null);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [oktaAuth]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatSession]);

  useLayoutEffect(() => {
    const updateScreenSize = () => {
      if (window.matchMedia("(max-width: 767px)").matches) {
        setPanelSize([0, 100]);
      } else if (
        window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches
      ) {
        setPanelSize([65, 35]);
      } else {
        setPanelSize([65, 35]);
      }
    };
    updateScreenSize();
  }, []);
  // Utility function to download JSON data as a file
  const downloadJsonFile = async () => {
    const filename = "chat.json";
    setIsLoadingHistory(true);
    try {
      const response = await axios.post(config.apiUrls.getChatsBySession, {
        session_id: latestSessionId,
        email: user?.email?.toLowerCase(),
      });

      const formattedChats = response.data.map((msg) => ({
        feedback: msg.feedback,
        message: msg.Input_query,
        type: "user",
        botMessage: msg.output,
        sources: msg.sources,
        timestamp: msg.timestamp,
      }));
      console.log(formattedChats);
      const jsonString = JSON.stringify(formattedChats, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error loading chat history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleChatSelect = async (sessionId) => {
    setIsLoadingHistory(true);
    try {
      const response = await axios.post(config.apiUrls.getChatsBySession, {
        session_id: sessionId,
        email: user?.email?.toLowerCase(),
      });

      const formattedChats = response.data.map((msg) => ({
        message_uuid: msg.message_uuid,
        feedback: msg.feedback,
        message: msg.Input_query,
        type: "user",
        botMessage: msg.output,
        sources: msg.sources,
        timestamp: msg.timestamp,
        file_name: msg.file_name,
        file_type: msg.file_type,
      }));

      setChatSession(formattedChats);
      setLatestSessionId(sessionId);
      setSessionStatus("continue");
    } catch (error) {
      console.error("Error loading chat history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    handleChatSelect,
    downloadJsonFile,
    latestSessionId,
  }));

  const handleCopyClick = useCallback(async (msg) => {
    let copiedMsg = msg.trim();
    try {
      await window.navigator.clipboard.writeText(copiedMsg);
    } catch (err) {
      console.error("Unable to copy to clipboard");
    }
  }, []);

  const submitQuery = async (message) => {
    if (!message && (!base64Files || base64Files.length === 0)) {
      return;
    }
    setSubmitForm(true);
    const file = base64Files && base64Files.length ? base64Files[0] : null;
    const args = {
      text: message,
      doc_uploaded: file ? "Y" : "N",
      file_name: file?.fileName,
      file_type: file?.fileType,
      timestamp: new Date().toISOString(),
    };
    handleChatSession(args, "user");
    setRightPanelContent("");
    try {
      setMessage("");
      setBase64Files([]);
      await submitBotQuery(message, file);
    } catch (err) {
      setMessage("");
    }
  };

  const submitBotQuery = async (userMsg, file) => {
    setSubmitForm(true);
    let data = {
      input: userMsg,
      email: user?.email?.toLowerCase(),
      doc_uploaded: "N",
    };
    latestSessionId
      ? (data["sessionId"] = latestSessionId)
      : delete data["sessionId"];
    if (file) {
      data["doc_uploaded"] = "Y";
      data["file_name"] = file.fileName;
      data["file_content"] = file.fileContent;
      data["file_type"] = file.fileType;
    }
    const hasDoc = isChatSessionHasDoc();
    if (hasDoc) {
      data["doc_uploaded"] = "Y";
    }
    await axios
      .post(config.apiUrls.chatQuery, data)
      .then((response) => {
        // handleSessionSync(response.data, data);
        handleChatSession(response.data, "bot");
        setLatestSessionId(response.data.sessionId);
        setSessionStatus("continue");
        setSubmitForm(false);
      })
      .catch((err) => {
        setSubmitForm(false);
        console.error(err);
      });
  };

  const handleChatSession = (message, type) => {
    if (type === "user") {
      const chatObj = {
        message: message.text,
        type: "user",
        botMessage: "",
        doc_uploaded: message?.doc_uploaded,
        file_name: message?.file_name,
        file_type: message?.file_type,
        timestamp: formatDateWithMicroseconds(new Date()),
      };
      setChatSession((prevState) => [...prevState, chatObj]);
    } else {
      setChatSession((prevChatSession) =>
        prevChatSession.map((chat) =>
          chat.botMessage === ""
            ? {
                ...chat,
                botMessage: message.output,
                sources: message.sources,
                timestamp: message.timestamp,
                message_uuid: message.message_uuid,
                feedback: message.feedback,
              }
            : chat
        )
      );
    }
  };
  function formatDateWithMicroseconds(date) {
    const isoString = date.toISOString(); // e.g., "2025-01-10T06:29:44.199Z"
    const milliseconds = date.getMilliseconds().toString().padStart(3, "0");
    const microseconds = milliseconds + "000"; // Add extra zeros for microseconds

    return isoString.replace(/\.\d{3}Z$/, `.${microseconds}`);
  }
  function handleKeyDown(event) {
    if (event.key === "Enter" && !submitForm) {
      submitQuery(message);
      setSubmitForm(true);
    }
  }

  const onSourceClick = (chatMsg) => {
    setRightPanelContent(chatMsg);
    setShowRightPanelContent(true);
  };

  const onSuggestionCardClick = (text) => {
    submitQuery(text);
    setSubmitForm(true);
  };
  // const toggleAddFileModal = () => {
  //   setShowAddFileModal(!showAddFileModal);
  // };

  // Dropzone file handler
  const onDrop = (acceptedFiles) => {
    // console.log(fileRejections);
    if (acceptedFiles && acceptedFiles.length) {
      convertFilesToBase64(acceptedFiles);
    }
  };

  const convertFilesToBase64 = (files) => {
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () =>
          resolve({
            fileName: file.name,
            fileContent: replaceBase64(reader.result),
            contentType: file.type,
            fileSize: file.size,
            fileType: fileCategories[file.type],
          });
        reader.onerror = reject;
      });
    });

    Promise.all(promises).then((base64Files) => {
      setBase64Files(base64Files);
    });
  };

  const replaceBase64 = (base64) => {
    const newstr = base64.replace(/^data:[^;]+;base64,/, "");
    return newstr;
  };
  // Dropzone settings
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf", ".htm"],
      "application/msword": [".doc", ".docx"],
    },
    noClick: true,
    multiple: false,
    maxFiles: 1,
  });
  const { getRootProps: getRootPropsClick, getInputProps: getInputPropsClick } =
    useDropzone({
      onDrop,
      accept: {
        "text/plain": [".txt"],
        "application/pdf": [".pdf", ".htm"],
        "application/msword": [".doc", ".docx"],
      },
      multiple: false,
    });
  useEffect(() => {
    if (fileRejections.length > 1) {
      toast.error("Multiple file allowed");
    }
  }, [fileRejections]);
  const isChatSessionHasDoc = () => {
    const hasDoc = chatSession.some((chat) => chat.doc_uploaded === "Y");
    return !!hasDoc;
  };
  const toggleRightSidepanel = () => {
    setShowRightPanelContent(!showRightPanelContent);
  };
  return (
    <div className="relative w-full">
      <Toaster />

      {/* <div
        className={`flex gap-1 sm:items-center items-end rounded-xl absolute md:top-4 top-5 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${
          chatSession.length > 0 || isLoadingHistory
            ? "opacity-100"
            : "opacity-0"
        }`}
      >
        <img
          src={"/images/sophia-small.png"}
          alt="Sophia Logo"
          className="md:w-8 w-[20px]"
        />
        <div className="text-[#04ADEF]  md:text-xl text-sm font-bold">
          Sophia
        </div>
      </div> */}
      <div className="flex w-full flex-col h-screen">
        <Header
          onDownload={downloadJsonFile}
          hasActiveSession={!!latestSessionId}
        />
        <div className="flex-1 w-full overflow-hidden bg-background">
          {/* <PanelGroup direction="horizontal">
            <Panel defaultSize={panelSize[0]} order={1}> */}
          <div className="h-full w-full flex flex-col">
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
            >
              {isLoadingHistory ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex space-x-2 justify-center items-center">
                    <span className="sr-only">Loading...</span>
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 bg-primary opacity-85 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 bg-primary opacity-70 rounded-full animate-bounce"></div>
                  </div>
                </div>
              ) : chatSession.length > 0 ? (
                <Message
                  chatSession={chatSession}
                  handleCopyClick={handleCopyClick}
                  submitBotQuery={submitBotQuery}
                  handleChatSession={handleChatSession}
                  loading={submitForm}
                  onSourceClick={onSourceClick}
                  showSources={showRightPanelContent}
                />
              ) : (
                <div className="h-full flex items-center justify-center lg:px-32 md:px-10 px-4">
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
                    <div className="lg:col-span-3 md:col-span-2 col-span-1 flex justify-center mb-5">
                      <div className="flex items-center gap-4 shadow-xl rounded-2xl bg-card p-4 max-w-xl">
                        <div className="flex items-end gap-3">
                          <div className="flex flex-col">
                            {theme === "dark" ? (
                              <img
                                src={"/images/dark-logo.png"}
                                alt=""
                                className="w-48 mx-auto "
                              />
                            ) : (
                              <img
                                src={"/images/logo.png"}
                                alt=""
                                className="w-48 mx-auto "
                              />
                            )}
                            <span className="text-secondary-foreground text-sm font-medium mt-2">
                              Your Personal AI Assistant. How can I help?
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {defaultSuggestion.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl bg-card text-secondary-foreground shadow-md w-full p-5 cursor-pointer"
                        onClick={() => onSuggestionCardClick(item.text)}
                      >
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 p-2">
              <div className=" rounded-xl bg-card px-4">
                <div className="flex gap-2">
                  {base64Files.map((file, index) => (
                    <div
                      key={index}
                      className="text-sm flex gap-1 items-center mt-4 px-2 py-1 border border-secondary rounded-xl"
                    >
                      <div className="bg-primary p-2 rounded-lg">
                        <FileText size={20} className="text-background" />
                      </div>
                      <div>
                        <div className="font-semibold text-secondary-foreground">
                          {file.fileName}
                        </div>
                        <div className="font-medium text-secondary">
                          {file.fileType}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center h-16">
                  <div {...getRootPropsClick()} className="">
                    <input {...getInputPropsClick()} />
                    <button className="text-primary hover:text-gray-700 p-2">
                      <PaperclipIcon size={20} />
                    </button>
                  </div>
                  <div className="flex-grow">
                    <div {...getRootProps()} className="">
                      <input {...getInputProps()} />
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.currentTarget.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="w-full border rounded-xl focus:outline-none focus:border-border pl-4 h-10 text-card-foreground bg-background "
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      submitQuery(message);
                    }}
                    disabled={submitForm}
                    className={`ml-4 flex items-center justify-center bg-primary hover:scale-105 rounded-xl text-card px-4 py-2 ${
                      submitForm && "bg-gray-300 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <span>Send</span>
                    <span className="ml-2">
                      <svg
                        className="w-4 h-4 transform rotate-45 -mt-px"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        ></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* </Panel> */}

          {rightPanelContent && (
            <RightDrawer
              isOpen={showRightPanelContent}
              onClose={toggleRightSidepanel}
              title="Proof of origin"
            >
              {/* <PanelResizeHandle hitAreaMargins={{ coarse: 15, fine: 15 }} />
                <Panel
                  id="sidebar"
                  defaultSize={panelSize[1]}
                  order={2}
                  className="transition-all duration-300"
                > */}
              <div className="h-full bg-card p-4 pr-0">
                <div className="">
                  <Accordion accordionData={rightPanelContent} />
                </div>
              </div>
              {/* </Panel> */}
            </RightDrawer>
          )}
          {/* </PanelGroup> */}
        </div>
      </div>
    </div>
  );
});

export default ChatBox;
