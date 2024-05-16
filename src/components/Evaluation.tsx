
const Evaluation = () => {
  return (
    <div className="flex justify-center gap-4 items-center text-[#5f605e] h-full mx-32 bg-[#fcfbf6] border-2 border-black/20 shadow-lg rounded-lg">
      <ul className="m-4">
        <li>
          wpm:
          <p className="text-[50px]">30</p>
        </li>
        <li>
          acc:
          <p className="text-[50px]">92%</p>
        </li>
        <li>
          Language:
          <p className="text-[14px]">English</p>
        </li>
      </ul>
      <div className="text-[50px] m-8 max-w-screen-md flex flex-wrap gap-2 items-end">
        <li>
          wpm
          <p className="text-[50px]">30</p>
        </li>
      </div>
    </div>
  )
}

export default Evaluation