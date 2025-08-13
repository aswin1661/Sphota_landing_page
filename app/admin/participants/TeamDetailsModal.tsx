"use client";
import React, { ReactElement } from 'react';

interface Attachment {
  id: string;
  url: string;
  filename: string;
  type: string;
}

interface TeamDetails {
  "Team Name"?: string;
  [key: string]: string | number | boolean | Attachment[] | unknown[] | Record<string, unknown> | null | undefined;
}

interface TeamDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamDetails: TeamDetails | null;
}

const formatValue = (value: string | number | boolean | Attachment[] | unknown[] | Record<string, unknown> | null | undefined): ReactElement | string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";

  // Handle attachments
  if (Array.isArray(value) && value.every((item): item is Attachment => typeof item === 'object' && item !== null && 'url' in item && 'id' in item && 'filename' in item)) {
    return (
      <div className="flex flex-col gap-2">
        {(value as Attachment[]).map((attachment) => (
          <a
            key={attachment.id}
            href={attachment.url}
            download={attachment.filename}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg border border-blue-500/20 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {attachment.filename}
          </a>
        ))}
      </div>
    );
  }

  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return "Complex data";
  return "";
};

export function TeamDetailsModal({ isOpen, onClose, teamDetails }: TeamDetailsModalProps) {
  if (!isOpen || !teamDetails) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-white/10 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            {teamDetails["Team Name"] || "Team Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          {Object.entries(teamDetails)
            .filter(([, value]) => value !== null && value !== undefined)
            .map(([key, value]) => (
              <div key={key} className="grid grid-cols-3 gap-4">
                <div className="text-sm font-medium text-zinc-400">{key}</div>
                <div className="col-span-2 text-sm text-white">
                  {formatValue(value)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}