"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OuraSleepDashboardGemini from "./OuraSleepDashboardGemini";
import OuraSleepDashboardGPT from "./OuraSleepDashboardGPT";
import OuraSleepDashboardClaude from "./OuraSleepDashboardClaude";
import OuraSleepDashboardO3Mini from "./OuraSleepDashboardO3Mini";
import OuraSleepDashboardO3 from "./OuraSleepDashboardO3";
import OuraSleepDashboardO3Low from "./OuraSleepDashboardO3Low";
import OuraSleepDashboardO3Medium from "./OuraSleepDashboardO3Medium";
import OuraSleepDashboardO3High from "./OuraSleepDashboardO3High";
import { SleepData } from "@/data/sleepData";

interface OuraSleepDashboardProps {
  sleepData: SleepData[];
}

const OuraSleepDashboard = ({ sleepData }: OuraSleepDashboardProps) => {
  const [selectedModel, setSelectedModel] = useState("o3");

  const models = [
    { value: "gemini", label: "Gemini 2.5 Pro" },
    { value: "gpt", label: "GPT-4.1" },
    { value: "claude", label: "Claude Sonnet 4" },
    { value: "o3mini", label: "o3-mini-high" },
    { value: "o3", label: "o3" },
    { value: "o3low", label: "o3-low" },
    { value: "o3medium", label: "o3-medium" },
    { value: "o3high", label: "o3-high" },
  ];

  return (
    <div className="w-full">
      <Tabs
        value={selectedModel}
        onValueChange={setSelectedModel}
        className="w-full"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4">
          {/* Mobile dropdown */}
          <div className="md:hidden mb-4">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop tabs */}
          <TabsList className="hidden md:grid w-full max-w-6xl mx-auto grid-cols-8">
            <TabsTrigger value="gemini" className="text-sm">
              Gemini 2.5 Pro
            </TabsTrigger>
            <TabsTrigger value="gpt" className="text-sm">
              GPT-4.1
            </TabsTrigger>
            <TabsTrigger value="claude" className="text-sm">
              Claude Sonnet 4
            </TabsTrigger>
            <TabsTrigger value="o3mini" className="text-sm">
              o3-mini-high
            </TabsTrigger>
            <TabsTrigger value="o3" className="text-sm">
              o3
            </TabsTrigger>
            <TabsTrigger value="o3low" className="text-sm">
              o3-low
            </TabsTrigger>
            <TabsTrigger value="o3medium" className="text-sm">
              o3-medium
            </TabsTrigger>
            <TabsTrigger value="o3high" className="text-sm">
              o3-high
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="gemini" className="mt-6">
          <div className="max-w-7xl mx-auto px-4">
            <OuraSleepDashboardGemini sleepData={sleepData} />
          </div>
        </TabsContent>

        <TabsContent value="gpt" className="mt-6">
          <div className="max-w-7xl mx-auto px-4">
            <OuraSleepDashboardGPT sleepData={sleepData} />
          </div>
        </TabsContent>

        <TabsContent value="claude" className="mt-6">
          <div className="max-w-7xl mx-auto px-4">
            <OuraSleepDashboardClaude sleepData={sleepData} />
          </div>
        </TabsContent>

        <TabsContent value="o3mini" className="mt-6">
          <div className="max-w-7xl mx-auto px-4">
            <OuraSleepDashboardO3Mini sleepData={sleepData} />
          </div>
        </TabsContent>

        <TabsContent value="o3" className="mt-6">
          <div className="max-w-7xl mx-auto px-4">
            <OuraSleepDashboardO3 sleepData={sleepData} />
          </div>
        </TabsContent>

        <TabsContent value="o3low" className="mt-6">
          <div className="max-w-7xl mx-auto px-4">
            <OuraSleepDashboardO3Low sleepData={sleepData} />
          </div>
        </TabsContent>

        <TabsContent value="o3medium" className="mt-6">
          <div className="max-w-7xl mx-auto px-4">
            <OuraSleepDashboardO3Medium sleepData={sleepData} />
          </div>
        </TabsContent>

        <TabsContent value="o3high" className="mt-6">
          <div className="max-w-7xl mx-auto px-4">
            <OuraSleepDashboardO3High sleepData={sleepData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OuraSleepDashboard;

