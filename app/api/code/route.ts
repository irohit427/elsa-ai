import { MAX_FREE_COUNTS } from "@/constants";
import { getApiLimitCount, incrementApiLimit } from "@/lib/apiLimit";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const instructionMessage = {
  role: "system",
  content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations."
};

export async function POST(
  req: Request
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
      model: "gpt-4",
      messages: [instructionMessage, ...messages]
    });

    await incrementApiLimit();
    
    return NextResponse.json(response.choices[0].message);
  } catch (err) {
    console.log('[CODE_ERROR]', err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}