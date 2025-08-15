import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function AdminLoading() {
  return (
    <div className="min-h-[100svh] bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900 text-white flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-zinc-400 text-sm">Loading admin panel...</p>
      </div>
    </div>
  );
}
