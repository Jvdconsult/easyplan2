import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Sun, Settings, Users } from 'lucide-react';
import { EventModal } from './EventModal';
import { EmptyState } from './EmptyState';
import { EventCard } from './EventCard';
import { SettingsModal } from './SettingsModal';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { Calendar } from './Calendar';

export function Dashboard() {
  const [showEventModal, setShowEventModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [view, setView] = useState<'events' | 'calendar'>('events');
  const { events } = useEvents();
  const { user, logout } = useAuth();

  const upcomingEvents = events.filter(event => 
    !['completed', 'cancelled'].includes(event.status)
  );

  const pastEvents = events.filter(event => 
    ['completed', 'cancelled'].includes(event.status)
  );

  return (
    <div className="min-h-screen bg-[#1a1f2b]">
      <header className="bg-[#232936] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold text-white">EasyPlan</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowEventModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center"
              >
                <Plus className="h-5 w-5 mr-1" />
                New Event
              </button>
              
              <button 
                onClick={() => setView('events')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === 'events' 
                    ? 'text-white bg-gray-700/50' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Users className="h-5 w-5" />
              </button>

              <button 
                onClick={() => setView('calendar')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === 'calendar' 
                    ? 'text-white bg-gray-700/50' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <CalendarIcon className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowSettingsModal(true)}
                  className="p-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <img
                  src={user?.photoURL || 'https://ui-avatars.com/api/?name=User&background=random'}
                  alt={user?.displayName || 'User'}
                  className="w-8 h-8 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'events' ? (
          events.length === 0 ? (
            <EmptyState onCreateEvent={() => setShowEventModal(true)} />
          ) : (
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-6">
                  Upcoming Events
                </h2>
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                  {upcomingEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                  {upcomingEvents.length === 0 && (
                    <p className="text-gray-400 col-span-2 py-4 text-center bg-gray-800/50 backdrop-blur rounded-xl border border-white/10">
                      No upcoming events
                    </p>
                  )}
                </div>
              </section>

              {pastEvents.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-6">
                    Past Events
                  </h2>
                  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    {pastEvents.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )
        ) : (
          <Calendar />
        )}
      </main>

      {showEventModal && (
        <EventModal onClose={() => setShowEventModal(false)} />
      )}

      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
}