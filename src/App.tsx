import SpeechRecognitionComponent from './components/Speech'
import poems from "./assets/poems.json"

function App() {

  return (
    <>
    <main>
      {poems.map((poem, index) => {
        try {
          return (
            <section key={index} className='flex flex-row items-center'>
              <img className=''
              src="https://next-images.opencollective.com/_next/image?url=%2Fstatic%2Fimages%2Fnew-home%2Fe2c-illustration-lg.png&w=640&q=75" alt="Poem Images" />
              <p className='text-[40px] '>{poem.poem}</p>
            </section>
          );
        } catch (error) {
          console.error(`Error rendering poem at index ${index}:`, error);
          return null; // Skip rendering the problematic poem
        }
      })}
    </main>
    <SpeechRecognitionComponent />
    </>
  )
}

export default App
