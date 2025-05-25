/**
 * Handles rendering events to the DOM
 */
export class EventRenderer {
  /**
   * Render event cards to container
   * @param {Array} events - Array of Event objects 
   * @param {HTMLElement} container - Container element
   */
  renderEvents(events, container) {
    // Clear container
    container.innerHTML = '';
    
    if (events.length === 0) {
      this.renderNoEventsMessage(container);
      return;
    }
    
    // Create and append event cards
    events.forEach(event => {
      const eventCard = this.createEventCard(event);
      container.appendChild(eventCard);
    });
  }
  
  /**
   * Create an event card element
   * @param {Event} event - Event object
   * @returns {HTMLElement} Event card element
   */
  createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card fade-in';
    card.dataset.eventId = event.id;
    card.dataset.category = event.category;
    card.dataset.location = event.location;
    
    // Only show upcoming events with available seats
    if (!event.isUpcoming()) {
      card.classList.add('past-event');
    }
    
    const isAvailable = event.checkAvailability();
    
    card.innerHTML = `
      <img src="${event.image}" alt="${event.name}" class="event-image">
      <div class="event-content">
        <span class="event-category category-${event.category}">${this.formatCategory(event.category)}</span>
        <h2 class="event-title">${event.name}</h2>
        <div class="event-date">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
          </svg>
          ${event.getFormattedDate()}
        </div>
        <div class="event-location">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
          </svg>
          ${this.formatLocation(event.location)}
        </div>
        <p class="event-description">${event.description}</p>
        <div class="event-footer">
          <span class="${event.getSeatStatusClass()}">${event.getSeatStatusText()}</span>
          <button class="btn btn-primary register-btn" ${!isAvailable ? 'disabled' : ''} data-event-id="${event.id}">
            ${isAvailable ? 'Register Now' : 'Sold Out'}
          </button>
        </div>
      </div>
    `;
    
    // Add event listener to register button
    const registerBtn = card.querySelector('.register-btn');
    if (registerBtn && !registerBtn.disabled) {
      registerBtn.addEventListener('click', () => {
        this.handleRegisterClick(event);
      });
    }
    
    return card;
  }
  
  /**
   * Format category name for display
   * @param {string} category - Category slug
   * @returns {string} Formatted category name
   */
  formatCategory(category) {
    const categories = {
      'music': 'Music',
      'art': 'Art',
      'food': 'Food',
      'sports': 'Sports',
      'workshop': 'Workshop',
      'volunteer': 'Volunteer',
      'education': 'Education'
    };
    
    return categories[category] || category.charAt(0).toUpperCase() + category.slice(1);
  }
  
  /**
   * Format location name for display
   * @param {string} location - Location slug
   * @returns {string} Formatted location name
   */
  formatLocation(location) {
    const locations = {
      'downtown': 'Downtown',
      'park': 'City Park',
      'library': 'Community Library',
      'gallery': 'Art Gallery',
      'community_center': 'Community Center',
      'sports_center': 'Sports Center',
      'hall': 'Town Hall'
    };
    
    return locations[location] || location.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  
  /**
   * Handle register button click
   * @param {Event} event - Event object
   */
  handleRegisterClick(event) {
    // Dispatch custom event to be handled by modal manager
    const customEvent = new CustomEvent('open-registration-modal', { 
      detail: { event }
    });
    document.dispatchEvent(customEvent);
  }
  
  /**
   * Render a message when no events are found
   * @param {HTMLElement} container - Container element
   */
  renderNoEventsMessage(container) {
    const message = document.createElement('div');
    message.className = 'no-events-message';
    message.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
      </svg>
      <h2>No events found</h2>
      <p>Try adjusting your filters or search terms.</p>
    `;
    container.appendChild(message);
  }
}