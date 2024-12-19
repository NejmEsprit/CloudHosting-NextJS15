import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * @method GET
 * @route http://localhost:3000/api/articles/search?searchText=
 * @desc Get  Article By searchText
 * @access public
 */
export async function GET(request: NextRequest) {
  try {
    const serachText = request.nextUrl.searchParams.get("searchText");
    let articles;
    if (serachText) {
      articles = await prisma.article.findMany({
        where: {
          title: {
            contains: serachText,
            mode: "insensitive",
          },
        },
      });
    } else {
      articles = await prisma.article.findMany({ take: 6 });
    }
    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { messahe: "Internal server error" },
      { status: 500 }
    );
  }
}
