import Replicate from "replicate";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { getApiLimitCount, incrementApiLimit } from "@/lib/apiLimit";
import { MAX_FREE_COUNTS } from "@/constants";
import { checkSubscription } from "@/lib/subscription";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

const model: `${string}/${string}:${string}` = process.env.VIDEO_GENERATION_MODEL as `${string}/${string}:${string}`;

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const apiLimitCount = await getApiLimitCount();
    const isPro = await checkSubscription();

    if (apiLimitCount === MAX_FREE_COUNTS) {
      return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
    }

    const body = await req.json();
    const { prompt  } = body;

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const response = await replicate.run(model,
      {
        input: {
          prompt,
        }
      }
    );

    if (!isPro) {
      await incrementApiLimit();
    }

    return NextResponse.json(response);
  } catch (error) {
    console.log('[VIDEO_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};