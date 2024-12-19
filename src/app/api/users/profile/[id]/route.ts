import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/utils/verifyToken";
import { UpdateUserDto } from "@/utils/dtos";
import bcrypt from "bcryptjs";
import { updateteUserSchema } from "@/utils/validationSchemas";

interface Props {
  params: { id: string };
}

/**
 * @method DELETE
 * @route http://localhost:3000/api/users/profile/:id
 * @desc Delete User
 * @access private (only user hemself can delete his account )
 */

export async function DELETE(request: NextRequest, { params }: Props) {
  const { id } = await params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { comments: true },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // const authToken = request.headers.get("Authorization") as string;

    const userFromToken = verifyToken(request);

    if (userFromToken !== null && userFromToken.id === user.id) {
      await prisma.user.delete({ where: { id: parseInt(params.id) } });
      return NextResponse.json(
        { message: "your account has benn deleted" },
        { status: 200 }
      );
    }
    const commentIds = user.comments.map((comment) => comment.id);
    await prisma.comment.deleteMany({ where: { id: { in: commentIds } } });
    return NextResponse.json(
      { message: " Only user hemself can delete his profile ,forbidden " },
      { status: 403 }
    );
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @method GET
 * @route http://localhost:3000/api/users/profile/:id
 * @desc Get Profile User
 * @access private (only user hemself can delete his account )
 */
export async function GET(request: NextRequest, { params }: Props) {
  const { id } = await params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        isAdmin: true,
      },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const userFromToken = verifyToken(request);
    if (userFromToken === null || userFromToken.id !== user.id) {
      return NextResponse.json(
        { message: "you are not allowed ,acces denied" },
        { status: 403 }
      );
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * @method PUT
 * @route http://localhost:3000/api/users/profile/:id
 * @desc Update Profile User
 * @access private (only user hemself can delete his account )
 */
export async function PUT(request: NextRequest, { params }: Props) {
  const { id } = await params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const userFromToken = verifyToken(request);
    if (userFromToken === null || userFromToken.id !== user.id) {
      return NextResponse.json(
        { message: "your are allowed ,acces denied" },
        { status: 403 }
      );
    }
    const body = (await request.json()) as UpdateUserDto;
    const validation = updateteUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      body.password = await bcrypt.hash(body.password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        username: body.username,
        email: body.email,
        password: body.password,
      },
    });

    const { password, ...other } = updatedUser;
    return NextResponse.json({ ...other }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
