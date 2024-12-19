import prisma from "@/utils/db";
import { NextResponse } from "next/server";

/**
 * @method GET
 * @route http://localhost:3000/api/articles/count
 * @desc Get Articles count
 * @access public
 */
export async function GET() {
  try {
    const count = await prisma.article.count();
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal sever error" },
      { status: 500 }
    );

  }
}
