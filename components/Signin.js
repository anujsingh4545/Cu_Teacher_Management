import React, { useRef, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { ShieldExclamationIcon } from "@heroicons/react/solid";
import Header from "../components/Header";
import { useRecoilState } from "recoil";
import { shuffle } from "../atom/shuffle";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { loginUser } from "../atom/loginUser";
import { db } from "../firebase";
import { checkForm } from "../atom/checkForm";

function Signin({ providers }) {
  const { data: session } = useSession();
  const [shuffles, setShuffles] = useRecoilState(shuffle);
  const [fpassword, setFpassword] = useState(false);
  const [loading, setLoading] = useState(false);
  let [login, setLogin] = useRecoilState(loginUser);
  const [form, setForm] = useRecoilState(checkForm);

  let useremail = useRef(null);
  let userpassword = useRef(null);
  let setuserpassword = useRef(null);

  // Code to sign in to website
  const SIGNIN = async () => {
    if (!session) {
      alert("Sign in with google first ⚠️");
      return;
    } else if (userpassword.current.value.length <= 5) {
      alert("Enter password of length greater than 5 ⚠️");
      return;
    } else {
      //

      setLoading(true);
      const docRef = doc(db, "user", session?.user?.uid); // getting user data from firebase
      const docSnap = await getDoc(docRef);

      //checking data entered by user is correct or not

      if (docSnap.exists()) {
        if (userpassword.current.value === docSnap.data().upassword) {
          setLoading(false);
          localStorage.setItem("login", JSON.stringify(1));
          setLogin(1);
        } else {
          setLoading(false);
          alert("Password is invalid.., please try again ⚠️");
        }
      } else {
        alert("No user found .., please sign up to continue to site 🙂");
        setLoading(false);
        setShuffles("true");
      }
    }
  };

  //code to signup to website
  const SIGNUP = async () => {
    if (!session) {
      alert("Sign in with google first ⚠️");
      return;
    } else if (userpassword.current.value.length <= 5) {
      alert("Enter password of length greater than 5 ⚠️");
      return;
    } else {
      if (loading) return;
      setLoading(true);
      const userdata = {
        uemail: session?.user?.email,
        upassword: userpassword.current.value,
        uid: session?.user?.uid,
      };

      const docRef = doc(db, "user", session?.user?.uid); // getting user data from firebase
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        alert("User already exists ⚠️");
        setLoading(false);
      } else {
        await setDoc(doc(db, "user", session?.user?.uid), userdata);
        setForm(false);
        userpassword.current.value = "";
        setLoading(false);
        localStorage.setItem("login", JSON.stringify(1));
        setLogin(1);
      }
    }
  };

  //Code to reset password of user
  const resetPassword = async () => {
    if (!session) {
      alert("Sign in with google first ⚠️");
      return;
    } else if (setuserpassword.current.value.length <= 5) {
      alert("Enter password of length greater than 5 ⚠️");
      return;
    } else {
      setLoading(true);
      const docRef = doc(db, "user", session?.user?.uid); // getting user data from firebase
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await setDoc(doc(db, "user", session?.user?.uid), {
          uemail: session?.user?.email,
          upassword: setuserpassword.current.value,
          uid: session?.user?.uid,
        });
        setLoading(false);
        alert("Password Updated .., sign in to continue to site 🙂");
        setFpassword(false);
      } else {
        alert("No such user exists.., Sign up to continue to site ⚠️");
        setLoading(false);
        setShuffles("true");
      }
    }
  };

  return (
    <>
      <Header show="no" />
      <div className=" max-w-5xl rounded-3xl   w-[95%]   mt-36 m-auto">
        {/*  */}

        <section className="flex w-[100%] text-center m-auto items-center bg-[#7c7c7c2b] rounded-t-3xl ">
          {/*  */}

          <p className={shuffles === "false" ? 'bg-gradient-to-r from-sky-600 to-indigo-900 text-slate-200 text-[1.5rem] md:text-[1.8rem] font-bold w-[50%] cursor-pointer font-sans tracking-wide  py-5 rounded-t-3xl "' : 'text-slate-200 text-[1.5rem] md:text-[1.8rem] font-bold w-[50%] cursor-pointer font-sans tracking-wide  py-5 rounded-t-3xl "'} onClick={() => setShuffles("false")}>
            SIGN IN
          </p>

          <p
            className={shuffles === "true" ? 'bg-gradient-to-r from-sky-600 to-indigo-900 text-slate-200 text-[1.5rem] md:text-[1.8rem] font-bold w-[50%] cursor-pointer font-sans tracking-wide  py-5 rounded-t-3xl "' : 'text-slate-200 text-[1.5rem] md:text-[1.8rem] font-bold w-[50%] cursor-pointer font-sans tracking-wide  py-5 rounded-t-3xl "'}
            onClick={fpassword === false ? () => setShuffles("true") : () => alert("Set Password is on .., Please close it first to move to sign up page 🙂")}
          >
            SIGN UP
          </p>
        </section>

        <section className="w-[100%] m-auto bg-gradient-to-r from-sky-600 to-indigo-900 py-5 border-t border-black ">
          <img src="/logo-white.png" alt="" className=" w-[90%]  md:w-[60%] h-52 m-auto mt-5  " />

          <p className="w-[100%] text-center text-slate-200 text-[1.3rem] md:text-[1.5rem] font-serif italic font-semibold mt-16 bg-[#11111180] py-7 ">To get access to site .., Please sign in || sign up first 🤍</p>
        </section>

        <section className="flex flex-col items-center bg-[#7c7c7c2b] py-16 rounded-b-3xl">
          {/*  */}

          <div className="m-auto  flex w-[80%] sm:w-[70%] items-center justify-center rounded-xl bg-[#7c7c7c2b] px-10 ">
            {Object.values(providers).map((provider) => (
              <button key={provider.name} className="flex-1 cursor-pointer font-serif   py-4 text-left  text-[1.5rem] text-slate-200" onClick={() => signIn(provider.id)}>
                Sign in with {provider.name}
              </button>
            ))}

            <ShieldExclamationIcon className={!session ? "h-10 pl-9 text-red-700 " : " h-10 pl-9 text-green-700 "} />
          </div>

          <p ref={useremail} placeholder="Enter your email" className="outline-none px-10 font-serif mt-5 py-4 w-[80%] sm:w-[70%]  text-[1.5rem] rounded-xl text-slate-400 bg-[#7c7c7c2b] ">
            {session ? session?.user?.email : "Default email ..."}
          </p>

          {fpassword ? (
            <input ref={setuserpassword} type="password" placeholder="Set your new password" className="outline-none px-10 mt-5 py-4 w-[80%] sm:w-[70%] text-[1.5rem]  rounded-xl text-slate-400 font-serif  bg-[#7c7c7c2b] " />
          ) : (
            <input ref={userpassword} type="password" placeholder="Enter your password" className="outline-none px-10 mt-5 py-4 w-[80%] sm:w-[70%] text-[1.5rem]  rounded-xl text-slate-400 font-serif  bg-[#7c7c7c2b] " />
          )}

          {/*  */}

          {shuffles === "false" && fpassword === false && (
            <p
              className="w-[80%] sm:w-[70%]  text-right  text-[1rem] text-slate-500 font-serif font-semibold italic mt-10 px-2 cursor-pointer"
              onClick={() => {
                setFpassword(true);
              }}
            >
              Forgot Password ?
            </p>
          )}

          <div className="w-[80%] sm:w-[70%] flex items-center justify-between mt-20 ">
            {/*  */}

            {fpassword ? (
              <>
                <button
                  className="w-[45%] bg-gradient-to-r from-sky-600 to-indigo-900 rounded-lg  px-5 py-3 text-[1.5rem] text-slate-200 font-bold "
                  onClick={() => {
                    setFpassword(false);
                  }}
                >
                  Cancel
                </button>
                <button className="w-[45%] bg-gradient-to-r from-sky-600 to-indigo-900 rounded-lg  px-5 py-3 text-[1.5rem] text-slate-200 font-bold " onClick={resetPassword}>
                  {loading ? "Updating..." : "Set Password"}
                </button>
              </>
            ) : (
              <>
                <button className="w-[45%] bg-gradient-to-r from-sky-600 to-indigo-900 rounded-lg  px-5 py-3 text-[1.5rem] text-slate-200 font-bold " onClick={() => (userpassword.current.value = "")}>
                  Cancel
                </button>
                <button className="w-[45%] bg-gradient-to-r from-sky-600 to-indigo-900 rounded-lg  px-5 py-3 text-[1.5rem] text-slate-200 font-bold " onClick={shuffles === "false" ? SIGNIN : SIGNUP}>
                  {loading ? "submitting..." : "Submit"}
                </button>
              </>
            )}

            {/*  */}
          </div>
        </section>

        {/*  */}
      </div>
      ;
    </>
  );
}

export default Signin;
