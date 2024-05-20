import { useState, useEffect } from 'react';

// Custom interfaces to match the Speech Recognition API
interface CustomSpeechRecognition extends EventTarget {
  new (): CustomSpeechRecognition;
  start(): void;
  stop(): void;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
}
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
  transcript: string;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

declare var webkitSpeechRecognition: {
  prototype: CustomSpeechRecognition;
  new (): CustomSpeechRecognition;
};

const useSpeechRecognition = (language: string) => {
  const [transcript, setTranscript] = useState<string>('');
  const [recognition, setRecognition] = useState<CustomSpeechRecognition | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech Recognition API not supported in this browser');
      return;
    }

    const recognitionInstance: CustomSpeechRecognition = new webkitSpeechRecognition();
    recognitionInstance.lang = language;

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      let newTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        newTranscript += event.results[i][0].transcript;
      }
      setTranscript(newTranscript);
    };

    setRecognition(recognitionInstance);

    return () => {
      recognitionInstance.stop();
    };
  }, [language]);

  const startListening = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  return { transcript, startListening, stopListening, resetTranscript };
};

export default useSpeechRecognition;
