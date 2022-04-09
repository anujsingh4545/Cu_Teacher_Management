import { ArrowLeftIcon } from "@heroicons/react/outline";
import { DatabaseIcon, PencilAltIcon, PencilIcon } from "@heroicons/react/solid";
import { collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { Triangle } from "react-loader-spinner";
import { useRecoilState } from "recoil";
import { checkForm } from "../atom/checkForm";
import { fridays } from "../atom/fridays";
import { mondays } from "../atom/mondays";
import { saturdays } from "../atom/saturdays";
import { ShowProfile } from "../atom/ShowProfile";
import { thursdays } from "../atom/thursdays";
import { tuesdays } from "../atom/tuesdays";
import { wednesdays } from "../atom/wednesdays";
import { db } from "../firebase";
import InfoAL from "./InfoAL";
import Smalldetails from "./Smalldetails";

function Profile({ uid }) {
  const { data: session } = useSession();
  const [onprofile, setOnProfile] = useRecoilState(ShowProfile);
  const [user, setUser] = useState([]);
  const [loader, setLoader] = useState(true);
  const [monday, setmonday] = useState([]);
  const [Monday, setMonday] = useRecoilState(mondays);
  const [tuesday, settuesday] = useState([]);
  const [Tuesday, setTuesday] = useRecoilState(tuesdays);
  const [wednesday, setwednesday] = useState([]);
  const [Wednesday, setWednesday] = useRecoilState(wednesdays);
  const [thursday, setthursday] = useState([]);
  const [Thursday, setThursday] = useRecoilState(thursdays);
  const [friday, setfriday] = useState([]);
  const [Friday, setFriday] = useRecoilState(fridays);
  const [saturday, setsaturday] = useState([]);
  const [Saturday, setSaturday] = useRecoilState(saturdays);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [form, setForm] = useRecoilState(checkForm);
  const [absent, setAbsent] = useState([]);
  const [replace, setReplace] = useState([]);

  let day = useRef(null);
  let time = useRef(null);
  let name = useRef(null);
  let phone = useRef(null);
  let count = 0;

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

  const submitData = async () => {
    // Selecting the day and entering time within it

    if (day.current.value === "monday") {
      for (let i = 0; i < Monday.length; i++) {
        if (Monday[i] === time.current.value) {
          alert("Data already Exist ...!");
          return;
        }
      }
      setMonday((data) => [...data, `${time.current.value}`]);
    } else if (day.current.value === "tuesday") {
      for (let i = 0; i < Tuesday.length; i++) {
        if (Tuesday[i] === time.current.value) {
          alert("Data already Exist ...!");
          return;
        }
      }
      setTuesday((data) => [...data, `${time.current.value}`]);
    } else if (day.current.value === "wednesday") {
      for (let i = 0; i < Wednesday.length; i++) {
        if (Wednesday[i] === time.current.value) {
          alert("Data already Exist ...!");
          return;
        }
      }
      setWednesday((data) => [...data, `${time.current.value}`]);
    } else if (day.current.value === "thursday") {
      for (let i = 0; i < Thursday.length; i++) {
        if (Thursday[i] === time.current.value) {
          alert("Data already Exist ...!");
          return;
        }
      }
      setThursday((data) => [...data, `${time.current.value}`]);
    } else if (day.current.value === "friday") {
      for (let i = 0; i < Friday.length; i++) {
        if (Friday[i] === time.current.value) {
          alert("Data already Exist ...!");
          return;
        }
      }
      setFriday((data) => [...data, `${time.current.value}`]);
    } else if (day.current.value === "saturday") {
      for (let i = 0; i < Saturday.length; i++) {
        if (Saturday[i] === time.current.value) {
          alert("Data already Exist ...!");
          return;
        }
      }
      setSaturday((data) => [...data, `${time.current.value}`]);
    }
  };

  // Checking user has entered every data correctly or not before sending request

  function UpdateData() {
    if (name.current.value.length <= 0) {
      alert("Please enter your name 🙂");
      return;
    } else if (phone.current.value.length < 10 || phone.current.value.length > 10) {
      alert("Please enter your phone number correctly 🙂 ");
    } else if (Monday.length > 0 || Tuesday.length > 0 || Wednesday.length > 0 || Thursday.length > 0 || Friday.length > 0 || Saturday.length > 0) {
      SubmitUserRequest();
    } else {
      alert("Fill all * details correctly ⚠️");
    }
  }

  const SubmitUserRequest = async () => {
    if (loading) return;
    setLoading(true);

    const docRef = doc(db, "teachers", uid);
    await updateDoc(docRef, {
      Teachername: name.current.value,
      MobileNumber: phone.current.value,
      monday: Monday,
      tuesday: Tuesday,
      wednesday: Wednesday,
      thursday: Thursday,
      friday: Friday,
      saturday: Saturday,
    });

    setLoading(false);
    setUpdate(false);
  };

  const deleteAccount = async () => {
    let conf = confirm("Are you sure you want to delete your account ? ");

    if (conf === true) {
      setLoader(true);
      await deleteDoc(doc(db, "teachers", uid));
      await deleteDoc(doc(db, "admin", uid));
      setOnProfile(false);
      setForm(false);
      setLoader(false);
    }
  };

  if (loader) {
    return (
      <>
        <div className=" w-[100%] max-w-7xl flex items-center z-50  justify-center my-60  m-auto">
          <Triangle color="#00BFFF" height={80} width={80} />
        </div>
      </>
    );
  }

  return (
    onprofile === true && (
      <>
        <div className="relative  w-[100%] m-auto  max-w-7xl bg-black z-50  h-fit rounded-2xl shadow-md shadow-black py-5 ">
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
              <img src={session?.user?.image} alt="" className=" h-36 md:h-40 m-2 rounded-full" />
            </div>

            <div className="flex items-center justify-start flex-col w-[75%] md:w-[80%]">
              <p className=" text-[1.5rem] italic md:text-[2.5rem] text-slate-200 tracking-wide  font-semibold w-[100%] px-3 truncate pb-1 ">{user.email}</p>
              <p className=" text-[1.2rem] italic md:text-[1.5rem] text-slate-400 font-serif font-semibold w-[100%] px-3 truncate  ">
                {user.Teachername} ~ <span>{user.MobileNumber}</span>
              </p>

              <section className="flex items-center my-4 w-[100%] px-3 ">
                <button className=" bg-[#7c7c7c2b] rounded-lg mr-4 px-8 md:px-10 py-2 text-[0.8rem] md:text-[1.2rem] text-slate-400 font-semibold border-b border-slate-600 " onClick={deleteAccount}>
                  Delete Account
                </button>
                <button className=" bg-[#7c7c7c2b] rounded-lg mr-4 px-8 md:px-10 py-2 text-[0.8rem] md:text-[1.2rem] text-slate-400 font-semibold border-b border-slate-600" onClick={() => setUpdate(true)}>
                  Update Details
                </button>
              </section>
            </div>

            {/*  */}
          </section>

          {update === false ? (
            <>
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
            </>
          ) : (
            <section className="w-[100%] my-20 md:px-20 px-10">
              {/*  */}

              <div className="flex flex-row w-[100%] justify-start items-center my-4 py-2 ">
                <p className="text-slate-200 font-semibold font-serif text-[1.5rem] md:text-[1.8rem]  w-[15%] mr-10 ">Name :</p>
                <input ref={name} type="text" placeholder="Enter your name" className=" outline-none font-serif italic flex-1 bg-[#7c7c7c2b] py-3 px-5  rounded-xl  text-slate-500  text-[1.2rem] " />
              </div>

              <div className="flex flex-row w-[100%] justify-start items-center my-4 py-2 ">
                <p className="text-slate-200 font-semibold font-serif text-[1.5rem] md:text-[1.8rem]  w-[15%] mr-10 ">Phone : </p>
                <input ref={phone} type="number" placeholder="Enter your phone number" className=" outline-none font-serif italic flex-1 bg-[#7c7c7c2b] py-3 px-5  rounded-xl  text-slate-500  text-[1.2rem] " />
              </div>

              <div className=" flex flex-col w-[100%] m-auto   bg-[#7c7c7c2b] rounded-xl my-14 py-6  ">
                <p className="w-[100%] text-[1.6rem] md:text-[1.8rem]    text-gray-300 tracking-wide  px-5  ">
                  Select your free slots <span className="text-red-800">*</span>
                </p>
                {/*  */}

                <section className="mt-3 flex w-[100%] items-center justify-between  px-5 py-5 ">
                  <select id="Days" ref={day} className="  rounded-xl  bg-transparent py-4 pr-3 font-serif  text-[1.5rem] text-slate-300 outline-none md:pr-16  md:text-[1.6rem] ">
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

                  <select id="TIme Zone" ref={time} className="   rounded-xl  bg-transparent py-4 pr-3 text-left font-serif text-[1.5rem] text-slate-300 outline-none md:pr-16 md:text-[1.6rem] ">
                    <option value="9:40 - 10:20" className="bg-black py-2 text-[1rem] lg:text-[1.5rem] ">
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

                  <button className="rounded-lg bg-purple-900 px-12 sm:px-16 py-2 sm:mr-5 text-[1.4rem] text-slate-200 outline-none" onClick={submitData}>
                    Submit
                  </button>
                </section>
                <div className="w-[100%] flex flex-col px-7 my-2 ">
                  {Monday.map((data, index) => (
                    <Smalldetails key={data} id={index} name={"Monday"} time={data} index={++count} />
                  ))}
                  {Tuesday.map((data, index) => (
                    <Smalldetails key={data} id={index} name={"Tuesday"} time={data} index={++count} />
                  ))}
                  {Wednesday.map((data, index) => (
                    <Smalldetails key={data} id={index} name={"Wednesday"} time={data} index={++count} />
                  ))}
                  {Thursday.map((data, index) => (
                    <Smalldetails key={data} id={index} name={"Thursday"} time={data} index={++count} />
                  ))}
                  {Friday.map((data, index) => (
                    <Smalldetails key={data} id={index} name={"Friday"} time={data} index={++count} />
                  ))}
                  {Saturday.map((data, index) => (
                    <Smalldetails key={data} id={index} name={"Saturday"} time={data} index={++count} />
                  ))}
                </div>

                {/*  */}
              </div>

              <section className="w-[100%] m-auto  flex justify-end items-center py-10  mb-10 ">
                <button className="rounded-lg bg-purple-900 px-12 sm:px-16 py-2 sm:mr-5 text-[1.4rem] text-slate-200 outline-none" onClick={() => setUpdate(false)}>
                  Cancel
                </button>
                <button className="rounded-lg bg-purple-900 px-12 sm:px-16 py-2 sm:ml-5 text-[1.4rem] text-slate-200 outline-none ml-5" onClick={UpdateData}>
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </section>
              {/*  */}
            </section>
          )}

          {/*  */}
        </div>
      </>
    )
  );
}

export default Profile;
