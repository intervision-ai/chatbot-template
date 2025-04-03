import { useEffect, useRef, useState } from "react";

const useSpeechToText = () => {
  const [transcript, setTranscript] = useState("");
  const [listening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in your browser");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setTranscript(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      setError(`Error occurred in recognition: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      if (listening) {
        recognitionRef.current?.start();
      }
    };

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) return;
    setIsListening(true);
    setError(null);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current?.stop();
  };

  return {
    transcript,
    listening,
    error,
    startListening,
    stopListening,
  };
};

export default useSpeechToText;
