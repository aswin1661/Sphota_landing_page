"use client";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

    const generatePDF = () => {
        const doc = new jsPDF();
        
        // Add title and date
        doc.setFontSize(16);
        doc.text('Sphota - Teams & Participants Report', 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 22);

        // Group participants by team
        interface TeamMember {
            name: string;
            phone: string | number;
            college: string | number;
        }

        interface TeamData {
            teamName: string;
            lead: string;
            leadPhone: string | number;
            leadCollege: string | number;
            members: TeamMember[];
        }

        const teamData = participants.reduce((teams: Record<string, TeamData>, participant) => {
            const fields = participant.recordFields || {};
            
            if (!teams[participant.teamName]) {
                teams[participant.teamName] = {
                    teamName: participant.teamName,
                    lead: '',
                    leadPhone: '',
                    leadCollege: '',
                    members: []
                };
            }

            if (participant.isLead) {
                teams[participant.teamName].lead = participant.name;
                teams[participant.teamName].leadPhone = 
                    typeof fields['Lead Mobile Number'] === 'string' || typeof fields['Lead Mobile Number'] === 'number'
                        ? fields['Lead Mobile Number']
                        : 'N/A';
                teams[participant.teamName].leadCollege = 
                    typeof fields['College Lead'] === 'string' || typeof fields['College Lead'] === 'number'
                        ? fields['College Lead']
                        : 'N/A';
            } else {
                let memberNumber = '';
                for (let i = 1; i <= 4; i++) {
                    if (fields[`Member ${i}`] === participant.name) {
                        memberNumber = String(i);
                        break;
                    }
                }

                const getCollegeFieldName = (memberNumber: string) => {
                    switch(memberNumber) {
                        case '2': return 'College Memeber 2'; // Note: keeping the typo as it matches Airtable
                        case '3': return 'Member 3 College';
                        case '4': return 'Member 4 College';
                        default: return `College Member ${memberNumber}`;
                    }
                };

                if (memberNumber) {
                    teams[participant.teamName].members.push({
                        name: participant.name,
                        phone: (fields[`Member ${memberNumber} Mobile Number`] !== null && 
                               typeof fields[`Member ${memberNumber} Mobile Number`] !== 'boolean' && 
                               (typeof fields[`Member ${memberNumber} Mobile Number`] === 'string' || 
                                typeof fields[`Member ${memberNumber} Mobile Number`] === 'number'))
                            ? fields[`Member ${memberNumber} Mobile Number`] as string | number
                            : 'N/A',
                        college: (fields[getCollegeFieldName(memberNumber)] !== null &&
                                typeof fields[getCollegeFieldName(memberNumber)] !== 'boolean' &&
                                (typeof fields[getCollegeFieldName(memberNumber)] === 'string' ||
                                 typeof fields[getCollegeFieldName(memberNumber)] === 'number'))
                            ? fields[getCollegeFieldName(memberNumber)] as string | number
                            : 'N/A'
                    });
                }
            }

            return teams;
        }, {});

        // Prepare table data with better formatting
        const tableData = Object.values(teamData).map((team: TeamData) => [
            `**${team.teamName}**`,
            `Team Lead: **${team.lead}**\nContact: ${team.leadPhone}\nCollege: ${team.leadCollege}`,
            team.members.map((m: TeamMember, index: number) => 
                `Member ${index + 1}: **${m.name}**\nContact: ${m.phone}\nCollege: ${m.college}`
            ).join('\n\n')
        ]);

        // Generate table with adjusted column widths
        autoTable(doc, {
            head: [['Team Name', 'Team Lead Details', 'Team Members']],
            body: tableData,
            startY: 30,
            styles: { 
                fontSize: 8, 
                cellPadding: 3,
                lineColor: [200, 200, 200],
                lineWidth: 0.1,
            },
            columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 70 },
                2: { cellWidth: 'auto' }
            },
            // Add text styling options
            didParseCell: function(data) {
                const text = data.cell.text;
                if (Array.isArray(text)) {
                    data.cell.text = text.map(line => {
                        if (typeof line === 'string' && line.includes('**')) {
                            // Remove ** markers for bold formatting
                            return line.replace(/\*\*/g, '');
                        }
                        return line;
                    });
                }
            },
            didDrawPage: (data) => {
                // Add footer
                doc.setFontSize(8);
                doc.text(
                    'Sphota Registration Report',
                    data.settings.margin.left,
                    doc.internal.pageSize.height - 10
                );
            }
        });

        // Save the PDF
        doc.save('sphota-teams-report.pdf');
    };

    return (
        <div className="min-h-[100svh] bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 text-white">
            <div className="mx-auto max-w-6xl px-8 py-14">
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white">Participants</h1>
                        <p className="mt-1 text-base text-zinc-300">View and export participant details</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button
                            onClick={generatePDF}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Download Report
                        </button>
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