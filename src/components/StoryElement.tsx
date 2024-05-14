import Navbar from "./Navbar";
import Speech from "./SpeechNew";
import { useEffect, useRef, useState } from "react";
import ViewWords from "./ViewWords";
import { ChevronLeftIcon, ChevronRightIcon, Volume2 } from "lucide-react";
import HTMLFlipBook from "react-pageflip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

type PoemData = {
  poem: string;
  image: string;
};

function StoryElement() {
  // const params = useParams();
  // console.log(params.storyId);
  const [storyData, setStoryData] = useState<PoemData[]>([]);
  const [language, setLanguage] = useState("en-IN");
  const [activeItem, setActiveItem] = useState(0);
  const [transcripts, setTranscript] = useState<string[]>([]);
  const [actualSentences, setActualSentences] = useState<
    { word: string; class: string; readFlag: boolean }[][]
  >([]);
  const [chances, setChances] = useState<number>(3);
  const [wordIndex, setWordIndex] = useState<number>(0);
  let wordMispelled = false;

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        const module = await import(`../assets/${language.slice()}.json`);
        setStoryData(module.default);
      } catch (error) {
        console.error("Error fetching story data:", error);
      }
    };

    fetchStoryData();
  }, [language]);

  const nextItem = () => {
    setActiveItem((prevItem) => (prevItem === storyData.length - 1 ? 0 : prevItem + 1));
    setWordIndex(0);
  };

  const prevItem = () => {
    setActiveItem((prevItem) => (prevItem === 0 ? storyData.length - 1 : prevItem - 1));
    setWordIndex(0);
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
    // setTranscript("");
  }, [storyData]);

  const childRef = useRef();

  useEffect(() => {
    // console.log("Chances left: " + chances)
    // console.log("Word mispelled: " + wordMispelled)

    if (transcripts && transcripts[activeItem]) {
      const transcript = transcripts[activeItem].split(" ");
      if (!wordMispelled) {
        setChances(3);
      }
      // let wordIndex = 0
      if (wordIndex < actualSentences[activeItem].length) {
        const currentElement = transcript[transcript.length - 1];
        // console.log(currentElement)

        if (
          currentElement.toLocaleLowerCase() ===
          actualSentences[activeItem][wordIndex].word
            .replace(/[".,:'";\-_ 0-9]/g, "")
            .toLocaleLowerCase()
        ) {
          // console.log("Current word spoken is matching with the existing current word")

          // change colour to blue
          const tempSentences = [...actualSentences];
          tempSentences[activeItem][wordIndex] = {
            ...tempSentences[activeItem][wordIndex],
            class: "blue",
            readFlag: true
          };
          setActualSentences(tempSentences);

          //go to the next actual sentence.
          setWordIndex(wordIndex + 1);
        } else {
          // console.log("Current word spoken is not matching with the actual sentence")
          const tempSentences = [...actualSentences];
          tempSentences[activeItem][wordIndex] = {
            ...tempSentences[activeItem][wordIndex],
            class: "yellow",
            readFlag: true
          };
          setActualSentences(tempSentences);

          if (chances >= 0) {
            // setWordMispelled(true)
            wordMispelled = true;
            if (chances == 0) {
              // console.log("the element can no longer considered for reading.")
              const tempSentences = [...actualSentences];
              tempSentences[activeItem][wordIndex] = {
                ...tempSentences[activeItem][wordIndex],
                class: "red",
                readFlag: true
              };
              setActualSentences(tempSentences);
              setWordIndex(wordIndex + 1);
              // setWordMispelled(false)
              wordMispelled = false;
            } else {
              const currentElement = transcript[transcript.length - 1];
              if (
                currentElement.toLocaleLowerCase() ===
                actualSentences[activeItem][wordIndex].word
                  .replace(/[".,:'";\-_ 0-9]/g, "")
                  .toLocaleLowerCase()
              ) {
                // console.log("Current word spoken is matching with the existing current word")
                // change colour to blue
                const tempSentences = [...actualSentences];
                tempSentences[activeItem][wordIndex] = {
                  ...tempSentences[activeItem][wordIndex],
                  class: "blue",
                  readFlag: true
                };
                setActualSentences(tempSentences);
                //go to the next actual sentence.
                setWordIndex(wordIndex + 1);
                // setWordMispelled(false)
                wordMispelled = false;
              } else {
                //even now the word is wrong
                // console.log("User has only " + chances + " chance left")
                setChances(chances - 1);
              }
            }
          }
        }
      }
    }
  }, [transcripts]);

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
    setWordIndex(0);
  };

  const resetCurrentTranscript = () => {
    setTranscript((prevTranscript) => {
      const newTranscript = [...prevTranscript];
      newTranscript[activeItem] = "";
      return newTranscript;
    });
  };

  const handleTextToSpeech = (text: string) => {
    const word = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();

    word.voice = voices[10];
    console.log(speechSynthesis.getVoices());

    word.lang = "en-IN";
    speechSynthesis.speak(word);
  };
  let innerIndex = -1;
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
        transcripts={transcripts}
      />
      <div id="animation-carousel" className="relative w-full mt-8" data-carousel="static">
        <div className="h-full w-screen overflow-hidden flex justify-center">
          {/* <div
                className={`${
                  activeItem === index ? "" : "hidden"
                } transition-all duration-200 ease-linear flex justify-center gap-8 h-full items-center`}
                data-carousel-item={activeItem === index ? "active" : null}
                key={index}
                style={{ left: `${index * 100}%` }}
                >
                <ViewWords
                key={index}
                actualSentence={actualSentence}
                image={storyData[index].image}
                />
              </div>
            */}
          <HTMLFlipBook
            width={800}
            height={650}
            minWidth={0}
            minHeight={0}
            maxShadowOpacity={0.6}
            size="stretch"
            mobileScrollSupport={true}
            className="h-full mx-32 p-4 m-2 bg-slate-200"
          >
            {actualSentences.map((actualSentence, index) => {
              // innerIndex++; // Increment innerIndex
              return (
                <div key={index}>
                  {index % 2 === 0 ? (
                    <img
                      src={storyData[index].image}
                      className="rounded-lg object-cover w-full  h-full border p-6"
                      alt=""
                    />
                  ) : (
                    <div className="text-[40px] m-8 bg-slate-200 w-full h-full">
                      <p className="hidden">{innerIndex++}</p>
                      {actualSentences[innerIndex].map((data) => {
                        return (
                          <HoverCard key={innerIndex}>
                            <HoverCardTrigger>
                              <span className={data.class}>{data.word + " "}</span>
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
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </HTMLFlipBook>
        </div>

        <div className="absolute z-30 flex mt-8 -translate-x-1/2 space-x-3 rtl:space-x-reverse left-1/2">
          {storyData.map((poem, index) => (
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
    </>
  );
}

export default StoryElement;
