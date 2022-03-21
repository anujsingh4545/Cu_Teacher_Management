import React, { useEffect } from "react";
import { DotsVerticalIcon } from "@heroicons/react/solid";
import { LogoutIcon } from "@heroicons/react/outline";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { loginUser } from "../atom/loginUser";
import { ShowProfile } from "../atom/ShowProfile";
import Profile from "./Profile";
import { db } from "../firebase";
import { AdminCheck } from "../atom/AdminCheck";
import { doc, getDoc } from "firebase/firestore";

function Header({ show, uid }) {
  const { data: session } = useSession();
  const [login, setLogin] = useRecoilState(loginUser);
  const [profile, setProfile] = useRecoilState(ShowProfile);
  const [admins, setAdmins] = useRecoilState(AdminCheck);

  //Function to log out user from website
  function logOut() {
    signOut();
    setLogin(0);
    localStorage.setItem("login", JSON.stringify(0));
  }

  if (profile === true) {
    return <Profile uid={session?.user?.uid} />;
  }

  useEffect(async () => {
    if (!uid) {
      return;
    }
    const docRef = await doc(db, "admin", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setAdmins(true);
    } else {
      setAdmins(false);
    }
  }, [db]);

  return (
    <div className=" fixed top-0  z-30 w-[100%] bg-white shadow-sm shadow-black  ">
      {/*  */}

      {/* Using this show to disable header so .., no one can operate with it .., when no use is there */}
      {show === "no" && <div className=" w-[100%] z-40 absolute top-0  h-24 md:h-28 cursor-not-allowed bg-[#00000013]"></div>}

      <section className="m-auto  flex items-center w-[100%] max-w-[90rem] z-30  justify-between py-4 px-3 ">
        <img src="/logocontinue.png" alt="" className="hidden md:inline h-9 md:h-8 lg:h-9 " />
        <img src="/logoset.jpg" alt="" className=" md:hidden h-14 " />

        <section className="flex items-center ">
          <div className=" flex mr-2 sm:mr-7 ">
            <Link href="/">
              <a className="nav nav-link  "> Home</a>
            </Link>

            <Link href="/absentee">
              <a className="nav nav-link"> Absentee</a>
            </Link>

            {admins && (
              <Link href="/admin">
                <a className="nav nav-link"> Admin</a>
              </Link>
            )}

            <Link href="/about">
              <a className="nav nav-link"> About Us</a>
            </Link>
          </div>

          <div className=" items-center rounded-full border-2 border-gray-900 bg-[#000000fb] py-1 px-1 flex ">
            <img src={session?.user?.image} className="h-14 rounded-full p-1 cursor-pointer " alt="" onClick={() => setProfile(true)} />

            {session ? (
              <p className="hidden sm:inline mx-3 text-[1.2rem]  font-semibold italic text-[#ad5b42] cursor-pointer " onClick={() => setProfile(true)}>
                {session?.user?.username}
              </p>
            ) : (
              <p className="ml-4 text-[1.5rem]  font-semibold italic text-[#ad5b42] hidden sm:inline ">sign in </p>
            )}

            <LogoutIcon className="ml-3  mr-3 h-8 cursor-pointer text-gray-200 " onClick={logOut} />
          </div>
        </section>

        {}
      </section>
    </div>
  );
}

export default Header;
