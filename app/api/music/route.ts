import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { prompt  } = body;
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }
    const response = await replicate.run(
      "pollinations/music-gen:9b8643c06debace10b9026f94dcb117f61dc1fee66558a09cde4cfbf51bcced6",
      {
        input: {
          text: prompt,
        }
      }
    );
    console.log(response);
    return NextResponse.json(response);
  } catch (err) {
    console.log('[MUSIC_ERROR]', err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}