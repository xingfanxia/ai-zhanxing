"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Star, AlertTriangle, Minus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

interface SynastryData {
  person1: {
    name: string;
    chart: {
      birthData: {
        date: string;
        time: string | null;
      };
      planets: Record<string, { sign: string; longitude: number }>;
      ascendant: { sign: string };
    };
  };
  person2: {
    name: string;
    chart: {
      birthData: {
        date: string;
        time: string | null;
      };
      planets: Record<string, { sign: string; longitude: number }>;
      ascendant: { sign: string };
    };
  };
  synastry: {
    aspects: Array<{
      planet1: string;
      planet2: string;
      type: string;
      orb: number;
      strength: number;
      category: string;
    }>;
    scores: {
      overall: number;
      emotional: number;
      romantic: number;
      physical: number;
      communication: number;
      growth: number;
      stability: number;
    };
    keyAspects: Array<{
      planet1: string;
      planet2: string;
      type: string;
      orb: number;
      strength: number;
      category: string;
    }>;
    summary: {
      totalAspects: number;
      harmonious: number;
      challenging: number;
      neutral: number;
    };
  };
}

export default function SynastryResultPage() {
  const t = useTranslations("Synastry");
  const tNav = useTranslations("Navigation");
  const tPlanets = useTranslations("Planets");
  const params = useParams();

  const [data, setData] = useState<SynastryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    const stored = sessionStorage.getItem(`synastry_${id}`);
    if (stored) {
      setData(JSON.parse(stored));
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-rose-950/20 to-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-rose-300">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-rose-950/20 to-slate-950 py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-slate-400">Reading not found</p>
          <Link href="/synastry" className="text-rose-400 hover:text-rose-300 mt-4 inline-block">
            Start a new reading
          </Link>
        </div>
      </div>
    );
  }

  const { synastry } = data;

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-400";
    if (score >= 50) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 70) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  const getAspectIcon = (type: string) => {
    const harmonious = ["Conjunction", "Trine", "Sextile"];
    const challenging = ["Opposition", "Square", "Quincunx"];
    if (harmonious.includes(type)) return <Star className="w-4 h-4 text-emerald-400" />;
    if (challenging.includes(type)) return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  const ScoreBar = ({ label, score }: { label: string; score: number }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-slate-400">{label}</span>
        <span className={getScoreColor(score)}>{score}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`h-full ${getScoreBarColor(score)} rounded-full`}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-rose-950/20 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/synastry" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {tNav("back")}
          </Link>

          {/* Header with names */}
          <Card className="bg-slate-900/50 border-rose-500/20 backdrop-blur-sm mb-8">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center mb-2 mx-auto">
                    <User className="w-8 h-8 text-pink-400" />
                  </div>
                  <p className="font-medium text-slate-200">{data.person1.name}</p>
                  <p className="text-sm text-slate-500">
                    Sun in {data.person1.chart.planets.Sun?.sign}
                  </p>
                </div>
                <Heart className="w-12 h-12 text-rose-400" />
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mb-2 mx-auto">
                    <User className="w-8 h-8 text-rose-400" />
                  </div>
                  <p className="font-medium text-slate-200">{data.person2.name}</p>
                  <p className="text-sm text-slate-500">
                    Sun in {data.person2.chart.planets.Sun?.sign}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overall Score */}
          <Card className="bg-slate-900/50 border-rose-500/20 backdrop-blur-sm mb-8">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl text-rose-300">
                {t("result.overallScore")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className={`text-7xl font-bold ${getScoreColor(synastry.scores.overall)}`}
              >
                {synastry.scores.overall}%
              </motion.div>
              <p className="text-slate-400 mt-2">
                {synastry.summary.harmonious} {t("result.harmonious")} · {synastry.summary.challenging} {t("result.challenging")}
              </p>
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          <Card className="bg-slate-900/50 border-rose-500/20 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-slate-200">Compatibility Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScoreBar label={t("result.emotional")} score={synastry.scores.emotional} />
              <ScoreBar label={t("result.romantic")} score={synastry.scores.romantic} />
              <ScoreBar label={t("result.physical")} score={synastry.scores.physical} />
              <ScoreBar label={t("result.communication")} score={synastry.scores.communication} />
              <ScoreBar label={t("result.growth")} score={synastry.scores.growth} />
              <ScoreBar label={t("result.stability")} score={synastry.scores.stability} />
            </CardContent>
          </Card>

          {/* Key Aspects */}
          <Card className="bg-slate-900/50 border-rose-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-200">
                {t("result.keyAspects")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {synastry.keyAspects.slice(0, 10).map((aspect, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3">
                      {getAspectIcon(aspect.type)}
                      <div>
                        <p className="text-slate-200">
                          {data.person1.name}'s {aspect.planet1} {aspect.type.toLowerCase()} {data.person2.name}'s {aspect.planet2}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">
                          {aspect.category} connection
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">
                        Orb: {aspect.orb.toFixed(1)}°
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* New Reading Button */}
          <div className="mt-8 text-center">
            <Link href="/synastry">
              <Button variant="outline" className="border-rose-500/50 text-rose-300 hover:bg-rose-500/10">
                <Heart className="w-4 h-4 mr-2" />
                Calculate Another Synastry
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
