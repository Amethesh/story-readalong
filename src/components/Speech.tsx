import React, { useState } from 'react';

// Custom interfaces to match the Speech Recognition API
interface CustomSpeechRecognition extends EventTarget {
  new(): CustomSpeechRecognition;
  start(): void;
  stop(): void;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList[];
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  item(index: number): SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  item(index: number): SpeechRecognitionAlternative;
  transcript : string
}

declare var webkitSpeechRecognition: {
  prototype: CustomSpeechRecognition;
  new(): CustomSpeechRecognition;
};

const SpeechRecognitionComponent: React.FC = () => {
  const [transcript, setTranscript] = useState<string>('');

  const recognition: CustomSpeechRecognition = new webkitSpeechRecognition();

  recognition.lang = 'en-IN'; // Set the language to Hindi

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    console.log('Recognition event:', event.results);
    setTranscript(event.results[0][0].transcript);
  };

  const startRecognition = () => {
    console.log('Starting recognition');
    recognition.start();
  };

  console.log("Transcript: ",transcript);

  return (
    <div>
      <button onClick={startRecognition}>Start Recognition</button>
      
      <h1>{transcript}</h1>
    </div>
  );
};

export default SpeechRecognitionComponent;

