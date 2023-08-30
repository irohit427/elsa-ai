import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

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
    const body = await req.json();
    const { messages  } = body;
    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }
    const response = await openai.chat.completions.create({
      messages,
      model: 'gpt-4'
    });
    
    return NextResponse.json(response.choices[0].message);
  } catch (err) {
    console.log('[CONVERSATION_ERROR]', err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}