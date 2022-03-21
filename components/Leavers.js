import React, { useEffect } from "react";
import { SwitchHorizontalIcon, TrashIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { async } from "@firebase/util";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import moment from "moment";

function Leavers({ id, username, userImg, userID, absent, replace, time, from, to, date }) {
  const { data: session } = useSession();
  const d = new Date();

  //   Deleting data after day is complete

  let times = moment(time?.toDate());

  if (times._d.getMonth() === d.getMonth()) {
    if (times._d.getDate() !== d.getDate()) {
      deleteDoc(doc(db, "absentee", id));
    }
  } else {
    deleteDoc(doc(db, "absentee", id));
  }

  //

  const deleteItem = async () => {
    await deleteDoc(doc(db, "absentee", id));
  };

  return (
    <div className="my-5 flex w-[100%] flex-col items-center rounded-xl border-b border-slate-500 bg-[#7c7c7c2b] shadow-sm shadow-[#ffffff75] ">
      {}

      <section className="flex w-[100%] items-center justify-between  bg-transparent px-5 sm:px-10 ">
        <div className="flex items-center  pt-4 pb-3 ">
          <img src={userImg} alt="" className="h-12 rounded-full" />
          <p className="truncate px-5 font-serif text-[1.5rem] font-semibold tracking-wider text-slate-400 ">{username}</p>
        </div>

        <div className="flex items-center py-3">
          <p className="truncate px-3 font-serif text-[1.2rem] font-semibold text-slate-600 ">{moment(time?.toDate()).fromNow()}</p>
          {session?.user?.uid === userID && <TrashIcon className="ml-2 h-7 cursor-pointer text-slate-700 " onClick={deleteItem} />}
        </div>
      </section>

      <section className="my-5 flex w-[100%] items-center sm:px-20">
        <p className="w-[40%] truncate   text-center  font-serif text-[1.3rem] font-bold tracking-wider text-gray-300 sm:text-[2rem]  ">{absent}</p>
        <div className="w-[20%] flex items-center flex-col">
          <p className="text-center text-[1.3rem] sm:text-[1.6irem] font-semibold font-serif italic flex text-orange-600   w-[100%] justify-center ">{date}</p>
          <p className="text-center text-[1rem] sm:text-[1.2rem] font-semibold font-serif italic flex text-orange-700   w-[100%] justify-center ">
            {from} - {to}
          </p>
        </div>
        <p className="w-[40%] truncate  text-center  font-serif text-[1.3rem] font-bold tracking-wider text-gray-300 sm:text-[2rem]">{replace}</p>
      </section>

      {}
    </div>
  );
}

export default Leavers;
