"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { ProductWithRelatedData } from "@/app/types";
import { ProductCard } from "../front/product-card";
import { Card, CardContent, CardFooter } from "../ui/card";

export default function AskForm() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, startLoading] = useTransition();
  const [recommendations, setRecommendations] = useState<
    ProductWithRelatedData[] | null
  >(null);
  const [explanation, setExplanation] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRecommendations(null);
    setError("");
    setExplanation("");
    startLoading(async () => {
      try {
        const response = await fetch("/api/ask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        // Expect attributes, "recommendedProducts", "explanation"
        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.recommendedProducts);
          setExplanation(data.explanation);
        } else {
          const data = await response.json();
          setError(data.error);
        }
      } catch (error) {
        setError("An error occurred while getting recommendations.");
      }
    });
  };

  return (
    <>
      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        <div className="w-full flex flex-col gap-2">
          <Textarea
            className="min-h-32 p-4 text-base"
            placeholder="Example: I need to build a bookshelf for my living room. What materials should I get?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="gap-2 text-sm rounded-sm"
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Ask Silvie
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      <div className="flex flex-col gap-4 pt-4">
        {isLoading && (
          <Card className="bg-muted/50 rounded-sm shadow-none">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating recommendations...
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="w-full max-w-2xl p-4 text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}
        {explanation && recommendations && (
          <Card className="bg-muted/50 rounded-sm shadow-none">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-md font-bold mb-2">
                  Silvie&apos;s Answer:
                </h2>
                <p className="text-sm text-muted-foreground">{explanation}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recommendations.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
