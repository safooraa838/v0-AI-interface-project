"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

export default function AIResearchInterface() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const processInput = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    setOutput("")

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate response")
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const text = decoder.decode(value)
          setOutput((prev) => prev + text)
        }
      }
    } catch (error) {
      console.error("Error:", error)
      setOutput("An error occurred while processing your request.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="w-full max-w-3xl space-y-8">
        <h1 className="text-3xl font-bold text-center">AI Research Interface</h1>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Input</h2>
          <Textarea
            placeholder="Enter your prompt here..."
            className="min-h-[150px] mb-4"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={processInput} disabled={isLoading || !input.trim()} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Generate Response"
            )}
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Output</h2>
          <div className="bg-muted p-4 rounded-md min-h-[150px] whitespace-pre-wrap">
            {output || "Response will appear here..."}
          </div>
        </Card>
      </div>
    </main>
  )
}
