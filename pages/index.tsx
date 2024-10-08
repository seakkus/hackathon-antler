/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import WordCloud from "react-d3-cloud";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const EmailAnalysisApp = () => {
  const [emails, setEmails] = useState("");
  const [wordCloudData, setWordCloudData] = useState<any>([]);
  const [toneAnalysis, setToneAnalysis] = useState<any>(null);
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const result: any = await analyzeEmails(emails);
      setWordCloudData(result.wordCloudData);
      setToneAnalysis(result.toneAnalysis);
    } catch (error) {
      console.error("Error analyzing emails:", error);
    }
    setIsLoading(false);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const content = await generateContent(prompt, emails);
      setGeneratedContent(content);
    } catch (error) {
      console.error("Error generating content:", error);
    }
    setIsLoading(false);
  };

  const fontSizeMapper = (word: any) => Math.log2(word.value) * 10;
  const rotate = (word: any) => Math.random() * 90;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Email Analysis App</h1>

      <Card>
        <CardHeader>
          <CardTitle>Email Input</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste your emails here..."
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            className="w-full h-40"
          />
          <Button onClick={handleAnalyze} disabled={isLoading} className="mt-2">
            {isLoading ? "Analyzing..." : "Analyze Emails"}
          </Button>
        </CardContent>
      </Card>

      {wordCloudData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Word Cloud</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: "400px" }}>
              <WordCloud data={wordCloudData} />
            </div>
          </CardContent>
        </Card>
      )}

      {toneAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>Tone Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Dominant Tone:</strong> {toneAnalysis.dominant}
            </p>
            <p>
              <strong>Secondary Tone:</strong> {toneAnalysis.secondary}
            </p>
            <p>
              <strong>Tertiary Tone:</strong> {toneAnalysis.tertiary}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Generate Content in Your Style</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full mb-2"
          />
          <Button onClick={handleGenerate} disabled={isLoading || !emails}>
            {isLoading ? "Generating..." : "Generate Content"}
          </Button>
          {generatedContent && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h3 className="font-bold mb-2">Generated Content:</h3>
              <p>{generatedContent}</p>
            </div>
          )}
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
