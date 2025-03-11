import axios from "axios";
import { CheckCheck, Copy, FileText, RefreshCcw, User } from "lucide-react";
import { useCallback, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import TimeAgo from "react-timeago";
import remarkGfm from "remark-gfm";
import config from "../../config.json";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import MessageFeedback from "./MessageFeedback";
import "./index.css";
const Message = (props) => {
  const {
    chatSession,
    handleCopyClick,
    submitBotQuery,
    handleChatSession,
    onSourceClick,
    loading,
    showSources,
  } = props;

  const [textCopied, setTextCopied] = useState(false);
  const [rightPanelContentId, setRightPanelContentId] = useState(null);

  const handleTextCopied = useCallback(() => {
    setTextCopied(true);
    setTimeout(() => setTextCopied(false), 3000);
  }, []);

  // Utility function to ensure consistent date handling
  const formatDateForDisplay = (dateString) => {
    if (typeof dateString === "string" && dateString.includes("T")) {
      return new Date(dateString).getTime();
    }
    return new Date(dateString).getTime();
  };

  // Custom formatter to handle edge cases
  const customFormatter = (value, unit, suffix) => {
    if (value < 1 && unit === "second") {
      return "just now";
    }
    return `${value} ${unit}${value !== 1 ? "s" : ""} ${suffix}`;
  };

  const handleFeedback = async (message, type) => {
    try {
      if (message.message_uuid) {
        await axios.post(config.apiUrls.saveFeedback, {
          message_uuid: message.message_uuid,
          feedback: type,
          timestamp: message.timestamp,
        });
      }
    } catch (error) {
      console.log("error");
    }
  };

  const handleRegenerateResponse = (msg) => {
    handleChatSession({ text: msg }, "user");
    submitBotQuery(msg);
  };

  const toggleSourcePanel = (msg, id) => {
    setRightPanelContentId(id);
    onSourceClick(msg.sources);
  };

  const createMarkup = (htmlContent) => {
    // Process the HTML content to ensure proper list styling
    const styledHTML = htmlContent
      .replace(/<ul>/g, '<ul class="list-disc pl-6 space-y-2 my-4">')
      .replace(/<ol>/g, '<ol class="list-decimal pl-6 space-y-2 my-4">')
      .replace(/<li>/g, '<li class="ml-2">');

    return { __html: styledHTML };
  };

  return (
    <>
      {chatSession.message !== "" &&
        chatSession.length > 0 &&
        chatSession.map((chatMsg, idx) => {
          const lastIndex = chatSession.length - 1;
          const messageTimestamp = formatDateForDisplay(
            chatMsg.timestamp
              ? chatMsg.timestamp + "+0000"
              : new Date().toISOString()
          );
          // const messageId = `msg-${idx}`;

          return (
            <div key={idx}>
              <div className="col-start-6 col-end-13 p-3 rounded-lg">
                <div className="my-8">
                  <div className="flex justify-start flex-row-reverse">
                    <div className="text-center">
                      <div className=" border border-secondary-foreground p-1 rounded-full">
                        <User size={20} className="text-secondary-foreground" />
                      </div>
                      <div className="text-secondary-foreground text-xs">
                        You
                      </div>
                    </div>
                    {
                      <div className="relative mr-3 text-base bg-card-foreground py-3 px-4 shadow rounded-3xl rounded-tr-sm">
                        {chatMsg.file_name && (
                          <div className="flex items-center justify-end mb-1 mr-14">
                            <div className="bg-background text-base flex gap-1 items-center  px-2 py-1 border border-secondary rounded-xl max-w-96">
                              <div className="bg-primary p-2 rounded-lg">
                                <FileText
                                  size={20}
                                  className="text-background"
                                />
                              </div>
                              <div>
                                <div className="font-semibold text-card-foreground">
                                  {chatMsg.file_name}
                                </div>
                                <div className="font-medium text-card">
                                  {chatMsg.file_type}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div
                          className={`text-left text-card ${
                            chatMsg.file_name ? "mt-2" : ""
                          }`}
                        >
                          {chatMsg.message}
                        </div>
                        <div className="text-xs mt-4 min-w-40 -mb-2 mr-1 text-secondary text-right">
                          <TimeAgo
                            date={messageTimestamp}
                            formatter={customFormatter}
                            live={true}
                          />
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>

              <div className="col-start-1 col-end-8 p-3 rounded-lg md:w-10/12 w-full">
                <div className="flex flex-row mb-5">
                  <div className="flex-col justify-center h-10 w-10 rounded-full flex-shrink-0">
                    <img
                      src={"/images/bot.png"}
                      alt="Assistant"
                      className="w-10 rounded-full "
                    />
                    <div className="text-secondary-foreground text-xs text-center">
                      Bot
                    </div>
                  </div>

                  {loading && lastIndex === idx ? (
                    <div className="relative ml-3 text-sm flex items-center">
                      <div className="text-left  min-w-[100px] h-2">
                        <div className="flex space-x-2 items-end">
                          <span className="sr-only">Loading...</span>
                          <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="h-2 w-2 bg-primary opacity-80 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="h-2 w-2 bg-primary opacity-65 rounded-full animate-bounce"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative ml-1 text-base bg-card text-card-foreground py-4 px-4 shadow rounded-3xl overflow-x-auto overflow-y-hidden">
                      {chatMsg.botMessage && (
                        <>
                          {/* <div
                            className="text-left chatTable"
                            dangerouslySetInnerHTML={createMarkup(
                              chatMsg.botMessage
                            )}
                          /> */}
                          <div className="text-foreground list-disc prose">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ node, ...props }) => (
                                  <p className="mt-1.5" {...props} />
                                ),
                                a: ({ node, ...props }) => (
                                  <a
                                    {...props}
                                    className="text-blue-600 underline hover:text-blue-800 text-sm"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  />
                                ),
                                table: ({ children }) => (
                                  <table className="w-full border-collapse border border-border rounded-xl">
                                    {children}
                                  </table>
                                ),
                                thead: ({ children }) => (
                                  <thead className="bg-gray-200">
                                    {children}
                                  </thead>
                                ),
                                tr: ({ children }) => (
                                  <tr className="border border-border rounded-t-xl">
                                    {children}
                                  </tr>
                                ),
                                th: ({ children }) => (
                                  <th className="border border-border px-4 py-2 text-left bg-background font-semibold">
                                    {children}
                                  </th>
                                ),
                                td: ({ children }) => (
                                  <td className="border border-border px-4 py-2">
                                    {children}
                                  </td>
                                ),
                              }}
                            >
                              {chatMsg.botMessage}
                            </ReactMarkdown>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            {/* <MessageFeedback
                              message={chatMsg}
                              onFeedback={handleFeedback}
                            /> */}

                            {chatMsg.sources?.length > 0 && (
                              <div className="ml-auto">
                                {rightPanelContentId !== idx || !showSources ? (
                                  <button
                                    className="flex items-center justify-center bg-primary hover:scale-105 rounded-xl text-card px-4 py-2 gap-1 text-sm"
                                    onClick={() =>
                                      toggleSourcePanel(chatMsg, idx)
                                    }
                                  >
                                    View sources <BsArrowRight />
                                  </button>
                                ) : (
                                  <button
                                    className="flex items-center justify-center bg-primary hover:scale-105 rounded-xl text-card px-4 py-2 gap-1 text-sm"
                                    onClick={() => toggleSourcePanel("", null)}
                                  >
                                    <BiArrowBack /> Hide sources
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between">
                            <div className=" flex items-center justify-start text-xs  min-w-80 text-secondary-foreground">
                              {/* <div className="text-xs text-center mt-1 mr-2">
                              <TimeAgo
                                date={messageTimestamp}
                                formatter={customFormatter}
                                live={false}
                              />
                            </div> */}
                              <MessageFeedback
                                message={chatMsg}
                                onFeedback={handleFeedback}
                              />
                              <Tooltip>
                                <TooltipTrigger>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleCopyClick(chatMsg.botMessage);
                                      handleTextCopied();
                                    }}
                                    className="text-slate-500 rounded-md text-xs py-0.5 px-2 inline-flex items-center"
                                  >
                                    {textCopied ? (
                                      <CheckCheck
                                        size={16}
                                        className="text-primary "
                                      />
                                    ) : (
                                      <Copy
                                        size={16}
                                        className="text-slate-500 hover:text-secondary-foreground"
                                      />
                                    )}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>Copy</TooltipContent>
                              </Tooltip>

                              {lastIndex === idx && (
                                <>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleRegenerateResponse(
                                            chatMsg.message
                                          );
                                        }}
                                        className="text-gray-500 rounded-md text-xs py-0.5 px-2 inline-flex items-center"
                                      >
                                        <RefreshCcw
                                          size={16}
                                          className="hover:text-secondary-foreground text-gray-500"
                                        />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent>Regenerate</TooltipContent>
                                  </Tooltip>
                                </>
                              )}
                            </div>

                            <div className="text-xs text-end mt-3 -mb-2 mr-2 text-gray-500">
                              <TimeAgo
                                date={messageTimestamp}
                                formatter={customFormatter}
                                live={true}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default Message;
