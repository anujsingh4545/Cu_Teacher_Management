import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useRecoilState } from "recoil";
import { loginUser } from "../atom/loginUser";
import { getProviders } from "next-auth/react";
import { useSession } from "next-auth/react";
import Signin from "../components/Signin";
import Request from "../components/Request";
import { db } from "../firebase";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import Adminsadd from "../components/Adminsadd";
import Users from "../components/Users";
import { checkForm } from "../atom/checkForm";
import { checkAccept } from "../atom/CheckAccept";
import { Triangle } from "react-loader-spinner";
import { ShowProfile } from "../atom/ShowProfile";
import Profile from "../components/Profile";
import Dataform from "../components/Dataform";
import Greet from "../components/Greet";
import { AdminCheck } from "../atom/AdminCheck";
import { useRouter } from "next/router";
import { ShowModal } from "../atom/ShowModal";
import { InformationCircleIcon } from "@heroicons/react/solid";
import Info from "../components/Info";
import { ShowUserProfile } from "../atom/ShowUserProfile";
import { UidGuest } from "../atom/UidGuest";
import UserProfile from "../components/Userprofile";

function admin({ providers }) {
  const { data: session } = useSession();
  const [login, setLogin] = useRecoilState(loginUser);
  const [swap, setSwap] = useState(false);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useRecoilState(checkForm);
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useRecoilState(checkAccept);
  const [onprofile, setOnProfile] = useRecoilState(ShowProfile);
  const [admins, setAdmins] = useRecoilState(AdminCheck);
  const router = useRouter();
  const [modal, setModal] = useRecoilState(ShowModal);
  const [onGuestprofile, setOnGuestProfile] = useRecoilState(ShowUserProfile);
  const [uidgest, setuidguest] = useRecoilState(UidGuest);
  const [sessionStore, setSessionstore] = useState(0);

  if (sessionStore === 0) {
    if (session) {
      setSessionstore(1);
    }
  } else {
  }

  useEffect(async () => {
    const unsubscribe = await onSnapshot(collection(db, "requests"), (snapshot) => {
      setRequests(snapshot.docs);
    });

    return unsubscribe;
  }, [db]);

  const checkAdmin = async () => {
    //
    setLoading(true);
    console.log("6");
    if (session) {
      const docRef = await doc(db, "admin", session?.user?.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAdmins(true);
      } else {
        setAdmins(false);
      }
      setLoading(false);

      //
    } else {
      return null;
    }

    //
  };

  useEffect(() => {
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
      checkAdmin();
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
  }, [sessionStore]);

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
    <>
      <Header uid={session?.user?.uid} />

      {admins ? (
        <>
          <div className="w-[100%] m-auto max-w-7xl mt-40 z-0">
            {/*  */}

            <section className=" flex w-[95%] m-auto items-center justify-between rounded-3xl  bg-[#7c7c7c2b] py-5">
              <p
                className=" w-[50%]   cursor-pointer border-r border-slate-600  text-center font-serif text-[1.5rem] font-semibold tracking-wider text-gray-300 sm:text-[2rem]"
                onClick={() => {
                  setSwap(false);
                }}
              >
                Settings
              </p>

              <div
                className="w-[50%] z-0 cursor-pointer items-center text-center justify-center flex border-l  border-slate-600"
                onClick={() => {
                  setSwap(true);
                }}
              >
                <p className="relative cursor-pointer z-0  w-fit text-center  font-serif text-[1.8rem] font-semibold tracking-wider text-gray-300 sm:text-[2rem]">
                  Requests
                  <span className="absolute top-[-25%] right-[-15%] z-0  text-[1.5rem]  text-red-600 "> {requests.length}</span>
                </p>
              </div>
            </section>

            {swap ? (
              <Request />
            ) : (
              <div className="flex flex-col">
                <Adminsadd />
                <Users />
              </div>
            )}

            {/*  */}
          </div>
        </>
      ) : (
        <div className="w-[95%] m-auto max-w-7xl my-80">
          <p className="w-[100%] text-slate-300 tracking-wider font-semibold font-serif text-[2rem] text-center ">Access not allowed ⚠️</p>
        </div>
      )}

      <div
        className=" fixed bottom-10 right-6 md:right-10  rounded-full bg-slate-100 cursor-pointer p-0"
        onClick={() => {
          setModal(true);
        }}
      >
        <InformationCircleIcon className=" text-blue-600 h-16 md:h-20 rounded-full m-0  " />
      </div>

      <Info />
      {onGuestprofile && <UserProfile uid={uidgest} />}
    </>
  );
}

export default admin;

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
