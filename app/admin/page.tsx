import Link from "next/link";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/app/admin/LogoutButton";


export default async function AdminPanel() {
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
                                </div>
                                <p className="mb-5 mt-1 text-sm text-zinc-400">View and manage participants.</p>
                                <Button variant="secondary" className="w-full text-black hover:text-black h-11 text-sm" asChild>
                                    <Link href="/admin/participants">View Participants</Link>
                                </Button>
                            </div>
                            <div className="rounded-lg border border-white/10 bg-black/20 p-5">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-medium text-white text-lg">Team</h3>
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
                                <Link href="/admin/attendance">Attendance</Link>
                            </Button>

                            <Button variant="secondary" className="w-full text-black hover:text-black h-9 text-sm justify-start" asChild>
                                <Link href="/admin/food-preferences">Food Preferences</Link>
                            </Button>

                            <Button variant="secondary" className="w-full text-black hover:text-black h-9 text-sm justify-start" asChild>
                                <Link href="/admin/payment">Payment ID</Link>
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