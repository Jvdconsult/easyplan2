import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, EventStatus, Vote } from '../types/Event';
import { db } from '../lib/firebase';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'status' | 'votes' | 'shareLink'>) => Promise<void>;
  updateEvent: (eventId: string, updates: Partial<Event>) => Promise<void>;
  updateEventStatus: (eventId: string, status: EventStatus) => Promise<void>;
  updateEventVotes: (eventId: string, vote: Vote) => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventData: Event[] = [];
      snapshot.forEach((doc) => {
        eventData.push({ id: doc.id, ...doc.data() } as Event);
      });
      setEvents(eventData);
    });

    return () => unsubscribe();
  }, []);

  const generateShareLink = (eventId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/event/${eventId}`;
  };

  const addEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'status' | 'votes' | 'shareLink'>) => {
    const newEvent = {
      ...eventData,
      createdAt: new Date().toISOString(),
      status: 'pending' as EventStatus,
      votes: [],
    };

    const docRef = await addDoc(collection(db, 'events'), newEvent);
    await updateDoc(doc(db, 'events', docRef.id), {
      shareLink: generateShareLink(docRef.id)
    });
  };

  const cleanUndefinedValues = (obj: Record<string, any>): Record<string, any> => {
    const cleaned: Record<string, any> = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (value !== undefined) {
        cleaned[key] = value;
      }
    });
    return cleaned;
  };

  const updateEvent = async (eventId: string, updates: Partial<Event>) => {
    const cleanedUpdates = cleanUndefinedValues(updates);
    await updateDoc(doc(db, 'events', eventId), cleanedUpdates);
  };

  const updateEventStatus = async (eventId: string, status: EventStatus) => {
    await updateDoc(doc(db, 'events', eventId), { status });
  };

  const updateEventVotes = async (eventId: string, newVote: Vote) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const filteredVotes = event.votes.filter(
      v => !(v.userId === newVote.userId &&
        v.timeSlot.day === newVote.timeSlot.day &&
        v.timeSlot.time === newVote.timeSlot.time)
    );

    const updatedVotes = [...filteredVotes, newVote];

    const isUnanimous = event.timeSlots.some(timeSlot => {
      const specificSlotVotes = updatedVotes.filter(
        v => v.timeSlot.day === timeSlot.day &&
          v.timeSlot.time === timeSlot.time
      );
      return specificSlotVotes.length === event.participants.length &&
        specificSlotVotes.every(v => v.response === 'yes');
    });

    await updateDoc(doc(db, 'events', eventId), {
      votes: updatedVotes,
      status: isUnanimous ? 'confirmed' : event.status
    });
  };

  const value = {
    events,
    addEvent,
    updateEvent,
    updateEventStatus,
    updateEventVotes
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}