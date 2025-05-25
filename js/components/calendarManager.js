/**
 * Manages calendar and reminders
 */
export class CalendarManager {
  constructor(events) {
    this.events = events;
    this.registeredEvents = new Set();
  }

  /**
   * Initialize calendar view
   */
  initializeCalendar() {
    const calendarContainer = document.getElementById('calendarContainer');
    if (!calendarContainer) return;

    const upcomingEvents = this.getUpcomingEvents();
    calendarContainer.innerHTML = this.generateCalendarHTML(upcomingEvents);
  }

  /**
   * Get upcoming events
   */
  getUpcomingEvents() {
    const now = new Date();
    return this.events.filter(event => new Date(event.date) > now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  /**
   * Generate calendar HTML
   */
  generateCalendarHTML(events) {
    return `
      <div class="calendar-wrapper">
        <h3>Upcoming Events</h3>
        ${events.map(event => `
          <div class="calendar-event ${this.registeredEvents.has(event.id) ? 'registered' : ''}">
            <div class="event-date">${new Date(event.date).toLocaleDateString()}</div>
            <div class="event-title">${event.name}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /**
   * Add event to registered list
   */
  addRegisteredEvent(eventId) {
    this.registeredEvents.add(eventId);
    this.initializeCalendar();
  }
}