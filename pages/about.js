import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { MailIcon } from "@heroicons/react/solid";
import Comment from "../components/Comment";
import { getProviders, useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import { loginUser } from "../atom/loginUser";
import Signin from "../components/Signin";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { checkAccept } from "../atom/CheckAccept";
import { checkForm } from "../atom/checkForm";
import Dataform from "../components/Dataform";
import Greet from "../components/Greet";
import { Triangle } from "react-loader-spinner";
import { ShowProfile } from "../atom/ShowProfile";
import Profile from "../components/Profile";

function about({ providers }) {
  const { data: session } = useSession();
  const [login, setLogin] = useRecoilState(loginUser);
  const [form, setForm] = useRecoilState(checkForm);
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useRecoilState(checkAccept);
  const [onprofile, setOnProfile] = useRecoilState(ShowProfile);

  useEffect(async () => {
    let leadsFromLocalStorage = JSON.parse(localStorage.getItem("login"));
    if (leadsFromLocalStorage) {
      setLogin(leadsFromLocalStorage);
    }
  }, [login]);

  const checkData = async () => {
    //

    if (session) {
      //
      setLoading(true);
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
        setLoading(false);
        //
      } else {
        setForm(false);
        setLoading(false);
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

  if (loading) {
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

  return (
    <div>
      <Header uid={session?.user?.uid} />

      <section className="m-auto w-[100%] min-w-[450px] max-w-[90rem]  px-8 ">
        {}

        <img src="/about.svg" alt="" className="m-auto mt-60 w-[80%] max-w-[90rem]  md:w-[60%] " />

        <h1 className="mt-20 text-[3rem] font-semibold text-gray-200">About</h1>

        <p className="mb-32 mt-5 text-[1.2rem] italic  text-gray-300 sm:text-[1.5rem]">
          Our website ( 👩‍🏫 CU Teacher Management System 🧑‍🏫 ) aims to provide certain features which are as follows:-
          <br />
          <br />
          <br />
          ➡️ In this website the data and timetable of teachers will be entered by them, and data will be stored dynamically in the database.
          <br />
          <br />
          ➡️ what all user (teacher) has to do is to enter the time table ie. When they are busy.
          <br />
          <br />
          ➡️ From this data we can find teachers who are free at certain instance by selecting the needed one.
          <br />
          <br />
          ➡️ If some teacher is absent we can find .., whom teacher is free at that instance and select them as replacement for certain teachers.
          <br />
          <br />
          ➡️ only the user will have the access to edit his own profile.
          <br />
          <br />
          ➡️ Morever there will be a machine learning algorithm used to suggest the names of teacher to take lectures on the behalf of the absentee teacher.
          <br />
          <br />
          ➡️ There will be some admins who are allowed to do all modification in the website.
          <br />
        </p>

        {}
      </section>

      <section className="m-auto mt-20 max-w-[90rem] px-8 ">
        <h1 className="text-[3rem] font-semibold text-gray-200">Contact </h1>

        <p className="my-5 text-[1.3rem] italic  text-gray-300 sm:text-[1.5rem]">You can contact via email or write comments and sugesstions below for your issues related with our website . Possitive feedbacks are most welcome.., cheers 🤍 </p>

        <section className=" mt-16 w-[100%] flex-row  justify-between ">
          {}
          <div className=" my-3 flex w-fit items-center  ">
            <div className="mr-5 rounded-full  bg-[#7c7c7c2b] p-2 ">
              <MailIcon className=" h-8 text-orange-600" />
            </div>
            <p className="text-[1.5rem] italic text-gray-400">anujsinghsisodiya5341@gmail.com</p>
          </div>

          <div className=" my-3 flex w-fit items-center ">
            <div className="mr-5 rounded-full  bg-[#7c7c7c2b] p-2 ">
              <MailIcon className=" h-8 text-orange-600" />
            </div>
            <p className="text-[1.5rem] italic text-gray-400">tanwarlakshay1902@gmail.com</p>
          </div>

          <div className=" my-3 flex w-fit items-center ">
            <div className="mr-5 rounded-full  bg-[#7c7c7c2b] p-2 ">
              <MailIcon className=" h-8 text-orange-600" />
            </div>
            <p className="text-[1.5rem] italic text-gray-400">ishitaphugatchoudhary@gmail.com</p>
          </div>

          <div className=" my-3 flex w-fit items-center  ">
            <div className="mr-5 rounded-full  bg-[#7c7c7c2b] p-2 ">
              <MailIcon className=" h-8 text-orange-600" />
            </div>
            <p className="text-[1.5rem] italic text-gray-400">gavinreji475@gmail.com</p>
          </div>

          {}
        </section>
      </section>
      <Comment />
    </div>
  );
}

export default about;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
