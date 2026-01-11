"use client";

import { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Loader2, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { NatalChartWheel } from "@/components/astrology";
import type {
  Planet as PlanetType,
  PlanetPosition,
  HouseCusps,
  Aspect as AspectTypeData,
  AspectType,
  ZodiacSign,
} from "@/lib/calculation/types";

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
  strength?: number;
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

// Map sign name to index for calculating absolute longitude
const SIGN_TO_INDEX: Record<string, number> = {
  Aries: 0, Taurus: 1, Gemini: 2, Cancer: 3,
  Leo: 4, Virgo: 5, Libra: 6, Scorpio: 7,
  Sagittarius: 8, Capricorn: 9, Aquarius: 10, Pisces: 11,
};

/**
 * Convert API planet data to chart wheel format
 */
function convertPlanetsForWheel(
  planets: Planet[]
): Record<string, PlanetPosition> {
  const result: Record<string, PlanetPosition> = {};

  planets.forEach((planet) => {
    const signIndex = SIGN_TO_INDEX[planet.sign] ?? 0;
    const longitude = signIndex * 30 + planet.degree;

    result[planet.name] = {
      planet: planet.name as PlanetType,
      longitude,
      latitude: 0,
      distance: 1,
      speed: 1,
      retrograde: planet.retrograde ?? false,
      sign: planet.sign as ZodiacSign,
      degreeInSign: planet.degree,
      minutes: 0,
      seconds: 0,
    };
  });

  return result;
}

/**
 * Convert API house data to chart wheel format
 */
function convertHousesForWheel(
  houses: { number: number; sign: string; degree: number }[]
): HouseCusps {
  const cusps = houses
    .sort((a, b) => a.number - b.number)
    .map((h) => {
      const signIndex = SIGN_TO_INDEX[h.sign] ?? 0;
      return signIndex * 30 + h.degree;
    });

  const ascendant = cusps[0] ?? 0;
  const midheaven = cusps[9] ?? 0;

  return {
    system: "Placidus",
    cusps,
    ascendant,
    midheaven,
    descendant: (ascendant + 180) % 360,
    ic: (midheaven + 180) % 360,
    vertex: 0,
  };
}

/**
 * Convert API aspect data to chart wheel format
 */
function convertAspectsForWheel(aspects: Aspect[]): AspectTypeData[] {
  return aspects.map((aspect) => ({
    planet1: aspect.planet1 as PlanetType,
    planet2: aspect.planet2 as PlanetType,
    type: aspect.type as AspectType,
    exactAngle: getAspectAngle(aspect.type),
    actualAngle: getAspectAngle(aspect.type) + aspect.orb,
    orb: aspect.orb,
    applying: true,
    strength: aspect.strength ?? Math.max(0, 1 - aspect.orb / 10),
  }));
}

function getAspectAngle(type: string): number {
  const angles: Record<string, number> = {
    Conjunction: 0, Opposition: 180, Trine: 120,
    Square: 90, Sextile: 60, Quincunx: 150,
    SemiSextile: 30, SemiSquare: 45, Sesquiquadrate: 135, Quintile: 72,
  };
  return angles[type] ?? 0;
}

/**
 * Chart wheel section with data conversion
 */
function ChartWheelSection({ chartData }: { chartData: ChartData }) {
  const wheelData = useMemo(() => {
    const planets = convertPlanetsForWheel(chartData.planets);
    const houses = convertHousesForWheel(chartData.houses);
    const aspects = convertAspectsForWheel(chartData.aspects);

    return { planets, houses, aspects, ascendant: houses.ascendant };
  }, [chartData]);

  return (
    <NatalChartWheel
      planets={wheelData.planets}
      houses={wheelData.houses}
      aspects={wheelData.aspects}
      ascendant={wheelData.ascendant}
      size={360}
    />
  );
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

          {/* Natal Chart Wheel Visualization */}
          <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-purple-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Chart Wheel
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ChartWheelSection chartData={chartData} />
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
