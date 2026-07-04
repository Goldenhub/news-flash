import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getArticle } from "@/lib/db";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
  }

  const { id } = await req.json();
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Missing article id" }, { status: 400 });
  }

  const article = getArticle(id);
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const content = [article.title, article.description, article.content].filter(Boolean).join("\n\n").slice(0, 8000);
  const prompt = `Summarize this news article in 2-6 concise paragraphs. Focus on key facts: who, what, when, where, why. Be objective and informative. Do't use en-dashes, em-dashes.\n\n${content}`;

  const client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const models = ["gemini-3.1-flash-lite", "gemini-2.5-flash", "gemini-2.5-flash-lite"];
  let lastErr = "";

  for (const model of models) {
    try {
      const res = await client.models.generateContent({
        model,
        contents: prompt,
        config: { maxOutputTokens: 512, temperature: 0.3 },
      });
      const summary = res.text || "";
      if (summary) return NextResponse.json({ summary });
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e);
      const isQuota = lastErr.includes("429") || lastErr.toLowerCase().includes("quota") || lastErr.toLowerCase().includes("rate limit");
      if (!isQuota) break;
    }
  }

  return NextResponse.json({ error: lastErr || "Summarization failed" }, { status: 502 });
}
