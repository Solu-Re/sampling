import { EventService } from './services/eventService.js';
import { WelcomeManager } from './components/welcomeManager.js';

class CalendarPage {
    constructor() {
        this.eventService = new EventService();
        this.welcomeManager = new WelcomeManager();
        this.registeredEventsContainer = document.getElementById('registeredEvents');
    }

    async initialize() {
        // Check if user is logged in
        const userName = this.welcomeManager.getUserName();
        if (!userName) {
            window.location.href = 'index.html';
            return;
        }

        // Update user info in header
        this.welcomeManager.updateUserInfo();

        // Load and display registered events
        await this.loadRegisteredEvents();
    }

    async loadRegisteredEvents() {
        try {
            await this.eventService.fetchEvents();
            const userName = this.welcomeManager.getUserName();
            const registeredEvents = this.eventService.getUserRegisteredEvents(userName);

            if (registeredEvents.length === 0) {
                this.showNoEventsMessage();
                return;
            }

            this.displayRegisteredEvents(registeredEvents);
        } catch (error) {
            console.error('Error loading registered events:', error);
        }
    }

    displayRegisteredEvents(events) {
        this.registeredEventsContainer.innerHTML = events.map(event => `
            <div class="registered-event-card fade-in">
                <div class="registered-event-date">${event.getFormattedDate()}</div>
                <h3 class="registered-event-title">${event.name}</h3>
                <div class="registered-event-location">${event.location}</div>
                <p>${event.description}</p>
            </div>
        `).join('');
    }

    showNoEventsMessage() {
        this.registeredEventsContainer.innerHTML = `
            <div class="no-events-message">
                <h2>No Registered Events</h2>
                <p>You haven't registered for any events yet.</p>
                <a href="index.html" class="btn btn-primary">Browse Events</a>
            </div>
        `;
    }
}

// Initialize calendar page
document.addEventListener('DOMContentLoaded', () => {
    const calendarPage = new CalendarPage();
    calendarPage.initialize();
});