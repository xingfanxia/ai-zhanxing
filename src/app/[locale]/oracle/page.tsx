"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { TarotCard } from "@/components/tarot/TarotCard";

interface OracleResult {
  answer: 'yes' | 'no' | 'maybe';
  confidence: 'strong' | 'moderate' | 'uncertain';
  card: {
    number: number;
    name: { en: string; zh: string; ja: string };
    arcana: string;
    suit?: string;
    keywords: string[];
    upright: string;
    reversed: string;
    inherentYesNo: string;
  };
  reversed: boolean;
  explanation: { en: string; zh: string };
  question?: string;
  drawnAt: string;
}

export default function OraclePage() {
  const t = useTranslations("Oracle");
  const tNav = useTranslations("Navigation");
  const tCommon = useTranslations("Common");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<OracleResult | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleAskOracle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);
    setIsRevealed(false);

    try {
      const response = await fetch("/api/tarot/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question || null,
          allow_reversed: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || data.error || "Failed to get oracle reading");
      }

      const data = await response.json();
      setResult(data.data);

      // Auto reveal after a delay
      setTimeout(() => setIsRevealed(true), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setIsRevealed(false);
    setQuestion("");
  };

  const getAnswerStyles = (answer: string) => {
    switch (answer) {
      case 'yes':
        return {
          bg: 'from-emerald-600 to-green-600',
          text: 'text-emerald-100',
          border: 'border-emerald-500/50',
          glow: 'shadow-emerald-500/30',
        };
      case 'no':
        return {
          bg: 'from-red-600 to-rose-600',
          text: 'text-red-100',
          border: 'border-red-500/50',
          glow: 'shadow-red-500/30',
        };
      case 'maybe':
      default:
        return {
          bg: 'from-amber-600 to-yellow-600',
          text: 'text-amber-100',
          border: 'border-amber-500/50',
          glow: 'shadow-amber-500/30',
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {tNav("backToHome")}
          </Link>

          {!result ? (
            <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-purple-300">
                  {t("title")}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {t("description")}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleAskOracle} className="space-y-8">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-slate-200">
                      <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                      {t("form.question")}
                    </label>
                    <Input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder={t("form.questionPlaceholder")}
                      className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500"
                    />
                    <p className="text-xs text-slate-500">
                      {t("form.questionDescription")}
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="mystical"
                    size="xl"
                    className="w-full from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t("buttons.consulting")}
                      </>
                    ) : (
                      t("buttons.ask")
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Question Display */}
              {result.question && (
                <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <p className="text-slate-400 text-sm mb-2">{t("result.yourQuestion")}</p>
                    <p className="text-xl text-slate-100 italic">"{result.question}"</p>
                  </CardContent>
                </Card>
              )}

              {/* Card Display */}
              <div className="flex justify-center">
                <div className="transform scale-125">
                  <TarotCard
                    name={result.card.name.en}
                    suit={result.card.suit}
                    reversed={result.reversed}
                    size="lg"
                    showBack={!isRevealed}
                    isFlipped={isRevealed}
                    onFlip={() => setIsRevealed(true)}
                  />
                </div>
              </div>

              {/* Answer Display */}
              <AnimatePresence>
                {isRevealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className={`bg-gradient-to-br ${getAnswerStyles(result.answer).bg} border ${getAnswerStyles(result.answer).border} shadow-lg ${getAnswerStyles(result.answer).glow}`}>
                      <CardContent className="p-8 text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                          className="mb-4"
                        >
                          <span className={`text-6xl font-bold ${getAnswerStyles(result.answer).text}`}>
                            {result.answer === 'yes' ? t("result.yes") :
                             result.answer === 'no' ? t("result.no") :
                             t("result.maybe")}
                          </span>
                        </motion.div>

                        <p className="text-white/80 text-sm mb-4">
                          {result.confidence === 'strong' ? t("result.strongConfidence") :
                           result.confidence === 'moderate' ? t("result.moderateConfidence") :
                           t("result.uncertainConfidence")}
                        </p>

                        <div className="mt-6 pt-6 border-t border-white/20">
                          <p className="text-sm text-white/70 mb-2">
                            {result.card.name.en} {result.reversed ? `(${t("result.reversed")})` : ''}
                          </p>
                          <p className="text-white/90">
                            {result.explanation.en}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              {isRevealed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex justify-center"
                >
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {t("buttons.askAnother")}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
