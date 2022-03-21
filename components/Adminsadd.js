import { data } from "autoprefixer";
import { addDoc, collection, doc, getDoc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Triangle } from "react-loader-spinner";
import { db } from "../firebase";
import Adminslist from "./Adminslist";

function Adminsadd() {
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const teacher = useRef(null);

  let options = (
    <select ref={teacher} className=" bg-gradient-to-r flex-1 from-gray-100 to-gray-200  text-[1.5rem] font-semibold text-slate-900 outline-none font-serif italic px-5 py-4  rounded-lg ">
      <option value="Add admin" className="bg-black text-[1rem] sm:text-[1.5rem]">
        Add a admin ...
      </option>
      {users.map((user) => (
        <option key={user.id} value={user.data().userId} className="bg-black text-[1rem] sm:text-[1.5rem] text-slate-100">
          {user.data().Teachername}
        </option>
      ))}
      ;
    </select>
  );

  useEffect(async () => {
    const unsubscribe = await onSnapshot(query(collection(db, "teachers"), where("verified", "==", true)), (snapshot) => {
      setUsers(snapshot.docs);
    });
    return unsubscribe;
  }, [db]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "admin"), (snapshot) => {
      setAdmins(snapshot.docs);
    });

    return unsubscribe;
  }, [db]);

  //Add admin to admin section in database
  const addAdmin = async () => {
    if (teacher.current.value === "Add admin") {
      alert("Select a teacher name first ⚠️");
      return;
    }

    if (loading) return;
    setLoading(true);

    const docRef = doc(db, "teachers", teacher.current.value); // getting user data from firebase
    const docSnap = await getDoc(docRef);

    const docAdmin = doc(db, "admin", teacher.current.value);
    const docGet = await getDoc(docAdmin);

    if (docGet.exists()) {
      setLoading(false);
      alert("Admin already exists ... ⚠️");
    } else {
      const userdata = {
        email: docSnap.data().email,
        name: docSnap.data().Teachername,
        phone: docSnap.data().MobileNumber,
        userID: docSnap.data().userId,
      };

      await setDoc(doc(db, "admin", docSnap.data().userId), userdata);
      setLoading(false);
    }
  };

  return (
    <div className="text-slate-100 w-[95%] m-auto max-w-7xl  mt-20 px-2">
      {/*  */}

      <section className="flex items-center my-20">
        {/*  */}

        {options}

        <button className=" bg-gradient-to-r from-sky-600 to-indigo-900 rounded-lg  px-14 md:px-20 py-4 text-[1.5rem] text-slate-200 font-bold ml-5  md:ml-10" onClick={addAdmin}>
          {loading === true ? "Loading..." : "Submit"}
        </button>

        {/*  */}
      </section>

      <p className=" text-[1.5rem] md:text-[2rem] font-semibold tracking-wider md:tracking-wide font-serif italic text-slate-200 mt-10 ">Admins List :</p>

      <section className="flex w-[100%]  mt-10 items-center flex-col md:flex-row md:flex-wrap md:justify-between h-fit max-h-[80vh] overflow-y-scroll scrollbar-hide">
        {/*  */}

        {loading ? (
          <div className=" w-[100%] max-w-7xl flex items-center justify-center mt-10 m-auto">
            <Triangle color="#00BFFF" height={80} width={80} />
          </div>
        ) : admins.length > 1 ? (
          admins.map((datas) => {
            return <Adminslist key={datas.id} name={datas.data().name} email={datas.data().email} UID={datas.data().userID} phone={datas.data().phone} />;
          })
        ) : (
          <div className=" text-slate-100 w-[100%] ">
            <p className=" w-[100%] text-center mt-20  text-slate-400 font-semibold font-serif italic text-[1.5rem] tracking-wider ">Admins list is empty 🙂</p>
          </div>
        )}

        {/*  */}
      </section>
    </div>
  );
}

export default Adminsadd;
