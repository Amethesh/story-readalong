import poems from "./assets/poems.json";
import Navbar from "./components/Navbar";
import Speech from "./components/SpeechNew";
import { useEffect, useState } from "react";
import ViewWords from "./components/ViewWords";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

function App() {
  const [activeItem, setActiveItem] = useState(0);
  const [transcripts, setTranscript] = useState("");
  const [actualSentence, setActualSentence] = useState<{ word: string; color: string; }[]>([]);

  const nextItem = () => {
    setActiveItem((prevItem) => (prevItem === poems.length - 1 ? 0 : prevItem + 1));
    resetStory()
  };

  const prevItem = () => {
    setActiveItem((prevItem) => (prevItem === 0 ? poems.length - 1 : prevItem - 1));
    resetStory()
  };
  const goToItem = (index: number) => {
    setActiveItem(index);
    resetStory()
  };

  useEffect(() => {
    let words = poems[activeItem].poem
      .trim()
      .split(" ")
      .map((data) => {
        return {
          word: data,
          color: "black",
        };
      });
    console.log(words);
    setActualSentence(words);
    setTranscript("")
  }, [activeItem]);

  useEffect(() => {
    console.log(transcripts);
    let transcript = transcripts.split(" ");
    for (let i = 0; i < actualSentence.length; i++) {
      if (transcript.length === i) {
        break;
      }
      if (
        actualSentence[i].word.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() ===
        transcript[i].toLowerCase()
      ) {
        let tempword = [...actualSentence];
        console.log("IF :", tempword)
        tempword[i] = { ...tempword[i], color: "blue" };
        setActualSentence(tempword);
      } else {
        let tempword = [...actualSentence];
        console.log("ELSE :", tempword)
        tempword[i] = { ...tempword[i], color: "red" };
        setActualSentence(tempword);
      }
    }
    console.log(actualSentence)
  }, [transcripts]);

  const resetStory = () => {
    setActualSentence(
      actualSentence.map((word) => {
        return { ...word, color: "black" };
      })
    );
    setTranscript("")
  };

  return (
    <>
      <Navbar />
      <Speech setTranscript={setTranscript} resetStory={resetStory} />
      <div id="animation-carousel" className="relative w-full mt-8" data-carousel="static">
        <div className="relative rounded-lg h-full w-screen overflow-hidden">
          <ViewWords actualSentence={actualSentence} image={poems[activeItem].image} />
        </div>
        <div className="absolute z-30 flex  -translate-x-1/2 space-x-3 rtl:space-x-reverse left-1/2">
          {poems.map((poem, index) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full ${activeItem === index ? "bg-[#289197]" : "bg-[#e9f3f4]"
                } focus:outline-none`}
              aria-current={activeItem === index ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
              data-carousel-slide-to={index}
              onClick={() => goToItem(index)}
            ></button>
          ))}
        </div>
        <button
          type="button"
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full cursor-pointer group focus:outline-none "
          data-carousel-prev
          onClick={prevItem}
        >
          <ChevronLeftIcon
            size={60}
            stroke="#007c84"
            className="bg-[#e9f3f4] rounded-r-full p-1 shadow-md"
          />
        </button>
        <button
          type="button"
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full cursor-pointer group focus:outline-none "
          data-carousel-next
          onClick={nextItem}
        >
          <ChevronRightIcon
            size={60}
            stroke="#007c84"
            className="bg-[#e9f3f4] rounded-l-full p-1 shadow-md"
          />
        </button>
      </div>
      <p className="w-[1000px] text-nowrap px-4 overflow-hidden mx-auto text-xl mt-6 p-2 bg-[#e9f3f4] rounded-full font-medium text-center text-[#007c84]">{transcripts}</p>
    </>
  );
}

export default App;
