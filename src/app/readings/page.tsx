"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  Star,
  Moon,
  Trash2,
  Eye,
  Calendar,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Reading } from "@/lib/services/readings";

type FilterType = "all" | "astrology" | "tarot";

export default function ReadingsPage() {
  const router = useRouter();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReadings();
  }, []);

  const fetchReadings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch both astrology and tarot readings
      const [astrologyRes, tarotRes] = await Promise.all([
        fetch("/api/astrology/readings"),
        fetch("/api/tarot/readings"),
      ]);

      // Check for auth errors
      if (astrologyRes.status === 401 || tarotRes.status === 401) {
        setError("Please sign in to view your saved readings");
        setIsLoading(false);
        return;
      }

      const [astrologyData, tarotData] = await Promise.all([
        astrologyRes.json(),
        tarotRes.json(),
      ]);

      // Combine and sort by date
      const allReadings: Reading[] = [
        ...(astrologyData.data || []),
        ...(tarotData.data || []),
      ].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setReadings(allReadings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load readings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (reading: Reading) => {
    if (!confirm("Are you sure you want to delete this reading?")) {
      return;
    }

    setDeletingId(reading.id);

    try {
      const endpoint =
        reading.reading_type === "astrology"
          ? `/api/astrology/readings/${reading.id}`
          : `/api/tarot/readings/${reading.id}`;

      const response = await fetch(endpoint, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Failed to delete reading");
      }

      // Remove from local state
      setReadings((prev) => prev.filter((r) => r.id !== reading.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete reading");
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (reading: Reading) => {
    const path =
      reading.reading_type === "astrology"
        ? `/astrology/${reading.id}`
        : `/tarot/${reading.id}`;
    router.push(path);
  };

  const filteredReadings = readings.filter((reading) => {
    if (filter === "all") return true;
    return reading.reading_type === filter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getReadingTitle = (reading: Reading): string => {
    if (reading.title) return reading.title;

    if (reading.reading_type === "astrology") {
      const input = reading.input_data as { chart?: { planets?: { Sun?: { sign?: string }, Moon?: { sign?: string } } } };
      if (input.chart?.planets?.Sun?.sign && input.chart?.planets?.Moon?.sign) {
        return `${input.chart.planets.Sun.sign} Sun, ${input.chart.planets.Moon.sign} Moon`;
      }
      return "Natal Chart";
    }

    const tarotInput = reading.input_data as { spreadType?: string; question?: string };
    const spreadLabel = getSpreadLabel(tarotInput.spreadType || "");
    if (tarotInput.question) {
      return `${spreadLabel}: "${tarotInput.question.slice(0, 30)}${tarotInput.question.length > 30 ? "..." : ""}"`;
    }
    return spreadLabel;
  };

  const getSpreadLabel = (spreadType: string): string => {
    switch (spreadType) {
      case "single":
        return "Single Card";
      case "three-card":
        return "Three Card Spread";
      case "celtic-cross":
        return "Celtic Cross";
      default:
        return spreadType || "Tarot Reading";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950/20 to-slate-950 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <Card className="bg-slate-900/50 border-indigo-500/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-indigo-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Star className="w-6 h-6" />
                  My Saved Readings
                </span>
                <span className="text-sm text-slate-400 font-normal">
                  {filteredReadings.length} reading
                  {filteredReadings.length !== 1 ? "s" : ""}
                </span>
              </CardTitle>

              {/* Filter tabs */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant={filter === "all" ? "mystical" : "mystical-outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className="flex items-center gap-1"
                >
                  <Filter className="w-3 h-3" />
                  All
                </Button>
                <Button
                  variant={filter === "astrology" ? "mystical" : "mystical-outline"}
                  size="sm"
                  onClick={() => setFilter("astrology")}
                  className="flex items-center gap-1"
                >
                  <Star className="w-3 h-3" />
                  Astrology
                </Button>
                <Button
                  variant={filter === "tarot" ? "mystical" : "mystical-outline"}
                  size="sm"
                  onClick={() => setFilter("tarot")}
                  className="flex items-center gap-1"
                >
                  <Moon className="w-3 h-3" />
                  Tarot
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 mb-4">{error}</p>
                  <Link href="/auth/login">
                    <Button variant="mystical">Sign In</Button>
                  </Link>
                </div>
              ) : filteredReadings.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 mb-4">
                    {filter === "all"
                      ? "No saved readings yet. Start by creating an astrology chart or tarot reading!"
                      : `No ${filter} readings yet.`}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link href="/astrology">
                      <Button variant="mystical-outline">
                        <Star className="w-4 h-4 mr-2" />
                        Calculate Chart
                      </Button>
                    </Link>
                    <Link href="/tarot">
                      <Button variant="mystical-outline">
                        <Moon className="w-4 h-4 mr-2" />
                        Draw Cards
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReadings.map((reading, index) => (
                    <motion.div
                      key={reading.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div
                        className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                          reading.reading_type === "astrology"
                            ? "bg-purple-900/20 border-purple-500/20 hover:border-purple-500/40"
                            : "bg-pink-900/20 border-pink-500/20 hover:border-pink-500/40"
                        }`}
                        onClick={() => handleView(reading)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {reading.reading_type === "astrology" ? (
                                <Star className="w-4 h-4 text-purple-400 flex-shrink-0" />
                              ) : (
                                <Moon className="w-4 h-4 text-pink-400 flex-shrink-0" />
                              )}
                              <h3
                                className={`font-medium truncate ${
                                  reading.reading_type === "astrology"
                                    ? "text-purple-200"
                                    : "text-pink-200"
                                }`}
                              >
                                {getReadingTitle(reading)}
                              </h3>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Calendar className="w-3 h-3" />
                              {formatDate(reading.created_at)}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleView(reading);
                              }}
                              className="text-slate-400 hover:text-slate-200"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(reading);
                              }}
                              disabled={deletingId === reading.id}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              {deletingId === reading.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
