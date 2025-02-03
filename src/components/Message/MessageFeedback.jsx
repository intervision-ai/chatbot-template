import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";

const MessageFeedback = ({ message, onFeedback }) => {
  const [feedbackState, setFeedbackState] = useState(message?.feedback || null);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isDislikeAnimating, setIsDislikeAnimating] = useState(false);

  useEffect(() => {
    // Update local state if message feedback changes (for loaded messages)
    if (message?.feedback) {
      setFeedbackState(message.feedback);
    }
  }, [message?.feedback]);

  const handleFeedback = async (type) => {
    // Immediately update UI state
    setFeedbackState(type);

    if (type === "1") {
      setIsLikeAnimating(true);
      setTimeout(() => setIsLikeAnimating(false), 500);
    } else {
      setIsDislikeAnimating(true);
      setTimeout(() => setIsDislikeAnimating(false), 500);
    }

    try {
      await onFeedback(message, type);
    } catch (error) {
      // Revert state if request fails
      setFeedbackState(message?.feedback || null);
      console.error("Failed to update feedback:", error);
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={() => handleFeedback("1")}
        className={`p-1.5 rounded-full transition-all duration-200 
          ${
            feedbackState === "1"
              ? "text-green-500"
              : "text-gray-500 hover:text-secondary-foreground"
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
      <button
        onClick={() => handleFeedback("-1")}
        className={`p-1.5 rounded-full transition-all duration-200
          ${
            feedbackState === "-1"
              ? " text-red-500"
              : "text-gray-500 hover:text-secondary-foreground"
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
    </div>
  );
};

export default MessageFeedback;
