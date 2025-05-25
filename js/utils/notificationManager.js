/**
 * Manages application notifications
 */
export class NotificationManager {
  constructor() {
    this.container = document.getElementById('notificationContainer');
    this.timeout = 5000; // Default timeout in ms
    this.notifications = [];
  }

  /**
   * Show a notification message
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, error, warning)
   * @param {number} timeout - Custom timeout in ms (optional)
   */
  showNotification(message, type = 'success', timeout = this.timeout) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} notification-enter`;
    
    // Add unique ID
    const id = Date.now().toString();
    notification.dataset.id = id;
    
    // Add content
    notification.innerHTML = `
      <div class="notification-content">${message}</div>
      <button class="notification-close">&times;</button>
    `;
    
    // Add to container
    this.container.appendChild(notification);
    
    // Add to tracking array
    this.notifications.push({
      id,
      element: notification,
      timer: setTimeout(() => this.removeNotification(id), timeout)
    });
    
    // Setup close button
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
      this.removeNotification(id);
    });
    
    return id;
  }

  /**
   * Remove a notification
   * @param {string} id - Notification ID
   */
  removeNotification(id) {
    // Find notification in array
    const index = this.notifications.findIndex(n => n.id === id);
    
    if (index !== -1) {
      const notification = this.notifications[index];
      
      // Clear timeout
      clearTimeout(notification.timer);
      
      // Add exit animation class
      notification.element.classList.remove('notification-enter');
      notification.element.classList.add('notification-exit');
      
      // Remove after animation
      setTimeout(() => {
        if (notification.element.parentNode) {
          notification.element.parentNode.removeChild(notification.element);
        }
      }, 300);
      
      // Remove from array
      this.notifications.splice(index, 1);
    }
  }

  /**
   * Clear all notifications
   */
  clearAll() {
    // Copy array to avoid modification during iteration
    const notificationsCopy = [...this.notifications];
    
    // Remove each notification
    notificationsCopy.forEach(notification => {
      this.removeNotification(notification.id);
    });
  }
}