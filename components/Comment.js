import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import Comments from "./Comments";
import { ShieldCheckIcon } from "@heroicons/react/solid";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";

function Comment() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [toxic, setToxic] = useState(true);
  const [check, setCheck] = useState(false);
  const [comm, setComm] = useState([]);
  const threshold = 0.9;

  const { data: session } = useSession();

  const change = (e) => {
    setCheck(false);
    setText(e.target.value);
    setToxic(true);
  };

  const checkComment = async () => {
    setLoading(true);
    await toxicity.load(threshold).then((model) => {
      const sentences = [`${text}`];

      model.classify(sentences).then((predictions) => {
        if (predictions[6].results[0].match === true) {
          setToxic(true);
        } else {
          setToxic(false);
        }
        setCheck(true);
        setLoading(false);
      });
    });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, "comment"), orderBy("uploadTime", "desc")), (snapshot) => {
      setComm(snapshot.docs);
    });
    return unsubscribe;
  }, [db]);

  const submitComment = async (e) => {
    if (loading) return;
    setLoading(true);

    const userData = {
      username: session?.user?.username,
      email: session?.user?.email,
      comment: text,
      UID: session?.user?.uid,
      uploadTime: serverTimestamp(),
      image: session?.user?.image,
    };

    await addDoc(collection(db, "comment"), userData);

    setLoading(false);
    setCheck(false);
    setText("");
  };

  function info() {
    if (toxic === false) {
      return;
    } else {
      alert("Toxic comment not allowed ...!");
    }
  }

  return (
    <>
      <div className="m-auto mt-32 w-[100%] max-w-[90rem]  px-10 ">
        <p className="mb-10 text-[1.5rem] font-semibold text-slate-300 ">{comm.length} Comments</p>

        <section className="flex items-start">
          <img src={session?.user?.image} alt="" className="h-16 rounded-full" />
          <div className="ml-6 flex flex-1 flex-col  ">
            {}

            <section className="flex items-center border-b border-gray-700 ">
              {}

              <input type="text" value={text} onChange={change} placeholder="Add a comment . . ." className=" w-[100%] flex-1    bg-transparent p-2 text-[1.2rem] text-gray-400 outline-none" />

              {check && <ShieldCheckIcon onClick={info} className={toxic === false ? "mx-2 h-8 text-green-700 " : "mx-2 h-8 cursor-pointer text-red-700 "} />}

              {}
            </section>

            {text.length > 0 && (
              <section className="mt-3 flex items-center justify-end">
                <button
                  className="ml-5 rounded-lg bg-[#7c7c7c2b] px-10 py-2 text-slate-300 "
                  onClick={() => {
                    setText("");
                    setCheck(false);
                  }}
                >
                  Clear
                </button>

                {toxic === false ? (
                  <button type="submit" className="ml-5 rounded-lg bg-[#7c7c7c2b] px-10 py-2 text-slate-300" onClick={submitComment}>
                    {loading ? "Loading ..." : "Submit"}
                  </button>
                ) : (
                  <button type="submit" className="ml-5 rounded-lg bg-[#7c7c7c2b] px-10 py-2 text-slate-300" onClick={checkComment}>
                    {loading ? "Loading ..." : "Check"}
                  </button>
                )}
              </section>
            )}
          </div>
        </section>

        <div className="my-10 h-fit max-h-[30rem] w-[100%] overflow-y-scroll  scrollbar-hide sm:max-h-[30rem] ">
          {comm.map((comment) => (
            <Comments key={comment.id} id={comment.id} uid={comment.data().UID} username={comment.data().username} image={comment.data().image} time={comment.data().uploadTime} comment={comment.data().comment} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Comment;
