import React from 'react';
import { X, Check, X as XIcon } from 'lucide-react';
import { Event, Vote, TimeSlot } from '../types/Event';
import { useEvents } from '../context/EventContext';
import { clsx } from 'clsx';

interface VoteModalProps {
  event: Event;
  onClose: () => void;
}

export function VoteModal({ event, onClose }: VoteModalProps) {
  const { updateEventVotes } = useEvents();
  const currentUserId = 'user-1'; // Dans une vraie app, ceci viendrait du contexte d'authentification

  // Générer les créneaux combinés (jour + heure)
  const combinedTimeSlots = event.preferredDays.flatMap(day => 
    event.timeSlots.map(time => ({
      day,
      time
    }))
  );

  const handleVote = (timeSlot: TimeSlot, response: 'yes' | 'no') => {
    const newVote: Vote = {
      userId: currentUserId,
      timeSlot,
      response
    };
    updateEventVotes(event.id, newVote);
  };

  const getUserVote = (timeSlot: TimeSlot) => {
    return event.votes.find(
      v => v.userId === currentUserId && 
           v.timeSlot.day === timeSlot.day &&
           v.timeSlot.time === timeSlot.time
    )?.response;
  };

  const getVoteCount = (timeSlot: TimeSlot, response: 'yes' | 'no') => {
    return event.votes.filter(
      v => v.timeSlot.day === timeSlot.day &&
           v.timeSlot.time === timeSlot.time &&
           v.response === response
    ).length;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1f2b]/95 backdrop-blur border border-white/5 rounded-2xl w-full max-w-lg overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-white">{event.title}</h2>
            <p className="text-sm text-gray-400">Select available time slots</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {combinedTimeSlots.map((timeSlot) => {
            const userVote = getUserVote(timeSlot);
            const yesCount = getVoteCount(timeSlot, 'yes');
            const noCount = getVoteCount(timeSlot, 'no');
            const timeDisplay = `${timeSlot.day} ${timeSlot.time}`;

            return (
              <div 
                key={`${timeSlot.day}-${timeSlot.time}`} 
                className="bg-[#232936] border border-white/5 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-medium text-white">
                    {timeDisplay}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVote(timeSlot, 'yes')}
                      className={clsx(
                        'p-2 rounded-lg transition-all duration-200',
                        userVote === 'yes'
                          ? 'bg-green-500/20 text-green-400'
                          : 'hover:bg-white/5 text-gray-400'
                      )}
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleVote(timeSlot, 'no')}
                      className={clsx(
                        'p-2 rounded-lg transition-all duration-200',
                        userVote === 'no'
                          ? 'bg-red-500/20 text-red-400'
                          : 'hover:bg-white/5 text-gray-400'
                      )}
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{yesCount}/{event.participants.length} available</span>
                  <span>{noCount} unavailable</span>
                </div>

                <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      "h-full transition-all duration-300",
                      yesCount === event.participants.length
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    )}
                    style={{ 
                      width: `${(yesCount / event.participants.length) * 100}%` 
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}