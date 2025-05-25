/**
 * Manages the registration modal
 */
export class ModalManager {
  constructor() {
    this.modal = document.getElementById('registrationModal');
    this.modalEventName = document.getElementById('modalEventName');
    this.eventIdInput = document.getElementById('eventId');
    this.closeButton = this.modal.querySelector('.close-button');
    this.currentEvent = null;
  }

  /**
   * Set up modal event listeners
   */
  setupModal() {
    // Close button click
    this.closeButton.addEventListener('click', () => {
      this.closeModal();
    });
    
    // Click outside modal to close
    window.addEventListener('click', (event) => {
      if (event.target === this.modal) {
        this.closeModal();
      }
    });
    
    // Listen for custom event to open modal
    document.addEventListener('open-registration-modal', (event) => {
      this.openModal(event.detail.event);
    });
    
    // Listen for escape key to close modal
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isModalOpen()) {
        this.closeModal();
      }
    });
  }

  /**
   * Open the registration modal
   * @param {Event} event - Event object
   */
  openModal(event) {
    // Save reference to current event
    this.currentEvent = event;
    
    // Update modal content
    this.modalEventName.textContent = event.name;
    this.eventIdInput.value = event.id;
    
    // Reset form
    const form = document.getElementById('registrationForm');
    form.reset();
    
    // Hide success message if visible
    document.getElementById('formSuccess').classList.add('hidden');
    
    // Clear error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(elem => {
      elem.textContent = '';
    });
    
    // Show modal
    this.modal.style.display = 'flex';
    
    // Focus first input
    setTimeout(() => {
      document.getElementById('name').focus();
    }, 100);
  }

  /**
   * Close the registration modal
   */
  closeModal() {
    this.modal.style.display = 'none';
    this.currentEvent = null;
  }

  /**
   * Check if modal is currently open
   * @returns {boolean} True if modal is open
   */
  isModalOpen() {
    return this.modal.style.display === 'flex';
  }

  /**
   * Show success message in modal
   */
  showSuccess() {
    // Hide form
    document.getElementById('registrationForm').style.display = 'none';
    
    // Show success message
    document.getElementById('formSuccess').classList.remove('hidden');
    
    // Close modal after delay
    setTimeout(() => {
      this.closeModal();
      
      // Show form again for next time
      document.getElementById('registrationForm').style.display = 'block';
    }, 3000);
  }

  /**
   * Get the current event
   * @returns {Event} Current event object
   */
  getCurrentEvent() {
    return this.currentEvent;
  }
}