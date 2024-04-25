import poems from "./assets/poems.json";
import Navbar from "./components/Navbar";
import ImageSlide from "./components/ImageSlide";
import Speech from "./components/SpeechNew";
import { useState } from "react";

function App() {
  
  const [transcript, setTranscript] = useState("")

  const resetStory = () => {
   
  };

  return (
    <>
      <Navbar />
      <Speech setTranscript={setTranscript} resetStory={resetStory}/>
      <ImageSlide />
    </>
  );
}

export default App;
