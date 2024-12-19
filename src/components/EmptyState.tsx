import React from 'react';
import { Calendar, Plus } from 'lucide-react';

export function EmptyState({ onCreateEvent }: { onCreateEvent: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#232936]/80 backdrop-blur-sm rounded-lg border border-white/5">
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
        <Calendar className="relative h-16 w-16 text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No events yet</h3>
      <p className="text-gray-400 mb-6">Create your first event to get started</p>
      <button
        onClick={onCreateEvent}
        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <Plus className="h-5 w-5 mr-1" />
        Create Event
      </button>
    </div>
  );
}