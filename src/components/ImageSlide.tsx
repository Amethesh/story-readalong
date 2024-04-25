import { useState } from "react";
import poems from "../assets/poems.json";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const ImageSlide = () => {
  const [activeItem, setActiveItem] = useState(0);

  const nextItem = () => {
    setActiveItem((prevItem) => (prevItem === poems.length - 1 ? 0 : prevItem + 1));
  };

  const prevItem = () => {
    setActiveItem((prevItem) => (prevItem === 0 ? poems.length - 1 : prevItem - 1));
  };
  const goToItem = (index: number) => {
    setActiveItem(index);
  };

  return (
    <div id="animation-carousel" className="relative w-full mt-8" data-carousel="static">
      <div className="relative rounded-lg h-full w-screen overflow-hidden">
        {poems.map((poem, index) => (
          <div
            className={`${
              activeItem === index ? "" : "hidden"
            } transition-all duration-200 ease-linear flex justify-center gap-8 h-full items-center px-32`}
            data-carousel-item={activeItem === index ? "active" : null}
            key={index}
            style={{ left: `${index * 100}%` }}
          >
            <img
              src={poem.image}
              className="rounded-lg object-cover w-[500px] h-[500px] shadow-lg border"
              alt=""
            />
            <p className="text-[40px] m-8">{poem.poem}</p>
            <p className="absolute z-50 p-1 rounded-xl font-bold -bottom-20">
              Page No: {index + 1}
            </p>
          </div>
        ))}
      </div>
      <div className="absolute z-30 flex  -translate-x-1/2 space-x-3 rtl:space-x-reverse left-1/2">
        {poems.map((poem, index) => (
          <button
            key={index}
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
  );
};

export default ImageSlide;
