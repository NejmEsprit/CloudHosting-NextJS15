"use client";
import { DOMAIN } from "@/utils/constants";
import { Article } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface EditArticleFormProps {
  article: Article;
}
const EditArticleForm = ({ article }: EditArticleFormProps) => {
  const [title, setTiltle] = useState(article.title);
  const [description, setDescription] = useState(article.description);
  const router = useRouter();

  const formSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title === "") return toast.error("Title is required");
    if (description === "") return toast.error("Description is required");
    try {
      await axios.put(`${DOMAIN}/api/articles/${article.id}`, {
        title,
        description,
      });

      toast.success(" article updated");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.response?.data.message);
      console.log(error);
    }
  };
  return (
    <form onSubmit={formSubmitHandler} className="flex flex-col">
      <input
        className="mb-4 border rounded p-2 text-xl"
        type="text"
        value={title}
        onChange={(e) => setTiltle(e.target.value)}
      />
      <textarea
        className="mb-4 p-2 lg:text-xl rounded resize-none"
        rows={5}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <button
        type="submit"
        className="text-2xl text-white bg-green-700 p-2 rounded-lg font-bold hover:bg-green-900"
      >
        Edit
      </button>
    </form>
  );
};

export default EditArticleForm;
