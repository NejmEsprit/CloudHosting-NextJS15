import prisma from "@/utils/db";
import { UpdateArticleDto } from "@/utils/dtos";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import { comment } from "postcss";
interface Props {
  params: { id: string };
}

/**
 * @method GET
 * @route http://localhost:3000/api/articles/:1
 * @desc Get Single Article By Id
 * @access public
 */
export async function GET(request: NextRequest, { params }: Props) {
  const { id } = await params;
  // console.log(params.id)
  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: {
        comments: {
          include: {
            user: {
              select: {
                username: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!article) {
      return NextResponse.json(
        { message: "Article Not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
/**
 * @method PUT
 * @route http://localhost:3000/api/articles/:1
 * @desc Update Single Article By Id
 * @access public
 */
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const user = verifyToken(request);
    if (user === null || user.isAdmin === false) {
      return NextResponse.json(
        { message: "Admin only can create Article,acces denied" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });
    if (!article) {
      return NextResponse.json(
        { message: "Article Not found" },
        { status: 404 }
      );
    }

    const body = (await request.json()) as UpdateArticleDto;
    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        description: body.description,
      },
    });
    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
/**
 * @method DELETE
 * @route http://localhost:3000/api/articles/:1
 * @desc Update Single Article By Id
 * @access public
 */
export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: { comments: true },
    });
    if (!article) {
      return NextResponse.json(
        { message: "Article Not found" },
        { status: 404 }
      );
    }
    const user = verifyToken(request);
    if (user === null || user.isAdmin === false) {
      return NextResponse.json(
        { message: "Admin only can create Article,acces denied" },
        { status: 403 }
      );
    }

    await prisma.article.delete({
      where: { id: parseInt(id) },
    });
    const commentIds: number[] = article?.comments.map((comment) => comment.id);
    await prisma.comment.deleteMany({ where: { id: { in: commentIds } } });

    return NextResponse.json({ meassage: "article deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
