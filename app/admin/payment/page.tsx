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

interface PaymentInfo {
    teamName: string;
    lead: string;
    upiTransactionId?: string;
    attachmentUrl?: string;
    attachmentName?: string;
    recordId: string;
    isVerified?: boolean;
    // Team member details
    member1?: string;
    member2?: string;
    member3?: string;
    member4?: string;
    // IEEE Membership IDs
    ieeeIdLead?: string;
    ieeeIdMember1?: string;
    ieeeIdMember2?: string;
    ieeeIdMember3?: string;
    ieeeIdMember4?: string;
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

    const getTeamMembers = (payment: PaymentInfo) => {
        const members = [];
        
        // Add lead
        if (payment.lead) {
            const leadIeeeId = payment.ieeeIdLead || '';
            const hasLeadIeeeMembership = leadIeeeId !== '' && leadIeeeId !== 'undefined' && leadIeeeId !== 'null';
            
            members.push({
                name: payment.lead,
                role: 'Lead',
                ieeeId: hasLeadIeeeMembership ? leadIeeeId : 'Not provided',
                hasIeeeMembership: hasLeadIeeeMembership,
                paymentAmount: hasLeadIeeeMembership ? 299 : 399
            });
        }
        
        // Add other members - check all member fields including member 1
        const memberFields = [
            { name: payment.member1, ieeeId: payment.ieeeIdMember1 || '', role: 'Member 1' },
            { name: payment.member2, ieeeId: payment.ieeeIdMember2 || '', role: 'Member 2' },
            { name: payment.member3, ieeeId: payment.ieeeIdMember3 || '', role: 'Member 3' },
            { name: payment.member4, ieeeId: payment.ieeeIdMember4 || '', role: 'Member 4' },
        ];
        
        memberFields.forEach((member) => {
            if (member.name && member.name.trim() !== '') {
                const ieeeId = member.ieeeId || '';
                const hasIeeeMembership = ieeeId !== '' && ieeeId !== 'undefined' && ieeeId !== 'null';
                
                members.push({
                    name: member.name,
                    role: member.role,
                    ieeeId: hasIeeeMembership ? ieeeId : 'Not provided',
                    hasIeeeMembership: hasIeeeMembership,
                    paymentAmount: hasIeeeMembership ? 299 : 399
                });
            }
        });
        
        return members;
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
            <div className="mx-auto max-w-7xl px-4 py-8">
                <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Payment Information</h1>
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
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                                
                                <div 
                                    className={`rounded-lg border border-white/10 p-3 cursor-pointer transition-all hover:scale-105 ${
                                        filter === 'verified' ? 'bg-blue-500/20 border-blue-500/40' : 'bg-blue-500/10 hover:bg-blue-500/15'
                                    }`}
                                    onClick={() => setFilter('verified')}
                                >
                                    <div className="text-xl font-bold text-blue-400">{stats.verifiedCount}</div>
                                    <div className="text-xs text-zinc-400">Verified Payments</div>
                                </div>
                                <div 
                                    className={`rounded-lg border border-white/10 p-3 cursor-pointer transition-all hover:scale-105 ${
                                        filter === 'unverified' ? 'bg-orange-500/20 border-orange-500/40' : 'bg-orange-500/10 hover:bg-orange-500/15'
                                    }`}
                                    onClick={() => setFilter('unverified')}
                                >
                                    <div className="text-xl font-bold text-orange-400">{stats.unverifiedCount}</div>
                                    <div className="text-xs text-zinc-400">Unverified Payments</div>
                                </div>
                                <div 
                                    className={`rounded-lg border border-white/10 p-3 cursor-pointer transition-all hover:scale-105 ${
                                        filter === 'all' ? 'bg-purple-500/20 border-purple-500/40' : 'bg-purple-500/10 hover:bg-purple-500/15'
                                    }`}
                                    onClick={() => setFilter('all')}
                                >
                                    <div className="text-xl font-bold text-purple-400">{stats.total}</div>
                                    <div className="text-xs text-zinc-400">All Payments</div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                                    <h2 className="text-lg sm:text-xl font-semibold text-white">
                                        {getFilterTitle()}
                                    </h2>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
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
                                
                                { filteredPayments.length > 0 ? (
                                    <div className="space-y-4">
                                        {filteredPayments.map((payment, index) => {
                                            const teamMembers = getTeamMembers(payment);
                                            
                                            return (
                                                <div 
                                                    key={index} 
                                                    className="p-3 sm:p-4 rounded-lg border border-white/10 bg-white/5"
                                                >
                                                    <div className="flex flex-col gap-4">
                                                        <div className="w-full">
                                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                                <Dialog>
                                                                    <DialogTrigger asChild>
                                                                        <h3 className="text-base sm:text-lg font-medium text-white cursor-pointer hover:text-blue-400 transition-colors break-words">
                                                                            {payment.teamName} 
                                                                            <span className="text-xs text-zinc-500 ml-2 block sm:inline">(Click for details)</span>
                                                                        </h3>
                                                                    </DialogTrigger>
                                                                    <DialogContent className="bg-slate-900 border-white/10 h-[90vh] text-white max-w-[95vw] sm:max-w-2xl mx-4">
                                                                        <DialogHeader>
                                                                            <DialogTitle className="text-lg sm:text-xl font-semibold text-white break-words">
                                                                                {payment.teamName} - Team Details
                                                                            </DialogTitle>
                                                                        </DialogHeader>
                                                                        <div className="mt-4 overflow-y-auto px-1">
                                                                            <div className="space-y-4">
                                                                                {teamMembers.map((member, memberIndex) => (
                                                                                    <div 
                                                                                        key={memberIndex}
                                                                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg border border-white/10 bg-white/5 gap-3"
                                                                                    >
                                                                                        <div className="flex items-center gap-4 min-w-0 flex-1">
                                                                                            <div className="min-w-0 flex-1">
                                                                                                <div className="text-zinc-100 font-medium break-words">
                                                                                                    {member.name}
                                                                                                </div>
                                                                                                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                                                                                                    member.role === 'Lead' 
                                                                                                        ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                                                                                                        : 'bg-white/5 border border-white/10 text-zinc-400'
                                                                                                }`}>
                                                                                                    {member.role}
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                                                                            <div className="text-left sm:text-right">
                                                                                                <div className="text-sm text-zinc-400 mb-1">Payment Amount</div>
                                                                                                <div className={`px-3 py-1 text-sm rounded-full font-medium inline-block ${
                                                                                                    member.hasIeeeMembership 
                                                                                                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                                                                                        : 'bg-orange-500/10 border border-orange-500/20 text-orange-400'
                                                                                                }`}>
                                                                                                    ₹{member.paymentAmount}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="text-left sm:text-right">
                                                                                                <div className="text-sm text-zinc-400 mb-1">IEEE Membership</div>
                                                                                                {member.hasIeeeMembership ? (
                                                                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                                                                                        <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 border border-green-500/20 text-green-400 whitespace-nowrap">
                                                                                                            ✓ Member
                                                                                                        </span>
                                                                                                        <div className="text-sm text-zinc-200 font-mono bg-black/30 px-2 py-1 rounded break-all">
                                                                                                            {member.ieeeId}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <span className="px-2 py-1 text-xs rounded-full bg-gray-500/10 border border-gray-500/20 text-gray-400 whitespace-nowrap">
                                                                                                        Not a member
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                            
                                                                            <div className="mt-6 p-3 sm:p-4 rounded-lg border border-white/10 bg-white/5">
                                                                                <h4 className="text-sm font-medium text-white mb-3">Team Summary</h4>
                                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
                                                                                    <div>
                                                                                        <span className="text-zinc-400">Total Members:</span>
                                                                                        <span className="ml-2 text-white">{teamMembers.length}</span>
                                                                                    </div>
                                                                                    <div>
                                                                                        <span className="text-zinc-400">IEEE Members:</span>
                                                                                        <span className="ml-2 text-white">{teamMembers.filter(m => m.hasIeeeMembership).length}</span>
                                                                                    </div>
                                                                                </div>
                                                                                
                                                                                <div className="border-t border-white/10 pt-3">
                                                                                    <h5 className="text-sm font-medium text-white mb-2">Payment Breakdown</h5>
                                                                                    <div className="space-y-2 text-sm">
                                                                                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                                                                            <span className="text-zinc-400">IEEE Members (₹299 each):</span>
                                                                                            <span className="text-green-400 font-mono text-xs sm:text-sm">{teamMembers.filter(m => m.hasIeeeMembership).length} × ₹299 = ₹{teamMembers.filter(m => m.hasIeeeMembership).length * 299}</span>
                                                                                        </div>
                                                                                        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                                                                            <span className="text-zinc-400">Non-IEEE Members (₹399 each):</span>
                                                                                            <span className="text-orange-400 font-mono text-xs sm:text-sm">{teamMembers.filter(m => !m.hasIeeeMembership).length} × ₹399 = ₹{teamMembers.filter(m => !m.hasIeeeMembership).length * 399}</span>
                                                                                        </div>
                                                                                        <div className="flex flex-col sm:flex-row sm:justify-between pt-2 border-t border-white/10 gap-1">
                                                                                            <span className="text-white font-medium">Total Team Payment:</span>
                                                                                            <span className="text-blue-400 font-bold font-mono">{teamMembers.reduce((total, member) => total + member.paymentAmount, 0)}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </DialogContent>
                                                                </Dialog>
                                                                
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
                                                        
                                                        <div className="grid grid-cols-1 gap-3 mt-3">
                                                            <div>
                                                                <p className="text-sm text-zinc-400 mb-1">Team Members:</p>
                                                                <div className="space-y-1">
                                                                    {teamMembers.map((member, idx) => (
                                                                        <div key={idx} className="flex flex-wrap items-center gap-2 py-1">
                                                                            <span className="text-zinc-200 text-sm break-words">{member.name}</span>
                                                                            <span className={`px-1.5 py-0.5 text-xs rounded whitespace-nowrap ${
                                                                                member.role === 'Lead' 
                                                                                    ? 'bg-blue-500/20 text-blue-400'
                                                                                    : 'bg-white/10 text-zinc-400'
                                                                            }`}>
                                                                                {member.role}
                                                                            </span>
                                                                            {member.hasIeeeMembership && (
                                                                                <span className="px-1.5 py-0.5 text-xs rounded bg-green-500/20 text-green-400 whitespace-nowrap">
                                                                                    IEEE (₹299)
                                                                                </span>
                                                                            )}
                                                                            {!member.hasIeeeMembership && (
                                                                                <span className="px-1.5 py-0.5 text-xs rounded bg-orange-500/20 text-orange-400 whitespace-nowrap">
                                                                                    ₹399
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="mt-3 sm:mt-0">
                                                                <p className="text-sm text-zinc-400 mb-1">Total Payment Amount:</p>
                                                                <p className="text-blue-400 font-bold text-lg">
                                                                    ₹{teamMembers.reduce((total, member) => total + member.paymentAmount, 0)}
                                                                </p>
                                                                <p className="text-xs text-zinc-500">
                                                                    {teamMembers.filter(m => m.hasIeeeMembership).length} IEEE + {teamMembers.filter(m => !m.hasIeeeMembership).length} Non-IEEE
                                                                </p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="mt-3">
                                                            <p className="text-sm text-zinc-400 mb-1">UPI Transaction ID:</p>
                                                            {payment.upiTransactionId ? (
                                                                <p className="text-zinc-200 font-mono text-xs sm:text-sm bg-black/30 px-2 py-1 rounded break-all overflow-hidden">
                                                                    {payment.upiTransactionId}
                                                                </p>
                                                            ) : (
                                                                <p className="text-zinc-500 italic text-sm">Not provided</p>
                                                            )}
                                                        </div>
                                                        
                                                        {payment.attachmentUrl && (
                                                            <div className="mt-3">
                                                                <p className="text-sm text-zinc-400 mb-2">Payment Attachment:</p>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="w-full sm:w-auto text-white bg-gray-900 border-blue-500/30 hover:bg-blue-500/10 text-xs sm:text-sm"
                                                                    asChild
                                                                >
                                                                    <a 
                                                                        href={payment.attachmentUrl} 
                                                                        target="_blank" 
                                                                        rel="noopener noreferrer"
                                                                        className="block truncate"
                                                                    >
                                                                        <span className="inline-block mr-1">📎</span>
                                                                        <span className="truncate">
                                                                            View {payment.attachmentName || 'Attachment'}
                                                                        </span>
                                                                    </a>
                                                                </Button>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Verification Button */}
                                                        <div className="mt-4 pt-3 border-t border-white/10">
                                                            <Button
                                                                variant={payment.isVerified ? "default" : "outline"}
                                                                size="sm"
                                                                className={`w-full sm:w-auto text-xs sm:text-sm ${
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
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-zinc-500">
                                            {filter === 'verified' 
                                                ? 'No verified payments found.' 
                                                : filter === 'unverified' 
                                                ? 'No unverified payments found.'
                                                : 'No payment information found.'
                                            }</p>
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

                <footer className="mt-8 text-center text-sm text-zinc-500">
                    Secure area · Logged in
                </footer>
            </div>
        </div>
    );
}
