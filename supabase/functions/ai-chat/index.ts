import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { message, context, mode } = await req.json();
    const apiKey = Deno.env.get("GROQ_API_KEY");
    if (!apiKey) throw new Error("GROQ_API_KEY not configured");

    let systemPrompt = "";

    if (mode === "customer-assistant") {
      systemPrompt = `You are a helpful shopping assistant for a Japanese e-commerce marketplace (similar to Rakuten Ichiba). 
You help customers find products, compare items, get recommendations, and answer questions about shipping, points, and deals.
Keep responses concise (2-3 sentences max), friendly, and in the context of Japanese online shopping.
If asked about specific products, use the product context provided.
You can respond in both English and Japanese depending on the user's language.
Available product categories: Electronics, Fashion, Food & Grocery, Home & Living, Beauty, Sports, Books, Toys & Kids.`;
    } else if (mode === "seller-description") {
      systemPrompt = `You are an expert e-commerce copywriter specializing in Japanese marketplace product listings.
Generate compelling, SEO-optimized product descriptions in English (with optional Japanese keywords).
Include: key features, benefits, target audience, and a call-to-action.
Keep it concise (3-5 sentences). Make it professional and conversion-focused.`;
    } else if (mode === "admin-insights") {
      systemPrompt = `You are a business intelligence analyst for a Japanese e-commerce platform.
Analyze the provided data and give actionable insights about sales trends, customer behavior, and inventory optimization.
Be data-driven, concise, and provide specific recommendations.
Format with bullet points when listing multiple insights.`;
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...(context ? [{ role: "user", content: `Context: ${context}` }] : []),
          { role: "user", content: message },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API error: ${response.status} ${errText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that request.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
