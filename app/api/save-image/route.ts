import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { addImage } from "@/lib/actions/image.actions";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newImage = await addImage({
      image: body,
      userId,
      path: "/profile",
    });

    return NextResponse.json({ success: true, data: newImage });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
