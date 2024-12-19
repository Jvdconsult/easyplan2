import React from 'react';
import { format, isPast, parseISO } from 'date-fns';
import { Calendar, MapPin, Users, Clock, AlertCircle, CheckCircle2, XCircle, Clock4, FileEdit } from 'lucide-react';
import { Event, EventStatus } from '../types/Event';
import { clsx } from 'clsx';

const StatusBadge = ({ status }: { status: EventStatus }) => {
  const statusConfig = {
    draft: {
      icon: FileEdit,
      text: 'Draft',
      className: 'bg-gray-500/10 text-gray-300 border-gray-500/20'
    },
    pending: {
      icon: Clock4,
      text: 'Pending',
      className: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20'
    },
    confirmed: {
      icon: CheckCircle2,
      text: 'Confirmed',
      className: 'bg-green-500/10 text-green-300 border-green-500/20'
    },
    cancelled: {
      icon: XCircle,
      text: 'Cancelled',
      className: 'bg-red-500/10 text-red-300 border-red-500/20'
    },
    completed: {
      icon: CheckCircle2,
      text: 'Completed',
      className: 'bg-blue-500/10 text-blue-300 border-blue-500/20'
    }
  };

  const { icon: Icon, text, className } = statusConfig[status];

  return (
    <div className={clsx(
      'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
      className
    )}>
      <Icon className="h-3.5 w-3.5" />
      {text}
    </div>
  );
};

interface EventCardProps {
  event: Event;
}

function EventCard({ event }: EventCardProps) {
  const firstTimeSlot = event.timeSlots[0];
  const [startTime] = firstTimeSlot.split(' - ');

  const typeColors = {
    Restaurant: 'from-emerald-500 to-teal-500',
    'Game Night': 'from-blue-500 to-indigo-500',
    Vacation: 'from-purple-500 to-pink-500',
    Other: 'from-gray-500 to-slate-500'
  };

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl transition-opacity opacity-0 group-hover:opacity-100" />
      <div className="relative bg-gray-800/50 backdrop-blur border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
            <StatusBadge status={event.status} />
          </div>
          <span className={clsx(
            'px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r text-white shadow-lg',
            typeColors[event.type as keyof typeof typeColors]
          )}>
            {event.type}
          </span>
        </div>
        
        <div className="space-y-3 mt-4">
          {event.location && (
            <div className="flex items-center text-gray-300">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span>{event.location}</span>
            </div>
          )}
          <div className="flex items-center text-gray-300">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            <span>{event.participants.join(', ')}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span>{startTime}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>{event.preferredDays.join(', ')}</span>
          </div>
        </div>
        
        {event.description && (
          <p className="mt-4 text-gray-400 text-sm border-t border-white/10 pt-4">{event.description}</p>
        )}
      </div>
    </div>
  );
}

interface EventListProps {
  title: string;
  events: Event[];
  emptyMessage: string;
}

export function EventList({ title, events, emptyMessage }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-6">
          {title}
        </h2>
        <p className="text-gray-400 text-center py-8 bg-gray-800/50 backdrop-blur rounded-xl border border-white/10">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-6">
        {title}
      </h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}