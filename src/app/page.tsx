"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Moon, Sun, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background stars effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-10 h-10 text-purple-400" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                AI 占星
              </h1>
              <Moon className="w-10 h-10 text-indigo-400" />
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
              Discover the wisdom of the stars and the mysteries of tarot through AI-powered insights.
              Explore your cosmic blueprint and divine guidance.
            </p>
          </motion.div>

          {/* Main Tabs */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Tabs defaultValue="astrology" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-14 bg-slate-900/50 border border-purple-500/20">
                <TabsTrigger
                  value="astrology"
                  className="text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white"
                >
                  <Sun className="w-5 h-5 mr-2" />
                  Astrology
                </TabsTrigger>
                <TabsTrigger
                  value="tarot"
                  className="text-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Tarot
                </TabsTrigger>
              </TabsList>

              <TabsContent value="astrology" className="mt-8">
                <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl text-purple-300">
                      Western Astrology
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-lg">
                      Calculate your natal chart and receive personalized AI interpretations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <FeatureItem
                        icon={<Sun className="w-6 h-6 text-yellow-400" />}
                        title="Natal Chart"
                        description="Calculate planet positions, houses, and aspects based on your birth data"
                      />
                      <FeatureItem
                        icon={<Moon className="w-6 h-6 text-blue-400" />}
                        title="AI Interpretation"
                        description="Get personalized readings powered by advanced AI understanding"
                      />
                      <FeatureItem
                        icon={<Sparkles className="w-6 h-6 text-purple-400" />}
                        title="Chat Follow-up"
                        description="Ask questions and dive deeper into your chart analysis"
                      />
                    </div>
                    <div className="text-center pt-4">
                      <Link href="/astrology">
                        <Button variant="mystical" size="xl">
                          Calculate Your Chart
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tarot" className="mt-8">
                <Card className="bg-slate-900/50 border-pink-500/20 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl text-pink-300">
                      Tarot Reading
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-lg">
                      Draw cards and receive intuitive AI-powered interpretations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <FeatureItem
                        icon={<Star className="w-6 h-6 text-pink-400" />}
                        title="Multiple Spreads"
                        description="Choose from Single Card, Three Card, or Celtic Cross spreads"
                      />
                      <FeatureItem
                        icon={<Sparkles className="w-6 h-6 text-yellow-400" />}
                        title="AI Guidance"
                        description="Receive detailed interpretations tailored to your question"
                      />
                      <FeatureItem
                        icon={<Moon className="w-6 h-6 text-indigo-400" />}
                        title="Deep Insights"
                        description="Explore card meanings and ask follow-up questions"
                      />
                    </div>
                    <div className="text-center pt-4">
                      <Link href="/tarot">
                        <Button variant="mystical" size="xl" className="from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                          Draw Your Cards
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  );
}
