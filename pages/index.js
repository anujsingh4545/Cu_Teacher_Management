import { getProviders, useSession } from "next-auth/react";
import Signin from "../components/Signin";
import Dataform from "../components/Dataform";
import Header from "../components/Header";
import { useRecoilState } from "recoil";
import { checkForm } from "../atom/checkForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { loginUser } from "../atom/loginUser";
import Homesearch from "../components/Homesearch";
import { Triangle } from "react-loader-spinner";
import { InformationCircleIcon } from "@heroicons/react/solid";

import { db } from "../firebase";
import { checkAccept } from "../atom/CheckAccept";
import { doc, getDoc } from "firebase/firestore";
import Greet from "../components/Greet";
import Profile from "../components/Profile";
import { ShowProfile } from "../atom/ShowProfile";
import { AdminCheck } from "../atom/AdminCheck";
import Info from "../components/Info";
import { ShowModal } from "../atom/ShowModal";

export default function Home({ providers }) {
  const { data: session } = useSession();
  const [form, setForm] = useRecoilState(checkForm);
  const [login, setLogin] = useRecoilState(loginUser);
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = useRecoilState(checkAccept);
  const [onprofile, setOnProfile] = useRecoilState(ShowProfile);
  const [admins, setAdmins] = useRecoilState(AdminCheck);
  const [modal, setModal] = useRecoilState(ShowModal);

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

      if (session) {
        const docRef = await doc(db, "admin", session?.user?.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAdmins(true);
        } else {
          setAdmins(false);
        }
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
      {/*  */}

      <Header uid={session?.user?.uid} />

      {admins ? (
        <Homesearch />
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

      {/*  */}
    </div>
  );
}

//

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}
