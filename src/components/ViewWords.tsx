import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ViewWordsProps {
  actualSentence: { word: string; class: string; readFlag: boolean }[];
  image: string;
}
const ViewWords = (props: ViewWordsProps) => {
  const handleTextToSpeech = (text: string) => {
    const word = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();

    word.voice = voices[10];
    console.log(speechSynthesis.getVoices());

    word.lang = "ta-IN";
    speechSynthesis.speak(word);
  };

  return (
    <div className="flex justify-center gap-4 items-center h-full mx-32 bg-[#fcfbf6] border-2 border-black/20 shadow-lg rounded-lg">
      <img
        src={props.image}
        className="rounded-lg object-cover w-[500px] h-[500px] shadow-xl p-6 bg-[#edeae1] "
        alt=""
      />
      <div className="text-[50px] m-8 max-w-screen-md flex flex-wrap gap-2 items-end">
        {props.actualSentence.map((data, index) => (
          <HoverCard>
            <HoverCardTrigger>
              <span>
                {data.class === "blue" &&
                  <img src="/images/star.png" alt="star" className="relative w-8 left-1/2 animate-ping hidden" />
                }
                <span key={index} className={data.class}>
                  {data.word + " "}
                </span>
              </span>
            </HoverCardTrigger>

            {data.readFlag ? (
              <HoverCardContent>
                <div className="flex justify-evenly gap-7">
                  <p className={data.class}>{data.word}</p>
                  <Volume2
                    size={36}
                    strokeWidth={2.25}
                    color={"#785153"}
                    onClick={() => {
                      handleTextToSpeech(data.word);
                    }}
                    className="mt-4"
                  />
                </div>
              </HoverCardContent>
            ) : (
              <HoverCardContent>
                <p className={data.class}>{data.word}</p>
              </HoverCardContent>
            )}
          </HoverCard>
        ))}
      </div>
    </div>
  );
};

export default ViewWords;