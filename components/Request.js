import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Requests from "./Requests";
import { Triangle } from "react-loader-spinner";

function Request() {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);

  useEffect(async () => {
    if (loading) return;

    setLoading(true);

    const unsubscribe = await onSnapshot(collection(db, "requests"), (snapshot) => {
      setRequests(snapshot.docs);
      setLoading(false);
    });

    return unsubscribe;
  }, [db]);

  return (
    <div className="w-[100%] flex flex-col items-center h-fit mt-20 overflow-y-scroll scrollbar-hide  ">
      {loading ? (
        <div className=" w-[100%] max-w-7xl flex items-center justify-center mt-40 m-auto ">
          <Triangle color="#00BFFF" height={80} width={80} />
        </div>
      ) : requests.length > 0 ? (
        requests.map((request) => (
          <Requests
            key={request.id}
            id={request.data().userId}
            name={request.data().Teachername}
            email={request.data().email}
            phone={request.data().MobileNumber}
            image={request.data().profileImg}
            monday={request.data().monday}
            tuesday={request.data().tuesday}
            wednesday={request.data().wednesday}
            thursday={request.data().thursday}
            friday={request.data().friday}
            saturday={request.data().saturday}
          />
        ))
      ) : (
        <div className=" text-slate-100 w-[100%]">
          <img src="/wait.svg" alt="" className="w-[70%] md:w-[40%] m-auto " />
          <p className=" w-[100%] text-center mt-20 text-slate-400 font-semibold font-serif italic text-[1.5rem] md:text-[1.8rem] tracking-wider ">Request list is empty 🙂</p>
        </div>
      )}
    </div>
  );
}

export default Request;
