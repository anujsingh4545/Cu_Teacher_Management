import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Triangle } from "react-loader-spinner";

import { useSession } from "next-auth/react";
import { db } from "../firebase";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useRecoilState } from "recoil";
import { checkForm } from "../atom/checkForm";
import { checkAccept } from "../atom/CheckAccept";
import { isBrowser } from "@firebase/util";
import { useRouter } from "next/router";

function Greet() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(true);
  const [not, setNot] = useState(true);
  const [check, setCheck] = useRecoilState(checkAccept);
  const [form, setForm] = useRecoilState(checkForm);
  const router = useRouter();

  const fillForm = async () => {
    await deleteDoc(doc(db, "teachers", session?.user?.uid));
    setForm(false);
    setCheck(true);
  };

  const checkVerified = async () => {
    //

    if (session) {
      //

      const docRef = doc(db, "teachers", session?.user?.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        if (docSnap.data().verified === true) {
          setLoading(false);
          router.push("/absentee");
        }

        if (docSnap.data().verified === "decline") {
          setNot(false);
        }
      }

      //
    } else {
      return null;
    }

    //
  };

  useEffect(() => {
    return checkVerified();
  }, [db, session]);

  return (
    <>
      <Header show="no" />
      <div className="w-[95%] m-auto  max-w-7xl mt-40 ">
        <img src="/waiting.svg" alt="" className="m-auto w-[80%] md:w-[50%]" />

        <section className="w-[100%] items-center text-center">
          {/*  */}

          {not ? (
            loading && (
              <>
                <p className="text-center text-[2rem] font-serif font-semibold italic text-slate-400 mt-32 md:mt-20 ">Waiting for your request, to get accepted by admins ???? </p>
                <div className=" w-[100%] max-w-7xl flex items-center justify-center mt-10 m-auto">
                  <Triangle color="#00BFFF" height={80} width={80} />
                </div>

                <button className=" mt-20 md:mt-14 rounded-lg bg-purple-900 px-16 sm:px-20 py-3 sm:mr-5 text-[1.4rem] text-slate-200 outline-none ml-5" onClick={checkVerified}>
                  Check Verification
                </button>
              </>
            )
          ) : (
            <>
              <p className="text-center text-[2rem] w-[90%] m-auto font-serif font-semibold italic text-slate-400 mt-32 md:mt-20 ">Your request has been declined.., ???? Click on the below button to submit form again ...! </p>
              <button className=" bg-gradient-to-r from-sky-600 to-indigo-900 rounded-lg mt-20 md:mt-10  px-28 py-4 text-[1.5rem] text-slate-200 font-bold" onClick={fillForm}>
                Fill Form again
              </button>
            </>
          )}

          {/*  */}
        </section>
      </div>
    </>
  );
}

export default Greet;
