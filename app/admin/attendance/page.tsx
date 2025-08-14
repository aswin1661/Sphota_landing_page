"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import LogoutButton from "@/app/admin/LogoutButton";
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface TeamRecord {
    recordId: string;
    fields: Record<string, string | boolean | undefined>;
    teamName: string;
}

export default function AttendancePage() {
    const [teamRecords, setTeamRecords] = useState<TeamRecord[]>([]);
    const [error, setError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/attendance');
                const data = await response.json();
                
                if (data.error) {
                    setError(data.error);
                } else {
                    setTeamRecords(data.teamRecords);
                }
            } catch {
                setError('Failed to fetch attendance data');
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    const updateAttendance = async (recordId: string, status: 'Present' | 'Absent') => {
        setUpdatingId(recordId);
        try {
            const response = await fetch('/api/attendance', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recordId,
                    attendance: status
                })
            });

            const data = await response.json();
            
            if (data.success) {
                // Update the local state
                setTeamRecords(prev => 
                    prev.map(record => 
                        record.recordId === recordId 
                            ? { ...record, fields: { ...record.fields, Attendance: status } }
                            : record
                    )
                );
            } else {
                alert('Failed to update attendance: ' + data.error);
            }
        } catch (err) {
            console.error('Error updating attendance:', err);
            alert('Failed to update attendance');
        } finally {
            setUpdatingId(null);
        }
    };

    const getAllTeamMembers = (team: TeamRecord) => {
        const members = [];
        
        // Add lead first
        if (team.fields['Lead']) {
            members.push({
                name: team.fields['Lead'] as string,
                role: 'Lead'
            });
        }
        
        // Add other members
        for (let i = 1; i <= 4; i++) {
            const member = team.fields[`Member ${i}`] as string;
            if (member) {
                members.push({
                    name: member,
                    role: `Member ${i}`
                });
            }
        }
        
        return members;
    };

    return (
        <div className="min-h-[100svh] bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 text-white">
            <div className="mx-auto max-w-6xl px-8 py-14">
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white">Attendance</h1>
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
                                Team Attendance
                            </h2>
                            <p className="text-sm text-zinc-400">
                                Total Teams: {teamRecords.length}
                            </p>
                        </div>
                        
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : error ? (
                            <div className="text-center py-6 bg-red-500/10 rounded-lg border border-red-500/20">
                                <p className="text-red-400">{error}</p>
                            </div>
                        ) : teamRecords.length > 0 ? (
                            <div className="space-y-3">
                                {teamRecords.map((team, index) => {
                                    const attendance = team.fields['Attendance'] as string || 'Not Set';
                                    const isVerified = team.fields['Verified'] === 'Verified';
                                    const isUpdating = updatingId === team.recordId;
                                    const allMembers = getAllTeamMembers(team);
                                    
                                    return (
                                        <div 
                                            key={index} 
                                            className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5"
                                        >
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <div className="flex items-center gap-4 cursor-pointer hover:bg-white/5 p-2 rounded transition-colors flex-1">
                                                        <div>
                                                            <div className="text-zinc-100 font-medium flex items-center gap-2">
                                                                {team.teamName}
                                                                <span className="text-xs text-zinc-500">
                                                                    (Click to view members)
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="px-2 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-zinc-400">
                                                                    {allMembers.length} member{allMembers.length !== 1 ? 's' : ''}
                                                                </span>
                                                                <span className="text-xs text-zinc-500">
                                                                    Lead: {team.fields['Lead'] as string || 'N/A'}
                                                                </span>
                                                                {isVerified && (
                                                                    <span className={`px-2 py-1 text-xs rounded-full border bg-green-500/10 border-green-500/20 text-green-400`}>
                                                                        Verified
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogTrigger>
                                                <DialogContent className="bg-slate-900 border-white/10 text-white">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-xl font-semibold text-white">
                                                            {team.teamName} - Team Members
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div className="mt-4">
                                                        <div className="space-y-3">
                                                            {allMembers.map((member, memberIndex) => (
                                                                <div 
                                                                    key={memberIndex}
                                                                    className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="text-zinc-100 font-medium">
                                                                            {member.name}
                                                                        </div>
                                                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                                                            member.role === 'Lead' 
                                                                                ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                                                                                : 'bg-white/5 border border-white/10 text-zinc-400'
                                                                        }`}>
                                                                            {member.role}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        
                                                        <div className="mt-4 space-y-3">
                                                            <div className="p-3 rounded-lg border border-white/10 bg-white/5">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-sm text-zinc-400">Team Attendance Status:</span>
                                                                    <span className={`font-medium ${
                                                                        attendance === 'Present' ? 'text-green-400' :
                                                                        attendance === 'Absent' ? 'text-red-400' :
                                                                        'text-yellow-400'
                                                                    }`}>
                                                                        {attendance}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="p-3 rounded-lg border border-white/10 bg-white/5">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-sm text-zinc-400">Verification Status:</span>
                                                                    <span className={`font-medium ${
                                                                        isVerified ? 'text-green-400' : 'text-yellow-400'
                                                                    }`}>
                                                                        {isVerified ? 'Verified' : 'Unverified'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                            
                                            <div className="flex items-center gap-3">
                                                <div className="text-sm text-zinc-400 min-w-[80px]">
                                                    Status: <span className={`font-medium ${
                                                        attendance === 'Present' ? 'text-green-400' :
                                                        attendance === 'Absent' ? 'text-red-400' :
                                                        'text-yellow-400'
                                                    }`}>
                                                        {attendance}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={isUpdating}
                                                        onClick={() => updateAttendance(team.recordId, 'Present')}
                                                        className={`h-8 text-xs ${
                                                            attendance === 'Present' 
                                                                ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                                                                : 'bg-green-500/40 hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400'
                                                        }`}
                                                    >
                                                        {isUpdating ? '...' : 'Present'}
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={isUpdating}
                                                        onClick={() => updateAttendance(team.recordId, 'Absent')}
                                                        className={`h-8 text-xs ${
                                                            attendance === 'Absent' 
                                                                ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                                                                : 'bg-red-500/40 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400'
                                                        }`}
                                                    >
                                                        {isUpdating ? '...' : 'Absent'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-zinc-500">No teams found.</p>
                            </div>
                        )}
                    </div>
                </main>

                <footer className="mt-16 text-center text-sm text-zinc-500">
                    Secure area · Logged in
                </footer>
            </div>
        </div>
    );
}
