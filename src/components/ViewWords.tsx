interface ViewWordsProps {
  actualSentence: { word: string; color: string; }[];
  image: string;
}

const ViewWords = (props: ViewWordsProps) => {

  return (
    <div className="flex justify-center gap-8 h-full items-center px-32"
    >
      <img
        src={props.image}
        className="rounded-lg object-cover w-[500px] h-[500px] shadow-xl border"
        alt=""
      />
      <div className="text-[40px] m-8">

        {props.actualSentence.map((data) => (
          <span className={`text-${data.color}-500 font-semibold`}>
            {data.word + " "}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ViewWords;
