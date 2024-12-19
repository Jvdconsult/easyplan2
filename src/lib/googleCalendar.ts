import { gapi } from 'gapi-script';

const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
  colorId?: string;
}

let gapiInited = false;

export async function initializeGoogleApi() {
  if (!gapiInited) {
    try {
      await new Promise<void>((resolve, reject) => {
        gapi.load('client', {
          callback: async () => {
            try {
              await gapi.client.init({
                apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
                discoveryDocs: [DISCOVERY_DOC],
              });
              gapiInited = true;
              resolve();
            } catch (error) {
              reject(error);
            }
          },
          onerror: () => {
            reject(new Error('Failed to load Google API client'));
          },
        });
      });
    } catch (error) {
      console.error('Error initializing Google API:', error);
      throw error;
    }
  }
}

export async function fetchCalendarEvents(): Promise<CalendarEvent[]> {
  try {
    await initializeGoogleApi();

    const response = await gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    });

    return (response.result.items || []).map(event => ({
      id: event.id || '',
      title: event.summary || 'Sans titre',
      start: event.start?.dateTime || event.start?.date || '',
      end: event.end?.dateTime || event.end?.date || '',
      description: event.description,
      location: event.location,
      colorId: event.colorId
    }));
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
}

export async function setGoogleToken(token: string) {
  try {
    await initializeGoogleApi();
    gapi.client.setToken({
      access_token: token,
      expires_in: 3600
    });
  } catch (error) {
    console.error('Error setting Google token:', error);
    throw error;
  }
}