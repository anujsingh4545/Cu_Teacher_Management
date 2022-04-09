import { useRouter } from "next/router";
import React, { useState } from "react";
import { Triangle } from "react-loader-spinner";
import { useRecoilState } from "recoil";
import { From } from "../atom/From";
import { Move, MoveReplacer } from "../atom/MoveReplacer";
import { MoverName } from "../atom/MoverName";
import { storeAbsent } from "../atom/StoreAbsent";
import { storeReplace } from "../atom/StoreReplace";
import { To } from "../atom/To";

function Detail({ name, id, day, time, index }) {
  const [absent, setAbsent] = useRecoilState(storeAbsent);
  const [replace, setReplace] = useRecoilState(storeReplace);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [move, setMove] = useRecoilState(MoveReplacer);
  const [moverfrom, setMoverFrom] = useRecoilState(From);
  const [moverto, setMoverTo] = useRecoilState(To);
  const [movername, setMoverName] = useRecoilState(MoverName);

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

  function executepass() {
    let spliter1 = time.split(" - ");
    setLoading(true);
    setMoverFrom(spliter1[0]);
    setMoverTo(spliter1[1]);
    setMoverName(name);
    setMove(true);
    router.push("/absentee");
    setLoading(false);
  }

  if (loading) {
    return (
      <div className=" w-[100%] max-w-7xl flex items-center justify-center mt-60 m-auto">
        <Triangle color="#00BFFF" height={80} width={80} />
      </div>
    );
  }

  return (
    <div style={styles} onClick={executepass} className=" cursor-pointer my-4 flex w-[100%] m-auto items-center justify-between rounded-xl border-b max-w-7xl  border-slate-400  bg-gradient-to-r from-sky-900 to-slate-900 px-10 py-4 ">
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
