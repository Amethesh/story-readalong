import Navbar from "./Navbar";
import Speech from "./SpeechNew";
import { useEffect, useRef, useState } from "react";
import ViewWords from "./ViewWords";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
// import { useParams } from "react-router-dom";
// import storyData from "../assets/tamil.json";
type PoemData = {
  poem: string;
  image: string;
};

function StoryElement() {
  // const params = useParams();
  // console.log(params.storyId);
  const [storyData, setStoryData] = useState<PoemData[]>([]);
  const [language, setLanguage] = useState("en-US");
  const [activeItem, setActiveItem] = useState(0);
  const [transcripts, setTranscript] = useState<string[]>([]);
  const [actualSentences, setActualSentences] = useState<{ word: string; class: string; readFlag: boolean }[][]>([]);
  const [chances, setChances] = useState<number>(3);
  const [wordIndex, setWordIndex] = useState<number[]>([]);
  let wordMispelled = false

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        const module = await import(`../assets/${language}.json`);
        setStoryData(module.default);
      } catch (error) {
        console.error("Error fetching story data:", error);
      }
    };

    fetchStoryData();
  }, [language]);

  const nextItem = () => {
    setActiveItem((prevItem) => (prevItem === storyData.length - 1 ? 0 : prevItem + 1));
  };

  const prevItem = () => {
    setActiveItem((prevItem) => (prevItem === 0 ? storyData.length - 1 : prevItem - 1));
  };
  const goToItem = (index: number) => {
    setActiveItem(index);
    resetStory();
  };

  useEffect(() => {
    console.log("INSIDE ACTIVEITEM");
    const sentences = storyData.map((poem) =>
      poem.poem
        .trim()
        .split(" ")
        .map((data) => {
          return {
            word: data,
            class: "black",
            readFlag: false
          };
        })
    );
    console.log(sentences);
    setActualSentences(sentences);
    setWordIndex(Array(storyData.length).fill(0));
  }, [storyData]);

  const childRef = useRef();

  useEffect(() => {
    // console.log("Chances left: " + chances)
    // console.log("Word mispelled: " + wordMispelled)

    if (transcripts && transcripts[activeItem]) {
      const transcript = transcripts[activeItem].split(" ");
      if (!wordMispelled) {
        setChances(3)
      }
      // let wordIndex = 0
      if (wordIndex[activeItem] < actualSentences[activeItem].length) {

        const currentElement = transcript[transcript.length - 1];
        // console.log(currentElement)

        if (currentElement.toLocaleLowerCase() === actualSentences[activeItem][wordIndex[activeItem]].word.replace(/[".,:'";\-_ 0-9]/g, "").toLocaleLowerCase()) {

          // console.log("Current word spoken is matching with the existing current word")

          // change colour to blue
          const tempSentences = [...actualSentences];
          tempSentences[activeItem][wordIndex[activeItem]] = { ...tempSentences[activeItem][wordIndex[activeItem]], class: "blue", readFlag: true };
          setActualSentences(tempSentences);


          //go to the next actual sentence.
          setWordIndex((prevWordIndex) => {
            const newWordIndex = [...prevWordIndex];
            newWordIndex[activeItem] = wordIndex[activeItem] + 1;
            return newWordIndex;
          });
        }
        else {
          // console.log("Current word spoken is not matching with the actual sentence")
          const tempSentences = [...actualSentences];
          tempSentences[activeItem][wordIndex[activeItem]] = { ...tempSentences[activeItem][wordIndex[activeItem]], class: "yellow", readFlag: true };
          setActualSentences(tempSentences);

          if (chances >= 0) {
            // setWordMispelled(true)
            wordMispelled = true
            if (chances == 0) {
              // console.log("the element can no longer considered for reading.")
              const tempSentences = [...actualSentences];
              tempSentences[activeItem][wordIndex[activeItem]] = { ...tempSentences[activeItem][wordIndex[activeItem]], class: "red", readFlag: true };
              setActualSentences(tempSentences);
              setWordIndex((prevWordIndex) => {
                const newWordIndex = [...prevWordIndex];
                newWordIndex[activeItem] = wordIndex[activeItem] + 1;
                return newWordIndex;
              });
              // setWordMispelled(false)
              wordMispelled = false
            }
            else {
              const currentElement = transcript[transcript.length - 1];
              if (currentElement.toLocaleLowerCase() === actualSentences[activeItem][wordIndex[activeItem]].word.replace(/[".,:'";\-_ 0-9]/g, "").toLocaleLowerCase()) {
                // console.log("Current word spoken is matching with the existing current word")
                // change colour to blue
                const tempSentences = [...actualSentences];
                tempSentences[activeItem][wordIndex[activeItem]] = { ...tempSentences[activeItem][wordIndex[activeItem]], class: "blue", readFlag: true };
                setActualSentences(tempSentences);
                //go to the next actual sentence.
                setWordIndex((prevWordIndex) => {
                  const newWordIndex = [...prevWordIndex];
                  newWordIndex[activeItem] = wordIndex[activeItem] + 1;
                  return newWordIndex;
                });
                // setWordMispelled(false)
                wordMispelled = false
              }
              else {
                //even now the word is wrong
                // console.log("User has only " + chances + " chance left")
                setChances(chances - 1)
              }
            }
          }
        }
      }
    }
  }, [transcripts])

  const resetStory = () => {
    const sentences = [...actualSentences];
    sentences[activeItem] = storyData[activeItem].poem
      .trim()
      .split(" ")
      .map((data) => {
        return {
          word: data,
          class: "black",
          readFlag: false
        };
      });
    setActualSentences(sentences);
    resetCurrentTranscript();
    setWordIndex((prevWordIndex) => {
      const newWordIndex = [...prevWordIndex];
      newWordIndex[activeItem] = 0; // Reset the wordIndex for the current activeItem
      return newWordIndex;
    });

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
        language={language}
        setLanguage={setLanguage}
        ref={childRef}
      />
      <div id="animation-carousel" className="relative w-full mt-8" data-carousel="static">
        <div className="relative rounded-lg h-full w-screen overflow-hidden">
          {actualSentences.map((actualSentence, index) => (
            <div
              className={`${activeItem === index ? "" : "hidden"
                } transition-all duration-200 ease-linear flex justify-center gap-8 h-full items-center`}
              data-carousel-item={activeItem === index ? "active" : null}
              key={index}
              style={{ left: `${index * 100}%` }}
            >
              <ViewWords
                key={index}
                actualSentence={actualSentence}
                image={storyData[index].image}
                chances={chances}
              />
            </div>
          ))}
        </div>
        <div className="absolute z-30 flex  -translate-x-1/2 space-x-3 rtl:space-x-reverse left-1/2">
          {storyData.map((poem, index) => (
            <button
              key={poem.poem.length}
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
      {transcripts[activeItem] && (
        <p className="w-[1000px] text-nowrap px-4 overflow-hidden mx-auto text-xl mt-6 p-2 bg-[#e9f3f4] rounded-full font-medium text-center text-[#007c84]">
          {transcripts[activeItem]}
        </p>
      )}
    </>
  );
}

export default StoryElement;
