
import React from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ActivitySquare, Brain, FileBarChart, MoveRight, VoiceNetwork, PencilRuler } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-blue-50 py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Early Detection of Parkinson's Disease
                </h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Our AI-powered platform analyzes your drawing, voice, and movements to help detect 
                  early signs of Parkinson's disease.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button variant="default" size="lg" asChild className="bg-parkinsons-600 hover:bg-parkinsons-700">
                  <Link to="/assessment">
                    Start Assessment
                    <MoveRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/resources">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[400px]">
                <div className="absolute -top-6 -left-6 h-64 w-64 rounded-full bg-blue-100 blur-3xl opacity-30" />
                <div className="absolute -bottom-6 -right-6 h-64 w-64 rounded-full bg-parkinsons-200 blur-3xl opacity-30" />
                <img
                  src="/placeholder.svg"
                  alt="Parkinson Detection"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                  width={500}
                  height={310}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group relative overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-parkinsons-100 text-parkinsons-600 mb-4">
                <PencilRuler className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Spiral Drawing Analysis</h3>
              <p className="text-sm text-gray-500 mt-2">
                Upload spiral drawings to analyze fine motor control and detect tremors and coordination issues.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-parkinsons-100 text-parkinsons-600 mb-4">
                <VoiceNetwork className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Voice Pattern Recognition</h3>
              <p className="text-sm text-gray-500 mt-2">
                Record your voice to detect subtle changes in speech patterns that may indicate Parkinson's disease.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-parkinsons-100 text-parkinsons-600 mb-4">
                <ActivitySquare className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">Posture Assessment</h3>
              <p className="text-sm text-gray-500 mt-2">
                Upload images to analyze posture and movement patterns for signs of Parkinson's disease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Our platform uses AI to analyze multiple data points for early detection
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 md:gap-12">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-parkinsons-600 text-white">
                1
              </div>
              <h3 className="text-xl font-bold">Upload Data</h3>
              <p className="text-sm text-gray-500">
                Upload spiral drawings, record voice samples, and provide movement images.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-parkinsons-600 text-white">
                2
              </div>
              <h3 className="text-xl font-bold">AI Analysis</h3>
              <p className="text-sm text-gray-500">
                Our algorithms analyze your data for patterns associated with Parkinson's disease.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-parkinsons-600 text-white">
                3
              </div>
              <h3 className="text-xl font-bold">Get Results</h3>
              <p className="text-sm text-gray-500">
                Receive an assessment report with insights and recommendations.
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <Button variant="default" size="lg" asChild className="bg-parkinsons-600 hover:bg-parkinsons-700">
              <Link to="/assessment">Start Assessment Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="bg-white py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">About Parkinson's Disease</h2>
              <p className="text-gray-500">
                Parkinson's disease is a neurodegenerative disorder that affects movement. Symptoms develop gradually, sometimes starting with a barely noticeable tremor in just one hand.
              </p>
              <ul className="space-y-2 text-gray-500">
                <li className="flex items-center">
                  <Brain className="mr-2 h-4 w-4 text-parkinsons-600" /> Tremor
                </li>
                <li className="flex items-center">
                  <Brain className="mr-2 h-4 w-4 text-parkinsons-600" /> Bradykinesia (slowed movement)
                </li>
                <li className="flex items-center">
                  <Brain className="mr-2 h-4 w-4 text-parkinsons-600" /> Rigid muscles
                </li>
                <li className="flex items-center">
                  <Brain className="mr-2 h-4 w-4 text-parkinsons-600" /> Impaired posture and balance
                </li>
                <li className="flex items-center">
                  <Brain className="mr-2 h-4 w-4 text-parkinsons-600" /> Loss of automatic movements
                </li>
              </ul>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button variant="outline" asChild>
                  <Link to="/resources">Learn More About Parkinson's</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto max-w-md overflow-hidden rounded-lg bg-gray-100">
              <div className="p-8">
                <FileBarChart className="h-12 w-12 text-parkinsons-600 mb-4" />
                <h3 className="text-2xl font-bold">Why Early Detection Matters</h3>
                <p className="text-gray-500 mt-2">
                  Early detection of Parkinson's disease can significantly improve treatment outcomes. Our platform helps identify potential signs before they become severe.
                </p>
                <ul className="mt-4 space-y-2 text-gray-500">
                  <li className="flex items-center">
                    <ActivitySquare className="mr-2 h-4 w-4 text-parkinsons-600" /> Earlier intervention
                  </li>
                  <li className="flex items-center">
                    <ActivitySquare className="mr-2 h-4 w-4 text-parkinsons-600" /> Better symptom management
                  </li>
                  <li className="flex items-center">
                    <ActivitySquare className="mr-2 h-4 w-4 text-parkinsons-600" /> Improved quality of life
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-parkinsons-600 py-16">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
            Take the First Step Today
          </h2>
          <p className="mx-auto max-w-[700px] text-white/80 md:text-xl/relaxed mt-4">
            Start your assessment now and take control of your health with our AI-powered Parkinson's detection platform.
          </p>
          <div className="mt-8">
            <Button size="lg" variant="default" asChild className="bg-white text-parkinsons-800 hover:bg-gray-100">
              <Link to="/assessment">Begin Assessment</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
