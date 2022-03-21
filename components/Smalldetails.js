import React from "react";
import { TrashIcon } from "@heroicons/react/outline";
import { useRecoilState } from "recoil";
import { mondays } from "../atom/mondays";
import { tuesdays } from "../atom/tuesdays";
import { wednesdays } from "../atom/wednesdays";
import { thursdays } from "../atom/thursdays";
import { fridays } from "../atom/fridays";
import { saturdays } from "../atom/saturdays";

function Smalldetails({ id, name, time, index }) {
  const [Monday, setMonday] = useRecoilState(mondays);
  const [Tuesday, setTuesday] = useRecoilState(tuesdays);
  const [Wednesday, setWednesday] = useRecoilState(wednesdays);
  const [Thursday, setThursday] = useRecoilState(thursdays);
  const [Friday, setFriday] = useRecoilState(fridays);
  const [Saturday, setSaturday] = useRecoilState(saturdays);

  function deleteItem() {
    // Deleting items according to data and id where id is index in each date
    console.log(Monday);
    if (name === "Monday") {
      const temp = [...Monday];
      temp.splice(id, 1);
      setMonday(temp);
    } else if (name === "Tuesday") {
      const temp = [...Tuesday];
      temp.splice(id, 1);
      setTuesday(temp);
    } else if (name === "Wednesday") {
      const temp = [...Wednesday];
      temp.splice(id, 1);
      setWednesday(temp);
    } else if (name === "Thursday") {
      const temp = [...Thursday];
      temp.splice(id, 1);
      setThursday(temp);
    } else if (name === "Friday") {
      const temp = [...Friday];
      temp.splice(id, 1);
      setFriday(temp);
    } else if (name === "Saturday") {
      const temp = [...Saturday];
      temp.splice(id, 1);
      setSaturday(temp);
    }
  }
  return (
    <div className="w-[100%] flex items-center py-2 border-b-[0.1rem] border-slate-700 ">
      <p className="w-[20%] font-serif text-[1.3rem] font-semibold text-slate-500 sm:text-[1.5rem] ">{index}</p>
      <p className="w-[40%] font-serif text-[1.3rem] font-semibold text-slate-500 sm:text-[1.5rem] "> {name}</p>
      <p className="w-[35%]  truncate   font-serif text-[1.3rem]  font-semibold text-slate-500  sm:text-[1.5rem] ">{time}</p>
      <TrashIcon className="h-7 flex-end text-gray-400 cursor-pointer " onClick={deleteItem} />
    </div>
  );
}

export default Smalldetails;
