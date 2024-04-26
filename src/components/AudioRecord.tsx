import { MicIcon, MicOffIcon } from "lucide-react";
import { useState } from "react";
import { useAudioRecorder } from "react-audio-voice-recorder";

const AudioRecorderComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const { startRecording, stopRecording, recordingBlob } = useAudioRecorder();
  const [audioURL, setAudioURL] = useState("");

  const handleRecordClick = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
      setAudioURL(URL.createObjectURL(recordingBlob));
      // addAudioElement(URL.createObjectURL(recordingBlob));
    }
    setIsRecording((prevState) => !prevState);
  };

  // const addAudioElement = (blobURL) => {
  //   const audio = document.createElement("audio");
  //   audio.src = blobURL;
  //   audio.controls = true;
  //   document.body.appendChild(audio);
  // };

  return (
    <div>
      {isRecording ? (
        <MicOffIcon
          className="w-12 h-12 text-[#e9f3f4] p-2 rounded-full bg-[#007c84] shadow-md cursor-pointer"
          onClick={handleRecordClick}
        />
      ) : (
        <MicIcon
          className="w-12 h-12 text-[#e9f3f4] p-2 rounded-full bg-[#007c84] cursor-pointer"
          onClick={handleRecordClick}
        />
      )}
      {audioURL && <audio src={audioURL} controls />}
    </div>
  );
};

export default AudioRecorderComponent;
