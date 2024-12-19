import React from 'react';
import { Event } from '../types/Event';
import { FileEdit, Clock4, CheckCircle2, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface StatusColumnProps {
  title: string;
  icon: React.ElementType;
  events: Event[];
  colorClass: string;
}

function StatusColumn({ title, icon: Icon, events, colorClass }: StatusColumnProps) {
  return (
    <div className="flex-1 min-w-[280px]">
      <div className={clsx(
        "flex items-center gap-2 p-3 rounded-lg mb-4",
        colorClass
      )}>
        <Icon className="h-5 w-5" />
        <h3 className="font-medium">{title}</h3>
        <span className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-sm">
          {events.length}
        </span>
      </div>

      <div className="space-y-3">
        {events.map(event => (
          <div
            key={event.id}
            className="bg-gray-800/50 backdrop-blur border border-white/10 rounded-lg p-4 hover:border-blue-500/50 transition-all duration-300 shadow-lg group"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-white">{event.title}</h4>
              <span className={clsx(
                'px-2 py-0.5 rounded text-xs font-medium',
                event.type === 'Restaurant' ? 'bg-emerald-500/20 text-emerald-300' :
                event.type === 'Game Night' ? 'bg-blue-500/20 text-blue-300' :
                event.type === 'Vacation' ? 'bg-purple-500/20 text-purple-300' :
                'bg-gray-500/20 text-gray-300'
              )}>
                {event.type}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {event.participants.length} participant{event.participants.length !== 1 ? 's' : ''}
            </p>
          </div>
        ))}

        {events.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No events
          </div>
        )}
      </div>
    </div>
  );
}

interface StatusBoardProps {
  events: Event[];
}

export function StatusBoard({ events }: StatusBoardProps) {
  const draftEvents = events.filter(e => e.status === 'draft');
  const pendingEvents = events.filter(e => e.status === 'pending');
  const confirmedEvents = events.filter(e => e.status === 'confirmed');
  const cancelledEvents = events.filter(e => e.status === 'cancelled');

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-6 min-w-full p-1">
        <StatusColumn
          title="Drafts"
          icon={FileEdit}
          events={draftEvents}
          colorClass="bg-gray-500/10 text-gray-300"
        />
        <StatusColumn
          title="Pending"
          icon={Clock4}
          events={pendingEvents}
          colorClass="bg-yellow-500/10 text-yellow-300"
        />
        <StatusColumn
          title="Confirmed"
          icon={CheckCircle2}
          events={confirmedEvents}
          colorClass="bg-green-500/10 text-green-300"
        />
        <StatusColumn
          title="Cancelled"
          icon={XCircle}
          events={cancelledEvents}
          colorClass="bg-red-500/10 text-red-300"
        />
      </div>
    </div>
  );
}