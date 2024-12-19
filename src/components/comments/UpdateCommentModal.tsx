"use client";

import { DOMAIN } from "@/utils/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, Dispatch, SetStateAction, FormEvent } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";
import { number } from "zod";
interface UpodateCommentModalProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  text: string;
  commentId: number;
}

const UpdateCommentModal = ({
  setOpen,
  text,
  commentId,
}: UpodateCommentModalProps) => {
  const [updateText, setUpdateText] = useState(text);
  const router = useRouter();
  const formSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (updateText === "") return toast.info("Please write something");
    try {
      await axios.put(`${DOMAIN}//api/comments/${commentId}`, {
        text: updateText,
      });
      router.refresh();
      setUpdateText("");
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data.message);
      console.log(error);
    }
  };
  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 z-10 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="lg:w-2/4 bg-white rounded-lg p-3 w-11/12">
        <div className="flex justify-end items-start mb-4">
          <IoMdCloseCircleOutline
            className="text-red-500 cursor-pointer text-3xl"
            onClick={() => setOpen(false)}
          />
        </div>
        <form onSubmit={formSubmitHandler}>
          <input
            type="text"
            placeholder="Edit Comment ..."
            className="text-xl rounded-lg p-2 w-full bg-white mb-2"
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-700 w-full text-white mt-2 p-1 text-xl rounded-lg hover:bg-green-900 transition"
          >
            Edit
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCommentModal;
