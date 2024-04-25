import poems from "./assets/poems.json";
import Navbar from "./components/Navbar";
import Speech from "./components/SpeechNew";
import { useEffect, useRef, useState } from "react";
import ViewWords from "./components/ViewWords";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

function App() {
  const [activeItem, setActiveItem] = useState(0);
  const [transcripts, setTranscript] = useState<string[]>([]);
  const [actualSentences, setActualSentences] = useState<{ word: string; color: string }[][]>([]);

  const nextItem = () => {
    setActiveItem((prevItem) => (prevItem === poems.length - 1 ? 0 : prevItem + 1));
    // setTranscript((prevTranscript) => {
    //   const newTranscript = [...prevTranscript];
    //   newTranscript[activeItem+1] = "";
    //   return newTranscript;
    // });
  };

  const prevItem = () => {
    setActiveItem((prevItem) => (prevItem === 0 ? poems.length - 1 : prevItem - 1));
  };
  const goToItem = (index: number) => {
    setActiveItem(index);
    resetStory();
  };

  useEffect(() => {
    console.log("INSIDE ACTIVEITEM");
    const sentences = poems.map((poem) =>
      poem.poem
        .trim()
        .split(" ")
        .map((data) => {
          return {
            word: data,
            color: "black"
          };
        })
    );
    console.log(sentences);
    setActualSentences(sentences);
    // setTranscript("");
  }, []);

  const childRef = useRef();

  useEffect(() => {
    if (transcripts && transcripts[activeItem]) {
      console.log(transcripts);
      const transcript = transcripts[activeItem].split(" ");
      let reachedEnd = true;
      for (let i = 0; i < actualSentences[activeItem].length; i++) {
        if (transcript.length === i && i !== 0) {
          reachedEnd = false;
          break;
        }
        if (
          actualSentences[activeItem][i].word.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() ===
          transcript[i].toLowerCase()
        ) {
          const tempSentences = [...actualSentences];
          console.log("IF :", tempSentences);
          tempSentences[activeItem][i] = { ...tempSentences[activeItem][i], color: "#2196f3" };
          setActualSentences(tempSentences);
        } else {
          const tempSentences = [...actualSentences];
          console.log("ELSE :", tempSentences);
          tempSentences[activeItem][i] = { ...tempSentences[activeItem][i], color: "#f44336" };
          setActualSentences(tempSentences);
        }
      }
      if (reachedEnd && transcript.length === actualSentences[activeItem].length) {
        nextItem();
        // @ts-ignore
        childRef.current?.resetTranscript();
      }
      console.log(actualSentences);
    }
  }, [transcripts]);

  const resetStory = () => {
    const sentences = [...actualSentences];
    sentences[activeItem] = poems[activeItem].poem
      .trim()
      .split(" ")
      .map((data) => {
        return {
          word: data,
          color: "black"
        };
      });
    setActualSentences(sentences);
    resetCurrentTranscript();
  };

  const resetCurrentTranscript = () => {
    setTranscript((prevTranscript) => {
      const newTranscript = [...prevTranscript];
      newTranscript[activeItem] = "";
      return newTranscript;
    });
  };

  return (
    <>
      <Navbar />
      <Speech
        setTranscript={setTranscript}
        resetStory={resetStory}
        activeItem={activeItem}
        ref={childRef}
      />
      <div id="animation-carousel" className="relative w-full mt-8" data-carousel="static">
        <div className="relative rounded-lg h-full w-screen overflow-hidden">
          {actualSentences.map((actualSentence, index) => (
            <div
              className={`${
                activeItem === index ? "" : "hidden"
              } transition-all duration-200 ease-linear flex justify-center gap-8 h-full items-center`}
              data-carousel-item={activeItem === index ? "active" : null}
              key={index}
              style={{ left: `${index * 100}%` }}
            >
              <ViewWords key={index} actualSentence={actualSentence} image={poems[index].image} />
            </div>
          ))}
        </div>
        <div className="absolute z-30 flex  -translate-x-1/2 space-x-3 rtl:space-x-reverse left-1/2">
          {poems.map((poem, index) => (
            <button
              key={poem.poem.length}
              type="button"
              className={`w-3 h-3 rounded-full ${
                activeItem === index ? "bg-[#289197]" : "bg-[#e9f3f4]"
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
      {transcripts[activeItem] && (
        <p className="w-[1000px] text-nowrap px-4 overflow-hidden mx-auto text-xl mt-6 p-2 bg-[#e9f3f4] rounded-full font-medium text-center text-[#007c84]">
          {transcripts[activeItem]}
        </p>
      )}
    </>
  );
}

export default App;
