import React, { useState, KeyboardEvent } from 'react';
import { X, Clock, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { Event } from '../types/Event';
import { useEvents } from '../context/EventContext';

const eventTypes = ['Restaurant', 'Game Night', 'Vacation', 'Other'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour += 2) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 2).toString().padStart(2, '0')}:00`;
    slots.push(`${startTime} - ${endTime}`);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

interface EditEventModalProps {
  event: Event;
  onClose: () => void;
}

export function EditEventModal({ event, onClose }: EditEventModalProps) {
  const { updateEvent } = useEvents();
  const [title, setTitle] = useState(event.title);
  const [type, setType] = useState(event.type);
  const [location, setLocation] = useState(event.location || '');
  const [selectedDays, setSelectedDays] = useState(event.preferredDays);
  const [isRecurring, setIsRecurring] = useState(event.isRecurring);
  const [participants, setParticipants] = useState(event.participants);
  const [newParticipant, setNewParticipant] = useState('');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState(event.timeSlots);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [description, setDescription] = useState(event.description || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (participants.length === 0) {
      newErrors.participants = 'At least one participant is required';
    }
    if (selectedTimeSlots.length === 0) {
      newErrors.timeSlots = 'At least one time slot is required';
    }
    if (selectedDays.length === 0) {
      newErrors.days = 'At least one day is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const updates: Partial<Event> = {
      title,
      type,
      participants,
      timeSlots: selectedTimeSlots,
      preferredDays: selectedDays,
      isRecurring
    };

    // Only include optional fields if they have values
    if (location.trim()) {
      updates.location = location.trim();
    }
    if (description.trim()) {
      updates.description = description.trim();
    }

    updateEvent(event.id, updates);
    onClose();
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleAddParticipant = () => {
    if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant('');
    }
  };

  const handleParticipantKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddParticipant();
    }
  };

  const removeParticipant = (participant: string) => {
    setParticipants(participants.filter(p => p !== participant));
  };

  const handleAddTimeSlot = () => {
    if (selectedTimeSlot && !selectedTimeSlots.includes(selectedTimeSlot)) {
      setSelectedTimeSlots([...selectedTimeSlots, selectedTimeSlot]);
      setSelectedTimeSlot('');
    }
  };

  const removeTimeSlot = (slot: string) => {
    setSelectedTimeSlots(selectedTimeSlots.filter(s => s !== slot));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800/90 backdrop-blur border border-white/10 rounded-xl w-full max-w-2xl shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Edit Event</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              className={clsx(
                "w-full px-3 py-1.5 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                errors.title && "border-red-500 focus:ring-red-500"
              )}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Event Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location (optional)"
              className="w-full px-3 py-1.5 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Participants *
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                onKeyPress={handleParticipantKeyPress}
                placeholder="Enter participant name"
                className={clsx(
                  "flex-1 px-3 py-1.5 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  errors.participants && "border-red-500 focus:ring-red-500"
                )}
              />
              <button 
                onClick={handleAddParticipant}
                className="px-3 py-1.5 text-blue-400 hover:text-blue-300 transition-colors"
              >
                Add
              </button>
            </div>
            {errors.participants && (
              <p className="mt-1 text-sm text-red-500">{errors.participants}</p>
            )}
            {participants.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {participants.map((participant) => (
                  <div
                    key={participant}
                    className="flex items-center bg-blue-500/20 border border-blue-500/30 text-blue-300 px-2 py-1 rounded-lg text-sm"
                  >
                    {participant}
                    <button
                      onClick={() => removeParticipant(participant)}
                      className="ml-1 hover:text-blue-200"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Time Slots *
            </label>
            <div className="flex items-center space-x-2">
              <select 
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className={clsx(
                  "flex-1 px-3 py-1.5 bg-gray-900/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  errors.timeSlots && "border-red-500 focus:ring-red-500"
                )}
              >
                <option value="">Select a time slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              <button 
                onClick={handleAddTimeSlot}
                className="text-blue-400 hover:text-blue-300 transition-colors flex items-center px-3 py-1.5"
              >
                <Clock className="h-4 w-4 mr-1" />
                Add
              </button>
            </div>
            {errors.timeSlots && (
              <p className="mt-1 text-sm text-red-500">{errors.timeSlots}</p>
            )}
            {selectedTimeSlots.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTimeSlots.map((slot) => (
                  <div
                    key={slot}
                    className="flex items-center bg-blue-500/20 border border-blue-500/30 text-blue-300 px-2 py-1 rounded-lg text-sm"
                  >
                    {slot}
                    <button
                      onClick={() => removeTimeSlot(slot)}
                      className="ml-1 hover:text-blue-200"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Preferred Days *
            </label>
            <div className="flex flex-wrap gap-2">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={clsx(
                    'px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200',
                    selectedDays.includes(day)
                      ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
                      : 'bg-gray-900/50 border border-white/10 text-gray-400 hover:border-blue-500/30 hover:text-blue-300'
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
            {errors.days && (
              <p className="mt-1 text-sm text-red-500">{errors.days}</p>
            )}
          </div>

          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                id="recurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-4 w-4 rounded border-white/10 text-blue-500 focus:ring-blue-500 bg-gray-900/50"
              />
              <label htmlFor="recurring" className="text-sm text-gray-200">
                Recurring Event
              </label>
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
              rows={2}
              className="w-full px-3 py-1.5 bg-gray-900/50 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="p-4 border-t border-white/10 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}