import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET';
const REDIRECT_URI = 'YOUR_REDIRECT_URI'; // Typically, this is your app's callback URL

// Initialize OAuth2 client
const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Set up authentication flow for Google Calendar API
export const authenticateGoogleAPI = (tokens) => {
  oauth2Client.setCredentials(tokens);
};

// Create event on Google Calendar
export const createCalendarEvent = async (email, eventDetails) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: eventDetails.summary,
      description: eventDetails.description,
      start: {
        dateTime: eventDetails.start,
        timeZone: 'UTC',
      },
      end: {
        dateTime: eventDetails.end,
        timeZone: 'UTC',
      },
      attendees: [
        { email },
      ],
      reminders: {
        useDefault: true,
      },
    };

    // Create the event
    const res = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    return res.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};
