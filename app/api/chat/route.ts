import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getOpenAIClient() {
  console.log("API KEY:", process.env.OPENAI_API_KEY);
  console.log("API EXISTS:", !!process.env.OPENAI_API_KEY);

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.log("❌ API KEY NOT FOUND");
    return null;
  }

  console.log("✅ API KEY FOUND");

  return new OpenAI({ apiKey });
}

type ChatRequestBody = {
  message?: unknown;
  stream?: unknown;
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      return jsonError("OpenAI API key is not configured.", 500);
    }

    let body: ChatRequestBody;

    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON body.", 400);
    }

    const message = body.message;
    const stream = body.stream === true;

    if (typeof message !== "string" || !message.trim()) {
      return jsonError("A non-empty string 'message' is required.", 400);
    }

    if (message.length > 4000) {
      return jsonError("Message exceeds maximum length of 4000 characters.", 400);
    }

    const messages = [
      {
        role: "system" as const,
        content:
          "You are Nexora AI, a premium AI assistant for modern businesses. Be concise, helpful, and professional.",
      },
      { role: "user" as const, content: message.trim() },
    ];

    if (stream) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 1024,
      });

      const encoder = new TextEncoder();

      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of completion) {
              const text = chunk.choices[0]?.delta?.content;
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content?.trim();

    if (!reply) {
      return jsonError("No response generated.", 502);
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[/api/chat]", error);

    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        return jsonError("Invalid OpenAI API key.", 500);
      }
      if (error.status === 429) {
        return jsonError("Rate limit exceeded. Please try again shortly.", 429);
      }
      return jsonError("OpenAI service error. Please try again.", 502);
    }

    return jsonError("An unexpected error occurred.", 500);
  }
}
