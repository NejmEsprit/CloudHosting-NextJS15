import prisma from "@/utils/db";
import { UpdateCommentDto } from "@/utils/dtos";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";
import { comment } from "postcss";

interface Props {
  params: {
    id: string;
  };
}
/**
 * @method PUT
 * @route http://localhost:3000/api/comments/:id
 * @desc Update Comment
 * @access private (only awner of the comment)
 */
export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });
    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }
    const user = verifyToken(request);
    if (user === null || user.id !== comment.userId) {
      return NextResponse.json(
        { message: "Only awner of the comment ,acces denied" },
        { status: 403 }
      );
    }
    const body = (await request.json()) as UpdateCommentDto;
    const updatedCommet = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { text: body.text },
    });
    return NextResponse.json(updatedCommet, { status: 200 });
  } catch (error) {
    NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
/**
 * @method DELETE
 * @route http://localhost:3000/api/comments/:id
 * @desc Delete Comment
 * @access private (only awner of the comment OR admin )
 */

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }
    const user = verifyToken(request);
    if (user === null) {
      return NextResponse.json(
        { message: "no token provided,acces denied" },
        { status: 401 }
      );
    }
    if (user.isAdmin || user.id === comment.userId) {
      await prisma.comment.delete({
        where: { id: parseInt(id) },
      });
      return NextResponse.json(
        { message: "comment has been deleted" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "only awner or admin can delet this comment" },
      { status: 403 }
    );
  } catch (error) {
    NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
