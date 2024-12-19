"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ButtonSpiner from "@/components/ButtonSpiner";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const formSumbithandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "") return toast.error("Email is required");
    if (password === "") return toast.error("Password is required");

    try {
      setLoading(true);
      await axios.post("http://localhost:3000/api/users/login", {
        email,
        password,
      });
      router.replace("/");
      setLoading(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data.message);
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <form onSubmit={formSumbithandler} className="flex flex-col">
      <input
        type="email"
        placeholder="Enter Youir Email"
        className="mb-4 border rounded p-2 text-xl"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter Youir Password"
        className="mb-4 border rounded p-2 text-xl"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
        className="text-2xl text-white bg-blue-800 p-2 rounded-lg font-bold"
        disabled={loading}
      >
        {loading ? <ButtonSpiner /> : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
