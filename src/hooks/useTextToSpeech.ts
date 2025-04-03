import { useEffect, useState } from "react";

const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    // Load available voices when component mounts
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      // Set a default voice (English)
      const defaultVoice = availableVoices.find(
        (voice) => voice.lang.includes("en") || voice.lang.includes("EN")
      );
      setSelectedVoice(defaultVoice || null);
    };

    // Some browsers need this event to load voices
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = (text: string) => {
    if (!text) return;

    // Cancel any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 1; // Speed (0.1 to 10)
    utterance.pitch = 1; // Pitch (0 to 2)
    utterance.volume = 1; // Volume (0 to 1)

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error("SpeechSynthesis error:", event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return {
    speak,
    stopSpeaking,
    isSpeaking,
    voices,
    selectedVoice,
    setSelectedVoice,
  };
};

export default useTextToSpeech;
