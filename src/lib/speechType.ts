// Assuming existing global types for SpeechRecognitionAlternative are correct
// and not redefining them here.

// Custom interfaces to match the Speech Recognition API
export interface CustomSpeechRecognition extends EventTarget {
    new (): CustomSpeechRecognition;
    start(): void;
    stop(): void;
    lang: string;
    onresult: (event: SpeechRecognitionEvent) => void;
  }
  
  export interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList[];
  }
  
  export interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    //length: number;
    item(index: number): SpeechRecognitionResult;
  }
  
  export interface SpeechRecognitionResult {
    //isFinal: boolean;
    [index: number]: SpeechRecognitionAlternative;
    //length: number;
    item(index: number): SpeechRecognitionAlternative;
    transcript: string;
  }
  
  export declare var webkitSpeechRecognition: {
    prototype: CustomSpeechRecognition;
    new (): CustomSpeechRecognition;
  };
  