import React from "react";
import { TrashIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import moment from "moment";

function Comments({ id, uid, username, image, time, comment }) {
  const { data: session } = useSession();

  // console.log(time)
  const deleteComment = async () => {
    await deleteDoc(doc(db, "comment", id));
  };

  return (
    <div className="mt-8 flex  w-[100%] px-2 ">
      <img src={image} alt="" className=" h-[4.5rem] rounded-full   p-1 " />

      {}
      <section className="mx-3 mt-1 flex flex-1  flex-col  px-4 ">
        {}

        <div className=" flex w-[100%] items-center ">
          <p className="text-[1.2rem] font-semibold text-slate-200 ">{username}</p>
          <p className="mx-4 text-[1.2rem] font-semibold text-gray-500 ">{moment(time?.toDate()).fromNow()}</p>

          {session?.user?.uid === uid && <TrashIcon className="ml-5 h-6 cursor-pointer text-gray-500 " onClick={deleteComment} />}
        </div>

        {}
        <p className="mt-2  text-[1.2rem] italic text-slate-300 ">{comment}</p>
      </section>
    </div>
  );
}

export default Comments;
