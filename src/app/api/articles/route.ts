import { CreateArticleDto } from "@/utils/dtos";
import { createarticleSchema } from "@/utils/validationSchemas";
import { NextRequest, NextResponse } from "next/server";
import { Article } from "@prisma/client";
import prisma from "@/utils/db";
import { ArticlePerPage } from "@/utils/constants";
import { verifyToken } from "@/utils/verifyToken";

/**
 * @method GET
 * @route http://localhost:3000/api/articles
 * @desc Get All Articles By Page Number
 * @access public
 */
export async function GET(request: NextRequest) {
  try {
    const pageNumber = request.nextUrl.searchParams.get("pageNumber") || "1";

    const articles = await prisma.article.findMany({
      skip: ArticlePerPage * (parseInt(pageNumber) - 1),
      take: ArticlePerPage,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @method POST
 * @route http://localhost:3000/api/articles
 * @desc Create New Article
 * @access private (only admin)
 */
export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (user === null || user.isAdmin === false) {
      return NextResponse.json(
        { message: "Admin only can create Article,acces denied" },
        { status: 403 }
      );
    }
    const body = (await request.json()) as CreateArticleDto; //body

    const validation = createarticleSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const newArticle: Article = await prisma.article.create({
      data: {
        title: body.title,
        description: body.description,
      },
    });
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
