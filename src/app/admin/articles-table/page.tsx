import {
  getArticles,
  getArticlesCount,
} from "@/apicalls/articleArticleCall";
import Pagination from "@/app/articles/Pagination";
import { ArticlePerPage } from "@/utils/constants";
import { verifyTokenForPage } from "@/utils/verifyToken";
import { Article } from "@prisma/client";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import DeleteArticleButton from "./DeleteArticleButton";

interface AdminArticleTableProps {
  searchParams: { pageNumber: string };
}

const AdminArticlesTable = async ({
  searchParams: { pageNumber },
}: AdminArticleTableProps) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwtToken")?.value;
  if (!token) redirect("/");
  const payload = verifyTokenForPage(token);
  if (payload?.isAdmin === false) redirect("/");

  const articles: Article[] = await getArticles(pageNumber);
  const count: number = await getArticlesCount();
  const pages = Math.ceil(count / ArticlePerPage);
  return (
    <section className="p-5">
      <h1 className="mb-7 text-2xl font-semibold text-gray-700">Articles</h1>
      <table className="table w-full  text-left">
        <thead className="border-t-2 border-b-2 border-gray-500 lg:text-xl">
          <tr>
            <th className="p-1 lg:p-2">Title</th>
            <th className="hidden lg:inline-block">Created At</th>
            <th className="">Actions</th>
            <th className="hidden lg:inline-block"></th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id} className="border-b border-t border-gray-300 ">
              <td className="p-3 text-gray-700">{article.title}</td>
              <td className="hidden lg:inline-block text-gray-700 font-normal p-3">
                {new Date(article.createdAt).toDateString()}
              </td>
              <td className="p-3">
                <Link
                  href={`/admin/articles-table/edit/${article.id}`}
                  className="bg-green-600 text-white rounded-lg px-2 py-1 inline-block text-center mb-2 me-2 lg:me-3 hover:bg-green-800 transition"
                >
                  Edit
                </Link>
                <DeleteArticleButton articleId={article.id} />
              </td>
              <td className="hidden lg:inline-block p-3">
                <Link
                  href={`/articles/${article.id}`}
                  className="text-white bg-blue-600 rounded-lg p-2 hover:bg-blue-800"
                >
                  Read More
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        pageNumber={parseInt(pageNumber)}
        pages={pages}
        route="/admin/articles-table"
      />
    </section>
  );
};

export default AdminArticlesTable;
