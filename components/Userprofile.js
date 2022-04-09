import { useRecoilState } from "recoil";
import { ShowUserProfile } from "../atom/ShowUserProfile";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { DatabaseIcon } from "@heroicons/react/solid";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { Triangle } from "react-loader-spinner";

import { db } from "../firebase";
import InfoAL from "./InfoAL";

function UserProfile({ uid }) {
  const { data: session } = useSession();
  const [user, setUser] = useState([]);
  const [loader, setLoader] = useState(true);
  const [monday, setmonday] = useState([]);
  const [tuesday, settuesday] = useState([]);
  const [wednesday, setwednesday] = useState([]);
  const [thursday, setthursday] = useState([]);
  const [friday, setfriday] = useState([]);
  const [saturday, setsaturday] = useState([]);

  const [update, setUpdate] = useState(false);
  const [onprofile, setOnProfile] = useRecoilState(ShowUserProfile);
  const [absent, setAbsent] = useState([]);
  const [replace, setReplace] = useState([]);

  useEffect(async () => {
    setLoader(true);
    const docRef = doc(db, "teachers", uid);
    const docSnap = await getDoc(docRef);

    await onSnapshot(collection(db, "teachers", uid, "absent"), (snapshot) => {
      setAbsent(snapshot.docs);
    });
    await onSnapshot(collection(db, "teachers", uid, "replace"), (snapshot) => {
      setReplace(snapshot.docs);
    });

    if (docSnap.exists()) {
      setUser(docSnap.data());
      setmonday(Object.values(docSnap.data().monday));
      settuesday(Object.values(docSnap.data().tuesday));
      setwednesday(Object.values(docSnap.data().wednesday));
      setthursday(Object.values(docSnap.data().thursday));
      setfriday(Object.values(docSnap.data().friday));
      setsaturday(Object.values(docSnap.data().saturday));
      setLoader(false);
    }
  }, [db, update]);

  if (loader) {
    return (
      <>
        <div className=" fixed top-[50%] left-[50%] tranform translate-x-[-50%] translate-y-[-50%]  max-w-7xl flex items-center z-50  justify-center   m-auto">
          <Triangle color="#00BFFF" height={80} width={80} />
        </div>
      </>
    );
  }

  return (
    <div className="fixed top-0 left-0 z-50 w-[100%] bg-black h-[100%]  ">
      <div className="overflow-y-scroll scrollbar-hide  w-[100%] m-auto  max-w-7xl bg-black z-50    h-[100%]  shadow-md shadow-black py-5  ">
        {/*  */}

        <section className="flex  items-center justify-between mx-10 mt-5">
          <ArrowLeftIcon className="h-12 text-slate-200 cursor-pointer" onClick={() => setOnProfile(false)} />

          <div className="flex items-center">
            <DatabaseIcon className=" h-10 text-orange-600 " />
            <p className="text-slate-200 font-semibold text-[1.8rem] px-3 ">{user.score}</p>
          </div>
        </section>

        <section className="flex items-center w-[100%] my-20 px-10 ">
          {/*  */}

          <div className=" w-[25%] md:w-[20%] flex justify-center items-center">
            <img src={user.profileImg} alt="" className=" h-36 md:h-40 m-2 rounded-full" />
          </div>

          <div className="flex items-center justify-start flex-col w-[75%] md:w-[80%]">
            <p className=" text-[1.5rem] italic md:text-[2.5rem] text-slate-200 tracking-wide  font-semibold w-[100%] px-3 truncate pb-1 ">{user.email}</p>
            <p className=" text-[1.2rem] italic md:text-[1.5rem] text-slate-400 font-serif font-semibold w-[100%] px-3 truncate  ">
              {user.Teachername} ~ <span>{user.MobileNumber}</span>
            </p>
          </div>

          {/*  */}
        </section>

        <section className="w-[100%] my-20 md:px-20 px-10">
          {/*  */}

          <div className="flex flex-row w-[100%] justify-start items-center my-3 ">
            <p className="text-slate-200 font-semibold font-serif text-[1.5rem] md:text-[1.8rem]  w-fit mr-10 ">Name : </p>
            <p className=" outline-none font-serif italic  flex-1 bg-transparent py-0  text-slate-400 font-semibold text-[1.5rem] ">{user.Teachername}</p>
          </div>

          <div className="flex flex-row w-[100%] justify-start items-center my-3 ">
            <p className="text-slate-200 font-semibold font-serif text-[1.5rem] md:text-[1.8rem]  w-fit mr-10 ">Phone : </p>
            <p className=" outline-none font-serif italic  flex-1 bg-transparent py-0  text-slate-400 font-semibold text-[1.5rem] ">{user.MobileNumber}</p>
          </div>

          {/*  */}
        </section>

        <section className=" flex items-center flex-col md:flex-wrap md:flex-row  w-[100%] justify-between  mt-5 mb-10 ">
          {monday.map((datas, index) => {
            return (
              <div key={index} className=" flex items-center px-5  w-[100%] md:w-[48%] md:rounded-lg  bg-[#7c7c7c2b] py-3 my-1 mx-[1%] ">
                <p className="w-[30%]  font-serif text-[1.1rem] font-semibold text-gray-400  ">Monday</p>
                <p className="w-[25%] font-serif text-[1.1rem] font-semibold text-gray-400  ">{datas}</p>
                <p className="w-[45%] truncate  text-center font-serif text-[1.1rem]  font-semibold text-gray-400 ">{user.Teachername}</p>
              </div>
            );
          })}
          {tuesday.map((datas, index) => {
            return (
              <div key={index} className=" flex items-center px-5  w-[100%] md:w-[48%] md:rounded-lg  bg-[#7c7c7c2b] py-3 my-1 mx-[1%] ">
                <p className="w-[30%]  font-serif text-[1.1rem] font-semibold text-gray-400  ">Tuesday</p>
                <p className="w-[25%] font-serif text-[1.1rem] font-semibold text-gray-400  ">{datas}</p>
                <p className="w-[45%] truncate  text-center font-serif text-[1.1rem]  font-semibold text-gray-400 ">{user.Teachername}</p>
              </div>
            );
          })}
          {wednesday.map((datas, index) => {
            return (
              <div key={index} className=" flex items-center px-5  w-[100%] md:w-[48%] md:rounded-lg  bg-[#7c7c7c2b] py-3 my-1 mx-[1%] ">
                <p className="w-[30%]  font-serif text-[1.1rem] font-semibold text-gray-400  ">Wednesday</p>
                <p className="w-[25%] font-serif text-[1.1rem] font-semibold text-gray-400  ">{datas}</p>
                <p className="w-[45%] truncate  text-center font-serif text-[1.1rem]  font-semibold text-gray-400 ">{user.Teachername}</p>
              </div>
            );
          })}
          {thursday.map((datas, index) => {
            return (
              <div key={index} className=" flex items-center px-5  w-[100%] md:w-[48%] md:rounded-lg  bg-[#7c7c7c2b] py-3 my-1 mx-[1%] ">
                <p className="w-[30%]  font-serif text-[1.1rem] font-semibold text-gray-400  ">Thursday</p>
                <p className="w-[25%] font-serif text-[1.1rem] font-semibold text-gray-400  ">{datas}</p>
                <p className="w-[45%] truncate  text-center font-serif text-[1.1rem]  font-semibold text-gray-400 ">{user.Teachername}</p>
              </div>
            );
          })}
          {friday.map((datas, index) => {
            return (
              <div key={index} className=" flex items-center px-5  w-[100%] md:w-[48%] md:rounded-lg  bg-[#7c7c7c2b] py-3 my-1 mx-[1%] ">
                <p className="w-[30%]  font-serif text-[1.1rem] font-semibold text-gray-400  ">Friday</p>
                <p className="w-[25%] font-serif text-[1.1rem] font-semibold text-gray-400  ">{datas}</p>
                <p className="w-[45%] truncate  text-center font-serif text-[1.1rem]  font-semibold text-gray-400 ">{user.Teachername}</p>
              </div>
            );
          })}
          {saturday.map((datas, index) => {
            return (
              <div key={index} className=" flex items-center px-5  w-[100%] md:w-[48%] md:rounded-lg  bg-[#7c7c7c2b] py-3 my-1 mx-[1%] ">
                <p className="w-[30%]  font-serif text-[1.1rem] font-semibold text-gray-400  ">Saturday</p>
                <p className="w-[25%] font-serif text-[1.1rem] font-semibold text-gray-400  ">{datas}</p>
                <p className="w-[45%] truncate  text-center font-serif text-[1.1rem]  font-semibold text-gray-400 ">{user.Teachername}</p>
              </div>
            );
          })}
        </section>

        <div className="w-[100%] border-0 border-white my-20  ">
          {/*  */}

          {absent.length > 0 && (
            <p className="text-orange-600 font-semibold font-serif text-[1.5rem] md:text-[1.8rem]  md:px-20 px-10 ">
              Absent Details <span className="text-orange-500">~ {absent.length}</span>
            </p>
          )}

          <div className="flex items-center flex-col md:flex-wrap md:flex-row  w-[100%] justify-between  mt-5 mb-2  max-h-[25rem] overflow-y-scroll scrollbar-hide ">
            {absent.map((datas, index) => (
              <div key={index} className=" flex items-center px-5  w-[100%] md:w-[48%] md:rounded-lg  py-3 my-0 mx-[1%]  ">
                <InfoAL absent={datas.data().Absent} replace={datas.data().Replace} date={datas.data().date} from={datas.data().from} to={datas.data().to} />
              </div>
            ))}
          </div>
          {/*  */}

          {replace.length > 0 && (
            <p className="text-orange-600 font-semibold font-serif text-[1.5rem] md:text-[1.8rem]  md:px-20 px-10 mt-20 ">
              Replacement Details <span className="text-orange-500">~ {replace.length}</span>
            </p>
          )}

          <div className="flex items-center flex-col md:flex-wrap md:flex-row  w-[100%] justify-between  mt-5 mb-2  max-h-[25rem] overflow-y-scroll scrollbar-hide ">
            {replace.map((datas, index) => (
              <div key={index} className=" flex items-center px-5  w-[100%] md:w-[48%] md:rounded-lg  py-3 my-0 mx-[1%]  ">
                <InfoAL absent={datas.data().Absent} replace={datas.data().Replace} date={datas.data().date} from={datas.data().from} to={datas.data().to} />
              </div>
            ))}
          </div>

          {/*  */}
        </div>

        {/*  */}
      </div>
    </div>
  );
}

export default UserProfile;
