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
  transcripts: string[];
}

const Speech = forwardRef((props: SpeechProps, ref: ForwardedRef<unknown>) => {
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useImperativeHandle(ref, () => {
    if (browserSupportsSpeechRecognition) {
      return {
        resetTranscript: resetTranscript,
        pauseListening: pauseListening
      };
    }
  });

  const [play, setPlay] = useState(true);
  const { startRecording, stopRecording, recordingBlob } = useAudioRecorder();
  const [audioURLs, setAudioURLs] = useState<(string | undefined)[]>(Array(5).fill(null)); // Array to hold audio URLs for each active item

  useEffect(() => {
    if (recordingBlob) {
      const newURL = URL.createObjectURL(recordingBlob);
      setAudioURLs((prevAudioURLs) => {
        const newAudioURLs = [...prevAudioURLs];
        newAudioURLs[props.activeItem] = newURL; // Store recording blob URL for the active item
        return newAudioURLs;
      });
    }
  }, [recordingBlob]);

  useEffect(() => {
    props.setTranscript((prevTranscript) => {
      const newTranscript = [...prevTranscript];
      console.log("Previous Transcript:", newTranscript);

      if (newTranscript[props.activeItem]) {
        const existingWords = newTranscript[props.activeItem].split(' ');
        const newWords = transcript.split(' ');
        
        // Find the words that are not already in the existing transcript
        const wordsToAdd = newWords.filter(word => !existingWords.includes(word));

        // Append only the new words
        newTranscript[props.activeItem] = [...existingWords, ...wordsToAdd].join(' ');
      } else {
        newTranscript[props.activeItem] = transcript;
      }

      console.log("Updated Transcript:", newTranscript);
      return newTranscript;
    });
  }, [transcript]);

  useEffect(() => {
    resetTranscript();
  }, [props.activeItem]);

  if (!browserSupportsSpeechRecognition) {
    return <BrowserNotSupport />;
  }

  const keepListening = () => {
    console.log(props.language);
    SpeechRecognition.startListening({ continuous: true, language: props.language });
    startRecording();
    setPlay(false);
  };

  const pauseListening = () => {
    SpeechRecognition.stopListening();
    console.log("Paused!!!!!");
    stopRecording();
    setPlay(true);
  };

  const resetListening = () => {
    resetTranscript();
    props.resetStory();
    setAudioURLs((prevAudioURLs) => {
      const newAudioURLs = [...prevAudioURLs];
      newAudioURLs[props.activeItem] = undefined; // Clear recorded audio for the active item
      return newAudioURLs;
    });
  };

  const handleChangeLanguage = (lang: string) => {
    console.log("lang:", lang);
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
            <SelectItem className="text-[#e85e65]" value="jp-JP">
              Japanese
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
});

export default Speech;
