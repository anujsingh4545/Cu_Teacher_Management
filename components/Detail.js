import React from "react";
import { useRecoilState } from "recoil";
import { storeAbsent } from "../atom/StoreAbsent";
import { storeReplace } from "../atom/StoreReplace";

function Detail({ name, id, day, time, index }) {
  const [absent, setAbsent] = useRecoilState(storeAbsent);
  const [replace, setReplace] = useRecoilState(storeReplace);
  let styles = { color: "#7C99AC" };

  let days = new Date();

  for (let i = 0; i < absent.length; i++) {
    let times = new Date(absent[i].date);

    let mon = times.getDay();

    let dateGot;

    if (mon === 1) {
      dateGot = "monday";
    } else if (mon === 2) {
      dateGot = "tuesday";
    } else if (mon === 3) {
      dateGot = "wednesday";
    } else if (mon === 4) {
      dateGot = "thursday";
    } else if (mon === 5) {
      dateGot = "friday";
    } else if (mon === 6) {
      dateGot = "saturday";
    } else {
    }

    if (days.getFullYear() === times.getFullYear() && days.getMonth() === times.getMonth() && days.getDay() === times.getDay() && dateGot === day) {
      if (absent[i].Absent?.split(" ").join("").toLocaleLowerCase() === name.split(" ").join("").toLocaleLowerCase()) {
        styles = { color: "#A13333" };
      }

      if (replace[i].Replace?.split(" ").join("").toLocaleLowerCase() === name.split(" ").join("").toLocaleLowerCase()) {
        styles = { color: "#14a861" };
      }
    }
  }

  return (
    <div style={styles} className=" my-4 flex w-[100%] m-auto items-center justify-between rounded-xl border-b max-w-7xl  border-slate-400  bg-gradient-to-r from-sky-900 to-slate-900 px-10 py-4 ">
      <p style={styles} className="w-[10%] font-serif text-[1.3rem] font-semibold text-gray-400 sm:text-[1.5rem] ">
        {index}
      </p>
      <p style={styles} className="w-[30%] font-serif text-[1.3rem] font-semibold text-gray-400 sm:text-[1.5rem] ">
        {time}
      </p>
      <p style={styles} className="w-[50%] max-w-[55%] truncate  text-center font-serif text-[1.3rem]  font-semibold text-gray-400 sm:max-w-[40%] sm:text-[1.5rem] ">
        {name}
      </p>
    </div>
  );
}

export default Detail;
