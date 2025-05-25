/**
 * Manages form submissions and validation
 */
export class FormManager {
  setupForm(eventService, modalManager, notificationManager, welcomeManager, calendarManager) {
    this.eventService = eventService;
    this.modalManager = modalManager;
    this.notificationManager = notificationManager;
    this.welcomeManager = welcomeManager;
    this.calendarManager = calendarManager;
    
    this.form = document.getElementById('registrationForm');
    
    // Pre-fill name field with user's name
    const nameInput = document.getElementById('userInfo');
    nameInput.value = this.welcomeManager.getUserName();
    
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });
    
    this.setupValidationListeners();
  }

  /**
   * Set up input validation listeners
   */
  setupValidationListeners() {
    // Name validation
    const nameInput = document.getElementById('userInfo');
    nameInput.addEventListener('blur', () => {
      this.validateName(nameInput.value);
    });
    
    // Email validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', () => {
      this.validateEmail(emailInput.value);
    });
    
    // Phone validation (optional)
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('blur', () => {
      if (phoneInput.value) {
        this.validatePhone(phoneInput.value);
      } else {
        document.getElementById('phoneError').textContent = '';
      }
    });
  }

  /**
   * Handle form submission
   */
  async handleFormSubmit() {
    try {
      const formData = this.getFormData();
      
      if (!this.validateForm(formData)) {
        return;
      }
      
      const submitButton = this.form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Processing...';
      
      const result = await this.eventService.registerForEvent(formData);
      
      this.modalManager.showSuccess();
      this.updateEventCard(result.event);
      this.calendarManager.addRegisteredEvent(result.event.id);
      
      this.notificationManager.showNotification(
        `You've successfully registered for ${result.event.name}!`,
        'success'
      );
      
    } catch (error) {
      this.notificationManager.showNotification(
        `Registration failed: ${error.message}`,
        'error'
      );
      
    } finally {
      const submitButton = this.form.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.textContent = 'Register Now';
    }
  }

  /**
   * Get form data as object
   * @returns {Object} Form data object
   */
  getFormData() {
    return {
      eventId: document.getElementById('eventId').value,
      name: document.getElementById('userInfo').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim()
    };
  }

  /**
   * Validate all form fields
   * @param {Object} formData - Form data object
   * @returns {boolean} True if all validations pass
   */
  validateForm(formData) {
    const nameValid = this.validateName(formData.name);
    const emailValid = this.validateEmail(formData.email);
    let phoneValid = true;
    
    if (formData.phone) {
      phoneValid = this.validatePhone(formData.phone);
    }
    
    return nameValid && emailValid && phoneValid;
  }

  /**
   * Validate name field
   * @param {string} name - Name value
   * @returns {boolean} True if valid
   */
  validateName(name) {
    const errorElement = document.getElementById('nameError');
    
    if (!name) {
      errorElement.textContent = 'Name is required';
      return false;
    }
    
    if (name.length < 2) {
      errorElement.textContent = 'Name must be at least 2 characters';
      return false;
    }
    
    errorElement.textContent = '';
    return true;
  }

  /**
   * Validate email field
   * @param {string} email - Email value
   * @returns {boolean} True if valid
   */
  validateEmail(email) {
    const errorElement = document.getElementById('emailError');
    
    if (!email) {
      errorElement.textContent = 'Email is required';
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorElement.textContent = 'Please enter a valid email address';
      return false;
    }
    
    errorElement.textContent = '';
    return true;
  }

  /**
   * Validate phone field
   * @param {string} phone - Phone value
   * @returns {boolean} True if valid
   */
  validatePhone(phone) {
    const errorElement = document.getElementById('phoneError');
    
    // Simple phone validation - allow numbers, spaces, dashes, parentheses
    const phoneRegex = /^[\d\s\-()]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      errorElement.textContent = 'Please enter a valid phone number';
      return false;
    }
    
    errorElement.textContent = '';
    return true;
  }

  /**
   * Update event card in the DOM after registration
   * @param {Event} event - Updated event object
   */
  updateEventCard(event) {
    const eventCard = document.querySelector(`.event-card[data-event-id="${event.id}"]`);
    if (eventCard) {
      // Update seats available text
      const seatsElement = eventCard.querySelector(`.${event.getSeatStatusClass()}`);
      if (seatsElement) {
        seatsElement.textContent = event.getSeatStatusText();
        
        // Update class if needed
        seatsElement.className = event.getSeatStatusClass();
      }
      
      // Update button if sold out
      if (event.availableSeats === 0) {
        const button = eventCard.querySelector('.register-btn');
        if (button) {
          button.disabled = true;
          button.textContent = 'Sold Out';
          button.removeEventListener('click', () => {});
        }
      }
    }
  }
}