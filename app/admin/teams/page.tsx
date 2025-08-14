"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import LogoutButton from "@/app/admin/LogoutButton";
import { TeamDetailsModal } from '../participants/TeamDetailsModal';
import type { TeamDetails } from '../participants/TeamDetailsModal';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Team {
    teamName: string;
    recordFields: TeamDetails;
}

export default function TeamsPage() {
    const [selectedTeamDetails, setSelectedTeamDetails] = useState<TeamDetails | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [teams, setTeams] = useState<Team[]>([]);
    const [error, setError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchTeams() {
            try {
                const response = await fetch('/api/teams');
                const data = await response.json();
                
                if (data.error) {
                    setError(data.error);
                } else {
                    setTeams(data.teams);
                }
            } catch {
                setError('Failed to fetch teams');
            } finally {
                setIsLoading(false);
            }
        }

        fetchTeams();
    }, []);

    const handleTeamClick = (recordFields: TeamDetails) => {
        setSelectedTeamDetails(recordFields);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-[100svh] bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 text-white">
            <div className="mx-auto max-w-6xl px-8 py-14">
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white">Teams</h1>
                        <p className="mt-1 text-base text-zinc-300"></p>
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
                    <div className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-white">
                                Registered Teams
                            </h2>
                            <p className="text-sm text-zinc-400">
                                Total: {teams.length}
                            </p>
                        </div>
                        
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : error ? (
                            <div className="text-center py-6 bg-red-500/10 rounded-lg border border-red-500/20">
                                <p className="text-red-400">{error}</p>
                            </div>
                        ) : teams.length > 0 ? (
                            <ul className="divide-y divide-white/10">
                                {teams.map((team, index) => (
                                    <li 
                                        key={index} 
                                        onClick={() => handleTeamClick(team.recordFields)}
                                        className="py-4 px-4 flex items-center justify-between cursor-pointer hover:bg-white/5 rounded-lg transition-colors"
                                    >
                                        <span className="text-zinc-100 hover:text-white">
                                            {team.teamName}
                                        </span>
                                        <svg 
                                            className="w-5 h-5 text-zinc-400" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-zinc-500">No teams registered yet.</p>
                            </div>
                        )}
                    </div>
                </main>

                <TeamDetailsModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    teamDetails={selectedTeamDetails}
                />

                <footer className="mt-16 text-center text-sm text-zinc-500">
                    Secure area · Logged in
                </footer>
            </div>
        </div>
    );
}