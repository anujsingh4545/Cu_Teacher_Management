import React, { useEffect, useState } from "react";
import { SwitchHorizontalIcon, TrashIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { async } from "@firebase/util";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import moment from "moment";
import { useRecoilState } from "recoil";
import { ShowUserProfile } from "../atom/ShowUserProfile";
import { UidGuest } from "../atom/UidGuest";
import UserProfile from "./Userprofile";

function InfoAL({ absent, replace, date, from, to }) {
  return (
    <div className="my-0 flex w-[100%] flex-col items-center rounded-xl border-b border-slate-500 bg-[#7c7c7c2b] shadow-sm shadow-[#ffffff75] ">
      {}

      <section className="my-2 flex w-[100%] items-center">
        <p className="w-[40%] truncate   text-center  font-serif text-[1.1rem] font-bold tracking-wider text-gray-300  ">{absent}</p>
        <div className="w-[20%] flex items-center flex-col">
          <p className="text-center text-[1.1rem]  font-semibold font-serif italic flex text-sky-600   w-[100%] justify-center ">{date}</p>
          <p className="text-center text-[1rem]  font-semibold font-serif italic flex text-sky-700   w-[100%] justify-center ">
            {from} - {to}
          </p>
        </div>
        <p className="w-[40%] truncate  text-center  font-serif text-[1.1rem] font-bold tracking-wider text-gray-300 ">{replace}</p>
      </section>

      {}
    </div>
  );
}

export default InfoAL;
