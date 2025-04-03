import { useChat } from "@/contexts/chatContext";
import useSpeechToText from "@/hooks/useSpeechToText";
import axios from "axios";
import {
  AudioLines,
  FileText,
  Mic,
  PaperclipIcon,
  Send,
  SquareIcon,
} from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import toast, { Toaster } from "react-hot-toast";
import config from "../../config.json";
import { useAuth } from "../../contexts/authContext";
import { useTheme } from "../../store/theme";
import Accordion from "../accordion/accordion";
import Header from "../Header/Header";
import { HelpDeskTrigger } from "../helpDesk/HelpDeskTrigger";
import Message from "../Message/Message";
import { RightDrawer } from "../rightpanel/rightDrawer";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

// Define types
type FileCategory = {
  [key: string]: string;
};

type Base64File = {
  fileName: string;
  fileContent: string;
  contentType: string;
  fileSize: number;
  fileType: string;
};

type ChatMessage = {
  message_uuid?: string;
  feedback?: string;
  message: string;
  type: "user" | "bot";
  botMessage?: string;
  sources?: any[];
  timestamp?: string;
  doc_uploaded?: string;
  file_name?: string;
  file_type?: string;
};

type RightPanelContent = any; // Replace with proper type if available

type ChatBoxProps = {
  // Add any props if needed
};

type ChatBoxHandle = {
  handleChatSelect: (sessionId: string) => void;
  downloadJsonFile: () => void;
  latestSessionId: string;
};

const fileCategories: FileCategory = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "DOCX",
  "text/plain": "TXT",
  // Add more mappings as needed
};

const ChatBox = forwardRef<ChatBoxHandle, ChatBoxProps>((props, ref) => {
  const { theme } = useTheme();
  console.log(theme);

  const defaultSuggestion = config.AppLevelConstants.defaultQuestions;
  const [latestSessionId, setLatestSessionId] = useState<string>("");
  const [sessionStatus, setSessionStatus] = useState<string>("new");
  const [message, setMessage] = useState<string>("");
  const [chatSession, setChatSession] = useState<ChatMessage[]>([]);
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [rightPanelContent, setRightPanelContent] =
    useState<RightPanelContent>("");
  const [showRightPanelContent, setShowRightPanelContent] =
    useState<boolean>(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [base64Files, setBase64Files] = useState<Base64File[]>([]);
  const [panelSize, setPanelSize] = useState<[number, number]>([100, 0]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // const [isListening, setListening] = useState<boolean>(false);
  const { user, isAuthenticated } = useAuth();
  const { updateSessionId } = useChat();

  // const {
  //   transcript,
  //   listening,
  //   resetTranscript,
  //   browserSupportsSpeechRecognition,
  // } = useSpeechRecognition();

  const { transcript, listening, error, startListening, stopListening } =
    useSpeechToText();
  useEffect(() => {
    console.log(error);
  }, [error]);

  useEffect(() => {
    setMessage(transcript || "");
  }, [transcript]);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

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

  const downloadJsonFile = async () => {
    const filename = "chat.json";
    setIsLoadingHistory(true);
    try {
      const response = await axios.post(config.apiUrls.getChatsBySession, {
        session_id: latestSessionId,
        email: user?.email?.toLowerCase(),
      });

      const formattedChats = response.data.map((msg: any) => ({
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

  const handleChatSelect = async (sessionId: string) => {
    setIsLoadingHistory(true);
    try {
      const response = await axios.post(config.apiUrls.getChatsBySession, {
        session_id: sessionId,
        email: user?.email?.toLowerCase(),
      });

      const formattedChats = response.data.map((msg: any) => ({
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

  const handleCopyClick = useCallback(async (msg: string) => {
    let copiedMsg = msg.trim();
    try {
      await window.navigator.clipboard.writeText(copiedMsg);
    } catch (err) {
      console.error("Unable to copy to clipboard");
    }
  }, []);

  const submitQuery = async (message: string) => {
    if (!message && (!base64Files || base64Files.length === 0)) {
      return;
    }
    setSubmitForm(true);
    const file = base64Files && base64Files.length ? base64Files[0] : undefined;
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

  const submitBotQuery = async (userMsg: string, file?: Base64File) => {
    setSubmitForm(true);
    let data: any = {
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

  const handleChatSession = (message: any, type: "user" | "bot") => {
    if (type === "user") {
      const chatObj = {
        message: message.text,
        type: "user" as any,
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

  function formatDateWithMicroseconds(date: Date) {
    const isoString = date.toISOString();
    const milliseconds = date.getMilliseconds().toString().padStart(3, "0");
    const microseconds = milliseconds + "000";
    return isoString.replace(/\.\d{3}Z$/, `.${microseconds}`);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!submitForm) {
        submitQuery(message?.trim());
      }
    }
  }

  const onSourceClick = (chatMsg: any) => {
    setRightPanelContent(chatMsg);
    setShowRightPanelContent(true);
  };

  const onSuggestionCardClick = (text: string) => {
    submitQuery(text);
    setSubmitForm(true);
  };

  // Dropzone file handler
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length) {
      convertFilesToBase64(acceptedFiles);
    }
  };

  const convertFilesToBase64 = (files: File[]) => {
    const promises = files.map((file) => {
      return new Promise<Base64File>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () =>
          resolve({
            fileName: file.name,
            fileContent: replaceBase64(reader.result as string),
            contentType: file.type,
            fileSize: file.size,
            fileType: fileCategories[file.type] || "UNKNOWN",
          });
        reader.onerror = reject;
      });
    });

    Promise.all(promises).then((base64Files) => {
      setBase64Files(base64Files);
    });
  };

  const replaceBase64 = (base64: string) => {
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
  const onDictate = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
    // setListening(!isListening);
  };
  // const startListening = () =>
  //   SpeechRecognition.startListening({ continuous: true });
  const newChat = () => {
    setChatSession([]);
    setLatestSessionId("");
    setSessionStatus("new");
    setRightPanelContent("");
    updateSessionId("");
    setMessage("");
  };
  return (
    <div className="relative w-full">
      <Toaster />
      <div className="flex w-full flex-col h-screen">
        <Header
          onNewChat={newChat}
          onDownload={downloadJsonFile}
          hasActiveSession={!!latestSessionId}
        />
        <div className="flex-1 w-full overflow-hidden bg-background">
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
                    {defaultSuggestion.map((item: any) => (
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
            <div className="p-6 flex justify-center">
              <div className=" rounded-[30px] bg-card px-4 shadow-lg  w-full ">
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
                        <div className="font-medium  text-secondary">
                          {file.fileType}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className=" py-4 relative">
                  <HelpDeskTrigger />
                  <div className="">
                    <div {...getRootProps()} className="">
                      <input {...getInputProps()} />
                      <textarea
                        ref={textareaRef}
                        rows={1}
                        value={message}
                        onChange={(e) => setMessage(e.currentTarget.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        placeholder="Got a question? Let's build the answer together!"
                        className="no-scrollbar min-h-10 w-full border-none resize-none  focus:outline-none focus:border-none text-card-foreground bg-transparent "
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div {...getRootPropsClick()} className="">
                      <input {...getInputPropsClick()} />
                      <button className="text-primary hover:text-gray-700 p-2">
                        <PaperclipIcon size={20} />
                      </button>
                    </div>
                    <div className="flex justify-end items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger>
                          <button
                            onClick={() => {
                              onDictate();
                            }}
                            disabled={submitForm}
                            className={` flex items-center justify-center bg-primary hover:scale-105 rounded-full h-8 w-8 text-card p-2  ${
                              submitForm &&
                              "bg-gray-300 cursor-not-allowed opacity-50"
                            }`}
                          >
                            {!listening ? (
                              <Mic size={20} />
                            ) : (
                              <AudioLines size={20} className="animate-pulse" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Dictate</TooltipContent>
                      </Tooltip>
                      {listening ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <button
                              onClick={() => {
                                onDictate();
                              }}
                              disabled={submitForm}
                              className={` flex items-center justify-center bg-primary hover:scale-105 rounded-full h-8 w-8 text-card p-2  ${
                                submitForm &&
                                "bg-gray-300 cursor-not-allowed opacity-50"
                              }`}
                            >
                              <SquareIcon size={20} fill="#fff" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Stop</TooltipContent>
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger>
                            <button
                              onClick={() => {
                                submitQuery(message);
                              }}
                              disabled={submitForm}
                              className={` flex items-center justify-center bg-primary hover:scale-105 rounded-full h-8 w-8 text-card p-2  ${
                                submitForm &&
                                "bg-gray-300 cursor-not-allowed opacity-50"
                              }`}
                            >
                              <Send size={20} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Send</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    {/* <SophiaAssistant /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {rightPanelContent && (
            <RightDrawer
              isOpen={showRightPanelContent}
              onClose={toggleRightSidepanel}
              title="Proof of origin"
            >
              <div className="h-full bg-card p-4 pr-0">
                <div className="">
                  <Accordion accordionData={rightPanelContent} />
                </div>
              </div>
            </RightDrawer>
          )}
        </div>
      </div>
    </div>
  );
});

ChatBox.displayName = "ChatBox";

export default ChatBox;
