import React from 'react';
import { useCalendar } from '../context/CalendarContext';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Loader2, RefreshCcw } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

export function Calendar() {
  const { events, loading, error, refreshEvents } = useCalendar();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <CalendarIcon className="h-12 w-12 text-gray-500 mb-4" />
        <p className="text-gray-400">Connectez-vous pour voir votre calendrier</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-400 text-center mb-4">
          <CalendarIcon className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-medium">Une erreur est survenue</p>
          <p className="text-sm opacity-80 mb-4">{error.message}</p>
          <button
            onClick={() => refreshEvents()}
            className="inline-flex items-center px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const groupedEvents = events.reduce((acc, event) => {
    const date = format(parseISO(event.start), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, typeof events>);

  return (
    <div className="bg-gray-800/50 rounded-xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Calendrier</h2>
        <button
          onClick={() => refreshEvents()}
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
        >
          <RefreshCcw className="h-5 w-5" />
        </button>
      </div>
      
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([date, dayEvents]) => (
          <div key={date} className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400">
              {format(parseISO(date), 'EEEE d MMMM', { locale: fr })}
            </h3>
            
            <div className="space-y-2">
              {dayEvents.map(event => (
                <div
                  key={event.id}
                  className={clsx(
                    'p-3 rounded-lg border',
                    event.colorId === '1' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' :
                    event.colorId === '2' ? 'bg-green-500/10 border-green-500/30 text-green-300' :
                    event.colorId === '3' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' :
                    event.colorId === '4' ? 'bg-red-500/10 border-red-500/30 text-red-300' :
                    'bg-gray-700/50 border-white/10 text-gray-300'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm opacity-80">
                        {format(parseISO(event.start), 'HH:mm')} - {format(parseISO(event.end), 'HH:mm')}
                      </p>
                    </div>
                    {event.location && (
                      <span className="text-sm opacity-80">{event.location}</span>
                    )}
                  </div>
                  {event.description && (
                    <p className="mt-2 text-sm opacity-70">{event.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(groupedEvents).length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun événement à venir</p>
          </div>
        )}
      </div>
    </div>
  );
}