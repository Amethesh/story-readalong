import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Volume2 } from "lucide-react";

interface ViewWordsProps {
  actualSentence: { word: string; class: string, readFlag: boolean }[];
  image: string;
  chances: number;
}

const ViewWords = (props: ViewWordsProps) => {

  const handleTextToSpeech = (text: string) => {
    let word = new SpeechSynthesisUtterance(text)
    // let voices = speechSynthesis.getVoices()

    // word.voice = voices[10]
    console.log(speechSynthesis.getVoices())

    word.lang = 'ta-IN'
    speechSynthesis.speak(word)
  }
  return (
    <div className="flex justify-center gap-8 h-full items-center px-32">
      <img
        src={props.image}
        className="rounded-lg object-cover w-[500px] h-[500px] shadow-xl border"
        alt=""
      />
      <div className="text-[40px] m-8">
        {props.actualSentence.map((data, index) => (
          <HoverCard>
            <HoverCardTrigger>
              <span key={index} className={`cursor-pointer ${data.class}`}>
                {data.word + " "}
              </span>
            </HoverCardTrigger>

            {data.readFlag ? (
              <HoverCardContent>
                <div className="flex justify-evenly gap-7">
                  <p 
                  // className={data.class}
                  className="font-medium"
                  >{data.word}</p>
                  <Volume2 size={36} strokeWidth={2.25} color={"#785153"} onClick={() => {
                    handleTextToSpeech(data.word)
                  }} className="mt-4 cursor-pointer" />
                  {/* <p>
                    {props.chances}
                  </p> */}
                </div>
              </HoverCardContent>
            ) :
              (
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