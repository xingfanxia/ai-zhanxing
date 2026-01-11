"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Loader2, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInterface } from "@/components/chat/ChatInterface";

interface Planet {
  name: string;
  sign: string;
  degree: number;
  house: number;
  retrograde?: boolean;
}

interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  orb: number;
}

interface ChartData {
  id: string;
  birthDate: string;
  birthTime: string;
  location: { city?: string; latitude?: number; longitude?: number };
  planets: Planet[];
  houses: { number: number; sign: string; degree: number }[];
  aspects: Aspect[];
  interpretation?: string;
}

export default function AstrologyResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInterpretationLoading, setIsInterpretationLoading] = useState(false);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch(`/api/astrology/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error("Chart not found");
        }
        const data = await response.json();
        setChartData(data);
        if (data.interpretation) {
          setInterpretation(data.interpretation);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chart");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [resolvedParams.id]);

  const handleGetInterpretation = async () => {
    setIsInterpretationLoading(true);
    try {
      const response = await fetch(`/api/astrology/${resolvedParams.id}/interpret`, {
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
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (error || !chartData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-red-400 mb-4">{error || "Chart not found"}</p>
          <Link href="/astrology">
            <Button variant="mystical-outline">Calculate New Chart</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back button */}
          <Link
            href="/astrology"
            className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Calculation
          </Link>

          {/* Birth Info Summary */}
          <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-purple-300 flex items-center gap-2">
                <Sun className="w-5 h-5" />
                Natal Chart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Date:</span>{" "}
                  <span className="text-slate-200">{chartData.birthDate}</span>
                </div>
                <div>
                  <span className="text-slate-400">Time:</span>{" "}
                  <span className="text-slate-200">{chartData.birthTime}</span>
                </div>
                <div>
                  <span className="text-slate-400">Location:</span>{" "}
                  <span className="text-slate-200">
                    {chartData.location.city ||
                      `${chartData.location.latitude}, ${chartData.location.longitude}`}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Planet Positions Table */}
          <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-purple-300 flex items-center gap-2">
                <Moon className="w-5 h-5" />
                Planet Positions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left py-2 text-slate-400 font-medium">Planet</th>
                      <th className="text-left py-2 text-slate-400 font-medium">Sign</th>
                      <th className="text-left py-2 text-slate-400 font-medium">Degree</th>
                      <th className="text-left py-2 text-slate-400 font-medium">House</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.planets.map((planet) => (
                      <tr key={planet.name} className="border-b border-slate-800/50">
                        <td className="py-2 text-slate-200">
                          {planet.name}
                          {planet.retrograde && (
                            <span className="ml-1 text-xs text-red-400">R</span>
                          )}
                        </td>
                        <td className="py-2 text-purple-300">{planet.sign}</td>
                        <td className="py-2 text-slate-300">{planet.degree.toFixed(2)}°</td>
                        <td className="py-2 text-slate-300">{planet.house}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Aspects */}
          <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-purple-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Aspects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {chartData.aspects.map((aspect, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm py-1 px-2 rounded bg-slate-800/30"
                  >
                    <span className="text-slate-200">{aspect.planet1}</span>
                    <span className="text-purple-400 font-medium">{aspect.type}</span>
                    <span className="text-slate-200">{aspect.planet2}</span>
                    <span className="text-slate-500 text-xs ml-auto">
                      {aspect.orb.toFixed(1)}°
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Interpretation */}
          <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-purple-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Interpretation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {interpretation ? (
                <div className="prose prose-invert prose-purple max-w-none">
                  <p className="text-slate-300 whitespace-pre-wrap">{interpretation}</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-slate-400 mb-4">
                    Get a personalized AI interpretation of your natal chart
                  </p>
                  <Button
                    variant="mystical"
                    onClick={handleGetInterpretation}
                    disabled={isInterpretationLoading}
                  >
                    {isInterpretationLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
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
          <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-purple-300">
                Ask Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChatInterface
                endpoint="/api/chat"
                contextId={resolvedParams.id}
                contextType="astrology"
                initialContext={interpretation || undefined}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
