export function formatTimeSlot(timeSlot: string, day: string): string {
  const [startTime, endTime] = timeSlot.split(' - ');
  return `${day} ${startTime} - ${endTime}`;
}

export function generateTimeSlots(startHour: number = 0, endHour: number = 24, interval: number = 2): string[] {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour += interval) {
    const start = hour.toString().padStart(2, '0') + ':00';
    const end = (hour + interval).toString().padStart(2, '0') + ':00';
    slots.push(`${start} - ${end}`);
  }
  return slots;
}

export function formatDateForDisplay(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}