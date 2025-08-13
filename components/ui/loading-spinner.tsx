export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            <span className="ml-3 text-sm text-zinc-400">Loading data...</span>
        </div>
    );
}
