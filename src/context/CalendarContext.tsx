import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchCalendarEvents, CalendarEvent, initializeGoogleApi, setGoogleToken } from '../lib/googleCalendar';

interface CalendarContextType {
  events: CalendarEvent[];
  loading: boolean;
  error: Error | null;
  refreshEvents: () => Promise<void>;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initGoogleApi = async () => {
      try {
        if (user) {
          await initializeGoogleApi();
          await refreshEvents();
        }
      } catch (error) {
        console.error('Error initializing Google API:', error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    initGoogleApi();
  }, [user]);

  const refreshEvents = async () => {
    if (!user) {
      setEvents([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = await user.getIdToken(true);
      await setGoogleToken(token);
      
      const calendarEvents = await fetchCalendarEvents();
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error refreshing events:', error);
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CalendarContext.Provider value={{ events, loading, error, refreshEvents }}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}