import React, { useState, useEffect } from "react";
import {
  IconDocumentText,
  IconPhoto,
  IconVideoCamera,
  IconGift,
  IconChevronRight,
  IconSparkles,
  IconBolt,
  IconLightBulb,
  IconMegaphone,
  IconEnvelope,
  IconAtSymbol,
  IconGlobeAlt,
  PROMPT_SUGGESTIONS,
  RECENT_PROJECTS_DEMO,
  API_KEY_WARNING,
  GEMINI_TEXT_MODEL,
  IconAdjustmentsHorizontal,
  IconBarsArrowDown,
  IconHandThumbUp,
  IconEllipsisVertical,
  ENHANCED_MARKETING_COPY_OPTIONS,
  TONE_OPTIONS,
  AUDIENCE_OPTIONS,
  LENGTH_OPTIONS,
  INDUSTRY_TEMPLATES,
  CONTENT_ENHANCEMENT_OPTIONS,
} from "../constants";
import {
  MarketingCopyType,
  GeneratedItem,
  ContentCreationType,
  GeneratedTextItem,
  GeneratedImageItem,
  ToneStyle,
  TargetAudience,
  ContentLength,
  Industry,
  ContentGenerationOptions,
} from "../types";
import { contentStorage, ContentStats } from "../utils/localStorage";
// Using Hugging Face Inference API for free text generation
// No imports needed - will use fetch API directly

const ContentGenerationPage: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedCreationType, setSelectedCreationType] =
    useState<ContentCreationType>(ContentCreationType.Copy);
  const [selectedMarketingCopyType, setSelectedMarketingCopyType] =
    useState<MarketingCopyType | null>(MarketingCopyType.AdCopy);
  const [generatedItems, setGeneratedItems] = useState<GeneratedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [contentStats, setContentStats] = useState<ContentStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedTone, setSelectedTone] = useState<ToneStyle>(
    ToneStyle.Professional,
  );
  const [selectedAudience, setSelectedAudience] = useState<TargetAudience>(
    TargetAudience.B2C,
  );
  const [selectedLength, setSelectedLength] = useState<ContentLength>(
    ContentLength.Medium,
  );
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(
    null,
  );
  const [keywords, setKeywords] = useState<string>("");
  const [callToAction, setCTA] = useState<string>("");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Load saved content and stats on component mount
  useEffect(() => {
    console.log("✅ Free text generation ready using Hugging Face");

    // Load previously generated content from localStorage
    const savedContent = contentStorage.getAllContent();
    if (savedContent.length > 0) {
      setGeneratedItems(savedContent);
      console.log(`📁 Loaded ${savedContent.length} saved content items`);
    }

    // Load content statistics
    const stats = contentStorage.getStats();
    setContentStats(stats);
  }, []);

  const handleGenerateContent = async () => {
    if (!prompt.trim()) {
      setApiError("Please enter a description for what you want to create.");
      return;
    }

    setIsLoading(true);
    setApiError(null);
    let newItem: GeneratedItem | null = null;

    try {
      if (selectedCreationType === ContentCreationType.Image) {
        // Use Picsum Photos for image generation
        const seed = prompt.trim() || Date.now().toString();
        const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(seed)}/500/350`;

        // Simulate API call delay for UX consistency
        await new Promise((resolve) => setTimeout(resolve, 1000));

        newItem = {
          id: Date.now().toString(),
          type: "Generated Image",
          imageUrl: imageUrl,
          prompt: prompt,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        } as GeneratedImageItem;
      } else {
        // Text generation using Hugging Face (free!)
        const enhancedPrompt = buildEnhancedPrompt();

        try {
          const response = await fetch(
            "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                inputs: enhancedPrompt,
                parameters: {
                  max_new_tokens: getTokenCountForLength(),
                  temperature: getTempForTone(),
                  do_sample: true,
                },
              }),
            },
          );

          if (!response.ok) {
            // Try alternative free model if first one fails
            const altResponse = await fetch(
              "https://api-inference.huggingface.co/models/gpt2",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  inputs: enhancedPrompt,
                  parameters: {
                    max_length: getTokenCountForLength(),
                    temperature: getTempForTone(),
                  },
                }),
              },
            );

            if (!altResponse.ok) {
              throw new Error("Both AI models are temporarily unavailable");
            }

            const altResult = await altResponse.json();
            const generatedText = altResult[0]?.generated_text || "";

            if (!generatedText) {
              throw new Error("No text was generated");
            }

            newItem = {
              id: Date.now().toString(),
              type: selectedMarketingCopyType || "Generated Text",
              content:
                generatedText.replace(enhancedPrompt, "").trim() ||
                generateFallbackContent(),
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            } as GeneratedTextItem;
          } else {
            const result = await response.json();
            const generatedText =
              result.generated_text || result[0]?.generated_text || "";

            if (!generatedText) {
              throw new Error("No text was generated");
            }

            newItem = {
              id: Date.now().toString(),
              type: selectedMarketingCopyType || "Generated Text",
              content:
                generatedText.replace(enhancedPrompt, "").trim() ||
                generateFallbackContent(),
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            } as GeneratedTextItem;
          }
        } catch (fetchError) {
          console.warn("Hugging Face API failed, using fallback generation");
          // Fallback to enhanced template-based generation
          newItem = {
            id: Date.now().toString(),
            type: selectedMarketingCopyType || "Generated Text",
            content: generateFallbackContent(),
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          } as GeneratedTextItem;
        }
      }

      if (newItem) {
        setGeneratedItems((prev) => [newItem!, ...prev]);

        // Save to localStorage
        const saveSuccess = contentStorage.saveContent(newItem!);
        if (saveSuccess) {
          console.log("✅ Content saved to localStorage");
          // Update stats
          const updatedStats = contentStorage.getStats();
          setContentStats(updatedStats);
        } else {
          console.warn("⚠️ Failed to save content to localStorage");
        }

        setPrompt(""); // Clear prompt after successful generation
      }
    } catch (error) {
      console.error("Error generating content:", error);
      let errorMessage = "Failed to generate content. ";

      if (error instanceof Error) {
        if (error.message.includes("quota")) {
          errorMessage +=
            "Service temporarily unavailable. Please try again later.";
        } else if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          errorMessage +=
            "Network error. Please check your internet connection.";
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += "An unexpected error occurred.";
      }

      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const contentTypes = [
    {
      id: ContentCreationType.Copy,
      label: "Marketing Copy",
      icon: IconDocumentText,
      color: "text-blue-500",
      description: "Generate ads, emails, social posts",
    },
    {
      id: ContentCreationType.Image,
      label: "Images",
      icon: IconPhoto,
      color: "text-purple-500",
      description: "Create stunning visuals (free)",
    },
    {
      id: ContentCreationType.Video,
      label: "Videos",
      icon: IconVideoCamera,
      color: "text-green-500",
      description: "Produce engaging video (soon)",
    },
    {
      id: ContentCreationType.GIF,
      label: "GIFs",
      icon: IconGift,
      color: "text-red-500",
      description: "Make fun animated GIFs (soon)",
    },
  ];

  // Helper functions for enhanced generation
  const buildEnhancedPrompt = (): string => {
    let enhancedPrompt = `Create ${selectedMarketingCopyType?.toLowerCase()} content`;

    if (selectedTone) {
      enhancedPrompt += ` with a ${selectedTone.toLowerCase()} tone`;
    }

    if (selectedAudience) {
      enhancedPrompt += ` targeting ${selectedAudience}`;
    }

    if (selectedLength) {
      enhancedPrompt += ` in ${selectedLength.toLowerCase()} format`;
    }

    if (selectedIndustry) {
      const template = INDUSTRY_TEMPLATES[selectedIndustry];
      if (template) {
        enhancedPrompt += ` for the ${selectedIndustry.toLowerCase()} industry`;
      }
    }

    enhancedPrompt += ` for: "${prompt}"`;

    if (keywords.trim()) {
      enhancedPrompt += `. Include these keywords: ${keywords}`;
    }

    if (callToAction.trim()) {
      enhancedPrompt += `. Use this call-to-action: ${callToAction}`;
    }

    enhancedPrompt +=
      ". Make it engaging, professional, and marketing-focused.";

    return enhancedPrompt;
  };

  const getTokenCountForLength = (): number => {
    switch (selectedLength) {
      case ContentLength.Short:
        return 50;
      case ContentLength.Medium:
        return 150;
      case ContentLength.Long:
        return 300;
      case ContentLength.VeryLong:
        return 500;
      default:
        return 150;
    }
  };

  const getTempForTone = (): number => {
    switch (selectedTone) {
      case ToneStyle.Professional:
      case ToneStyle.Formal:
      case ToneStyle.Authoritative:
        return 0.6;
      case ToneStyle.Casual:
      case ToneStyle.Conversational:
      case ToneStyle.Playful:
        return 0.8;
      case ToneStyle.Urgent:
      case ToneStyle.Persuasive:
        return 0.7;
      default:
        return 0.7;
    }
  };

  const generateFallbackContent = (): string => {
    const industryTemplate = selectedIndustry
      ? INDUSTRY_TEMPLATES[selectedIndustry]
      : null;
    const industryKeywords = industryTemplate?.keywords || [];
    const industryPhrases = industryTemplate?.phrases || [];

    const allKeywords = keywords.trim()
      ? [...keywords.split(",").map((k) => k.trim()), ...industryKeywords]
      : industryKeywords;

    const templates = {
      [MarketingCopyType.AdCopy]: generateAdCopyTemplate(),
      [MarketingCopyType.Email]: generateEmailTemplate(),
      [MarketingCopyType.SocialPost]: generateSocialTemplate(),
      [MarketingCopyType.Website]: generateWebsiteTemplate(),
      [MarketingCopyType.BlogPost]: generateBlogTemplate(),
      [MarketingCopyType.ProductDescription]: generateProductTemplate(),
      [MarketingCopyType.Headlines]: generateHeadlinesTemplate(),
      [MarketingCopyType.PressRelease]: generatePressReleaseTemplate(),
    };

    return (
      templates[selectedMarketingCopyType as MarketingCopyType] ||
      generateGenericTemplate()
    );
  };

  const generateAdCopyTemplate = (): string => {
    const cta = callToAction || "Get Started Today!";
    return `🚀 Discover ${prompt}!

Transform your experience with our innovative solution. Perfect for ${selectedAudience?.toLowerCase() || "everyone"} who values quality and results.

✨ Key Benefits:
• Premium quality guaranteed
• Fast and reliable service
• Customer satisfaction focused
• Competitive pricing

${cta} 🎯`;
  };

  const generateEmailTemplate = (): string => {
    const subject = `Exciting News About ${prompt}`;
    const cta = callToAction || "Learn More";

    return `Subject: ${subject}

Hi there!

We're thrilled to share something special with you. Our latest ${prompt} is designed specifically for ${selectedAudience?.toLowerCase() || "our valued customers"}.

Here's what makes it special:
• Carefully crafted for your needs
• Backed by our quality promise
• Easy to get started

Ready to learn more? ${cta}

Best regards,
The Team`;
  };

  const generateSocialTemplate = (): string => {
    const hashtags = selectedIndustry
      ? `#${selectedIndustry.toLowerCase().replace(" ", "")}`
      : "#marketing";
    return `🌟 Just discovered ${prompt} and it's a game-changer!

Perfect for ${selectedAudience?.toLowerCase() || "anyone"} looking to enhance their experience. The quality is outstanding and the results speak for themselves.

Who else has tried this? Share your thoughts below! 👇

${hashtags} #innovation #quality`;
  };

  const generateWebsiteTemplate = (): string => {
    const cta = callToAction || "Get started today";
    return `Welcome to ${prompt}

Your go-to solution for exceptional results. We've designed this with ${selectedAudience?.toLowerCase() || "you"} in mind, focusing on quality, reliability, and satisfaction.

Why Choose Us?
• Expert team with proven results
• Customer-first approach
• Competitive pricing
• 24/7 support

${cta} and see the difference for yourself.`;
  };

  const generateBlogTemplate = (): string => {
    return `# ${prompt}: A Comprehensive Guide

${selectedAudience === TargetAudience.B2B ? "In today's competitive business landscape" : "In our ever-evolving world"}, understanding ${prompt} has become more important than ever.

## Why ${prompt} Matters

This innovative solution addresses the key challenges faced by ${selectedAudience?.toLowerCase() || "modern consumers"}. With its unique approach, it delivers results that matter.

## Key Benefits

• Enhanced efficiency and performance
• User-friendly design and interface
• Proven track record of success
• Scalable solution for growth

## Conclusion

${prompt} represents the future of ${selectedIndustry?.toLowerCase() || "innovation"}. ${callToAction || "Take the next step and explore what it can do for you."}`;
  };

  const generateProductTemplate = (): string => {
    return `${prompt}

Discover the perfect solution designed specifically for ${selectedAudience?.toLowerCase() || "discerning customers"}. This premium offering combines quality, functionality, and style.

**Key Features:**
• Premium materials and construction
• Intuitive design and usability
• Reliable performance you can trust
• Exceptional value for your investment

**Perfect For:**
${selectedAudience === TargetAudience.B2B ? "Business professionals and teams" : "Individuals and families"} seeking quality and reliability.

${callToAction || "Order now and experience the difference."}`;
  };

  const generateHeadlinesTemplate = (): string => {
    return `${prompt}: The Future is Here

🔥 ${prompt} - Revolutionary Solution for ${selectedAudience || "Everyone"}

✨ Discover ${prompt}: Your Gateway to Success

🚀 ${prompt} - Transforming ${selectedIndustry || "Industries"} Worldwide

💡 The Ultimate Guide to ${prompt}

⭐ ${prompt}: Quality You Can Trust`;
  };

  const generatePressReleaseTemplate = (): string => {
    const today = new Date().toLocaleDateString();
    return `FOR IMMEDIATE RELEASE

${prompt} Launches Revolutionary Solution for ${selectedIndustry || "Market"}

[City, ${today}] - Today marks a significant milestone in ${selectedIndustry?.toLowerCase() || "innovation"} with the launch of ${prompt}, a groundbreaking solution designed for ${selectedAudience?.toLowerCase() || "modern consumers"}.

This innovative offering addresses key market needs while delivering exceptional value and performance. Built with ${selectedAudience === TargetAudience.B2B ? "business professionals" : "consumers"} in mind, it represents the next evolution in quality and service.

"We're excited to bring ${prompt} to market," said [Spokesperson]. "This launch represents our commitment to innovation and customer satisfaction."

${callToAction || "For more information, visit our website or contact our team."}

###`;
  };

  const generateGenericTemplate = (): string => {
    return `${prompt}

This professional content has been crafted with a ${selectedTone?.toLowerCase()} tone specifically for ${selectedAudience?.toLowerCase() || "your audience"}.

Our solution focuses on delivering exceptional results while maintaining the highest standards of quality and service.

Key highlights:
• Professional and engaging content
• Tailored for your specific needs
• Optimized for ${selectedIndustry?.toLowerCase() || "maximum impact"}
• Ready to use and customize

${callToAction || "Ready to make an impact with your marketing!"}`;
  };

  const marketingCopyOptions = ENHANCED_MARKETING_COPY_OPTIONS;

  const isTextGenerationDisabled =
    isInitializing && selectedCreationType === ContentCreationType.Copy;
  const isGenerateButtonDisabled =
    isLoading || !prompt.trim() || isInitializing;

  // Filter and search logic
  const filteredItems = generatedItems.filter((item) => {
    const matchesSearch = searchQuery
      ? item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item as GeneratedTextItem).content
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (item as GeneratedImageItem).prompt
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      : true;

    const matchesFilter =
      filterType === "all" ||
      (filterType === "favorites" && item.feedback === "liked") ||
      (filterType === "text" && "content" in item) ||
      (filterType === "images" && "imageUrl" in item) ||
      item.type === filterType;

    return matchesSearch && matchesFilter;
  });

  const handleExportContent = (format: "json" | "txt" | "csv" = "json") => {
    const exportData = contentStorage.exportContent(format);
    const blob = new Blob([exportData], {
      type: format === "json" ? "application/json" : "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marketgen-content.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearAllContent = () => {
    if (
      window.confirm(
        "Are you sure you want to delete all saved content? This action cannot be undone.",
      )
    ) {
      const success = contentStorage.clearAllContent();
      if (success) {
        setGeneratedItems([]);
        const updatedStats = contentStorage.getStats();
        setContentStats(updatedStats);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn">
      {/* API Status Messages */}
      {apiError && (
        <div
          className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
          role="alert"
        >
          <p className="font-bold">⚠️ Error</p>
          <p>{apiError}</p>
        </div>
      )}

      {!apiError && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <div className="flex justify-between items-center">
            <p className="text-sm">
              ✅ Free AI text generation ready (powered by Hugging Face)
            </p>
            <div className="text-xs text-green-600">
              {generatedItems.length > 0 &&
                `${generatedItems.length} items saved`}
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Type Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-slate-800 mb-5">
            Create New Content
          </h2>
          <div className="space-y-3">
            {contentTypes.map((ct) => (
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
                                ${selectedCreationType === ct.id ? "border-indigo-500 ring-2 ring-indigo-500 bg-indigo-50" : "border-slate-300 hover:border-indigo-400 hover:bg-indigo-50"}
                                ${ct.id === ContentCreationType.Video || ct.id === ContentCreationType.GIF ? "opacity-50 cursor-not-allowed" : ""}`}
                aria-pressed={selectedCreationType === ct.id}
                disabled={
                  ct.id === ContentCreationType.Video ||
                  ct.id === ContentCreationType.GIF
                }
              >
                <span className="flex items-center">
                  <ct.icon
                    className={`w-5 h-5 mr-3 ${ct.color} ${ct.id === ContentCreationType.Video || ct.id === ContentCreationType.GIF ? "opacity-50" : ""}`}
                  />
                  <span
                    className={`font-medium text-sm text-slate-700 ${ct.id === ContentCreationType.Video || ct.id === ContentCreationType.GIF ? "opacity-50" : ""}`}
                  >
                    {ct.label} ({ct.description})
                  </span>
                </span>
                <IconChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="text-sm font-medium text-slate-500 mb-2">
              Recent Projects
            </h3>
            <div className="space-y-1">
              {RECENT_PROJECTS_DEMO.map((project) => (
                <a
                  key={project.id}
                  href="#"
                  className="flex items-center p-2 text-sm text-slate-600 rounded hover:bg-slate-100 transition-colors"
                >
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
              Generate{" "}
              {contentTypes.find((ct) => ct.id === selectedCreationType)
                ?.label || "Content"}
            </h2>
          </div>

          <div className="mb-6">
            <label
              htmlFor="prompt-input"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Describe what you want to create
            </label>
            <div className="relative">
              <textarea
                id="prompt-input"
                className="w-full p-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 transition-all text-sm"
                rows={4}
                placeholder={
                  selectedCreationType === ContentCreationType.Image
                    ? "e.g., A happy dog playing with a ball in a sunny park (seed for Picsum Photos)"
                    : "e.g., Facebook ad for new eco-friendly water bottles targeting millennials..."
                }
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                aria-label="Prompt for content generation"
              />
              <button
                title="Generate with AI"
                aria-label="Generate with AI"
                className="absolute bottom-3 right-3 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleGenerateContent}
                disabled={isGenerateButtonDisabled}
              >
                <IconSparkles className="w-5 h-5" />
              </button>
            </div>
          </div>

          {selectedCreationType === ContentCreationType.Copy && (
            <div className="mb-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select content type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {marketingCopyOptions.map((opt) => (
                    <button
                      key={opt.type}
                      onClick={() => setSelectedMarketingCopyType(opt.type)}
                      className={`border p-3 rounded-lg text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1
                                        ${selectedMarketingCopyType === opt.type ? "border-indigo-500 ring-2 ring-indigo-500 bg-indigo-50" : "border-slate-300 hover:border-indigo-400 hover:bg-indigo-50"}
                                        ${isTextGenerationDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      aria-pressed={selectedMarketingCopyType === opt.type}
                      disabled={isTextGenerationDisabled}
                      title={opt.description}
                    >
                      <opt.icon
                        className={`w-4 h-4 mb-1 mx-auto ${opt.color} ${isTextGenerationDisabled ? "opacity-50" : ""}`}
                      />
                      <div
                        className={`text-xs font-medium text-slate-700 ${isTextGenerationDisabled ? "opacity-50" : ""}`}
                      >
                        {opt.type}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tone
                  </label>
                  <select
                    value={selectedTone}
                    onChange={(e) =>
                      setSelectedTone(e.target.value as ToneStyle)
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                    disabled={isTextGenerationDisabled}
                  >
                    {TONE_OPTIONS.map((tone) => (
                      <option key={tone.tone} value={tone.tone}>
                        {tone.tone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={selectedAudience}
                    onChange={(e) =>
                      setSelectedAudience(e.target.value as TargetAudience)
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                    disabled={isTextGenerationDisabled}
                  >
                    {AUDIENCE_OPTIONS.map((audience) => (
                      <option key={audience.audience} value={audience.audience}>
                        {audience.audience}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Length
                  </label>
                  <select
                    value={selectedLength}
                    onChange={(e) =>
                      setSelectedLength(e.target.value as ContentLength)
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                    disabled={isTextGenerationDisabled}
                  >
                    {LENGTH_OPTIONS.map((length) => (
                      <option key={length.length} value={length.length}>
                        {length.length}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Advanced Options Toggle */}
              <div>
                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                  disabled={isTextGenerationDisabled}
                >
                  <IconAdjustmentsHorizontal className="w-4 h-4 mr-1" />
                  {showAdvancedOptions ? "Hide" : "Show"} Advanced Options
                </button>
              </div>

              {/* Advanced Options */}
              {showAdvancedOptions && (
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Industry (Optional)
                      </label>
                      <select
                        value={selectedIndustry || ""}
                        onChange={(e) =>
                          setSelectedIndustry(
                            (e.target.value as Industry) || null,
                          )
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                        disabled={isTextGenerationDisabled}
                      >
                        <option value="">Select Industry</option>
                        {Object.values(Industry).map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Call-to-Action (Optional)
                      </label>
                      <input
                        type="text"
                        value={callToAction}
                        onChange={(e) => setCTA(e.target.value)}
                        placeholder="e.g., Shop Now, Learn More"
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                        disabled={isTextGenerationDisabled}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Keywords (Optional)
                    </label>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="e.g., premium, sustainable, innovative"
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                      disabled={isTextGenerationDisabled}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Separate keywords with commas
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleGenerateContent}
            disabled={isGenerateButtonDisabled}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center space-x-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Generate content button"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>
                  {selectedCreationType === ContentCreationType.Image
                    ? "Generating image..."
                    : "Generating content..."}
                </span>
              </>
            ) : isInitializing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Initializing...</span>
              </>
            ) : (
              <>
                <IconBolt className="w-5 h-5" />
                <span>Generate Content</span>
              </>
            )}
          </button>

          {PROMPT_SUGGESTIONS.length > 0 && !isLoading && (
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

      {/* Content Statistics */}
      {contentStats && generatedItems.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Content Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {contentStats.totalGenerated}
              </div>
              <div className="text-sm text-slate-600">Total Generated</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {contentStats.textContent}
              </div>
              <div className="text-sm text-slate-600">Text Content</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {contentStats.imageContent}
              </div>
              <div className="text-sm text-slate-600">Images</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {contentStats.favoriteCount}
              </div>
              <div className="text-sm text-slate-600">Favorites</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => handleExportContent("json")}
              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors text-sm"
            >
              Export JSON
            </button>
            <button
              onClick={() => handleExportContent("txt")}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm"
            >
              Export TXT
            </button>
            <button
              onClick={() => handleExportContent("csv")}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
            >
              Export CSV
            </button>
            <button
              onClick={handleClearAllContent}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Generated Content Display */}
      {generatedItems.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-3 sm:space-y-0">
            <h2 className="text-lg font-semibold text-slate-800">
              Generated Results ({filteredItems.length})
            </h2>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-1 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="all">All Content</option>
                <option value="favorites">Favorites</option>
                <option value="text">Text Only</option>
                <option value="images">Images Only</option>
                <option value="Ad Copy">Ad Copy</option>
                <option value="Email">Email</option>
                <option value="Social Post">Social Post</option>
                <option value="Website Content">Website</option>
              </select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-all bg-slate-50/50 flex flex-col"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-medium">
                    {item.type}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      className={`transition-colors ${
                        item.feedback === "liked"
                          ? "text-red-500 hover:text-red-600"
                          : "text-slate-400 hover:text-indigo-600"
                      }`}
                      title={item.feedback === "liked" ? "Unlike" : "Like"}
                      aria-label={
                        item.feedback === "liked"
                          ? "Unlike this item"
                          : "Like this item"
                      }
                      onClick={() => {
                        const success = contentStorage.favoriteContent(item.id);
                        if (success) {
                          // Update local state
                          setGeneratedItems((prev) =>
                            prev.map((prevItem) =>
                              prevItem.id === item.id
                                ? {
                                    ...prevItem,
                                    feedback:
                                      prevItem.feedback === "liked"
                                        ? undefined
                                        : "liked",
                                  }
                                : prevItem,
                            ),
                          );
                        }
                      }}
                    >
                      <IconHandThumbUp className="w-4 h-4" />
                    </button>
                    <button
                      className="text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete"
                      aria-label="Delete this item"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this content?",
                          )
                        ) {
                          const success = contentStorage.deleteContent(item.id);
                          if (success) {
                            setGeneratedItems((prev) =>
                              prev.filter(
                                (prevItem) => prevItem.id !== item.id,
                              ),
                            );
                            // Update stats after deletion
                            const updatedStats = contentStorage.getStats();
                            setContentStats(updatedStats);
                          }
                        }
                      }}
                    >
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
                        alt={
                          (item as GeneratedImageItem).prompt ||
                          "Generated image"
                        }
                        className="rounded-lg max-w-full h-auto shadow-md object-contain max-h-64 mx-auto"
                      />
                      <p className="text-xs text-slate-500 mt-2 italic">
                        Prompt: {(item as GeneratedImageItem).prompt}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="flex justify-between items-center text-xs text-slate-500 mt-auto pt-2">
                  <span>Generated: {item.timestamp}</span>
                  <div className="flex space-x-2">
                    <button
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                      aria-label="Copy to clipboard"
                      onClick={() => {
                        const textToCopy =
                          (item as GeneratedTextItem).content ||
                          `Image: ${(item as GeneratedImageItem).prompt}`;
                        navigator.clipboard.writeText(textToCopy).then(() => {
                          // Could add a toast notification here
                          console.log("Content copied to clipboard");
                        });
                      }}
                    >
                      Copy
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800 font-medium"
                      aria-label="Use this generated item"
                      onClick={() => {
                        const textToUse =
                          (item as GeneratedTextItem).content ||
                          `${(item as GeneratedImageItem).prompt}`;
                        setPrompt(textToUse);
                      }}
                    >
                      Use
                    </button>
                  </div>
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
