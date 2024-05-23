import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Navbar from "./Navbar";
import Speech from "./SpeechNew";
import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import WarningCard from "./WarningCard";

type PoemData = {
  poem: string;
  image: string;
};

function StoryElement() {
  const [storyData, setStoryData] = useState<PoemData[]>([]);
  const [language, setLanguage] = useState("en-IN");
  const [activeItem, setActiveItem] = useState(0);
  const [transcripts, setTranscript] = useState<string[]>([]);
  const [actualSentences, setActualSentences] = useState<
    { word: string; class: string; readFlag: boolean }[][]
  >([]);
  const [chances, setChances] = useState<number>(3);
  const [wordIndex, setWordIndex] = useState<number[]>([]);
  const [allowPage, setAllowPage] = useState<boolean[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  let wordMispelled = false;
  const book = useRef();

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
    setTranscript([])
  }, [language]);

  const nextItem = () => {

    //@ts-ignore
    childRef.current?.pauseListening()
    // setActiveItem((prevItem) => (prevItem === storyData.length - 1 ? 0 : prevItem + 1));
    // setWordIndex(0);
    //@ts-ignore
    book.current.pageFlip().flipNext();
  };

  const prevItem = () => {
    // setActiveItem((prevItem) => (prevItem === 0 ? storyData.length - 1 : prevItem - 1));
    // setWordIndex(0);
    //@ts-ignore
    book.current.pageFlip().flipPrev();
  };

  const goToItem = (index: number) => {
    if (!allowPage[index]) {
      setActiveItem(index);
      console.log("index", index);
      console.log("index*2", index * 2);
      //@ts-ignore
      book.current
        .pageFlip()
        .flip(index * 2, "top")
        .on("touchstart", {
          passive: true
        });
      resetStory();
    }
  };

  const [alternateElements, setAlternateElements] = useState<JSX.Element[]>([]);
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
    console.log(actualSentences);
    setWordIndex(Array(storyData.length).fill(0));
    setAllowPage(Array(storyData.length).fill(true));
  }, [storyData, language]);

  useEffect(() => {
    const newAlternateElements = [];
    for (let i = 0; i < storyData.length; i++) {
      const item = storyData[i];
      newAlternateElements.push(
        <img
          key={`img${i}`}
          src={item.image}
          alt="poem"
          className="rounded-lg object-scale-down w-[500px] h-[500px] shadow-xl border"
        />,
        <p
          key={`poem${i}`}
          className="text-[50px] p-4 rounded-lg bg-[#fcfbf6] h-full overflow-y-auto w-full"
        >
          {actualSentences[i] &&
            actualSentences[i].map((data, index) => (
              <span key={index} className={`relative group cursor-pointer ${data.class}`}>
                {data.word + " "}
                <div
                  className={`z-40 absolute left-1/2 transform -translate-x-1/2 top-full border mb-2 hidden group-hover:block bg-white rounded p-3 w-max`}
                >
                  {data.readFlag ? (
                    <div className="z-50 flex justify-evenly gap-7">
                      <p
                        className="black"
                        onMouseEnter={() => {
                          handleTextToSpeech(data.word);
                        }}
                      >
                        {data.word}
                      </p>
                      {/* <Volume2
                      size={36}
                      strokeWidth={2.25}
                      color={"#785153"}
                      onMouseEnter={() => {
                        handleTextToSpeech(data.word);
                      }}
                      className="mt-4"
                    /> */}
                    </div>
                  ) : (
                    <p className={data.class}>{data.word}</p>
                  )}
                </div>
              </span>
            ))}
        </p>
      );
    }
    setAlternateElements(newAlternateElements);
  }, [actualSentences]);

  const childRef = useRef();

  useEffect(() => {
    // console.log("Chances left: " + chances)
    // console.log("Word mispelled: " + wordMispelled)

    if (transcripts && transcripts[activeItem]) {
      const transcript = transcripts[activeItem].split(" ");
      if (!wordMispelled) {
        setChances(5);
      }
      // let wordIndex = 0
      if (wordIndex[activeItem] < actualSentences[activeItem].length) {
        const currentElement = transcript[transcript.length - 1];
        // console.log(currentElement)

        if (
          currentElement.toLocaleLowerCase() ===
          actualSentences[activeItem][wordIndex[activeItem]].word
            .replace(/[".,:!?'";\-_ 0-9]/g, "")
            .toLocaleLowerCase()
        ) {
          // console.log("Current word spoken is matching with the existing current word")

          // change colour to blue
          const tempSentences = [...actualSentences];
          tempSentences[activeItem][wordIndex[activeItem]] = {
            ...tempSentences[activeItem][wordIndex[activeItem]],
            class: "blue",
            readFlag: true
          };
          setActualSentences(tempSentences);

          //go to the next actual sentence.
          // setWordIndex(wordIndex + 1);
          setWordIndex((prevWordIndex) => {
            const newWordIndex = [...prevWordIndex];
            newWordIndex[activeItem] = newWordIndex[activeItem] + 1;
            return newWordIndex;
          });
        } else {
          // console.log("Current word spoken is not matching with the actual sentence")
          const tempSentences = [...actualSentences];
          tempSentences[activeItem][wordIndex[activeItem]] = {
            ...tempSentences[activeItem][wordIndex[activeItem]],
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
              tempSentences[activeItem][wordIndex[activeItem]] = {
                ...tempSentences[activeItem][wordIndex[activeItem]],
                class: "red",
                readFlag: true
              };
              setActualSentences(tempSentences);
              // setWordIndex(wordIndex + 1);
              // setWordIndex(prevWordIndex => [...prevWordIndex, prevWordIndex.length]);
              setWordIndex((prevWordIndex) => {
                const newWordIndex = [...prevWordIndex];
                newWordIndex[activeItem] = newWordIndex[activeItem] + 1;
                return newWordIndex;
              });

              // setWordMispelled(false)
              wordMispelled = false;
            } else {
              const currentElement = transcript[transcript.length - 1];
              if (
                currentElement.toLocaleLowerCase() ===
                actualSentences[activeItem][wordIndex[activeItem]].word
                  .replace(/[".,:!?'";\-_ 0-9]/g, "")
                  .toLocaleLowerCase()
              ) {
                // console.log("Current word spoken is matching with the existing current word")
                // change colour to blue
                const tempSentences = [...actualSentences];
                tempSentences[activeItem][wordIndex[activeItem]] = {
                  ...tempSentences[activeItem][wordIndex[activeItem]],
                  class: "blue",
                  readFlag: true
                };
                setActualSentences(tempSentences);
                //go to the next actual sentence.
                // setWordIndex(wordIndex + 1);
                setWordIndex((prevWordIndex) => {
                  const newWordIndex = [...prevWordIndex];
                  newWordIndex[activeItem] = newWordIndex[activeItem] + 1;
                  return newWordIndex;
                });
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

    if (actualSentences[activeItem] && actualSentences[activeItem].every(sentence => sentence.readFlag)) {
      setAllowPage((prevAllowPage) => {
        const newAllowPage = [...prevAllowPage];
        newAllowPage[activeItem] = false;
        return newAllowPage;
      });
    }

  }, [transcripts]);

  const checkNinetyPercentRedClasses = () => {
    // Ensure that actualSentences[activeItem] exists
    if (!actualSentences[activeItem]) {
      return false;
    }
    const sentence = actualSentences[activeItem];
    const totalWords = sentence.length;
    const redWords = sentence.filter(wordObject => wordObject.class === 'red').length;
    const redPercentage = (redWords / totalWords) * 100;

    return redPercentage >= 80;
  };

  useEffect(() => {
    if (checkNinetyPercentRedClasses()) {
      setShowDialog(true);
    }
  }, [actualSentences, activeItem]);

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
      newWordIndex[activeItem] = 0;
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

  const handleTextToSpeech = (text: string) => {
    const word = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();

    word.voice = voices[10];
    console.log(speechSynthesis.getVoices());

    word.lang = "ta-IN";
    speechSynthesis.speak(word);
  };

  const handleFlip = (e: { data: number }) => {
    setActiveItem(e.data / 2);
    // setWordIndex(0)
    console.log(e);
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
        transcripts={transcripts}
      />
      {showDialog && (
        <div className="grid absolute top-0 h-screen w-screen place-items-center backdrop-blur-sm z-[999]">
          <WarningCard setShowDialog={setShowDialog} />
        </div>
      )}
      <div id="animation-carousel" className="relative w-full mt-8" data-carousel="static">
        <div className="h-full w-screen overflow-hidden flex justify-center ">
          <HTMLFlipBook
            width={800}
            height={650}
            minWidth={0}
            minHeight={0}
            maxShadowOpacity={0.6}
            onFlip={handleFlip}
            size="stretch"
            mobileScrollSupport={true}
            ref={book}
            style={{}}
            startPage={0}
            maxWidth={0}
            maxHeight={0}
            drawShadow={true}
            flippingTime={1000}
            usePortrait={true}
            startZIndex={0}
            autoSize={true}
            showCover={false}
            clickEventForward={true}
            useMouseEvents={false}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={true}
            // useMouseEvents={false}
            className="mx-32 my-4 bg-[#fcfbf6] border-2 border-black/20 rounded-lg shadow-lg z-50"
          >
            {alternateElements}
          </HTMLFlipBook>
        </div>

        <div className="absolute z-30 flex mt-8 -translate-x-1/2 space-x-3 rtl:space-x-reverse left-1/2">
          {storyData.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`w-4 h-4 rounded-full ${activeItem === index ? "bg-[#e85e65]" : "bg-[#fcfbf6]"
                } focus:outline-none`}
              aria-current={activeItem === index ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
              data-carousel-slide-to={index}
              onClick={(e) => {
                e.preventDefault;
                goToItem(index);
              }}
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
            stroke="#e85e65"
            className="bg-[#e9f3f4] rounded-r-full p-1 shadow-md"
          />
        </button>
        <button
          type="button"
          className={`absolute top-0 end-0 z-30 flex items-center justify-center h-full cursor-pointer group focus:outline-none ${allowPage[activeItem] ? 'hidden' : ''}`}
          data-carousel-next
          onClick={nextItem}
        // disabled={allowPage[activeItem]}
        >
          <ChevronRightIcon
            size={60}
            stroke="#e85e65"
            className="bg-[#e9f3f4] rounded-l-full p-1 shadow-md"
          />
        </button>
      </div>
    </>
  );
}

export default StoryElement;
