// useVoiceAssistant.ts
import { useEffect, useRef, useState } from "react";

const useVoiceAssistant = (wakeWord = "hey sophia") => {
  const [isAwake, setIsAwake] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [command, setCommand] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition not supported in your browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i][0];
        if (event.results[i].isFinal) {
          finalTranscript += result.transcript;
        } else {
          interimTranscript += result.transcript;
        }
      }

      const fullTranscript = (
        finalTranscript || interimTranscript
      ).toLowerCase();
      setTranscript(fullTranscript);

      // Check for wake word when not awake
      if (!isAwake && fullTranscript.includes(wakeWord.toLowerCase())) {
        setIsAwake(true);
        setCommand(fullTranscript.replace(wakeWord.toLowerCase(), "").trim());
      }
      // Process command when awake
      else if (isAwake) {
        setCommand(fullTranscript);
      }
    };

    recognition.onerror = (event) => {
      setError(`Recognition error: ${event.error}`);
      setIsAwake(false);
    };

    recognition.onend = () => {
      if (isAwake) {
        // If awake, restart listening immediately
        recognition.start();
      }
    };

    // Start listening in background for wake word
    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [isAwake, wakeWord]);

  // Reset after 5 seconds of inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isAwake) {
      timeout = setTimeout(() => {
        setIsAwake(false);
        setCommand("");
      }, 5000); // 5 seconds timeout
    }
    return () => clearTimeout(timeout);
  }, [isAwake, command]);

  const reset = () => {
    setIsAwake(false);
    setCommand("");
  };

  return {
    isAwake,
    transcript,
    command,
    error,
    reset,
  };
};

export default useVoiceAssistant;
