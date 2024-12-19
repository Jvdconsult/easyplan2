import React, { useState } from 'react';
import { Clock, Users, Calendar, Share2, MapPin } from 'lucide-react';
import { Event } from '../types/Event';
import { VoteModal } from './VoteModal';
import { EventDetailsModal } from './EventDetailsModal';
import { clsx } from 'clsx';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const statusConfig = {
    draft: {
      text: 'Draft',
      className: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    },
    pending: {
      text: 'Pending Votes',
      className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
    },
    confirmed: {
      text: 'Confirmed',
      className: 'bg-green-500/20 text-green-300 border-green-500/30'
    },
    cancelled: {
      text: 'Cancelled',
      className: 'bg-red-500/20 text-red-300 border-red-500/30'
    },
    completed: {
      text: 'Completed',
      className: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    }
  };

  const typeColors = {
    Restaurant: 'from-emerald-500/20 to-teal-500/20',
    'Game Night': 'from-blue-500/20 to-indigo-500/20',
    Vacation: 'from-purple-500/20 to-pink-500/20',
    Other: 'from-gray-500/20 to-slate-500/20'
  };

  const canVote = event.status === 'pending';

  // Fonction pour trouver le créneau validé (si existe)
  const getConfirmedTimeSlot = () => {
    if (event.status !== 'confirmed') return null;
    
    for (const timeSlot of event.timeSlots) {
      const timeSlotVotes = event.votes.filter(
        v => v.timeSlot.day === timeSlot.day && 
            v.timeSlot.time === timeSlot.time
      );
      if (timeSlotVotes.length === event.participants.length && 
          timeSlotVotes.every(v => v.response === 'yes')) {
        return timeSlot;
      }
    }
    return null;
  };

  const confirmedTimeSlot = getConfirmedTimeSlot();

  return (
    <>
      <div 
        className="group relative cursor-pointer"
        onClick={() => setShowDetailsModal(true)}
      >
        <div className={clsx(
          "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r",
          typeColors[event.type as keyof typeof typeColors]
        )} />
        <div className="relative bg-gray-800/40 backdrop-blur-sm border border-white/5 rounded-xl p-6 hover:border-white/20 transition-all duration-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
              <span className={clsx(
                'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border',
                statusConfig[event.status].className
              )}>
                {statusConfig[event.status].text}
              </span>
            </div>
            <span className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r shadow-lg',
              event.type === 'Restaurant' ? 'from-emerald-500 to-teal-500 text-white' :
              event.type === 'Game Night' ? 'from-blue-500 to-indigo-500 text-white' :
              event.type === 'Vacation' ? 'from-purple-500 to-pink-500 text-white' :
              'from-gray-500 to-slate-500 text-white'
            )}>
              {event.type}
            </span>
          </div>

          <div className="space-y-3 text-gray-300">
            {event.location && (
              <p className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 opacity-50" />
                {event.location}
              </p>
            )}
            <p className="flex items-center">
              <Clock className="h-4 w-4 mr-2 opacity-50" />
              {confirmedTimeSlot ? (
                `${confirmedTimeSlot.day} ${confirmedTimeSlot.time}`
              ) : (
                <span className="text-yellow-300">Date to be determined</span>
              )}
            </p>
            <p className="flex items-center">
              <Users className="h-4 w-4 mr-2 opacity-50" />
              {event.participants.length} participant{event.participants.length !== 1 ? 's' : ''}
            </p>
            <p className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 opacity-50" />
              {event.preferredDays.join(', ')}
            </p>
          </div>

          {canVote && (
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowVoteModal(true);
                }}
                className="flex-1 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-all duration-200"
              >
                Vote for Time Slots
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.share({
                    title: event.title,
                    text: `Join my event "${event.title}" on EasyPlan!`,
                    url: event.shareLink
                  }).catch(() => {
                    navigator.clipboard.writeText(event.shareLink);
                  });
                }}
                className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/30 transition-all duration-200"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {showVoteModal && (
        <VoteModal event={event} onClose={() => setShowVoteModal(false)} />
      )}

      {showDetailsModal && (
        <EventDetailsModal event={event} onClose={() => setShowDetailsModal(false)} />
      )}
    </>
  );
}