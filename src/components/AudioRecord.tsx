import { MicIcon, MicOffIcon } from "lucide-react";
import { useState } from "react";
import { useAudioRecorder } from "react-audio-voice-recorder";

const AudioRecorderComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const { startRecording, stopRecording, recordingBlob } = useAudioRecorder();
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const handleRecordClick = () => {
    if (!isRecording) {
      startRecording();
      console.log("IF ....");
    } else {
      if (recordingBlob) {
        const newURL = URL.createObjectURL(recordingBlob);
        setAudioURL(newURL);
        console.log("IBSIDE ELSE IF");
        stopRecording();
      }
      console.log("IBSIDE ELSE");
    }
    setIsRecording((prevState) => !prevState);
  };

  return (
    <div>
      {isRecording ? (
        <MicOffIcon
          className="w-12 h-12 text-[#e9f3f4] p-2 rounded-full bg-[#e85e65] shadow-md cursor-pointer"
          onClick={handleRecordClick}
        />
      ) : (
        <MicIcon
          className="w-12 h-12 text-[#e9f3f4] p-2 rounded-full bg-[#e85e65] cursor-pointer"
          onClick={handleRecordClick}
        />
      )}
      {audioURL && <audio src={audioURL} controls />}
    </div>
  );
};

export default AudioRecorderComponent;
