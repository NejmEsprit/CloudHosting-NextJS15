import { getSingleArticleById } from "@/apicalls/articleArticleCall";
import { verifyTokenForPage } from "@/utils/verifyToken";
import { Article } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import EditArticleForm from "./EditArticleForm";

interface EditArticlePageProps {
  params: { id: string };
}

const EdtiArticlePage = async ({ params }: EditArticlePageProps) => {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("jwtToken")?.value;
  if (!token) redirect("/");
  const payload = verifyTokenForPage(token);
  if (payload?.isAdmin === false) redirect("/");

  const article: Article = await getSingleArticleById(id);
  return (
    <section className="fix-height  flex items-center justify-center px-5 lg:px-20">
      <div className="shadow p-4 bg-purple-200 rounded w-full">
        <h2 className="text-2xl text-green-700 font-semibold mb-4">
          Edit Article
        </h2>
        <EditArticleForm article={article} />
      </div>
    </section>
  );
};
export default EdtiArticlePage;