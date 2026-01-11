"use client";

import { useState, useEffect, use, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Loader2, Sun, Moon, Save, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { NatalChartWheel } from "@/components/astrology";
import { isValidUUID } from "@/lib/utils/validation";
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

function convertPlanetsForWheel(planets: Planet[]): Record<string, PlanetPosition> {
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

function convertAspectsForWheel(aspects: Aspect[]): AspectTypeData[] {
  const angles: Record<string, number> = {
    Conjunction: 0, Opposition: 180, Trine: 120,
    Square: 90, Sextile: 60, Quincunx: 150,
    SemiSextile: 30, SemiSquare: 45, Sesquiquadrate: 135, Quintile: 72,
  };
  return aspects.map((aspect) => ({
    planet1: aspect.planet1 as PlanetType,
    planet2: aspect.planet2 as PlanetType,
    type: aspect.type as AspectType,
    exactAngle: angles[aspect.type] ?? 0,
    actualAngle: (angles[aspect.type] ?? 0) + aspect.orb,
    orb: aspect.orb,
    applying: true,
    strength: aspect.strength ?? Math.max(0, 1 - aspect.orb / 10),
  }));
}

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
  const [isSaving, setIsSaving] = useState(false);
  const [savedReadingId, setSavedReadingId] = useState<string | null>(null);
  const [isFromDatabase, setIsFromDatabase] = useState(false);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // Check if ID is a UUID (database reading) or temp ID
        const isDbReading = isValidUUID(resolvedParams.id);
        setIsFromDatabase(isDbReading);

        if (isDbReading) {
          // Load from database
          const response = await fetch(`/api/astrology/readings/${resolvedParams.id}`);
          if (response.status === 401) {
            throw new Error("Please sign in to view this reading");
          }
          if (!response.ok) {
            throw new Error("Reading not found");
          }
          const { data } = await response.json();

          // Transform database format to chart format
          const inputData = data.input_data;
          const resultData = data.result_data;

          // Build chart data from stored format
          const transformedChart = transformDatabaseToChart(inputData, data.id);
          setChartData(transformedChart);
          setSavedReadingId(data.id);

          if (resultData?.interpretation) {
            setInterpretation(resultData.interpretation);
          }
        } else {
          // Load from temporary storage (existing flow)
          const response = await fetch(`/api/astrology/${resolvedParams.id}`);
          if (!response.ok) {
            throw new Error("Chart not found");
          }
          const data = await response.json();
          setChartData(data);
          if (data.interpretation) {
            setInterpretation(data.interpretation);
          }
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

  const handleSaveReading = async () => {
    if (!chartData || !interpretation) return;

    setIsSaving(true);
    try {
      const inputData = {
        chart: buildChartForStorage(chartData),
        birthInfo: {
          date: chartData.birthDate,
          time: chartData.birthTime,
          location: chartData.location.city || "",
          latitude: chartData.location.latitude || 0,
          longitude: chartData.location.longitude || 0,
        },
      };

      const resultData = { interpretation };

      if (savedReadingId) {
        // Update existing reading
        const response = await fetch(`/api/astrology/readings/${savedReadingId}`, {
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
        const response = await fetch("/api/astrology/readings", {
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
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/astrology"
              className="inline-flex items-center text-slate-400 hover:text-slate-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Calculation
            </Link>
            <Link
              href="/readings"
              className="inline-flex items-center text-slate-400 hover:text-slate-200"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              My Readings
            </Link>
          </div>

          {/* Birth Info Summary */}
          <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-purple-300 flex items-center gap-2">
                <Sun className="w-5 h-5" />
                Natal Chart
                {savedReadingId && (
                  <span className="text-xs bg-purple-500/20 px-2 py-1 rounded text-purple-300 ml-2">
                    Saved
                  </span>
                )}
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

          {/* Chart Wheel */}
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
                        <td className="py-2 text-slate-300">{planet.degree.toFixed(2)}</td>
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
                      {aspect.orb.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Interpretation */}
          <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm mb-6">
            <CardHeader>
              <CardTitle className="text-xl text-purple-300 flex items-center justify-between">
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
              <CardTitle className="text-xl text-purple-300">Ask Questions</CardTitle>
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

// Helper to transform database format to chart display format
function transformDatabaseToChart(inputData: Record<string, unknown>, id: string): ChartData {
  const birthInfo = inputData.birthInfo as { date?: string; time?: string; location?: string; latitude?: number; longitude?: number } | undefined;
  const chart = inputData.chart as Record<string, unknown> | undefined;

  // If chart data is stored directly
  if (chart?.planets) {
    const planets = chart.planets as Record<string, { sign: string; degreeInSign: number; retrograde?: boolean }>;
    const aspects = (chart.aspects || []) as Array<{ planet1: string; planet2: string; type: string; orb: number }>;
    const houses = chart.houses as { cusps?: number[] } | undefined;

    return {
      id,
      birthDate: birthInfo?.date || "",
      birthTime: birthInfo?.time || "",
      location: {
        city: birthInfo?.location,
        latitude: birthInfo?.latitude,
        longitude: birthInfo?.longitude,
      },
      planets: Object.entries(planets).map(([name, data], index) => ({
        name,
        sign: data.sign,
        degree: data.degreeInSign,
        house: calculateHouse(index, houses?.cusps),
        retrograde: data.retrograde,
      })),
      houses: (houses?.cusps || []).map((cusp, index) => ({
        number: index + 1,
        sign: getSignFromLongitude(cusp),
        degree: cusp % 30,
      })),
      aspects: aspects.map(a => ({
        planet1: a.planet1,
        planet2: a.planet2,
        type: a.type,
        orb: a.orb,
      })),
    };
  }

  // Fallback for minimal data
  return {
    id,
    birthDate: birthInfo?.date || "",
    birthTime: birthInfo?.time || "",
    location: {
      city: birthInfo?.location,
      latitude: birthInfo?.latitude,
      longitude: birthInfo?.longitude,
    },
    planets: [],
    houses: [],
    aspects: [],
  };
}

function buildChartForStorage(chartData: ChartData): Record<string, unknown> {
  const planets: Record<string, unknown> = {};
  chartData.planets.forEach(p => {
    planets[p.name] = {
      sign: p.sign,
      degreeInSign: p.degree,
      retrograde: p.retrograde,
    };
  });

  return {
    planets,
    aspects: chartData.aspects,
    houses: {
      cusps: chartData.houses.map(h => {
        const signIndex = SIGN_TO_INDEX[h.sign] ?? 0;
        return signIndex * 30 + h.degree;
      }),
    },
  };
}

function calculateHouse(planetIndex: number, cusps?: number[]): number {
  // Simplified - return 1-12 based on index
  return (planetIndex % 12) + 1;
}

function getSignFromLongitude(longitude: number): string {
  const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const signIndex = Math.floor((longitude % 360) / 30);
  return signs[signIndex] || "Aries";
}
