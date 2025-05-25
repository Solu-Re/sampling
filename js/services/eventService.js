import { Event } from '../models/Event.js';
import { mockEvents } from './mockData.js';
import { CookieManager } from '../utils/cookieManager.js';

/**
 * Service for handling event data operations
 */
export class EventService {
  constructor() {
    this.events = [];
    this.registrations = new Map();
    this.loadRegistrations();
  }

  /**
   * Load saved registrations from cookies
   */
  loadRegistrations() {
    const savedRegistrations = CookieManager.getCookie('eventRegistrations');
    if (savedRegistrations) {
      this.registrations = new Map(JSON.parse(savedRegistrations));
    }
  }

  /**
   * Save registrations to cookies
   */
  saveRegistrations() {
    CookieManager.setCookie('eventRegistrations', 
      JSON.stringify(Array.from(this.registrations.entries()))
    );
  }

  /**
   * Fetch events from mock API
   */
  async fetchEvents() {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      this.events = mockEvents.map(eventData => new Event(eventData));
      return this.events;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw new Error('Failed to fetch events');
    }
  }

  /**
   * Register a user for an event
   */
  async registerForEvent(registrationData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { eventId, name, email, phone } = registrationData;
      const event = this.events.find(event => event.id === eventId);
      
      if (!event) {
        throw new Error('Event not found');
      }
      
      if (!event.checkAvailability()) {
        throw new Error('No seats available for this event');
      }
      
      event.registerAttendee();
      
      if (!this.registrations.has(eventId)) {
        this.registrations.set(eventId, []);
      }
      
      const registration = {
        id: Date.now().toString(),
        eventId,
        name,
        email,
        phone,
        timestamp: new Date()
      };
      
      this.registrations.get(eventId).push(registration);
      this.saveRegistrations();
      
      return {
        success: true,
        registration,
        event
      };
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  }

  /**
   * Get user's registered events
   */
  getUserRegisteredEvents(userName) {
    const registeredEventIds = new Set();
    
    this.registrations.forEach((registrations, eventId) => {
      if (registrations.some(reg => reg.name === userName)) {
        registeredEventIds.add(eventId);
      }
    });
    
    return this.events.filter(event => registeredEventIds.has(event.id));
  }

  getEventsByCategory(category) {
    if (category === 'all') return this.events;
    return this.events.filter(event => event.category === category);
  }

  getEventsByLocation(location) {
    if (location === 'all') return this.events;
    return this.events.filter(event => event.location === location);
  }

  searchEvents(query) {
    if (!query) return this.events;
    
    const searchTerm = query.toLowerCase();
    return this.events.filter(event => 
      event.name.toLowerCase().includes(searchTerm) || 
      event.description.toLowerCase().includes(searchTerm)
    );
  }

  getRegistrationsByCategory(category) {
    let count = 0;
    return () => {
      count = 0;
      const categoryEvents = this.getEventsByCategory(category);
      const categoryEventIds = categoryEvents.map(event => event.id);
      
      for (const [eventId, registrations] of this.registrations.entries()) {
        if (categoryEventIds.includes(eventId)) {
          count += registrations.length;
        }
      }
      
      return count;
    };
  }
}