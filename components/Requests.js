import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import { collection, deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firebase";

function Requests({ id, name, email, phone, image, monday, tuesday, wednesday, thursday, friday, saturday }) {
  const [view, setView] = useState(false);
  const [hide, setHide] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  let index = 0;

  function viewData() {
    setHide(false);
    setView(true);
  }

  function hideData() {
    setHide(true);
    setView(false);
  }

  const acceptUser = async () => {
    setAccepting(true);

    const docRef = doc(db, "teachers", id);
    await updateDoc(docRef, {
      verified: true,
    });
    await deleteDoc(doc(db, "requests", id));
    setAccepting(false);
  };

  const declineUser = async () => {
    setDeclining(true);

    const docRef = doc(db, "teachers", id);
    await updateDoc(docRef, {
      verified: "decline",
    });
    await deleteDoc(doc(db, "requests", id));
    setDeclining(false);
  };

  return (
    <div className="w-[95%] m-auto max-w-7xl bg-gradient-to-r from-sky-600 to-indigo-800 rounded-xl pt-3  my-5 ">
      {/*  */}

      <section className="flex items-center w-[100%] ">
        {/*  */}

        <div className="w-[16%] flex justify-center items-center">
          <img src={image} alt="" className=" h-20 md:h-28 m-2 rounded-full p-1 border  bg-slate-600  " />
        </div>

        <div className="flex items-center justify-start flex-col w-[84%]">
          <p className=" text-[1.5rem] italic md:text-[2rem] text-slate-200 tracking-wide  font-semibold w-[100%] px-3 truncate pb-1 ">{email}</p>
          <p className=" text-[1.2rem] italic md:text-[1.6rem] text-slate-400 font-serif font-semibold w-[100%] px-3 truncate  ">
            {name} ~ <span>{phone}</span>
          </p>
        </div>

        {/*  */}
      </section>

      {}

      {}

      <section className=" flex items-center flex-col md:flex-wrap md:flex-row  w-[100%] justify-between  my-5 ">
        {view &&
          monday.map((datas, index) => {
            return (
              <div key={index} className=" flex items-center px-5  w-[100%] md:w-[48%] md:rounded-lg  bg-[#00000056] py-3 my-1 mx-[1%] ">
                <p className="w-[30%]  font-serif text-[1.1rem] font-semibold text-gray-400  ">Monday</p>
                <p className="w-[25%] font-serif text-[1.1rem] font-semibold text-gray-400  ">{datas}</p>
                <p className="w-[45%] truncate  text-center font-serif text-[1.1rem]  font-semibold text-gray-400 ">{name}</p>
              </div>
            );
          })}

        {view &&
          tuesday.map((datas, index) => {
            return (
              <div key={index} className=" flex items-center px-5 w-[100%] md:w-[48%] md:rounded-lg  bg-[#00000056] py-3 my-1 mx-[1%]">
                <p className="w-[30%]  font-serif text-[1.1rem] font-semibold text-gray-400   ">Tuesday</p>
                <p className="w-[25%] font-serif text-[1.1rem] font-semibold text-gray-400  ">{datas}</p>
                <p className="w-[45%] truncate  text-center font-serif text-[1.1rem]  font-semibold text-gray-400 ">{name}</p>
              </div>
            );
          })}

        {view &&
          wednesday.map((datas, index) => {
            return (
              <div key={index} className=" flex items-center px-5  w-[100%] md:w-[48%] md:rounded-lg  bg-[#00000056] py-3 my-1 mx-[1%]">
                <p className="w-[30%]  font-serif text-[1.1rem] font-semibold text-gray-400  ">Wednesday</p>
                <p className="w-[25%] font-serif text-[1.1rem] font-semibold text-gray-400 ">{datas}</p>
                <p className="w-[45%] truncate  text-center font-serif text-[1.1rem]  font-semibold text-gray-400 ">{name}</p>
              </div>
            );
          })}

        {view &&
          thursday.map((datas, index) => {
            return (
              <div key={index} className=" flex items-center px-5  w-[100%] md:w-[48%] md:rounded-lg  bg-[#00000056] py-3 my-1 mx-[1%]">
                <p className="w-[30%]  font-serif text-[1.1rem] font-semibold text-gray-400  ">Thursday</p>
                <p className="w-[25%] font-serif text-[1.1rem] font-semibold text-gray-400  ">{datas}</p>
                <p className="w-[45%] truncate  text-center font-serif text-[1.1rem]  font-semibold text-gray-400 ">{name}</p>
              </div>
            );
          })}

        {view &&
          friday.map((datas, index) => {
            return (
              <div key={index} className=" flex items-center px-5  w-[100%] md:w-[48%] md:rounded-lg  bg-[#00000056] py-3 my-1 mx-[1%]">
                <p className="w-[30%]  font-serif text-[1.1rem] font-semibold text-gray-400  ">Friday</p>
                <p className="w-[25%] font-serif text-[1.1rem] font-semibold text-gray-400  ">{datas}</p>
                <p className="w-[45%] truncate  text-center font-serif text-[1.1rem]  font-semibold text-gray-400 ">{name}</p>
              </div>
            );
          })}

        {view &&
          saturday.map((datas, index) => {
            return (
              <div key={index} className=" flex items-center px-5  w-[100%] md:w-[48%] md:rounded-lg  bg-[#00000056] py-3 my-1 mx-[1%]">
                <p className="w-[30%]  font-serif text-[1.1rem] font-semibold text-gray-400  ">Saturday</p>
                <p className="w-[25%] font-serif text-[1.1rem] font-semibold text-gray-400  ">{datas}</p>
                <p className="w-[45%] truncate  text-center font-serif text-[1.1rem]  font-semibold text-gray-400 ">{name}</p>
              </div>
            );
          })}
      </section>

      {}

      {}

      <section className="flex items-end w-[100%]  mt-5 mb-2 justify-between ">
        {hide ? (
          <p className="flex items-end  text-[#0c0c0ccc] text-[1.2rem] md:text-[1.4rem] font-semibold italic mx-5 md:mx-11 cursor-pointer " onClick={viewData}>
            View Details
            <ChevronDownIcon className="h-7 md:h-8 text-[#0c0c0ccc] pl-2" />
          </p>
        ) : (
          <p className="flex items-end  text-[#0c0c0ccc] text-[1.2rem] md:text-[1.4rem] font-semibold italic mx-5 md:mx-11 cursor-pointer" onClick={hideData}>
            Hide Details
            <ChevronUpIcon className="h-7 md:h-8 text-[#0c0c0ccc] pl-2" />
          </p>
        )}

        <div className="flex items-center  ">
          <button className=" bg-[#0c0c0ccc] rounded-lg mr-4 px-8 md:px-10 py-2 text-[1.2rem] text-slate-400 font-semibold" onClick={acceptUser}>
            {accepting ? "Accepting..." : "Accept"}
          </button>
          <button className=" bg-[#0c0c0ccc] rounded-lg mr-4  px-8 md:px-10 py-2 text-[1.2rem] text-slate-400 font-semibold" onClick={declineUser}>
            {declining ? "Declining..." : "Decline"}
          </button>
        </div>
      </section>

      {/*  */}
    </div>
  );
}

export default Requests;
