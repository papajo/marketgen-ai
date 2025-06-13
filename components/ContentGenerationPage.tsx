
import React, { useState } from 'react';
import {
  IconDocumentText, IconPhoto, IconVideoCamera, IconGift, IconChevronRight, IconSparkles, IconBolt, IconLightBulb,
  IconMegaphone, IconEnvelope, IconAtSymbol, IconGlobeAlt, PROMPT_SUGGESTIONS, RECENT_PROJECTS_DEMO,
  IconAdjustmentsHorizontal, IconBarsArrowDown, IconHandThumbUp, IconEllipsisVertical
} from '../constants';
import { MarketingCopyType, GeneratedItem, ContentCreationType, GeneratedTextItem, GeneratedImageItem } from '../types';

const ContentGenerationPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedCreationType, setSelectedCreationType] = useState<ContentCreationType>(ContentCreationType.Copy);
  const [selectedMarketingCopyType, setSelectedMarketingCopyType] = useState<MarketingCopyType | null>(MarketingCopyType.AdCopy);
  const [generatedItems, setGeneratedItems] = useState<GeneratedItem[]>([]); // To store generated content
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateContent = async () => {
    if (!prompt) {
      alert('Please enter a description for what you want to create.');
      return;
    }
    setIsLoading(true);
    // Placeholder for API call
    console.log('Generating content for:', prompt, selectedCreationType, selectedMarketingCopyType);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let newItem: GeneratedItem;

    if (selectedCreationType === ContentCreationType.Image) {
      newItem = {
        id: Date.now().toString(),
        type: 'Generated Image',
        imageUrl: `https://picsum.photos/seed/${Date.now().toString()}/400/300`, // Placeholder image
        prompt: prompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      } as GeneratedImageItem;
    } else {
      newItem = {
        id: Date.now().toString(),
        type: selectedMarketingCopyType || 'Generated Text',
        content: `This is a generated ${selectedMarketingCopyType || 'text result'} for: "${prompt}". \n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      } as GeneratedTextItem;
    }
    
    setGeneratedItems(prev => [newItem, ...prev]);
    setIsLoading(false);
  };
  
  const contentTypes = [
    { id: ContentCreationType.Copy, label: 'Marketing Copy', icon: IconDocumentText, color: 'text-blue-500', description: 'Generate ads, emails, social posts' },
    { id: ContentCreationType.Image, label: 'Images', icon: IconPhoto, color: 'text-purple-500', description: 'Create stunning visuals' },
    { id: ContentCreationType.Video, label: 'Videos', icon: IconVideoCamera, color: 'text-green-500', description: 'Produce engaging video (soon)' },
    { id: ContentCreationType.GIF, label: 'GIFs', icon: IconGift, color: 'text-red-500', description: 'Make fun animated GIFs (soon)' },
  ];

  const marketingCopyOptions = [
    { type: MarketingCopyType.AdCopy, icon: IconMegaphone, color: 'text-blue-500' },
    { type: MarketingCopyType.Email, icon: IconEnvelope, color: 'text-purple-500' },
    { type: MarketingCopyType.SocialPost, icon: IconAtSymbol, color: 'text-sky-500' },
    { type: MarketingCopyType.Website, icon: IconGlobeAlt, color: 'text-green-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Type Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-slate-800 mb-5">Create New Content</h2>
          <div className="space-y-3">
            {contentTypes.map(ct => (
              <button
                key={ct.id}
                onClick={() => {
                  setSelectedCreationType(ct.id);
                  if (ct.id !== ContentCreationType.Copy) {
                    setSelectedMarketingCopyType(null);
                  } else if (!selectedMarketingCopyType) {
                    setSelectedMarketingCopyType(MarketingCopyType.AdCopy);
                  }
                }}
                className={`w-full flex items-center justify-between p-4 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                                ${selectedCreationType === ct.id ? 'border-indigo-500 ring-2 ring-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-indigo-50'}`}
                aria-pressed={selectedCreationType === ct.id}
              >
                <span className="flex items-center">
                  <ct.icon className={`w-5 h-5 mr-3 ${ct.color}`} />
                  <span className="font-medium text-sm text-slate-700">{ct.label}</span>
                </span>
                <IconChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Recent Projects</h3>
            <div className="space-y-1">
              {RECENT_PROJECTS_DEMO.map(project => (
                <a key={project.id} href="#" className="flex items-center p-2 text-sm text-slate-600 rounded hover:bg-slate-100 transition-colors">
                  <span className="truncate">{project.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Content Generator */}
        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">
              Generate {contentTypes.find(ct => ct.id === selectedCreationType)?.label || 'Content'}
            </h2>
            {/* Action buttons (History, Templates) can be added here */}
          </div>

          <div className="mb-6">
            <label htmlFor="prompt-input" className="block text-sm font-medium text-slate-700 mb-1">
              Describe what you want to create
            </label>
            <div className="relative">
              <textarea
                id="prompt-input"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 transition-all text-sm"
                rows={4}
                placeholder={
                  selectedCreationType === ContentCreationType.Image 
                  ? "e.g., A futuristic cityscape at sunset, neon lights, flying cars..."
                  : "e.g., Facebook ad for new eco-friendly water bottles targeting millennials..."
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                aria-label="Prompt for content generation"
              />
              <button 
                title="Generate with AI"
                aria-label="Generate with AI"
                className="absolute bottom-3 right-3 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                onClick={handleGenerateContent}
                disabled={isLoading}
              >
                <IconSparkles className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {selectedCreationType === ContentCreationType.Copy && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Select content type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {marketingCopyOptions.map(opt => (
                  <button
                    key={opt.type}
                    onClick={() => setSelectedMarketingCopyType(opt.type)}
                    className={`border p-3 rounded-lg text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1
                                  ${selectedMarketingCopyType === opt.type ? 'border-indigo-500 ring-2 ring-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-indigo-50'}`}
                    aria-pressed={selectedMarketingCopyType === opt.type}
                  >
                    <opt.icon className={`w-5 h-5 mb-1 mx-auto ${opt.color}`} />
                    <div className="text-xs font-medium text-slate-700">{opt.type}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleGenerateContent}
            disabled={isLoading || !prompt}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center space-x-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            aria-label="Generate content button"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <IconBolt className="w-5 h-5" />
                <span>Generate Content</span>
              </>
            )}
          </button>

          {PROMPT_SUGGESTIONS.length > 0 && (
            <div className="mt-8 border-t border-slate-200 pt-6">
              <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
                <IconLightBulb className="w-5 h-5 text-yellow-500 mr-2" />
                Prompt Suggestions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROMPT_SUGGESTIONS.slice(0, 2).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(suggestion)}
                    className="p-3 bg-slate-50 rounded-lg hover:bg-indigo-50 cursor-pointer transition-all border border-transparent hover:border-indigo-200 text-left w-full"
                    aria-label={`Use prompt suggestion: ${suggestion}`}
                  >
                    <p className="text-xs text-slate-600">{suggestion}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Generated Content Display */}
      {generatedItems.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Generated Results</h2>
            {/* Filter/Sort buttons can be added here */}
          </div>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {generatedItems.map((item) => (
              <div key={item.id} className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-all bg-slate-50/50 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-medium">{item.type}</span>
                  <div className="flex space-x-2">
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors" title="Like" aria-label="Like this item">
                      <IconHandThumbUp className="w-4 h-4" />
                    </button>
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors" title="More options" aria-label="More options for this item">
                      <IconEllipsisVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex-grow">
                  {(item as GeneratedTextItem).content !== undefined ? (
                    <p className="text-sm text-slate-700 mb-3 whitespace-pre-wrap">
                      {(item as GeneratedTextItem).content}
                    </p>
                  ) : (item as GeneratedImageItem).imageUrl !== undefined ? (
                    <div className="mb-3">
                      <img 
                        src={(item as GeneratedImageItem).imageUrl} 
                        alt={(item as GeneratedImageItem).prompt || 'Generated image'} 
                        className="rounded-lg max-w-full h-auto shadow-md object-contain max-h-64 mx-auto" 
                      />
                      <p className="text-xs text-slate-500 mt-2 italic">Prompt: {(item as GeneratedImageItem).prompt}</p>
                    </div>
                  ) : null}
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 mt-auto pt-2">
                  <span>Generated: {item.timestamp}</span>
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium" aria-label="Use this generated item">Use this</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentGenerationPage;