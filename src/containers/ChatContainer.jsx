import React, { forwardRef } from "react";
import ChatBox from "../components/ChatBox/ChatBox";
import "./ChatContainer.css";

const ChatContainer = forwardRef((props, ref) => {
  return (
    <>
      <ChatBox ref={ref} />
    </>
  );
});

export default ChatContainer;
