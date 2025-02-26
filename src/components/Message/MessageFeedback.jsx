import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import FeedbackModal from "./FeedbackModal";

const MessageFeedback = ({ message, onFeedback }) => {
  const [feedbackState, setFeedbackState] = useState(message?.feedback || null);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isDislikeAnimating, setIsDislikeAnimating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Update local state if message feedback changes (for loaded messages)
    if (message?.feedback) {
      setFeedbackState(message.feedback);
    }
  }, [message?.feedback]);

  const handleFeedbackWithModal = async (type) => {
    if (type === "1") {
      try {
        setFeedbackState(type);
        await onFeedback(message, type);
        setIsLikeAnimating(true);
        setTimeout(() => setIsLikeAnimating(false), 500);
      } catch (error) {
        setFeedbackState(message?.feedback || null);
        console.error("Failed to update feedback:", error);
      }
    } else {
      setIsModalOpen(true);
    }
  };
  const handleModalSubmit = async (feedback) => {
    try {
      setFeedbackState("-1");
      await onFeedback(message, "-1", feedback);
      setIsModalOpen(false);
      setIsDislikeAnimating(true);
      setTimeout(() => setIsDislikeAnimating(false), 500);
    } catch (error) {
      setFeedbackState(message?.feedback || null);
      console.error("Failed to update feedback:", error);
    }
  };
  return (
    <>
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        helpText="Submitting this report will send the entire current conversation to InterVision for future improvements to our models."
        placeholderText="What was unsatisfying about this response?"
      />
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger>
            {" "}
            <button
              onClick={() => handleFeedbackWithModal("positive")}
              className={`p-1.5 rounded-full transition-all duration-200
          ${
            feedbackState === "positive"
              ? "text-green-500"
              : "text-slate-500 hover:text-card-foreground"
          }
          ${isLikeAnimating ? "scale-125" : "scale-100"}
          transform active:scale-95`}
              aria-label="Like message"
            >
              <ThumbsUp
                size={16}
                className={`transition-colors duration-200
            ${isLikeAnimating ? "animate-bounce" : ""}`}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Good response</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <button
              onClick={() => handleFeedbackWithModal("negative")}
              className={`p-1.5 rounded-full transition-all duration-200
          ${
            feedbackState === "negative"
              ? " text-red-500"
              : "text-slate-500 hover:text-card-foreground"
          }
          ${isDislikeAnimating ? "scale-125" : "scale-100"}
          transform active:scale-95`}
              aria-label="Dislike message"
            >
              <ThumbsDown
                size={16}
                className={`transition-colors duration-200
            ${isDislikeAnimating ? "animate-bounce" : ""}`}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bad response</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  );
};

export default MessageFeedback;
