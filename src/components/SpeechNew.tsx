import { MicIcon, MicOffIcon, RefreshCcw } from "lucide-react";
import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

interface SpeechProps {
  setTranscript: React.Dispatch<React.SetStateAction<string[]>>;
  resetStory: () => void;
  activeItem: number;
}
const Speech = forwardRef((props: SpeechProps, ref: ForwardedRef<unknown>) => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

    useImperativeHandle(ref, ()=>{
      return {
        resetTranscript: resetTranscript,
      }
    })

  const [play, setPlay] = useState(true);

  useEffect(() => {
    props.setTranscript((prevTranscript) => {
      const newTranscript = [...prevTranscript];
      newTranscript[props.activeItem] = transcript;
      return newTranscript;
    });
    
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  const keepListeneing = () => {
    SpeechRecognition.startListening({ continuous: true });
    setPlay(false);
  };

  const pauseListening = () => {
    SpeechRecognition.stopListening();
    setPlay(true);
  };

 const resetListening = () => {
    resetTranscript();
    props.resetStory();
  };

  return (
    <div className="flex gap-4 justify-end w-full pr-16">
      <RefreshCcw className="w-12 h-12 bg-[#e9f3f4] p-2 rounded-full text-[#007c84] shadow-md cursor-pointer" onClick={resetListening} />
      {play ? (
        <MicOffIcon className="w-12 h-12 text-[#e9f3f4] p-2 rounded-full bg-[#007c84] shadow-md cursor-pointer" onClick={keepListeneing} />
      ) : (
        <MicIcon className="w-12 h-12 text-[#e9f3f4] p-2 rounded-full bg-[#007c84] cursor-pointer" onClick={pauseListening} />
      )}
    </div>
  );
})

export default Speech;
