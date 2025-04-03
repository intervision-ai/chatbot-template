import { useAuth } from "@/contexts/authContext";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import config from "../../config.json";
import FeedbackModal from "../Message/FeedbackModal";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const HelpDeskTrigger = () => {
  const { user } = useAuth();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const openFeedbackModal = () => {
    setIsFeedbackModalOpen(true);
  };

  const onSubmit = async (feedback) => {
    console.log("Inside Header OnSubmit : ", feedback);
    try {
      await axios.post(config.apiUrls.feedbackOnApp, {
        email: user?.email,
        feedback_type: feedback.type,
        feedback_text: feedback.details,
      });
      toast.success("Feedback submitted successfully!");
    } catch (error) {
      toast.success("Oops, something went wrong. Please try again later!");
      console.log("error", error);
    }
  };
  return (
    <>
      <div
        className={`hover:cursor-pointer shadow-md hover:scale-105 flex items-center absolute -top-12 right-0 z-50 p-[1px] rounded-full bg-gradient-to-r from-[#04adef] to-purple-600 animate-border `}
        onClick={openFeedbackModal}
      >
        <Tooltip>
          <TooltipTrigger>
            <img
              src="/images/help-desk.png"
              className="h-10 bg-white rounded-full p-1 opacity-80 shadow-md"
              alt=""
            />

            <TooltipContent>Help desk</TooltipContent>
          </TooltipTrigger>
        </Tooltip>
      </div>
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmit={onSubmit}
        helpText=""
        feedbackType="app"
        placeholderText="What was unsatisfying about the app?"
      />
    </>
  );
};
