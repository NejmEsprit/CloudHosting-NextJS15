import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * @method GeT
 * @route http://localhost:3000/api/users/logout
 * @desc Logout User
 * @access public
 */

export async function GET(request: NextRequest) {
  try {
    (await cookies()).delete("jwtToken");
    return NextResponse.json({ message: "logout" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
