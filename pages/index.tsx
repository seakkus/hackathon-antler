/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import WordCloud from "react-d3-cloud";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Loader2 } from "lucide-react";

// Mock function for API call - replace with actual API call in production
const analyzeEmails = async (emails: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock response
  return {
    wordCloudData: [
      { text: "meeting", value: 64 },
      { text: "project", value: 41 },
      { text: "deadline", value: 16 },
      // ... more words
    ],
    toneAnalysis: {
      dominant: "Professional",
      secondary: "Friendly",
      tertiary: "Urgent",
    },
  };
};

// Mock function for AI content generation - replace with actual API call in production
const generateContent = async (prompt: string, style: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock response
  return `Here's a generated response in the style of your emails: ${prompt}`;
};

const tones = ["dominant", "secondary", "tertiary"];

const toUpperCase = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const EmailAnalysisApp = () => {
  const [emails, setEmails] = useState("");
  const [wordCloudData, setWordCloudData] = useState<any>([]);
  const [toneAnalysis, setToneAnalysis] = useState<any>(null);
  const [prompt, setPrompt] = useState("");
  const [generatedResponse, setGeneratedResponse] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // request to api/prompt post endpoint
    const data: any = fetch("/api/prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setWordCloudData(data.data.wordCloudData);
        setToneAnalysis(data.data.toneAnalysis);

        setTimeout(() => {
          generateResponseEmail();
        }, 5000);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const generateResponseEmail = async () => {
    setIsGenerating(true);
    try {
      const data: any = fetch("/api/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          style: {
            commonWords: wordCloudData,
            toneAnalysis: toneAnalysis,
          },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setGeneratedResponse(data.response.response);
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          setIsGenerating(false);
        });
    } catch (error) {
      console.error("Error generating content:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2 p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg font-medium text-primary">
          Retrieving & analyzing emails...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="w-full grid grid-cols-2 gap-10 items-center">
        {wordCloudData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Popular Words</CardTitle>
            </CardHeader>
            <CardContent>
              <WordCloud height={300} width={600} data={wordCloudData} />
            </CardContent>
          </Card>
        )}

        {toneAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle>Your Tone Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {tones.map((tone: any) => (
                <div key={tone} className="flex items-center gap-2">
                  <strong>{toUpperCase(tone)} Tone:</strong>{" "}
                  <p style={{ color: toneAnalysis[tone].color }}>
                    {toneAnalysis[tone].value}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center justify-between">
              <span>Waiting for Email</span>
              {!generatedResponse && (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div dangerouslySetInnerHTML={{ __html: generatedResponse }} />
        </CardContent>
      </Card>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <EmailAnalysisApp />
    </div>
  );
}
