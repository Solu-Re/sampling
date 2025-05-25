import { Event } from './models/Event.js';
import { EventService } from './services/eventService.js';
import { EventRenderer } from './components/eventRenderer.js';
import { FilterManager } from './components/filterManager.js';
import { ModalManager } from './components/modalManager.js';
import { FormManager } from './components/formManager.js';
import { NotificationManager } from './utils/notificationManager.js';
import { WelcomeManager } from './components/welcomeManager.js';
import { CalendarManager } from './components/calendarManager.js';

// Create instances of managers and services
const eventService = new EventService();
const eventRenderer = new EventRenderer();
const filterManager = new FilterManager();
const modalManager = new ModalManager();
const formManager = new FormManager();
const notificationManager = new NotificationManager();
const welcomeManager = new WelcomeManager();
let calendarManager;

// DOM Elements
const eventsContainer = document.getElementById('eventsContainer');
const loadingSpinner = document.getElementById('loadingSpinner');
const welcomeScreen = document.getElementById('welcomeScreen');
const mainContent = document.getElementById('mainContent');
const welcomeForm = document.getElementById('welcomeForm');

// Function to handle welcome form submission
function handleWelcomeForm(e) {
    e.preventDefault();
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();
    
    if (name) {
        welcomeManager.setUserName(name);
        welcomeScreen.classList.add('hidden');
        mainContent.classList.remove('hidden');
        initApp();
    }
}

// Function to initialize the application
async function initApp() {
    try {
        // Check if user has entered their name
        const userName = welcomeManager.getUserName();
        if (!userName) {
            welcomeScreen.classList.remove('hidden');
            mainContent.classList.add('hidden');
            return;
        }

        // Show loading spinner
        loadingSpinner.style.display = 'flex';
        
        // Update user info in header
        welcomeManager.updateUserInfo();
        
        // Wait for event data to load
        const events = await eventService.fetchEvents();
        
        // Initialize calendar
        calendarManager = new CalendarManager(events);
        calendarManager.initializeCalendar();
        
        // Render events
        eventRenderer.renderEvents(events, eventsContainer);
        
        // Setup event listeners for filters
        filterManager.setupFilters(events, eventRenderer, eventsContainer);
        
        // Setup modal and form handlers
        modalManager.setupModal();
        formManager.setupForm(eventService, modalManager, notificationManager, welcomeManager, calendarManager);
        
        // Hide loading spinner
        loadingSpinner.style.display = 'none';
        
        // Show welcome notification
        notificationManager.showNotification(
            `Welcome back, ${welcomeManager.getUserName()}! 👋`,
            'success'
        );
    } catch (error) {
        console.error('Error initializing application:', error);
        loadingSpinner.style.display = 'none';
        notificationManager.showNotification(
            'Failed to load events. Please try again later.',
            'error'
        );
    }
}

// Set up welcome form listener
welcomeForm.addEventListener('submit', handleWelcomeForm);

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', initApp);