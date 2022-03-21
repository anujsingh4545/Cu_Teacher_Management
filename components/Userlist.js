import { TrashIcon } from "@heroicons/react/outline";
import { deleteDoc, doc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React from "react";
import { db } from "../firebase";

function Userlist({ UID, name, email, phone, score, profile }) {
  const { data: session } = useSession();

  if (session?.user?.email === email) {
    return null;
  }

  const deleteAdmin = async () => {
    await deleteDoc(doc(db, "teachers", UID));
  };

  return (
    <div className="w-[100%] md:w-[49%] px-5 my-2 md:px-3 py-4 flex items-center justify-between bg-gradient-to-r from-cyan-600 to-indigo-900 rounded-xl ">
      <section className="flex flex-row flex-1 items-center">
        <div className="mr-5 rounded-full   p-1 flex  ">
          <img src={profile} alt="" className="rounded-full h-14" />
        </div>

        <section className="flex flex-col w-fit">
          <p className="text-[1.7rem] md:text-[1.6rem]  font-semibold text-gray-300 truncate ">{email}</p>
          <p className="text-[1.3rem] md:text-[1.2rem] italic font-semibold mt-1 text-gray-400 truncate ">
            {name} ~ {phone} ~ <span className="font-bold text-orange-600 ">{score}</span>
          </p>
        </section>
      </section>

      <TrashIcon className=" h-9 cursor-pointer text-slate-500 " onClick={deleteAdmin} />
    </div>
  );
}

export default Userlist;
