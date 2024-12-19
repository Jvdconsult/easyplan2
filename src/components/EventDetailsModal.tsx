import React, { useState } from 'react';
import { X, MapPin, Users, Clock, Calendar, Share2, Edit2 } from 'lucide-react';
import { Event } from '../types/Event';
import { ShareModal } from './ShareModal';
import { EditEventModal } from './EditEventModal';
import { clsx } from 'clsx';

interface EventDetailsModalProps {
  event: Event;
  onClose: () => void;
}

export function EventDetailsModal({ event, onClose }: EventDetailsModalProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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

  const canEdit = !['completed', 'cancelled'].includes(event.status);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-gray-800/90 backdrop-blur border border-white/10 rounded-xl w-full max-w-2xl shadow-xl">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-semibold text-white">{event.title}</h2>
              <span className={clsx(
                'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border',
                statusConfig[event.status].className
              )}>
                {statusConfig[event.status].text}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {canEdit && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1.5 bg-blue-500/10 text-blue-300 rounded-lg text-sm font-medium border border-blue-500/20">
                {event.type}
              </span>
            </div>

            <div className="space-y-4">
              {event.location && (
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{event.location}</span>
                </div>
              )}
              
              <div className="flex items-center text-gray-300">
                <Users className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="font-medium mb-1">Participants</p>
                  <div className="flex flex-wrap gap-2">
                    {event.participants.map(participant => (
                      <span key={participant} className="px-2 py-1 bg-gray-700/50 rounded-lg text-sm">
                        {participant}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center text-gray-300">
                <Clock className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="font-medium mb-1">Time Slots</p>
                  <div className="flex flex-wrap gap-2">
                    {event.timeSlots.map(slot => (
                      <span key={slot} className="px-2 py-1 bg-gray-700/50 rounded-lg text-sm">
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center text-gray-300">
                <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p className="font-medium mb-1">Preferred Days</p>
                  <div className="flex flex-wrap gap-2">
                    {event.preferredDays.map(day => (
                      <span key={day} className="px-2 py-1 bg-gray-700/50 rounded-lg text-sm">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {event.description && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Description</h3>
                <p className="text-gray-400">{event.description}</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Close
            </button>
            {event.status === 'pending' && (
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Vote for Time Slots
              </button>
            )}
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareModal event={event} onClose={() => setShowShareModal(false)} />
      )}

      {showEditModal && (
        <EditEventModal 
          event={event} 
          onClose={() => {
            setShowEditModal(false);
            onClose();
          }} 
        />
      )}
    </>
  );
}