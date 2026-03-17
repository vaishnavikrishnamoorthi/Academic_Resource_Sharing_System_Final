// AI News Recommendations Component
// This file is isolated — delete it to remove the AI feature

import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

const MAX_USES_PER_DAY = 2;

const getUsageKey = () => {
    const today = new Date().toISOString().split("T")[0]; // "2026-03-09"
    return `ai_news_usage_${today}`;
};

const getUsageCount = () => {
    return parseInt(sessionStorage.getItem(getUsageKey()) || "0", 10);
};

const incrementUsage = () => {
    const count = getUsageCount() + 1;
    sessionStorage.setItem(getUsageKey(), count.toString());
    return count;
};

const NewsRecommendations = ({ onSelectArticle }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTopic, setSearchTopic] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState(null);
    const [usageCount, setUsageCount] = useState(getUsageCount());

    const remainingUses = MAX_USES_PER_DAY - usageCount;
    const isLimitReached = remainingUses <= 0;

    const fetchRecommendations = async () => {
        if (!searchTopic.trim()) {
            setError("Please enter a search topic.");
            return;
        }

        if (isLimitReached) {
            setError("Daily limit reached (2 searches/day). Try again tomorrow.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const res = await axiosInstance.get(`/ai-news/recommendations?q=${encodeURIComponent(searchTopic)}`);
            setArticles(res.data.articles || []);
            if (res.data.articles && res.data.articles.length > 0) {
                const newCount = incrementUsage();
                setUsageCount(newCount);
            } else {
                setError("No articles found. Try a different topic.");
            }
        } catch (err) {
            console.error("Failed to fetch recommendations:", err);
            setError(err.response?.data?.error || "Failed to fetch recommendations. Check your API key.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (article) => {
        onSelectArticle({
            title: article.title,
            source: article.source,
        });
        setIsOpen(false);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    };

    if (!isOpen) {
        return (
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg text-sm font-medium"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    AI News Suggestions
                </button>
                <span className="text-xs text-gray-400 italic">
                    ⚡ Limited to {MAX_USES_PER_DAY} searches/day • {remainingUses > 0 ? `${remainingUses} remaining` : "Limit reached"}
                </span>
            </div>
        );
    }

    return (
        <div className="bg-white border border-purple-200 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-bold text-sm">AI News Suggestions</span>
                    <span className="text-white/70 text-xs ml-2">
                        ({remainingUses > 0 ? `${remainingUses} search${remainingUses > 1 ? "es" : ""} left today` : "Limit reached"})
                    </span>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Search Bar */}
            <div className="px-5 py-3 border-b border-gray-100 flex gap-2">
                <input
                    type="text"
                    value={searchTopic}
                    onChange={(e) => setSearchTopic(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !isLimitReached && fetchRecommendations()}
                    placeholder="Search topic (e.g. technology, science)"
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
                    disabled={isLimitReached}
                />
                <button
                    onClick={fetchRecommendations}
                    disabled={loading || isLimitReached || !searchTopic.trim()}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "..." : "Search"}
                </button>
            </div>

            {/* Usage Note */}
            <div className="px-5 py-2 bg-amber-50 border-b border-amber-100">
                <p className="text-xs text-amber-700 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Please use AI suggestions limitedly — {MAX_USES_PER_DAY} searches per day per user.
                </p>
            </div>

            {/* Content */}
            <div className="max-h-72 overflow-y-auto">
                {loading && (
                    <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    </div>
                )}

                {error && (
                    <div className="px-5 py-4 text-center text-sm text-red-500">{error}</div>
                )}

                {!loading && !error && articles.length > 0 && (
                    <div className="divide-y divide-gray-100">
                        {articles.map((article, idx) => (
                            <div
                                key={idx}
                                className="px-5 py-3 hover:bg-purple-50 transition-colors cursor-pointer group"
                                onClick={() => handleSelect(article)}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-gray-800 group-hover:text-purple-700 transition-colors line-clamp-2">
                                            {article.title}
                                        </h4>
                                        {article.description && (
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {article.description}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className="text-xs text-purple-600 font-medium">
                                                {article.sourceName}
                                            </span>
                                            {article.publishedAt && (
                                                <span className="text-xs text-gray-400">
                                                    {formatDate(article.publishedAt)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button className="shrink-0 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-purple-200">
                                        Use
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsRecommendations;
