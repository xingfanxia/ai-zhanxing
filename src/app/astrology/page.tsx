"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, MapPin, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const houseSystems = [
  { value: "placidus", label: "Placidus (Default)" },
  { value: "koch", label: "Koch" },
  { value: "whole-sign", label: "Whole Sign" },
  { value: "equal", label: "Equal House" },
  { value: "campanus", label: "Campanus" },
  { value: "regiomontanus", label: "Regiomontanus" },
];

export default function AstrologyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    birthDate: "",
    birthTime: "",
    city: "",
    latitude: "",
    longitude: "",
    houseSystem: "placidus",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate required fields
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    if (!formData.birthDate || !formData.birthTime) {
      setError("Please enter both birth date and time");
      setIsLoading(false);
      return;
    }

    if (isNaN(lat) || isNaN(lng)) {
      setError("Please enter valid latitude and longitude coordinates");
      setIsLoading(false);
      return;
    }

    try {
      // Format data for API - API expects birthData wrapper
      const birthData = {
        date: formData.birthDate, // Already in YYYY-MM-DD from date input
        time: formData.birthTime, // Already in HH:MM from time input
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Use browser timezone
        latitude: lat,
        longitude: lng,
      };

      const response = await fetch("/api/astrology/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birthData,
          options: {
            houseSystem: formData.houseSystem.charAt(0).toUpperCase() + formData.houseSystem.slice(1),
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || data.error || "Failed to calculate chart");
      }

      const result = await response.json();

      // Store result in sessionStorage and navigate with temp ID
      const tempId = `temp_${Date.now()}`;
      const chartData = {
        ...result.data,
        birthData,
        city: formData.city,
        houseSystem: formData.houseSystem,
        createdAt: new Date().toISOString(),
      };
      sessionStorage.setItem(`astrology_reading_${tempId}`, JSON.stringify(chartData));

      router.push(`/astrology/${tempId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
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
          {/* Back button */}
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-purple-300">
                Calculate Your Natal Chart
              </CardTitle>
              <CardDescription className="text-slate-400">
                Enter your birth information to generate your astrological chart
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Birth Date */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-slate-200">
                    <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                    Birth Date
                  </label>
                  <Input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                </div>

                {/* Birth Time */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-slate-200">
                    <Clock className="w-4 h-4 mr-2 text-purple-400" />
                    Birth Time
                  </label>
                  <Input
                    type="time"
                    name="birthTime"
                    value={formData.birthTime}
                    onChange={handleInputChange}
                    required
                    className="bg-slate-800/50 border-slate-700 text-slate-100"
                  />
                  <p className="text-xs text-slate-500">
                    Enter your local birth time. If unknown, use 12:00.
                  </p>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <label className="flex items-center text-sm font-medium text-slate-200">
                    <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                    Birth Location
                  </label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City name (e.g., New York)"
                    className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="number"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        placeholder="Latitude (e.g., 40.7128)"
                        step="0.0001"
                        className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500"
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        placeholder="Longitude (e.g., -74.0060)"
                        step="0.0001"
                        className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    Enter city name or coordinates. Coordinates provide more accurate calculations.
                  </p>
                </div>

                {/* House System */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-slate-200">
                    <Settings className="w-4 h-4 mr-2 text-purple-400" />
                    House System
                  </label>
                  <select
                    name="houseSystem"
                    value={formData.houseSystem}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  >
                    {houseSystems.map((system) => (
                      <option key={system.value} value={system.value}>
                        {system.label}
                      </option>
                    ))}
                  </select>
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
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    "Calculate Chart"
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
