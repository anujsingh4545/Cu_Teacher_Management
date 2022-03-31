import React from "react";
import { XIcon } from "@heroicons/react/solid";
import { useRecoilState } from "recoil";
import { ShowModal } from "../atom/ShowModal";

function Info() {
  const [modal, setModal] = useRecoilState(ShowModal);

  return (
    <>
      {modal && (
        <>
          <div
            className="fixed z-30 top-0 left-0 w-[100%] h-[100%] bg-[#ffffff80] blur-lg   "
            onClick={() => {
              setModal(false);
            }}
          ></div>

          {/*  */}
          <div className=" fixed z-50 top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] w-[90%] sm:w-[60%] max-w-5xl h-fit bg-black rounded-2xl shadow-lg shadow-black ">
            <XIcon
              className="absolute right-5 top-5 h-9 md:h-10 text-white cursor-pointer "
              onClick={() => {
                setModal(false);
              }}
            />
            <p className=" text-center text-[1.8rem] md:text-[2.4rem] font-serif font-semibold mt-5 text-orange-600 ">Information regarding website</p>

            <div className="w-[100%] h-[30rem]  overflow-y-scroll scrollbar-hide mt-3 mb-5 p-2  flex flex-col ">
              <section className="mb-3 w-[100%] px-5 md:px-10 ">
                <p className=" text-[1.5rem] md:text-[1.8rem] text-blue-500 font-serif font-semibold my-2 "> Home</p>

                <p className="text-[1.3rem]  font-medium text-slate-300">
                  It's accessible to admins only , else other participants aren't allowed to access this page. <br /> Talking about the content it basically shows which teacher is free at particular date and time , in the most efficent way possible !
                </p>
              </section>

              <section className="my-3 w-[100%] px-5 md:px-10 ">
                <p className=" text-[1.5rem] md:text-[1.8rem] text-blue-500 font-serif font-semibold my-2 "> Absentee</p>

                <p className="text-[1.3rem]  font-medium text-slate-300">
                  Accessible to both admins and participants out there . <br /> So whenever someone's taking a leave , replacement of that teacher is must to be created , that's where this section comes as a saver . <br /> Just select the date and time ., and you're gonna see all the replacements options , with all available suggestions , just select one and get your job done , the aim of this
                  section is to reduce the complexity of absentee , cheers !
                </p>
              </section>

              <section className="my-3 w-[100%] px-5 md:px-10 ">
                <p className=" text-[1.5rem] md:text-[1.8rem] text-blue-500 font-serif font-semibold my-2 "> Admin</p>

                <p className="text-[1.3rem]  font-medium text-slate-300">
                  Accessible to only admins out there . <br /> For managing everything around this website some administration need to be there , and that's how admin section comes in picture. <br /> Using this section you can accepts requests of participants or decline it, add admins, remove admins, add users & remove users !
                </p>
              </section>

              <section className="my-3 w-[100%] px-5 md:px-10 ">
                <p className=" text-[1.5rem] md:text-[1.8rem] text-blue-500 font-serif font-semibold my-2 "> About us</p>

                <p className="text-[1.3rem]  font-medium text-slate-300">
                  Accessible to both admins and participants out there . <br /> For knowing more about our website and devlopers , you can view " About us " page !
                </p>
              </section>
            </div>

            {/*  */}
          </div>
        </>
      )}
    </>
  );
}

export default Info;
