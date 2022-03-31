import { addDoc, collection, onSnapshot, serverTimestamp, query, orderBy, doc, getDoc, updateDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import moment from "moment";
import { getProviders, useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import Header from "../components/Header";
import Leavers from "../components/Leavers";
import { useRecoilState } from "recoil";
import { loginUser } from "../atom/loginUser";
import Signin from "../components/Signin";
import Dataform from "../components/Dataform";
import Greet from "../components/Greet";
import Profile from "../components/Profile";
import { checkForm } from "../atom/checkForm";
import { checkAccept } from "../atom/CheckAccept";
import { ShowProfile } from "../atom/ShowProfile";
import { Triangle } from "react-loader-spinner";
import Info from "../components/Info";
import { InformationCircleIcon } from "@heroicons/react/solid";
import { ShowModal } from "../atom/ShowModal";

function absentee({ providers }) {
  const { data: session } = useSession();
  const [modal, setModal] = useRecoilState(ShowModal);
  let dates = useRef(null);
  let from = useRef(null);
  let to = useRef(null);
  let absentee = useRef(null);
  let replacer = useRef(null);
  const day = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const times = ["09:40 - 10:20", "10:30 - 11:10", "11:20 - 12:00", "12:10 - 12:50", "13:10 - 13:50", "14:00 - 14:40", "14:50 - 15:30", "15:40 - 16:20"];

  const [move, setMove] = useState(false);
  const [form, setForm] = useRecoilState(checkForm);
  const [check, setCheck] = useRecoilState(checkAccept);
  const [onprofile, setOnProfile] = useRecoilState(ShowProfile);
  const [firstTime, setFirstTime] = useState("");
  const [secondTime, setSecondTime] = useState("");
  const [setTime, setSetTime] = useState("");
  const [teacher, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  let [options1, setOptions1] = useState(<select ref={replacer} className="flex-1 bg-slate-200  text-[1.5rem] rounded-md py-2   text-black outline-none "></select>);
  let [options2, setOptions2] = useState(<select ref={absentee} className="flex-1 bg-slate-200  text-[1.5rem] rounded-md py-2   text-black outline-none "></select>);
  const [absent, setAbsent] = useState([]);
  let leavers = [];
  let Replacers = [];
  const [login, setLogin] = useRecoilState(loginUser);

  useEffect(() => {
    let leadsFromLocalStorage = JSON.parse(localStorage.getItem("login"));
    if (leadsFromLocalStorage) {
      setLogin(leadsFromLocalStorage);
    }
  }, [login]);

  useEffect(async () => {
    const unsubscribe = await onSnapshot(query(collection(db, "absentee"), orderBy("timeStamp", "desc")), (snapshot) => {
      setAbsent(snapshot.docs);
    });

    return unsubscribe;
  }, [db]);

  useEffect(async () => {
    const unsubscribe = await onSnapshot(collection(db, "teachers"), (snapshot) => {
      setTeachers(snapshot.docs);
    });
    return unsubscribe;
  }, [db]);

  const checkData = async () => {
    //

    if (session) {
      //
      setLoader(true);
      const docRef = doc(db, "teachers", session?.user?.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        //

        if (docSnap.data().verified === true) {
          setCheck(true);
        } else {
          setCheck(false);
        }

        setForm(true);
        setLoader(false);
        //
      } else {
        setForm(false);
        setLoader(false);
      }

      //
    } else {
      return null;
    }

    //
  };

  useEffect(() => {
    checkData();
  }, [db, session]);

  if (loader) {
    return (
      <div className=" w-[100%] max-w-7xl flex items-center justify-center mt-60 m-auto">
        <Triangle color="#00BFFF" height={80} width={80} />
      </div>
    );
  }

  if (!session) return <Signin providers={providers} />;
  if (login === 0) return <Signin providers={providers} />;
  if (form === false) {
    return <Dataform />;
  }
  if (check === false) {
    return <Greet />;
  }
  if (onprofile === true) {
    return <Profile uid={session?.user?.uid} />;
  }

  function Recommend() {
    let result = [],
      i = 0;
    absent.map((teachers) => {
      Replacers.push({ teacher: teachers.data().Replace, from: teachers.data().from, to: teachers.data().to });
      leavers.push({ teacher: teachers.data().Absent, from: teachers.data().from, to: teachers.data().to });
    });

    return (
      <section className="max-w-[100%]  mt-14">
        <p className="text-yellow-600  font-semibold font-serif text-[1.8rem] tracking-wider ">Recommendations : </p>
        {teacher.map((datas) => {
          let days = new Date(setTime);
          let findDay = datas.data()[`${day[days.getDay() - 1]}`];
          for (let i = 0; i < findDay.length; i++) {
            let spliter = findDay[i].split(" ");
            if (spliter[0] === firstTime && spliter[2] === secondTime) {
              let index = -1;
              for (let i = 0; i < times.length; ++i) {
                if (times[i] === `${firstTime} - ${secondTime}`) {
                  index = i;
                  break;
                }
              }

              let correct = false;
              if (leavers.length <= 0 && Replacers.length <= 0) {
                correct = true;
              }
              for (let i = 0; i < leavers.length && Replacers.length; i++) {
                if (leavers[i].from === firstTime && leavers[i].to === secondTime && leavers[i].teacher === datas.data().Teachername) {
                  correct = false;

                  break;
                } else if (Replacers[i].from === firstTime && Replacers[i].to === secondTime && Replacers[i].teacher === datas.data().Teachername) {
                  correct = false;

                  break;
                } else {
                  correct = true;
                }
              }

              if (result !== -1 && correct === true) {
                if (index === 0) {
                  for (let i = 0; i < findDay.length; i++) {
                    if (times[index + 1] === findDay[i]) {
                      result.push(`${datas.data().Teachername} ➡️`);
                    }
                  }
                } else if (index == times.length - 1) {
                  for (let i = 0; i < findDay.length; i++) {
                    if (times[index - 1] === findDay[i]) {
                      result.push(`⬅️ ${datas.data().Teachername} `);
                    }
                  }
                } else {
                  for (let i = 0; i < findDay.length; i++) {
                    if (times[index + 1] === findDay[i]) {
                      result.push(`${datas.data().Teachername} ➡️`);
                    } else if (times[index - 1] === findDay[i]) {
                      result.push(`⬅️ ${datas.data().Teachername} `);
                    }
                  }
                }
              }
            }
          }
        })}

        <section className=" mt-2 w-[100%]  max-h-60 overflow-y-scroll scrollbar-hide flex flex-wrap justify-between ">
          {result.map((datas) => {
            return (
              <p key={++i} className="px-2 py-3 my-2 bg-slate-800 text-gray-300 tracking-wider font-semibold  text-[1.4rem] truncate rounded-xl w-[48%] sm:w-[30%] text-center ">
                {datas}
              </p>
            );
          })}
        </section>
      </section>
    );
  }

  function clearContent() {
    dates.current.value = "";
    from.current.value = "";
    to.current.value = "";
  }

  function clearFirst() {
    dates.current.value = "";
    from.current.value = "";
    to.current.value = "";
  }

  function submitFirst() {
    if (loading) return;

    const d = new Date();
    let times = new Date(dates.current.value);

    Replacers = [];
    leavers = [];
    absent.map((teachers) => {
      Replacers.push({ teacher: teachers.data().Replace, from: teachers.data().from, to: teachers.data().to });
      leavers.push({ teacher: teachers.data().Absent, from: teachers.data().from, to: teachers.data().to });
    });

    setLoading(true);

    if (dates.current.value.length > 0 && from.current.value.length > 0 && to.current.value.length > 0 && from.current.value < to.current.value && times >= d) {
      setOptions1(
        <select ref={absentee} className="flex-1 bg-slate-200  text-[1.5rem] rounded-md py-2   text-black outline-none ">
          <option value="Pick a teacher" className="text-black text-[1rem] sm:text-[1.5rem]">
            Pick a teacher ...
          </option>
          {teacher?.map((datas) => {
            let correct = false;
            if (leavers.length <= 0) {
              correct = true;
            }
            for (let i = 0; i < leavers.length; i++) {
              if (leavers[i].from === from.current.value && leavers[i].to === to.current.value && leavers[i].teacher === datas.data().Teachername) {
                correct = false;

                break;
              } else {
                correct = true;
              }
            }

            if (correct === true) {
              return (
                <option key={datas.id} value={`${datas.data().Teachername} - ${datas.data().email} - ${datas.data().userId}`} data-emails={datas.data().email} className="bg-white text-[1rem] sm:text-[1.5rem]">
                  {datas.data().Teachername}
                </option>
              );
            }
          })}
        </select>
      );

      setOptions2(
        <select ref={replacer} className="flex-1 bg-slate-200  text-[1.5rem] rounded-md py-2   text-black outline-none ">
          <option value="Pick a teacher" className="text-black text-[1rem] sm:text-[1.5rem]">
            Pick a teacher ...
          </option>
          {teacher?.map((datas) => {
            let correct = false;
            let days = new Date(dates.current.value);
            let findDay = datas.data()[`${day[days.getDay() - 1]}`];

            for (let i = 0; i < findDay.length; i++) {
              let spliter = findDay[i].split(" ");
              if (spliter[0] === from.current.value && spliter[2] === to.current.value) {
                if (leavers.length <= 0) {
                  correct = true;
                }
                for (let i = 0; i < Replacers.length; i++) {
                  if (Replacers[i].from == from.current.value && Replacers[i].to == to.current.value && Replacers[i].teacher == datas.data().Teachername) {
                    correct = false;
                    break;
                  } else if (leavers[i].from === from.current.value && leavers[i].to === to.current.value && leavers[i].teacher === datas.data().Teachername) {
                    correct = false;
                    break;
                  } else {
                    correct = true;
                  }
                }
              }
            }

            if (correct === true) {
              return (
                <option key={datas.id} value={`${datas.data().Teachername} - ${datas.data().email} - ${datas.data().userId}`} data-emails={datas.data().email} className="bg-white text-[1rem] sm:text-[1.5rem]">
                  {datas.data().Teachername}
                </option>
              );
            }
          })}
        </select>
      );
      setMove(true);
      setFirstTime(from.current.value);
      setSecondTime(to.current.value);
      setSetTime(dates.current.value);
      setLoading(false);
    } else {
      setLoading(false);
      alert("Something wrong .., Please fill all details correctly ..! ⚠️");
    }
  }

  const submitDetails = async () => {
    if (loading) return;
    setLoading(true);

    if (absentee.current.value === "Pick a teacher" || replacer.current.value === "Pick a teacher" || absentee.current.value === replacer.current.value) {
      alert("Please choose teachers correctly ...!");
    } else {
      let spliter1 = absentee.current.value.split(" - ");
      let absenter = spliter1[0];
      let absenterMail = spliter1[1];
      let absenterUID = spliter1[2];

      let spliter2 = replacer.current.value.split(" - ");
      let replacers = spliter2[0];
      let replacerMail = spliter2[1];
      let replacerUID = spliter2[2];

      const userdata = {
        username: session.user.username,
        profileImg: session.user.image,
        timeStamp: serverTimestamp(),
        userId: session.user.uid,
        Absent: absenter,
        Replace: replacers,
        from: firstTime,
        to: secondTime,
        date: setTime,
      };

      const docRef = doc(db, "teachers", absenterUID);
      let AbsenterScore = 0;
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        AbsenterScore = docSnap.data().score;
      }
      await updateDoc(docRef, {
        score: AbsenterScore - 10,
      });

      const docRef1 = doc(db, "teachers", replacerUID);
      let ReplacerScore = 0;
      const docSnap1 = await getDoc(docRef1);
      if (docSnap1.exists()) {
        ReplacerScore = docSnap1.data().score;
      }
      await updateDoc(docRef1, {
        score: ReplacerScore + 10,
      });

      await addDoc(collection(db, "absentee"), userdata);

      emailjs.send("anuj", "template_i0vdx5k", { absentee: `${absenter}`, names: `${replacers}`, absent: `${absenter}`, dates: `${setTime}`, times: `${firstTime} - ${secondTime}`, receiver: `${replacerMail}`, senders: `${session?.user?.email}` }, "80bpaghXcoMxa7-uz").then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );

      absentee.current.value = "Pick a teacher";
      replacer.current.value = "Pick a teacher";
    }
    setMove(false);
    setLoading(false);
  };

  return (
    <>
      <Header uid={session?.user?.uid} />

      <section className="max-w-7xl m-auto w-[95%] mt-40 ">
        {/*  */}

        {!move && (
          <div className="w-[100%] border-b border-slate-400 px-5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-900 pt-4 ">
            {/*  */}

            <section className="w-[100%] pt-4 flex flex-col md:flex-row md:justify-between items-center">
              <div className="w-[100%] md:w-fit flex items-center  ">
                <p className="text-[1.5rem] font-serif font-semibold text-slate-200 mr-5 w-[28%] md:w-fit ">Select Date : </p>
                <input type="date" ref={dates} className="bg-slate-200  flex-1  px-5 md:px-2 py-2 rounded-md text-[1.5rem] outline-none  md:w-[18rem]" />
              </div>

              <div className="w-[100%] flex md:w-fit  items-center mt-6 md:mt-0">
                <p className="text-[1.5rem] font-serif font-semibold text-slate-200 mr-5 w-[28%] md:w-fit ">From : </p>
                <input type="time" ref={from} className="bg-slate-200  flex-1  px-5 md:px-2 py-2 rounded-md text-[1.5rem] md:w-[15rem] outline-none   " />
              </div>

              <div className="w-[100%] flex md:w-fit  items-center mt-6 md:mt-0 ">
                <p className="text-[1.5rem] font-serif font-semibold text-slate-200 mr-5 w-[28%] md:w-fit ">To : </p>
                <input type="time" ref={to} className="bg-slate-200  flex-1  px-5 md:px-2 py-2 rounded-md text-[1.5rem] md:w-[15rem] outline-none " />
              </div>
            </section>
            <div className=" flex w-[100%] items-center justify-end  flex-row  mt-8 mb-5   ">
              <button className=" bg-[#000] rounded-lg  px-20 py-3 text-[1.5rem] text-slate-300 font-serif font-semibold mr-2 cursor-pointer   " onClick={submitFirst}>
                {loading ? "Loading.." : "Submit"}
              </button>
              <button className="bg-[#000] rounded-lg  px-20 py-3 text-[1.5rem] text-slate-300 font-serif font-semibold ml-2 cursor-pointer " onClick={clearFirst}>
                Cancel
              </button>
            </div>

            {/*  */}
          </div>
        )}

        {move && (
          <>
            <p className=" text-[1.5rem] font-semibold font-serif text-blue-500  cursor-pointer w-fit " onClick={() => setMove(false)}>
              {" "}
              ⬅️ Go back{" "}
            </p>
            <div className=" flex w-[100%] flex-col items-center  justify-between rounded-xl bg-gradient-to-r from-sky-800 to-indigo-900  sm:flex-row pt-5 mt-10  border-b border-slate-400 ">
              <section className="my-2 flex w-[100%] flex-col   sm:w-[65%]">
                {}

                <div className="my-4 flex w-[100%] items-center px-5 ">
                  <p className="font-serif  text-[1.5rem] font-semibold tracking-wider text-slate-200 w-[28%] md:w-[25%] mr-5  ">Absenter :</p>

                  {options1}
                </div>

                <div className="my-4 flex w-[100%] items-center px-5 ">
                  <p className="font-serif  text-[1.5rem] font-semibold tracking-wider text-slate-200 w-[28%] mr-5 md:w-[25%]  ">Replacer :</p>

                  {options2}
                </div>

                {}
              </section>

              <div className="my-5 flex w-[100%] items-center justify-end   sm:my-0 sm:w-[30%] sm:flex-col px-5 ">
                <button className=" bg-[#000] rounded-lg  px-14 py-2 text-[1.5rem] text-slate-300 font-serif font-semibold mr-2 cursor-pointer md:w-[80%] md:my-4 md:mr-0 " onClick={submitDetails}>
                  {loading ? "Loading.." : "Submit"}
                </button>
                <button className="bg-[#000] rounded-lg  px-14 py-2 text-[1.5rem] text-slate-300 font-serif font-semibold ml-2 cursor-pointer md:my-4 md:w-[80%] md:ml-0 " onClick={clearContent}>
                  Cancel
                </button>
              </div>
            </div>

            {Recommend()}
            {/*  */}
          </>
        )}
        {/*  */}

        {/*  */}

        <section className="mt-16 h-fit  w-[100%] ">
          {absent.map((post) => (
            <Leavers key={post.id} id={post.id} username={post.data().username} userImg={post.data().profileImg} userID={post.data().userId} absent={post.data().Absent} replace={post.data().Replace} time={post.data().timeStamp} from={post.data().from} to={post.data().to} date={post.data().date} />
          ))}
        </section>

        {/*  */}
      </section>

      <div
        className=" fixed bottom-10 right-6 md:right-10  rounded-full bg-slate-100 cursor-pointer p-0"
        onClick={() => {
          setModal(true);
        }}
      >
        <InformationCircleIcon className=" text-blue-600 h-16 md:h-20 rounded-full m-0  " />
      </div>

      <Info />
    </>
  );
}

export default absentee;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
