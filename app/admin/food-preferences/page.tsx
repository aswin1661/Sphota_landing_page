"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import LogoutButton from "@/app/admin/LogoutButton";
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface FoodPreferenceStats {
    vegCount: number;
    nonVegCount: number;
    totalCount: number;
    vegParticipants: Array<{
        name: string;
        teamName: string;
        isLead: boolean;
    }>;
    nonVegParticipants: Array<{
        name: string;
        teamName: string;
        isLead: boolean;
    }>;
}

export default function FoodPreferencesPage() {
    const [stats, setStats] = useState<FoodPreferenceStats | null>(null);
    const [error, setError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/food-preferences');
                const data = await response.json();
                
                if (data.error) {
                    setError(data.error);
                } else {
                    setStats(data);
                }
            } catch {
                setError('Failed to fetch food preference data');
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="min-h-[100svh] bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 text-white">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-14">
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 lg:mb-10 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">Food Preferences</h1>
                        <p className="mt-1 text-sm sm:text-base text-zinc-300"></p>
                    </div>
                    
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link 
                            href="/admin" 
                            className="text-sm sm:text-base text-zinc-300 hover:text-white underline-offset-4 hover:underline"
                        >
                            Back to Admin
                        </Link>
                        <LogoutButton />
                    </div>
                </header>

                <main>
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner />
                        </div>
                    ) : error ? (
                        <div className="text-center py-6 bg-red-500/10 rounded-lg border border-red-500/20">
                            <p className="text-red-400">{error}</p>
                        </div>
                    ) : stats ? (
                        <>
                            {/* Summary Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                                        <h3 className="text-lg sm:text-xl font-semibold text-white">Vegetarian</h3>
                                    </div>
                                    <p className="text-2xl sm:text-3xl font-bold text-green-400">{stats.vegCount}</p>
                                    <p className="text-xs sm:text-sm text-zinc-400">participants</p>
                                </div>
                                
                                <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                                        <h3 className="text-lg sm:text-xl font-semibold text-white">Non-Vegetarian</h3>
                                    </div>
                                    <p className="text-2xl sm:text-3xl font-bold text-red-400">{stats.nonVegCount}</p>
                                    <p className="text-xs sm:text-sm text-zinc-400">participants</p>
                                </div>
                                
                                <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur sm:col-span-2 lg:col-span-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                                        <h3 className="text-lg sm:text-xl font-semibold text-white">Total</h3>
                                    </div>
                                    <p className="text-2xl sm:text-3xl font-bold text-blue-400">{stats.totalCount}</p>
                                    <p className="text-xs sm:text-sm text-zinc-400">participants</p>
                                </div>
                            </div>

                            {/* Detailed Lists */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                                {/* Vegetarian Participants */}
                                <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur">
                                    <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                        <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                                        Vegetarian Participants ({stats.vegCount})
                                    </h2>
                                    
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {stats.vegParticipants.map((participant, index) => (
                                            <div 
                                                key={index}
                                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5 gap-2"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-zinc-100 font-medium break-words">
                                                        {participant.name}
                                                    </div>
                                                    <div className="text-xs text-zinc-400 break-words">
                                                        {participant.teamName}
                                                    </div>
                                                </div>
                                                {participant.isLead && (
                                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 whitespace-nowrap">
                                                        Lead
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                        {stats.vegParticipants.length === 0 && (
                                            <p className="text-zinc-500 text-center py-4">No vegetarian participants</p>
                                        )}
                                    </div>
                                </div>

                                {/* Non-Vegetarian Participants */}
                                <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur">
                                    <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                        <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                                        Non-Vegetarian Participants ({stats.nonVegCount})
                                    </h2>
                                    
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {stats.nonVegParticipants.map((participant, index) => (
                                            <div 
                                                key={index}
                                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5 gap-2"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-zinc-100 font-medium break-words">
                                                        {participant.name}
                                                    </div>
                                                    <div className="text-xs text-zinc-400 break-words">
                                                        {participant.teamName}
                                                    </div>
                                                </div>
                                                {participant.isLead && (
                                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 whitespace-nowrap">
                                                        Lead
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                        {stats.nonVegParticipants.length === 0 && (
                                            <p className="text-zinc-500 text-center py-4">No non-vegetarian participants</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-zinc-500">No data available.</p>
                        </div>
                    )}
                </main>

                <footer className="mt-8 sm:mt-12 lg:mt-16 text-center text-sm text-zinc-500">
                    Secure area · Logged in
                </footer>
            </div>
        </div>
    );
}
