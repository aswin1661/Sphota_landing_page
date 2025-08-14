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
            <div className="mx-auto max-w-6xl px-8 py-14">
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white">Food Preferences</h1>
                        <p className="mt-1 text-base text-zinc-300">View dietary preferences overview</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/admin" 
                            className="text-base text-zinc-300 hover:text-white underline-offset-4 hover:underline"
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
                            {/* Detailed Lists */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Vegetarian Participants */}
                                <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                        <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                                        Vegetarian Participants ({stats.vegCount})
                                    </h2>
                                    
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {stats.vegParticipants.map((participant, index) => (
                                            <div 
                                                key={index}
                                                className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5"
                                            >
                                                <div>
                                                    <div className="text-zinc-100 font-medium">
                                                        {participant.name}
                                                    </div>
                                                    <div className="text-xs text-zinc-400">
                                                        {participant.teamName}
                                                    </div>
                                                </div>
                                                {participant.isLead && (
                                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
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
                                <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                        <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                                        Non-Vegetarian Participants ({stats.nonVegCount})
                                    </h2>
                                    
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {stats.nonVegParticipants.map((participant, index) => (
                                            <div 
                                                key={index}
                                                className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5"
                                            >
                                                <div>
                                                    <div className="text-zinc-100 font-medium">
                                                        {participant.name}
                                                    </div>
                                                    <div className="text-xs text-zinc-400">
                                                        {participant.teamName}
                                                    </div>
                                                </div>
                                                {participant.isLead && (
                                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
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

                <footer className="mt-16 text-center text-sm text-zinc-500">
                    Secure area · Logged in
                </footer>
            </div>
        </div>
    );
}
