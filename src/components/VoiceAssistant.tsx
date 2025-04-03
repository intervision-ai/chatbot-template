// SophiaAssistant.tsx
import useVoiceAssistant from "@/hooks/useVoiceAssistant";
import React, { useState } from "react";
import "./index.css";

const SophiaAssistant = () => {
  const { isAwake, command, error, reset } = useVoiceAssistant("hey sophia");
  const [response, setResponse] = useState("");

  // Process commands when awake
  React.useEffect(() => {
    if (!isAwake || !command) return;

    // Example command processing
    if (command.includes("time")) {
      const time = new Date().toLocaleTimeString();
      setResponse(`The current time is ${time}`);
    } else if (command.includes("date")) {
      const date = new Date().toLocaleDateString();
      setResponse(`Today's date is ${date}`);
    } else if (command.includes("hello") || command.includes("hi")) {
      setResponse("Hello there! How can I help you?");
    } else {
      setResponse(`I heard: "${command}". What would you like me to do?`);
    }

    // Reset after processing
    const timer = setTimeout(reset, 3000);
    return () => clearTimeout(timer);
  }, [command, isAwake, reset]);

  return (
    <div className="voice-assistant">
      <h1>Sophia Voice Assistant</h1>

      {error && <div className="error">{error}</div>}

      <div className={`status ${isAwake ? "awake" : "sleeping"}`}>
        Status: {isAwake ? "🟢 Awake" : "🔴 Sleeping"}
      </div>

      {isAwake && (
        <div className="command">
          <p>Command: {command}</p>
          {response && <p className="response">Sophia: {response}</p>}
        </div>
      )}

      <div className="instructions">
        <p>Say "Hey Sophia" followed by your command</p>
        <p>Try: "Hey Sophia what time is it?"</p>
      </div>
    </div>
  );
};

export default SophiaAssistant;
