import React from "react";

function Detail({ name, id, day, time, index }) {
  return (
    <div className=" my-4 flex w-[100%] m-auto items-center justify-between rounded-xl border-b max-w-7xl  border-slate-400  bg-gradient-to-r from-sky-900 to-slate-900 px-10 py-4 ">
      <p className="w-[10%] font-serif text-[1.3rem] font-semibold text-gray-400 sm:text-[1.5rem] ">{index}</p>
      <p className="w-[30%] font-serif text-[1.3rem] font-semibold text-gray-400 sm:text-[1.5rem] ">{time}</p>
      <p className="w-[50%] max-w-[55%] truncate  text-center font-serif text-[1.3rem]  font-semibold text-gray-400 sm:max-w-[40%] sm:text-[1.5rem] ">{name}</p>
    </div>
  );
}

export default Detail;
