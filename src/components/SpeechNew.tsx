import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from "react";
// import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
// import useSpeechRecognition from './Speech';
// import BrowserNotSupport from "./BrowserNotSupport";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";
import { RefreshCcw, MicIcon, MicOffIcon } from "lucide-react";
import { useAudioRecorder } from "react-audio-voice-recorder";
// import {CustomSpeechRecognition, webkitSpeechRecognition, SpeechRecognitionEvent} from "../lib/speechType"

interface SpeechProps {
  setTranscript: React.Dispatch<React.SetStateAction<string[]>>;
  resetStory: () => void;
  activeItem: number;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  transcripts: string[];
}

const Speech = forwardRef((props: SpeechProps, ref: ForwardedRef<unknown>) => {
  const recognition: SpeechRecognition = new window.webkitSpeechRecognition();
  const [play, setPlay] = useState(true);
  const { startRecording, stopRecording, recordingBlob } = useAudioRecorder();
  const [audioURLs, setAudioURLs] = useState<(string | undefined)[]>(Array(5).fill(undefined));
  console.log(props.activeItem)
  
  // Update the transcript state when speech recognition results are available
  let recognitionOnresult = (event: SpeechRecognitionEvent) => {``
    const resultsLength = event.results.length;
    const latestResult = event.results[resultsLength - 1];
    const speechToText = latestResult[0].transcript.trim();
    console.log("speechToText", speechToText);
    console.log("Event", event.results);
    props.setTranscript((prevTranscript) => {
      const newTranscript = [...prevTranscript];
      if (newTranscript[props.activeItem]) {
        const existingWords = newTranscript[props.activeItem].split(' ');
        const newWords = speechToText.split(' ');
  
        // Find the words that are not already in the existing transcript
        const wordsToAdd = newWords.filter(word => !existingWords.includes(word));
  
        // Append only the new words
        newTranscript[props.activeItem] = [...existingWords, ...wordsToAdd].join(' ');
      } else {
        newTranscript[props.activeItem] = speechToText;
      }
      console.log("Updated Transcript:", newTranscript);
      return newTranscript;
    });
  };
  
  recognition.lang = props.language; // Use the language from props
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.onresult = recognitionOnresult;
  
  // Handle imperative actions using the ref
  useImperativeHandle(ref, () => ({
    pauseListening: pauseListening
  }));

  // useEffect(() => {
  //   recognition.onresult = recognitionOnresult;
  //   // This effect runs when activeItem changes, ensuring the new activeItem is used in the recognitionOnresult logic
  // }, [props.activeItem]);

  useEffect(() => {
    if (recordingBlob) {
      const newURL = URL.createObjectURL(recordingBlob);
      setAudioURLs((prevAudioURLs) => {
        const newAudioURLs = [...prevAudioURLs];
        newAudioURLs[props.activeItem] = newURL;
        return newAudioURLs;
      });
    }
  }, [recordingBlob]);
  
  const keepListening = () => {
    recognition.start();
    startRecording();
    setPlay(false);
  };
  
  const pauseListening = () => {
    recognition.stop();
    stopRecording();
    setPlay(true);
  };
  
  const resetListening = () => {
    props.resetStory();
    setAudioURLs((prevAudioURLs) => {
      const newAudioURLs = [...prevAudioURLs];
      newAudioURLs[props.activeItem] = undefined;
      return newAudioURLs;
    });
  };
  

  const handleChangeLanguage = (lang: string) => {
    props.setLanguage(lang);
    pauseListening();
    resetListening();
  };
  return (
    <div className="flex gap-4 justify-end items-center w-full px-12">
      {props.transcripts[props.activeItem] && (
        <p className="w-[1000px] text-nowrap px-4 overflow-hidden text-xl p-2 bg-[#e9f3f4] rounded-full font-medium text-center text-[#e85e65]">
          {props.transcripts[props.activeItem]}
        </p>
      )}
      {audioURLs[props.activeItem] && ( // Display audio for the active item
        <audio src={audioURLs[props.activeItem]} controls />
      )}
      <RefreshCcw
        className="w-12 h-12 bg-[#e9f3f4] p-2 rounded-full text-[#e85e65] shadow-md cursor-pointer"
        onClick={resetListening}
      />
      {play ? (
        <MicOffIcon
          className="w-12 h-12 text-[#e9f3f4] p-2 rounded-full bg-[#e85e65] shadow-md cursor-pointer"
          onClick={keepListening}
        />
      ) : (
        <MicIcon
          className="w-12 h-12 text-[#e9f3f4] p-2 rounded-full bg-[#e85e65] cursor-pointer"
          onClick={pauseListening}
        />
      )}
      <Select defaultValue="en-IN" onValueChange={(value: string) => handleChangeLanguage(value)}>
        <SelectTrigger className="w-[180px] h-full bg-[#e9f3f4] border-0 text-[#e85e65] font-medium">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent className="bg-[#e9f3f4]">
          <SelectGroup>
            <SelectItem className="text-[#e85e65]" value="ta-IN">
              Tamil
            </SelectItem>
            <SelectItem className="text-[#e85e65]" value="en-IN">
              English
            </SelectItem>
            <SelectItem className="text-[#e85e65]" value="hi-IN">
              Hindi
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
});

export default Speech;
