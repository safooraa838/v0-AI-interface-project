import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt || typeof prompt !== "string") {
      return new Response("Invalid prompt", { status: 400 })
    }

    // Process with AI SDK
    const result = streamText({
      model: openai("gpt-4o"),
      messages: [{ role: "user", content: prompt }],
    })

    // Return streaming response
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in generate route:", error)
    return new Response("Error processing your request", { status: 500 })
  }
}
