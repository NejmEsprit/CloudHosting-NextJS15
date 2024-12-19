"use client";
import { DOMAIN } from "@/utils/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

const LogoutButton = () => {
  const router = useRouter();
  const logoutHandler = async () => {
    try {
      await axios.get(`${DOMAIN}/api/users/logout`);
      router.push("/");
      router.refresh()
    } catch (error) {
      toast.warning("Somthing went wrong");
      console.log(error);
    }
  };
  return (
    <div>
      <button
        onClick={logoutHandler}
        className="bg-gray-700 text-gray-200 px-1 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
