"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { CitySearch } from "@/components/CitySearch";

interface PersonData {
  name: string;
  date: string;
  time: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string;
}

const defaultPersonData: PersonData = {
  name: "",
  date: "",
  time: "12:00",
  city: "",
  latitude: null,
  longitude: null,
  timezone: "",
};

export default function SynastryPage() {
  const router = useRouter();
  const t = useTranslations("Synastry");
  const tNav = useTranslations("Navigation");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [person1, setPerson1] = useState<PersonData>({ ...defaultPersonData });
  const [person2, setPerson2] = useState<PersonData>({ ...defaultPersonData });

  const handleCitySelect = (personNum: 1 | 2) => (result: {
    name: string;
    latitude: number;
    longitude: number;
    timezone?: string;
    country?: string;
    displayName?: string;
    source?: string;
  }) => {
    const updateFn = personNum === 1 ? setPerson1 : setPerson2;
    updateFn(prev => ({
      ...prev,
      city: result.name + (result.country ? `, ${result.country}` : ''),
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone || 'UTC',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate
    if (!person1.date || !person1.latitude || !person2.date || !person2.latitude) {
      setError("Please fill in all required fields for both people");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/astrology/synastry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          person1: {
            name: person1.name || "Person 1",
            birthData: {
              date: person1.date,
              time: person1.time || null,
              latitude: person1.latitude,
              longitude: person1.longitude,
              timezone: person1.timezone,
            },
          },
          person2: {
            name: person2.name || "Person 2",
            birthData: {
              date: person2.date,
              time: person2.time || null,
              latitude: person2.latitude,
              longitude: person2.longitude,
              timezone: person2.timezone,
            },
          },
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || data.error || "Failed to calculate synastry");
      }

      const result = await response.json();

      // Store result in sessionStorage and navigate
      const tempId = `synastry_${Date.now()}`;
      sessionStorage.setItem(`synastry_${tempId}`, JSON.stringify(result.data));
      router.push(`/synastry/${tempId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const PersonForm = ({
    person,
    setPerson,
    personNum
  }: {
    person: PersonData;
    setPerson: React.Dispatch<React.SetStateAction<PersonData>>;
    personNum: 1 | 2;
  }) => (
    <div className="space-y-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-pink-400" />
        <h3 className="font-medium text-slate-200">
          {t(`form.person${personNum}`)}
        </h3>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-slate-400">{t("form.name")}</label>
        <Input
          type="text"
          value={person.name}
          onChange={(e) => setPerson(prev => ({ ...prev, name: e.target.value }))}
          placeholder={t("form.namePlaceholder")}
          className="bg-slate-800/50 border-slate-700 text-slate-100"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-slate-400">{t("form.birthDate")} *</label>
        <Input
          type="date"
          value={person.date}
          onChange={(e) => setPerson(prev => ({ ...prev, date: e.target.value }))}
          className="bg-slate-800/50 border-slate-700 text-slate-100"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-slate-400">{t("form.birthTime")}</label>
        <Input
          type="time"
          value={person.time}
          onChange={(e) => setPerson(prev => ({ ...prev, time: e.target.value }))}
          className="bg-slate-800/50 border-slate-700 text-slate-100"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-slate-400">{t("form.birthPlace")} *</label>
        <CitySearch
          value={person.city}
          onSelect={handleCitySelect(personNum)}
          placeholder="Search for a city..."
          className="bg-slate-800/50 border-slate-700 text-slate-100"
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
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {tNav("backToHome")}
          </Link>

          <Card className="bg-slate-900/50 border-rose-500/20 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-rose-300 flex items-center justify-center gap-2">
                <Heart className="w-8 h-8" />
                {t("title")}
              </CardTitle>
              <CardDescription className="text-slate-400">
                {t("description")}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <PersonForm
                    person={person1}
                    setPerson={setPerson1}
                    personNum={1}
                  />
                  <PersonForm
                    person={person2}
                    setPerson={setPerson2}
                    personNum={2}
                  />
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
                  className="w-full from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t("buttons.calculating")}
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 mr-2" />
                      {t("buttons.calculate")}
                    </>
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
