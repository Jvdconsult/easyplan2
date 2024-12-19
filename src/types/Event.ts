export type EventStatus = 'draft' | 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type TimeSlot = {
  day: string;
  time: string;
};

export type Vote = {
  userId: string;
  timeSlot: TimeSlot;
  response: 'yes' | 'no';
};

export type ShareMethod = 'whatsapp' | 'email' | 'sms' | 'copy' | 'qr';

export interface Event {
  id: string;
  title: string;
  type: string;
  location?: string;
  participants: string[];
  timeSlots: string[];
  preferredDays: string[];
  description?: string;
  createdAt: string;
  isRecurring: boolean;
  status: EventStatus;
  votes: Vote[];
  shareLink: string;
  selectedTimeSlot?: TimeSlot;
}