"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Loader2, Save, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { TarotCard as TarotCardComponent } from "@/components/tarot";
import { isValidUUID } from "@/lib/utils/validation";

interface TarotCardData {
  name: string;
  position: string;
  reversed: boolean;
  meaning: string;
  keywords: string[];
  suit?: string;
}

interface ReadingData {
  id: string;
  question?: string;
  spreadType: string;
  cards: TarotCardData[];
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
  const [isSaving, setIsSaving] = useState(false);
  const [savedReadingId, setSavedReadingId] = useState<string | null>(null);
  const [isFromDatabase, setIsFromDatabase] = useState(false);

  useEffect(() => {
    const fetchReadingData = async () => {
      try {
        const id = resolvedParams.id;

        // Check if ID is a UUID (database reading) or temp ID (sessionStorage)
        if (isValidUUID(id)) {
          // Load from database
          setIsFromDatabase(true);
          const response = await fetch(`/api/tarot/readings/${id}`);
          if (response.status === 401) {
            throw new Error("Please sign in to view this reading");
          }
          if (!response.ok) {
            throw new Error("Reading not found");
          }
          const { data } = await response.json();

          // Transform database format to reading format
          const transformedReading = transformDatabaseToReading(data);
          setReadingData(transformedReading);
          setSavedReadingId(data.id);

          if (data.result_data?.interpretation) {
            setInterpretation(data.result_data.interpretation);
          }
        } else if (id.startsWith("temp_")) {
          // Load from sessionStorage for temporary readings
          setIsFromDatabase(false);
          const storedData = sessionStorage.getItem(`tarot_reading_${id}`);

          if (!storedData) {
            throw new Error("Reading not found. It may have expired.");
          }

          const data = JSON.parse(storedData);

          // Transform sessionStorage format to reading format
          const transformedReading: ReadingData = {
            id: id,
            question: data.question || undefined,
            spreadType: data.spread?.id || data.spread_type || "unknown",
            cards: data.cards.map((card: { position: number; positionName: { en: string }; positionMeaning?: string; card: { name: { en: string }; keywords: string[]; upright: string; reversed: string; suit?: string }; reversed: boolean }) => ({
              name: card.card?.name?.en || "Unknown Card",
              position: card.positionName?.en || `Position ${card.position}`,
              reversed: card.reversed || false,
              meaning: card.reversed ? card.card?.reversed : card.card?.upright || "",
              keywords: card.card?.keywords || [],
              suit: card.card?.suit,
            })),
          };

          setReadingData(transformedReading);
        } else {
          throw new Error("Invalid reading ID");
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

  const handleSaveReading = async () => {
    if (!readingData || !interpretation) return;

    setIsSaving(true);
    try {
      const inputData = {
        spreadType: readingData.spreadType,
        question: readingData.question,
        cards: readingData.cards.map(card => ({
          name: card.name,
          position: card.position,
          reversed: card.reversed,
        })),
      };

      const resultData = {
        interpretation,
        cardMeanings: readingData.cards.map(card => ({
          name: card.name,
          meaning: card.meaning,
          keywords: card.keywords,
        })),
      };

      if (savedReadingId) {
        // Update existing reading
        const response = await fetch(`/api/tarot/readings/${savedReadingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inputData, resultData }),
        });

        if (response.status === 401) {
          throw new Error("Please sign in to update readings");
        }
        if (!response.ok) {
          throw new Error("Failed to update reading");
        }
      } else {
        // Create new reading
        const response = await fetch("/api/tarot/readings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inputData, resultData }),
        });

        if (response.status === 401) {
          throw new Error("Please sign in to save readings");
        }
        if (!response.ok) {
          throw new Error("Failed to save reading");
        }

        const { data } = await response.json();
        setSavedReadingId(data.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save reading");
    } finally {
      setIsSaving(false);
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
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/tarot"
              className="inline-flex items-center text-slate-400 hover:text-slate-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Reading
            </Link>
            <Link
              href="/readings"
              className="inline-flex items-center text-slate-400 hover:text-slate-200"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              My Readings
            </Link>
          </div>

          {/* Reading Info */}
          <Card className="bg-slate-900/50 border-pink-500/20 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-pink-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {getSpreadLabel(readingData.spreadType)}
                {savedReadingId && (
                  <span className="text-xs bg-pink-500/20 px-2 py-1 rounded text-pink-300 ml-2">
                    Saved
                  </span>
                )}
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
          <div className={`flex flex-wrap justify-center gap-6 mb-6 ${
            readingData.cards.length === 1
              ? "max-w-xs mx-auto"
              : ""
          }`}>
            {readingData.cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex flex-col items-center"
              >
                <TarotCardComponent
                  name={card.name}
                  suit={card.suit}
                  reversed={card.reversed}
                  size={readingData.cards.length <= 3 ? "lg" : "md"}
                  position={card.position}
                />
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
              <CardTitle className="text-xl text-pink-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI Interpretation
                </span>
                {interpretation && (
                  <Button
                    variant="mystical-outline"
                    size="sm"
                    onClick={handleSaveReading}
                    disabled={isSaving}
                    className="border-pink-500/30 hover:border-pink-500/50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : savedReadingId ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Update
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </>
                    )}
                  </Button>
                )}
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

// Helper to transform database format to reading display format
function transformDatabaseToReading(data: {
  id: string;
  input_data: Record<string, unknown>;
  result_data: Record<string, unknown>;
}): ReadingData {
  const inputData = data.input_data as {
    spreadType?: string;
    question?: string;
    cards?: Array<{ name: string; position: string; reversed: boolean; suit?: string }>;
  };
  const resultData = data.result_data as {
    cardMeanings?: Array<{ name: string; meaning: string; keywords: string[] }>;
  };

  const cards = inputData.cards || [];
  const cardMeanings = resultData.cardMeanings || [];

  return {
    id: data.id,
    spreadType: inputData.spreadType || "single",
    question: inputData.question,
    cards: cards.map((card, index) => {
      const meaning = cardMeanings[index] || { meaning: "", keywords: [] };
      return {
        name: card.name,
        position: card.position,
        reversed: card.reversed,
        meaning: meaning.meaning,
        keywords: meaning.keywords || [],
        suit: card.suit,
      };
    }),
  };
}
