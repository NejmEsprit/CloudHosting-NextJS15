import ArticlesItem from "@/components/articles/ArticlesItem";
import { Metadata } from "next";
import Link from "next/link";
import { it } from "node:test";
import React, { Suspense } from "react";
import SearchArticleInput from "./SearchArticleInput";
import Pagination from "./Pagination";
import { Article } from "@prisma/client";
import { getArticles, getArticlesCount,  } from "../../apicalls/articleArticleCall";
import { ArticlePerPage } from "@/utils/constants";

interface ArticlesPageProps {
  searchParams: { pageNumber: string };
}

const ArticlesPage = async ({ searchParams }: ArticlesPageProps) => {
  const { pageNumber } =await searchParams;

  const articles: Article[] = await getArticles(pageNumber);
  const count =await getArticlesCount();

 const pages = Math.ceil(count / ArticlePerPage);
  
  

  console.log(count)

  return (
    <section className=" fix-height container m-auto px-5">
      <SearchArticleInput />
      <div className="flex items-center justify-center flex-wrap gap-7 ">
        {articles.slice(0, 6).map((item) => (
          <ArticlesItem article={item} key={item.id} />
        ))}
      </div>
      <Pagination
        pages={pages}
        pageNumber={parseInt(pageNumber)}
        route="/articles"
      />
    </section>
  );
};

export default ArticlesPage;

export const metadata: Metadata = {
  title: "Articles Page",
  description: "This articles page",
};
