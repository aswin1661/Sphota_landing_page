"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/app/admin/LogoutButton";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AdminPanel() {
    const [isLoading, setIsLoading] = useState(true);
    const [counts, setCounts] = useState({
        participants: 0,
        teams: 0,
        payments: 0,
        attendance: 0
    });

    useEffect(() => {
        // Simulate loading and fetch any necessary data
        const fetchCounts = async () => {
            try {
                // You can add API calls here to get actual counts
                const response = await fetch('/api/counts');
                if (response.ok) {
                    const data = await response.json();
                    setCounts(data);
                }
            } catch (error) {
                console.error('Failed to fetch counts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCounts();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-[100svh] bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 text-white flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }


    return (
        <div className="min-h-[100svh] bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 text-white">
            <div className="mx-auto max-w-6xl px-8 py-14">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white">Admin Panel</h1>
                        <p className="mt-1 text-base text-zinc-300">Sphota</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-base text-zinc-300 hover:text-white underline-offset-4 hover:underline">
                            View site
                        </Link>
                        <LogoutButton />
                    </div>
                </header>

                <main className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
                    <section className="col-span-2 rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                        <h2 className="text-xl font-semibold text-white">Dashboard</h2>
                        <p className="mt-1 text-base text-zinc-300">
                            Quick access
                        </p>

                        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div className="rounded-lg border border-white/10 bg-black/20 p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-medium text-white text-lg">Participants</h3>
                                    {counts.participants > 0 && (
                                        <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                                            {counts.participants}
                                        </span>
                                    )}
                                </div>
                                <p className="mb-5 mt-1 text-sm text-zinc-400">View and manage participants.</p>
                                <Button variant="secondary" className="w-full text-black hover:text-black h-11 text-sm" asChild>
                                    <Link href="/admin/participants">View Participants</Link>
                                </Button>
                            </div>
                            <div className="rounded-lg border border-white/10 bg-black/20 p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-medium text-white text-lg">Team</h3>
                                    {counts.teams > 0 && (
                                        <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                                            {counts.teams}
                                        </span>
                                    )}
                                </div>
                                <p className="mb-5 mt-1 text-sm text-zinc-400">View and manage teams.</p>
                                <Button variant="secondary" className="w-full text-black hover:text-black h-11 text-sm" asChild>
                                    <Link href="/admin/teams">View Team</Link>
                                </Button>
                            </div>
                        </div>
                    </section>

                    <aside className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                        <h2 className="text-lg font-semibold text-white">Quick Links</h2>
                        <p className="mt-1 text-sm text-zinc-300">Quick access to common pages</p>

                        <div className="mt-4 flex flex-col gap-3">
                            <Button variant="secondary" className="w-full text-black hover:text-black h-9 text-sm justify-start" asChild>
                                <Link href="/admin/attendance">
                                    <span>Attendance</span>
                                    {counts.attendance > 0 && (
                                        <span className="ml-auto px-2 py-1 text-xs rounded-full bg-orange-500/20 text-orange-400">
                                            {counts.attendance}
                                        </span>
                                    )}
                                </Link>
                            </Button>

                            <Button variant="secondary" className="w-full text-black hover:text-black h-9 text-sm justify-start" asChild>
                                <Link href="/admin/food-preferences">Food Preferences</Link>
                            </Button>

                            <Button variant="secondary" className="w-full text-black hover:text-black h-9 text-sm justify-start" asChild>
                                <Link href="/admin/payment">
                                    <span>Payment ID</span>
                                    {counts.payments > 0 && (
                                        <span className="ml-auto px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">
                                            {counts.payments}
                                        </span>
                                    )}
                                </Link>
                            </Button>
                            <div className="pt-2">
                                <LogoutButton />
                            </div>
                        </div>
                    </aside>
                </main>

                <footer className="mt-16 text-center text-sm text-zinc-500">
                Sphota Admin . Logged in
                </footer>
            </div>
        </div>
    );
}