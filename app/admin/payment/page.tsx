"use client";

import Link from "next/link";
import { useState, useEffect } from 'react';
import LogoutButton from "@/app/admin/LogoutButton";
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from "@/components/ui/button";

interface PaymentInfo {
    teamName: string;
    lead: string;
    upiTransactionId?: string;
    attachmentUrl?: string;
    attachmentName?: string;
    recordId: string;
    isVerified?: boolean;
}

export default function PaymentPage() {
    const [payments, setPayments] = useState<PaymentInfo[]>([]);
    const [error, setError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'unverified' | 'verified' | 'all'>('unverified'); // Default to unverified

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/payments');
                const data = await response.json();
                
                if (data.error) {
                    setError(data.error);
                } else {
                    setPayments(data.payments);
                }
            } catch {
                setError('Failed to fetch payment data');
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    const getPaymentStats = () => {
        const paidCount = payments.filter(payment => payment.upiTransactionId).length;
        const unpaidCount = payments.filter(payment => !payment.upiTransactionId).length;
        const verifiedCount = payments.filter(payment => payment.isVerified).length;
        const unverifiedCount = payments.filter(payment => !payment.isVerified).length;
        const withAttachmentCount = payments.filter(payment => payment.attachmentUrl).length;
        
        return { paidCount, unpaidCount, verifiedCount, unverifiedCount, withAttachmentCount, total: payments.length };
    };

    const getFilteredPayments = () => {
        switch (filter) {
            case 'verified':
                return payments.filter(payment => payment.isVerified);
            case 'unverified':
                return payments.filter(payment => !payment.isVerified);
            default:
                return payments;
        }
    };

    const getFilterTitle = () => {
        switch (filter) {
            case 'verified':
                return 'Verified Payments';
            case 'unverified':
                return 'Unverified Payments';
            default:
                return 'All Payments';
        }
    };

    const handleVerificationToggle = async (recordId: string, currentStatus: boolean) => {
        // If already verified, show alert and prevent changes
        if (currentStatus) {
            alert('Payment verification cannot be changed once verified. Contact developer if you need to modify this.');
            return;
        }
        
        try {
            const response = await fetch('/api/payments', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recordId,
                    isVerified: !currentStatus
                }),
            });

            if (response.ok) {
                // Update local state
                setPayments(prev => prev.map(payment => 
                    payment.recordId === recordId 
                        ? { ...payment, isVerified: !currentStatus }
                        : payment
                ));
            } else {
                setError('Failed to update verification status');
            }
        } catch {
            setError('Failed to update verification status');
        }
    };

    const stats = getPaymentStats();
    const filteredPayments = getFilteredPayments();

    return (
        <div className="min-h-[100svh] bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 text-white">
            <div className="mx-auto max-w-6xl px-8 py-14">
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-white">Payment Information</h1>
                        <p className="mt-1 text-base text-zinc-300">View UPI transaction IDs and payment attachments</p>
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
                    ) : (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                                
                                <div 
                                    className={`rounded-lg border border-white/10 p-4 cursor-pointer transition-all hover:scale-105 ${
                                        filter === 'verified' ? 'bg-blue-500/20 border-blue-500/40' : 'bg-blue-500/10 hover:bg-blue-500/15'
                                    }`}
                                    onClick={() => setFilter('verified')}
                                >
                                    <div className="text-2xl font-bold text-blue-400">{stats.verifiedCount}</div>
                                    <div className="text-sm text-zinc-400">Verified Payments</div>
                                </div>
                                <div 
                                    className={`rounded-lg border border-white/10 p-4 cursor-pointer transition-all hover:scale-105 ${
                                        filter === 'unverified' ? 'bg-orange-500/20 border-orange-500/40' : 'bg-orange-500/10 hover:bg-orange-500/15'
                                    }`}
                                    onClick={() => setFilter('unverified')}
                                >
                                    <div className="text-2xl font-bold text-orange-400">{stats.unverifiedCount}</div>
                                    <div className="text-sm text-zinc-400">Unverified Payments</div>
                                </div>
                                <div 
                                    className={`rounded-lg border border-white/10 p-4 cursor-pointer transition-all hover:scale-105 ${
                                        filter === 'all' ? 'bg-purple-500/20 border-purple-500/40' : 'bg-purple-500/10 hover:bg-purple-500/15'
                                    }`}
                                    onClick={() => setFilter('all')}
                                >
                                    <div className="text-2xl font-bold text-purple-400">{stats.total}</div>
                                    <div className="text-sm text-zinc-400">All Payments</div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-white">
                                        {getFilterTitle()}
                                    </h2>
                                    <div className="flex items-center gap-4">
                                        <p className="text-sm text-zinc-400">
                                            Showing: {filteredPayments.length} of {payments.length} teams
                                        </p>
                                        <div className="flex gap-2">
                                            {filter !== 'unverified' && (
                                                <button 
                                                    onClick={() => setFilter('unverified')}
                                                    className="text-sm text-orange-400 hover:text-orange-300 underline"
                                                >
                                                    Show Unverified
                                                </button>
                                            )}
                                            {filter !== 'all' && (
                                                <button 
                                                    onClick={() => setFilter('all')}
                                                    className="text-sm text-purple-400 hover:text-purple-300 underline"
                                                >
                                                    Show All
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {filteredPayments.length > 0 ? (
                                    <div className="space-y-4">
                                        {filteredPayments.map((payment, index) => (
                                            <div 
                                                key={index} 
                                                className="p-4 rounded-lg border border-white/10 bg-white/5"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-medium text-white">
                                                                {payment.teamName}
                                                            </h3>
                                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                                payment.upiTransactionId 
                                                                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                                                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                                                            }`}>
                                                                {payment.upiTransactionId ? 'Paid' : 'Unpaid'}
                                                            </span>
                                                            {payment.isVerified && (
                                                                <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                                                    ✓ Verified
                                                                </span>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                                            <div>
                                                                <p className="text-sm text-zinc-400 mb-1">Team Lead:</p>
                                                                <p className="text-zinc-200">{payment.lead || 'N/A'}</p>
                                                            </div>
                                                            
                                                            <div>
                                                                <p className="text-sm text-zinc-400 mb-1">UPI Transaction ID:</p>
                                                                {payment.upiTransactionId ? (
                                                                    <p className="text-zinc-200 font-mono text-sm bg-black/30 px-2 py-1 rounded">
                                                                        {payment.upiTransactionId}
                                                                    </p>
                                                                ) : (
                                                                    <p className="text-zinc-500 italic">Not provided</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        {payment.attachmentUrl && (
                                                            <div className="mt-3">
                                                                <p className="text-sm text-zinc-400 mb-2">Payment Attachment:</p>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-white bg-gray-900 border-blue-500/30 hover:bg-blue-500/10"
                                                                    asChild
                                                                >
                                                                    <a 
                                                                        href={payment.attachmentUrl} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        📎 View {payment.attachmentName || 'Attachment'}
                                                                    </a>
                                                                </Button>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Verification Button */}
                                                        <div className="mt-4 pt-3 border-t border-white/10">
                                                            <Button
                                                                variant={payment.isVerified ? "default" : "outline"}
                                                                size="sm"
                                                                className={`${
                                                                    payment.isVerified 
                                                                        ? 'bg-blue-600 hover:bg-blue-600 text-white cursor-not-allowed opacity-75'
                                                                        : 'text-black border-green-500/30 hover:text-white hover:bg-blue-500/10'
                                                                }`}
                                                                onClick={() => handleVerificationToggle(payment.recordId, payment.isVerified || false)}
                                                            >
                                                                {payment.isVerified ? '✓ Verified (Permanent)' : 'Mark as Verified'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-zinc-500">
                                            {filter === 'verified' 
                                                ? 'No verified payments found.' 
                                                : filter === 'unverified' 
                                                ? 'No unverified payments found.'
                                                : 'No payment information found.'
                                            }
                                        </p>
                                        {filter !== 'unverified' && filter !== 'all' && payments.length > 0 && (
                                            <div className="flex gap-2 mt-2">
                                                <button 
                                                    onClick={() => setFilter('unverified')}
                                                    className="text-orange-400 hover:text-orange-300 underline"
                                                >
                                                    View Unverified Payments
                                                </button>
                                                <span className="text-zinc-500">|</span>
                                                <button 
                                                    onClick={() => setFilter('all')}
                                                    className="text-purple-400 hover:text-purple-300 underline"
                                                >
                                                    View All Payments
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </main>

                <footer className="mt-16 text-center text-sm text-zinc-500">
                    Secure area · Logged in
                </footer>
            </div>
        </div>
    );
}
