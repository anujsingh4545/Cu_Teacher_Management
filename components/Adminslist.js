import { TrashIcon } from "@heroicons/react/outline";
import { MailIcon } from "@heroicons/react/solid";
import { deleteDoc, doc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React from "react";
import { db } from "../firebase";

function Adminslist({ UID, name, email, phone }) {
  const { data: session } = useSession();

  if (session?.user?.email === email) {
    return null;
  }

  const deleteAdmin = async () => {
    await deleteDoc(doc(db, "admin", UID));
  };

  return (
    <div className="w-[100%] md:w-[49%] px-5 my-2 md:px-3 py-4 flex items-center justify-between bg-gradient-to-r from-sky-700 to-indigo-900 rounded-xl ">
      <section className="flex flex-row flex-1 items-center">
        <div className="mr-5 rounded-full  bg-[#1f1e1e70] p-2 flex  ">
          <MailIcon className=" h-10 text-orange-600" />
        </div>

        <section className="flex flex-col w-fit">
          <p className="text-[1.7rem] md:text-[1.6rem]  font-semibold text-gray-300 truncate ">{email}</p>
          <p className="text-[1.3rem] md:text-[1.2rem] italic font-semibold mt-1 text-gray-400">
            {name} ~ {phone}
          </p>
        </section>
      </section>

      <TrashIcon className=" h-9 cursor-pointer text-slate-500 " onClick={deleteAdmin} />
    </div>
  );
}

export default Adminslist;
