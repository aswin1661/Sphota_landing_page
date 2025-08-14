"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import LogoutButton from "@/app/admin/LogoutButton";
import { TeamDetailsModal } from './TeamDetailsModal';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Participant {
    name: string;
    teamName: string;
    isLead: boolean;
    recordFields?: Record<string, string | number | boolean | null>;
}

export default function ParticipantsPage() {
    const [selectedTeamDetails, setSelectedTeamDetails] = useState<Record<string, string | number | boolean | null> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [error, setError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchParticipants() {
            try {
                const response = await fetch('/api/participants');
                const data = await response.json();
                
                if (data.error) {
                    setError(data.error);
                } else {
                    setParticipants(data.participants);
                }
            } catch {
                setError('Failed to fetch participants');
            } finally {
                setIsLoading(false);
            }
        }

        fetchParticipants();
    }, []);

    const handleParticipantClick = (recordFields: Record<string, string | number | boolean | null> | undefined) => {
        if (recordFields) {
            setSelectedTeamDetails(recordFields);
            setIsModalOpen(true);
        }
    };

    return (
        <div className="min-h-[100svh] bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 text-white">
            <div className="mx-auto max-w-6xl px-8 py-14">
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white">Participants</h1>
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
                                Registered Members
                            </h2>
                            <p className="text-sm text-zinc-400">
                                Total: {participants.length}
                            </p>
                        </div>
                        
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : error ? (
                            <div className="text-center py-6 bg-red-500/10 rounded-lg border border-red-500/20">
                                <p className="text-red-400">{error}</p>
                            </div>
                        ) : participants.length > 0 ? (
                            <ul className="divide-y divide-white/10">
                                {participants.map((participant, index) => (
                                    <li 
                                        key={index} 
                                        className="py-4 flex items-center justify-between cursor-pointer hover:bg-white/5 px-4 -mx-4 rounded-lg transition-colors"
                                        onClick={() => handleParticipantClick(participant.recordFields)}
                                    >
                                        <span className="text-zinc-100 hover:text-white">
                                            {participant.name}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className="px-2 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-zinc-400">
                                                {participant.teamName}
                                            </span>
                                            {participant.isLead && (
                                                <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                                    Lead
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-zinc-500">No participants registered yet.</p>
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