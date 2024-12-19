import { DOMAIN } from "@/utils/constants";
import { SingleArticle } from "@/utils/types";
import { Article } from "@prisma/client";

export async function getArticles(pageNumber: string): Promise<Article[]> {
  const response = await fetch(
    `http://localhost:3000/api/articles?pageNumber=${pageNumber}`,
    { cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error("Failed to fecth articles");
  }
  return response.json();
}

export async function getArticlesCount(): Promise<number> {
  const response = await fetch("http://localhost:3000/api/articles/count", {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fecth articles");
  }

  const { count } = (await response.json()) as { count: number };
  // const { count } = (await response.json()) as { count: number };
  return count;
}

export async function getArticlesBasedOnSearch(
  searchText: string
): Promise<Article[]> {
  const response = await fetch(
    `http://localhost:3000/api/articles/search?searchText=${searchText}`,
    { cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error("Failed to fecth articles");
  }
  return response.json();
}

//Get Single article by id
export async function getSingleArticleById(
  articleId: string
): Promise<SingleArticle> {
  const response = await fetch(`${DOMAIN}/api/articles/${articleId}`);
  if (!response.ok) {
    throw new Error("Failed to fecth articles");
  }
  return response.json();
}
