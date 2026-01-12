"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

const spreadTypeKeys = [
  { value: "single", key: "single", cards: 1 },
  { value: "three_card", key: "threeCard", cards: 3 },
  { value: "celtic_cross", key: "celticCross", cards: 10 },
];

export default function TarotPage() {
  const router = useRouter();
  const t = useTranslations("Tarot");
  const tNav = useTranslations("Navigation");
  const tSpreads = useTranslations("Spreads");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [question, setQuestion] = useState("");
  const [selectedSpread, setSelectedSpread] = useState("three_card");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tarot/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question || null,
          spread_type: selectedSpread,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || data.error || "Failed to draw cards");
      }

      const result = await response.json();

      // Generate a temporary ID and store reading data in sessionStorage
      const tempId = `temp_${Date.now()}`;
      const readingData = {
        ...result.data,
        question: question || null,
        spread_type: selectedSpread,
        createdAt: new Date().toISOString(),
      };
      sessionStorage.setItem(`tarot_reading_${tempId}`, JSON.stringify(readingData));

      router.push(`/tarot/${tempId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-pink-950/20 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back button */}
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {tNav("backToHome")}
          </Link>

          <Card className="bg-slate-900/50 border-pink-500/20 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-pink-300">
                {t("title")}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {t("description")}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Question Input */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-slate-200">
                    <Sparkles className="w-4 h-4 mr-2 text-pink-400" />
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

                {/* Spread Type Selection */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-slate-200">
                    {t("form.spread")}
                  </label>
                  <div className="grid gap-4">
                    {spreadTypeKeys.map((spread) => (
                      <SpreadOption
                        key={spread.value}
                        spreadKey={spread.key}
                        cards={spread.cards}
                        isSelected={selectedSpread === spread.value}
                        onSelect={() => setSelectedSpread(spread.value)}
                        tSpreads={tSpreads}
                      />
                    ))}
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="mystical"
                  size="xl"
                  className="w-full from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t("buttons.drawing")}
                    </>
                  ) : (
                    t("buttons.draw")
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function SpreadOption({
  spreadKey,
  cards,
  isSelected,
  onSelect,
  tSpreads,
}: {
  spreadKey: string;
  cards: number;
  isSelected: boolean;
  onSelect: () => void;
  tSpreads: ReturnType<typeof useTranslations<"Spreads">>;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full p-4 rounded-lg border text-left transition-all ${
        isSelected
          ? "bg-pink-500/20 border-pink-500/50 ring-1 ring-pink-500/30"
          : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600/50"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`font-medium ${isSelected ? "text-pink-300" : "text-slate-200"}`}>
          {tSpreads(`${spreadKey}.name`)}
        </span>
        <span className="text-xs text-slate-500">
          {cards} {cards === 1 ? "card" : "cards"}
        </span>
      </div>
      <p className="text-sm text-slate-400">{tSpreads(`${spreadKey}.description`)}</p>
    </button>
  );
}
