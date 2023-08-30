import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { incrementApiLimit, getApiLimitCount } from "@/lib/apiLimit";
import { MAX_FREE_COUNTS } from "@/constants";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  req: Request,
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const apiLimitCount = await getApiLimitCount();
    
    if (apiLimitCount === MAX_FREE_COUNTS) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    const body = await req.json();
    const { messages  } = body;
    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }
    const response = await openai.chat.completions.create({
      messages,
      model: 'gpt-4'
    });

    await incrementApiLimit();
    
    return NextResponse.json(response.choices[0].message);
  } catch (err) {
    console.log('[CONVERSATION_ERROR]', err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}