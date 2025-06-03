"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OuraSleepDashboard from '@/components/OuraSleepDashboard';
import OuraSleepDashboardGPT from '@/components/OuraSleepDashboardGPT';
import OuraSleepDashboardClaude from '@/components/OuraSleepDashboardClaude';
import OuraSleepDashboardGemini from '@/components/OuraSleepDashboardGemini';
import OuraSleepDashboardO3 from '@/components/OuraSleepDashboardO3';
import OuraSleepDashboardO3Mini from '@/components/OuraSleepDashboardO3Mini';
import OuraSleepDashboardO3Low from '@/components/OuraSleepDashboardO3Low';
import OuraSleepDashboardO3Medium from '@/components/OuraSleepDashboardO3Medium';
import OuraSleepDashboardO3High from '@/components/OuraSleepDashboardO3High';
import OuraSleepDashboardVercel from '@/components/OuraSleepDashboardVercel';

interface DashboardSelectorProps {
  sleepData: any[];
  dataSource: 'live' | 'sample';
}

export default function DashboardSelector({ sleepData, dataSource }: DashboardSelectorProps) {
  const [selectedOpenAIModel, setSelectedOpenAIModel] = useState('gpt-4.1');

  const openAIModels = [
    { value: 'gpt-4.1', label: 'GPT-4.1', component: OuraSleepDashboardGPT },
    { value: 'o3', label: 'O3', component: OuraSleepDashboardO3 },
    { value: 'o3-mini', label: 'O3 Mini', component: OuraSleepDashboardO3Mini },
    { value: 'o3-low', label: 'O3 Low', component: OuraSleepDashboardO3Low },
    { value: 'o3-medium', label: 'O3 Medium', component: OuraSleepDashboardO3Medium },
    { value: 'o3-high', label: 'O3 High', component: OuraSleepDashboardO3High },
  ];

  const SelectedOpenAIComponent = openAIModels.find(model => model.value === selectedOpenAIModel)?.component || OuraSleepDashboardGPT;

  const getDataSourceInfo = () => {
    if (dataSource === 'live') {
      return {
        label: '🟢 Live Data',
        description: 'Current data from Oura API',
        className: 'bg-green-100 text-green-800 border-green-200'
      };
    } else {
      return {
        label: '🟡 Sample Data',
        description: 'Sample data from May 23-29, 2025',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    }
  };

  const dataInfo = getDataSourceInfo();

  return (
    <>
      <div className={`w-full px-4 py-2 text-center text-sm font-medium ${dataInfo.className} border-b`}>
        <span>{dataInfo.label}</span>
        <span className="text-xs opacity-75 ml-2">({dataInfo.description})</span>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="vercel" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vercel">Vercel</TabsTrigger>
          <TabsTrigger value="claude">Claude</TabsTrigger>
          <TabsTrigger value="gemini">Gemini</TabsTrigger>
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vercel" className="mt-6">
          <OuraSleepDashboardVercel sleepData={sleepData} />
        </TabsContent>
        
        <TabsContent value="claude" className="mt-6">
          <OuraSleepDashboardClaude sleepData={sleepData} />
        </TabsContent>
        
        <TabsContent value="gemini" className="mt-6">
          <OuraSleepDashboardGemini sleepData={sleepData} />
        </TabsContent>
        
        <TabsContent value="openai" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label htmlFor="openai-model" className="text-sm font-medium">
                OpenAI Model:
              </label>
              <Select value={selectedOpenAIModel} onValueChange={setSelectedOpenAIModel}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select OpenAI model" />
                </SelectTrigger>
                <SelectContent>
                  {openAIModels.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <SelectedOpenAIComponent sleepData={sleepData} />
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </>
  );
}