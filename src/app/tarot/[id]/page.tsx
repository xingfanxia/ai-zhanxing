"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInterface } from "@/components/chat/ChatInterface";

interface TarotCard {
  name: string;
  position: string;
  reversed: boolean;
  meaning: string;
  keywords: string[];
}

interface ReadingData {
  id: string;
  question?: string;
  spreadType: string;
  cards: TarotCard[];
  interpretation?: string;
}

export default function TarotResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [readingData, setReadingData] = useState<ReadingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInterpretationLoading, setIsInterpretationLoading] = useState(false);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReadingData = async () => {
      try {
        const response = await fetch(`/api/tarot/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error("Reading not found");
        }
        const data = await response.json();
        setReadingData(data);
        if (data.interpretation) {
          setInterpretation(data.interpretation);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reading");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReadingData();
  }, [resolvedParams.id]);

  const handleGetInterpretation = async () => {
    setIsInterpretationLoading(true);
    try {
      const response = await fetch(`/api/tarot/${resolvedParams.id}/interpret`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to get interpretation");
      }
      const data = await response.json();
      setInterpretation(data.interpretation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get interpretation");
    } finally {
      setIsInterpretationLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-pink-950/20 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
      </div>
    );
  }

  if (error || !readingData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-pink-950/20 to-slate-950 py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-red-400 mb-4">{error || "Reading not found"}</p>
          <Link href="/tarot">
            <Button variant="mystical-outline">Draw New Cards</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getSpreadLabel = (type: string) => {
    switch (type) {
      case "single":
        return "Single Card";
      case "three-card":
        return "Three Card Spread";
      case "celtic-cross":
        return "Celtic Cross";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-pink-950/20 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back button */}
          <Link
            href="/tarot"
            className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Reading
          </Link>

          {/* Reading Info */}
          <Card className="bg-slate-900/50 border-pink-500/20 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-pink-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {getSpreadLabel(readingData.spreadType)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {readingData.question && (
                <p className="text-slate-300 italic">
                  &ldquo;{readingData.question}&rdquo;
                </p>
              )}
            </CardContent>
          </Card>

          {/* Cards Display */}
          <div className={`grid gap-6 mb-6 ${
            readingData.cards.length === 1
              ? "grid-cols-1 max-w-sm mx-auto"
              : readingData.cards.length <= 3
              ? "grid-cols-1 md:grid-cols-3"
              : "grid-cols-2 md:grid-cols-5"
          }`}>
            {readingData.cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <TarotCardDisplay card={card} />
              </motion.div>
            ))}
          </div>

          {/* Card Meanings */}
          <Card className="bg-slate-900/50 border-pink-500/20 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-pink-300">Card Meanings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {readingData.cards.map((card, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-pink-300">
                      {card.name}
                      {card.reversed && (
                        <span className="ml-2 text-xs text-slate-400">(Reversed)</span>
                      )}
                    </h3>
                    <span className="text-xs text-slate-500">{card.position}</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">{card.meaning}</p>
                  <div className="flex flex-wrap gap-2">
                    {card.keywords.map((keyword, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Interpretation */}
          <Card className="bg-slate-900/50 border-pink-500/20 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-pink-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Interpretation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {interpretation ? (
                <div className="prose prose-invert prose-pink max-w-none">
                  <p className="text-slate-300 whitespace-pre-wrap">{interpretation}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-400 mb-4">
                    Get a personalized AI interpretation of your tarot reading
                  </p>
                  <Button
                    variant="mystical"
                    className="from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                    onClick={handleGetInterpretation}
                    disabled={isInterpretationLoading}
                  >
                    {isInterpretationLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Interpreting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get AI Interpretation
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="bg-slate-900/50 border-pink-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-pink-300">
                Ask Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChatInterface
                endpoint="/api/chat"
                contextId={resolvedParams.id}
                contextType="tarot"
                initialContext={interpretation || undefined}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function TarotCardDisplay({ card }: { card: TarotCard }) {
  return (
    <div className="aspect-[2/3] rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-pink-500/30 shadow-lg shadow-pink-500/10 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative border */}
      <div className="absolute inset-2 border border-pink-500/20 rounded-lg pointer-events-none" />

      {/* Reversed indicator */}
      {card.reversed && (
        <div className="absolute top-2 right-2">
          <RotateCcw className="w-4 h-4 text-pink-400" />
        </div>
      )}

      {/* Card content */}
      <div className="text-center z-10">
        <Sparkles className="w-8 h-8 text-pink-400 mx-auto mb-3" />
        <h3 className={`font-semibold text-slate-200 ${card.reversed ? "rotate-180" : ""}`}>
          {card.name}
        </h3>
        <p className="text-xs text-slate-500 mt-2">{card.position}</p>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500" />
      </div>
    </div>
  );
}
