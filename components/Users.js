import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Userlist from "./Userlist";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(async () => {
    const unsubscribe = await onSnapshot(query(collection(db, "teachers"), orderBy("score", "desc"), where("verified", "==", true)), (snapshot) => {
      setUsers(snapshot.docs);
    });
    return unsubscribe;
  }, [db]);

  return (
    <div className="text-slate-100 w-[95%] m-auto max-w-7xl  mt-20 px-2">
      <p className=" text-[1.5rem] md:text-[2rem] font-semibold font-serif italic text-slate-200 mt-10  tracking-wider md:tracking-wide">Users List :</p>

      <section className="flex w-[100%]  mt-10 items-center flex-col md:flex-row md:flex-wrap md:justify-between h-fit max-h-[80vh] overflow-y-scroll scrollbar-hide ">
        {users.length > 0 ? (
          users.map((datas) => {
            return <Userlist key={datas.id} UID={datas.data().userId} name={datas.data().Teachername} phone={datas.data().MobileNumber} email={datas.data().email} profile={datas.data().profileImg} score={datas.data().score} />;
          })
        ) : (
          <div className=" text-slate-100 w-[100%] ">
            <p className=" w-[100%] text-center mt-20  text-slate-400 font-semibold font-serif italic text-[1.5rem] tracking-wider ">Users list is empty 🙂</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Users;
