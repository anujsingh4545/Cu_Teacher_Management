import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import Detail from "./Detail";
import { Triangle } from "react-loader-spinner";
import Comment from "../components/Comment";
import { useRecoilState } from "recoil";
import { storeAbsent } from "../atom/StoreAbsent";
import { storeReplace } from "../atom/StoreReplace";

function Homesearch() {
  let day = useRef(null);
  let time = useRef(null);
  const [teacher, setTeacher] = useState([]);
  const [loading, setLoading] = useState(false);
  const [faculty, setFaculty] = useState([]);

  const [absent, setAbsent] = useRecoilState(storeAbsent);
  const [replace, setReplace] = useRecoilState(storeReplace);
  let index = 0;
  let count = 0;

  useEffect(async () => {
    setAbsent([]);
    setReplace([]);
    const unsubscribe = await onSnapshot(query(collection(db, "absentee"), orderBy("timeStamp", "desc")), (snapshot) => {
      snapshot.docs.map((check) => {
        setAbsent((data) => [...data, { Absent: check.data().Absent, date: check.data().date }]);
        setReplace((data) => [...data, { Replace: check.data().Replace, date: check.data().date }]);
      });
    });
    return unsubscribe;
  }, [db]);

  const searchData = async () => {
    if (loading) return;
    else {
      setLoading(true);
      const subscribe = async () => {
        await onSnapshot(collection(db, "teachers"), (snapshot) => {
          setTeacher(snapshot.docs);
          setLoading(false);
        });
      };

      setTimeout(subscribe, 1000);
    }
  };

  return (
    <>
      <section className="mt-40 mb-20 flex w-[95%] m-auto max-w-7xl items-center justify-between  rounded-3xl bg-[#7c7c7c2b] px-5 md:px-10 py-5 ">
        <select ref={day} id="Days" className="  rounded-xl  bg-transparent py-4 pr-3 cursor-pointer font-serif  text-[1.5rem] text-slate-300 outline-none md:pr-16  md:text-[2rem]  ">
          <option value="monday" className="bg-black py-2 text-[1rem] lg:text-[1.5rem] ">
            Monday
          </option>
          <option value="tuesday" className="bg-black py-2 text-[1rem] lg:text-[1.5rem] ">
            Tuesday
          </option>
          <option value="wednesday" className="bg-black py-2 text-[1rem] lg:text-[1.5rem] ">
            Wednesday
          </option>
          <option value="thursday" className="bg-black py-2 text-[1rem] lg:text-[1.5rem] ">
            Thursday
          </option>
          <option value="friday" className="bg-black py-2 text-[1rem] lg:text-[1.5rem] ">
            Friday
          </option>
          <option value="saturday" className="bg-black py-2 text-[1rem] lg:text-[1.5rem] ">
            Saturday
          </option>
        </select>

        <select id="TIme Zone" ref={time} className="   rounded-xl  bg-transparent cursor-pointer py-4 pr-3 text-left font-serif text-[1.5rem] text-slate-300 outline-none md:pr-16 md:text-[2rem] ">
          <option value="09:40 - 10:20" className="bg-black py-2 text-[1rem] lg:text-[1.5rem] ">
            09:40 - 10:20
          </option>
          <option value="10:30 - 11:10" className="bg-black py-2 text-[1rem] lg:text-[1.5rem] ">
            10:30 - 11:10
          </option>
          <option value="11:20 - 12:00" className="bg-black py-2 text-[1rem] lg:text-[1.5rem] ">
            11:20 - 12:00
          </option>
          <option value="12:10 - 12:50" className="bg-black py-2 text-[1rem] lg:text-[1.5rem] ">
            12:10 - 12:50
          </option>
          <option value="13:10 - 13:50" className="bg-black py-2 text-[1rem] lg:text-[1.5rem] ">
            13:10 - 13:50
          </option>
          <option value="14:00 - 14:40" className="bg-black py-2 text-[1rem] lg:text-[1.5rem] ">
            14:00 - 14:40
          </option>
          <option value="14:50 - 15:30" className="bg-black py-2 text-[1rem] lg:text-[1.5rem] ">
            14:50 - 15:30
          </option>
          <option value="15:40 - 16:20" className="bg-black py-2 text-[1rem] lg:text-[1.5rem] ">
            15:40 - 16:20
          </option>
        </select>

        <button className=" bg-gradient-to-r from-sky-600 to-indigo-900 rounded-lg  px-14 md:px-20 py-3 text-[1.5rem] text-slate-200 font-bold" onClick={searchData}>
          {loading === true ? "Loading..." : "Submit"}
        </button>
      </section>

      <div className="w-[95%] max-w-7xl items-center flex-col  h-fit  min-h-[35rem] border border-transparent md:min-h-[20rem]  m-auto ">
        {loading ? (
          <div className=" w-[100%] max-w-7xl flex items-center justify-center mt-40 m-auto ">
            <Triangle color="#00BFFF" height={80} width={80} />
          </div>
        ) : teacher.length > 0 ? (
          teacher.map((faculty) => {
            if (faculty.data()[`${day.current.value}`].includes(`${time.current.value}`) && faculty.data().verified === true) {
              return <Detail key={faculty.id} index={++index} id={faculty.data().userId} name={faculty.data().Teachername} day={day.current.value} time={time.current.value} />;
            } else {
              count = 1;
            }
          })
        ) : (
          <>
            <p className="text-[1.5rem] text-slate-400 font-serif font-semibold italic text-center mt-40 md:mt-20 ">Click on submit to start search ..., cheers 🤍</p>
            <img src="/data.svg" alt="" className="w-[50%] md:w-[30%] m-auto mt-20 " />
          </>
        )}

        {count === 1 && index === 0 && <p className="text-[1.5rem] text-slate-400 font-serif font-semibold italic text-center mt-40 md:mt-20 ">No Data Found ⚠️</p>}
      </div>

      <Comment />
    </>
  );
}

export default Homesearch;
