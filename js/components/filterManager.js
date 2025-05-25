/**
 * Manages event filtering functionality
 */
export class FilterManager {
  /**
   * Set up filter event listeners
   * @param {Array} events - Array of Event objects
   * @param {EventRenderer} renderer - Event renderer instance
   * @param {HTMLElement} container - Container element
   */
  setupFilters(events, renderer, container) {
    this.events = events;
    this.renderer = renderer;
    this.container = container;
    
    // Get filter elements
    this.categoryFilter = document.getElementById('categoryFilter');
    this.locationFilter = document.getElementById('locationFilter');
    this.searchInput = document.getElementById('searchInput');
    
    // Add event listeners
    this.categoryFilter.addEventListener('change', () => this.applyFilters());
    this.locationFilter.addEventListener('change', () => this.applyFilters());
    
    // Debounce search input
    this.searchInput.addEventListener('keyup', this.debounce(() => {
      this.applyFilters();
    }, 300));
    
    // Add event listener for keydown to allow quick search
    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.applyFilters();
      }
    });
  }
  
  /**
   * Apply all filters and render filtered events
   */
  applyFilters() {
    const categoryValue = this.categoryFilter.value;
    const locationValue = this.locationFilter.value;
    const searchValue = this.searchInput.value.trim().toLowerCase();
    
    let filteredEvents = [...this.events];
    
    // Filter by category
    if (categoryValue !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.category === categoryValue);
    }
    
    // Filter by location
    if (locationValue !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.location === locationValue);
    }
    
    // Filter by search term
    if (searchValue) {
      filteredEvents = filteredEvents.filter(event => 
        event.name.toLowerCase().includes(searchValue) || 
        event.description.toLowerCase().includes(searchValue)
      );
    }
    
    // Render filtered events
    this.renderer.renderEvents(filteredEvents, this.container);
  }
  
  /**
   * Reset all filters to default values
   */
  resetFilters() {
    this.categoryFilter.value = 'all';
    this.locationFilter.value = 'all';
    this.searchInput.value = '';
    this.applyFilters();
  }
  
  /**
   * Debounce function to limit how often a function is called
   * @param {Function} func - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, delay) {
    let timeoutId;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(context, args);
      }, delay);
    };
  }
}