/**
 * Event class representing a community event
 */
export class Event {
  /**
   * Create a new Event
   * @param {Object} eventData - The event data
   */
  constructor(eventData) {
    this.id = eventData.id;
    this.name = eventData.name;
    this.description = eventData.description;
    this.date = new Date(eventData.date);
    this.category = eventData.category;
    this.location = eventData.location;
    this.image = eventData.image;
    this.totalSeats = eventData.totalSeats;
    this.availableSeats = eventData.availableSeats;
  }

  /**
   * Check if event has available seats
   * @returns {boolean} True if seats are available
   */
  checkAvailability() {
    return this.availableSeats > 0;
  }

  /**
   * Check if the event is in the future
   * @returns {boolean} True if event is upcoming
   */
  isUpcoming() {
    return this.date > new Date();
  }

  /**
   * Register a user for this event
   * @returns {boolean} True if registration was successful
   */
  registerAttendee() {
    if (this.checkAvailability()) {
      this.availableSeats--;
      return true;
    }
    return false;
  }

  /**
   * Get the formatted date string
   * @returns {string} Formatted date
   */
  getFormattedDate() {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return this.date.toLocaleDateString('en-US', options);
  }

  /**
   * Get seat availability status
   * @returns {string} Status text
   */
  getSeatStatusText() {
    if (this.availableSeats === 0) {
      return 'Sold Out';
    } else if (this.availableSeats <= 5) {
      return `Only ${this.availableSeats} seats left!`;
    } else {
      return `${this.availableSeats} seats available`;
    }
  }

  /**
   * Get seat availability class
   * @returns {string} CSS class name
   */
  getSeatStatusClass() {
    if (this.availableSeats === 0) {
      return 'seats-full';
    } else if (this.availableSeats <= 5) {
      return 'seats-limited';
    } else {
      return 'seats-available';
    }
  }
}