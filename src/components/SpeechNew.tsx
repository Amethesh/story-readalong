import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import BrowserNotSupport from "./BrowserNotSupport";
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

interface SpeechProps {
  setTranscript: React.Dispatch<React.SetStateAction<string[]>>;
  resetStory: () => void;
  activeItem: number;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
}

const Speech = forwardRef((props: SpeechProps, ref: ForwardedRef<unknown>) => {
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useImperativeHandle(ref, () => {
    if(browserSupportsSpeechRecognition){
      return {
        resetTranscript: resetTranscript,
        pauseListening: pauseListening
      };
    }
  });
  
  const [play, setPlay] = useState(true);
  const { startRecording, stopRecording, recordingBlob } = useAudioRecorder();
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [languageChanged, setLanguageChanged] = useState(false); // Track if language is changed

  if (!browserSupportsSpeechRecognition) {
    return <BrowserNotSupport />;
  }

  useEffect(() => {
    if (recordingBlob) {
      const newURL = URL.createObjectURL(recordingBlob);
      setAudioURL(newURL);
    }
  }, [recordingBlob]);

  useEffect(() => {
    props.setTranscript((prevTranscript) => {
      const newTranscript = [...prevTranscript];
      newTranscript[props.activeItem] = transcript;
      return newTranscript;
    });
  }, [transcript]);

  const keepListening = () => {
    console.log(props.language)
    SpeechRecognition.startListening({ continuous: true, language: props.language });
    startRecording();
    setPlay(false);
    setLanguageChanged(false); // Reset language change flag when starting recording
  };

  const pauseListening = () => {
    SpeechRecognition.stopListening();
    console.log("Paused!!!!!")
    stopRecording();
    setPlay(true);
  };

  const resetListening = () => {
    resetTranscript();
    props.resetStory();
    setAudioURL(null); // Clear recorded audio

  };

  const handleChangeLanguage = (lang: string) => {
    console.log("lang:", lang)
    props.setLanguage(lang)
    setLanguageChanged(true); // Set language changed to true
    pauseListening();
    resetListening();
  }

  return (
    <div className="flex gap-4 justify-end items-center w-full pr-16">
      {audioURL && !languageChanged && <audio src={audioURL} controls />} {/* Render audio only if there's an audioURL and language is not changed */}
      <RefreshCcw
        className="w-12 h-12 bg-[#e9f3f4] p-2 rounded-full text-[#007c84] shadow-md cursor-pointer"
        onClick={resetListening}
      />
      {(play) ? (
        <MicOffIcon
          className="w-12 h-12 text-[#e9f3f4] p-2 rounded-full bg-[#007c84] shadow-md cursor-pointer"
          onClick={keepListening}
        />
      ) : (
        <MicIcon
          className="w-12 h-12 text-[#e9f3f4] p-2 rounded-full bg-[#007c84] cursor-pointer"
          onClick={pauseListening}
        />
      )}
      <Select defaultValue="en-IN" onValueChange={(value: string) => handleChangeLanguage(value)}>
        <SelectTrigger className="w-[180px] h-full bg-[#e9f3f4] border-0 text-[#007c84] font-medium">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent className="bg-[#e9f3f4]">
          <SelectGroup>
            <SelectItem className="text-[#007c84]" value="ta-IN">
              Tamil
            </SelectItem>
            <SelectItem className="text-[#007c84]" value="en-IN">
              English
            </SelectItem>
            <SelectItem className="text-[#007c84]" value="hi-IN">
              Hindi
            </SelectItem>
            <SelectItem className="text-[#007c84]" value="jp-JP">
              Japanese
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
});

export default Speech;
