import React, { useRef, useState } from "react";
import { getProviders, useSession } from "next-auth/react";
import Smalldetails from "../components/Smalldetails";
import { useRecoilState } from "recoil";
import { mondays } from "../atom/mondays";
import { tuesdays } from "../atom/tuesdays";
import { wednesdays } from "../atom/wednesdays";
import { thursdays } from "../atom/thursdays";
import { fridays } from "../atom/fridays";
import { saturdays } from "../atom/saturdays";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import Header from "../components/Header";
import { useRouter } from "next/router";
import { checkAccept } from "../atom/CheckAccept";
import Greet from "./Greet";

function Dataform() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [check, setCheck] = useRecoilState(checkAccept);

  const [Monday, setMonday] = useRecoilState(mondays);
  const [Tuesday, setTuesday] = useRecoilState(tuesdays);
  const [Wednesday, setWednesday] = useRecoilState(wednesdays);
  const [Thursday, setThursday] = useRecoilState(thursdays);
  const [Friday, setFriday] = useRecoilState(fridays);
  const [Saturday, setSaturday] = useRecoilState(saturdays);

  const day = useRef(null);
  const time = useRef(null);
  const name = useRef(null);
  const phone = useRef(null);

  // Using this count to send index to list
  let count = 0;

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

  //On clear click removing all enteries from form
  function clearData() {
    name.current.value = "";
    phone.current.value = "";
    day.current.value = "monday";
    time.current.value = "9:40 - 10:20";

    //Erasing all values from data ..,
    setMonday([]);
    setTuesday([]);
    setWednesday([]);
    setThursday([]);
    setFriday([]);
    setSaturday([]);
  }

  // Checking user has entered every data correctly or not before sending request

  function sendRequest() {
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

    const userdata = {
      verified: false,
      email: session.user.email,
      username: session.user.username,
      profileImg: session.user.image,
      userId: session.user.uid,
      Teachername: name.current.value,
      MobileNumber: phone.current.value,
      score: 0,
      monday: [...Monday],
      tuesday: [...Tuesday],
      wednesday: [...Wednesday],
      thursday: [...Thursday],
      friday: [...Friday],
      saturday: [...Saturday],
    };

    await setDoc(doc(db, "teachers", session?.user?.uid), userdata);
    await setDoc(doc(db, "requests", session?.user?.uid), userdata);

    clearData();
    setLoading(false);
    setCheck(false);
    router.push("/");
    setMonday([]);
    setTuesday([]);
    setWednesday([]);
    setThursday([]);
    setFriday([]);
    setSaturday([]);
  };

  if (check === false) {
    return <Greet />;
  }

  return (
    <>
      <Header show="no" />
      <div className="m-auto mt-40 md:mt-48 max-w-6xl w-[100%]">
        {/* User data entry section */}
        <div className="flex flex-col items-center w-[95%] m-auto   bg-[#7c7c7c2b] rounded-t-3xl border-t-8 border-purple-700 py-4  ">
          <p className="w-[100%] text-[2.5rem] md:text-[3rem] py-2 font-semibold text-slate-100  px-5   ">Teacher Details Form </p>
          <p className="w-[100%] pt-4 px-5 text-[1.5rem]   font-serif text-red-800 ">* required</p>
        </div>

        <div className=" flex flex-col w-[95%] m-auto   bg-[#7c7c7c2b] rounded-xl mt-32 py-6  ">
          <p className="w-[100%] text-[1.6rem] md:text-[1.8rem]    text-gray-300 tracking-wide  px-5  ">
            Name <span className="text-red-800">*</span>
          </p>
          <input ref={name} type="text" className="w-[95%] my-2 py-1 sm:w-[60%] sm:mx-5 flex sm:justify-start m-auto   px-2 bg-transparent border-b-[0.1rem] rounded-md  border-purple-800 outline-none text-[1.6rem] text-slate-300  " />
        </div>

        <div className=" flex flex-col w-[95%] m-auto   bg-[#7c7c7c2b] rounded-xl mt-14 py-6  ">
          <p className="w-[100%] text-[1.6rem] md:text-[1.8rem]   text-gray-300 tracking-wide  px-5  ">
            Phone Number <span className="text-red-800">*</span>
          </p>
          <input ref={phone} type="number" className="w-[95%] my-2 py-1 sm:w-[60%] sm:mx-5 flex sm:justify-start m-auto   px-2 bg-transparent border-b-[0.1rem] rounded-md  border-purple-800 outline-none text-[1.6rem] text-slate-300  " />
        </div>

        <div className=" flex flex-col w-[95%] m-auto   bg-[#7c7c7c2b] rounded-xl my-14 py-6  ">
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
              <option value="09:40 - 10:20" className="bg-black py-2 text-[1rem] lg:text-[1.5rem] ">
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

            <button className="rounded-lg bg-purple-900 px-12 sm:px-16 py-2 sm:mr-5 text-[1.4rem] text-slate-200 outline-none " onClick={submitData}>
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

        <section className="w-[95%] m-auto bg-[#7c7c7c2b]  flex justify-end items-center px-5 py-10 border-b-8 rounded-b-3xl border-purple-700 mb-10 ">
          <button className="rounded-lg bg-purple-900 px-12 sm:px-16 py-2 sm:mr-5 text-[1.4rem] text-slate-200 outline-none mx-5 " onClick={clearData}>
            Cancel
          </button>
          <button className="rounded-lg bg-purple-900 px-12 sm:px-16 py-2 sm:mr-5 text-[1.4rem] text-slate-200 outline-none ml-5" onClick={sendRequest}>
            {loading ? "Submitting..." : "Send Request"}
          </button>
        </section>

        {/*  */}
      </div>
    </>
  );
}

export default Dataform;
