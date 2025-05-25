import { CookieManager } from '../utils/cookieManager.js';

/**
 * Manages user welcome experience
 */
export class WelcomeManager {
  constructor() {
    this.userName = CookieManager.getCookie('userName');
  }

  /**
   * Show welcome dialog if first visit
   */
  async showWelcomeDialog() {
    if (!this.userName) {
      const name = prompt("Welcome to Community Events!\nWhat's your name?");

      if (name) {
        this.userName = name;
        CookieManager.setCookie('userName', name);
        this.updateUserInfo();
      } else {
        alert("Please enter your name!");
      }
    } else {
      this.updateUserInfo();
    }
  }

  /**
   * Update user info in navbar
   */
  updateUserInfo() {
    const userInfo = document.getElementById('userInfo');
    userInfo.textContent = `Welcome, ${this.userName}!`;
  }

  /**
   * Get user's name
   */
  getUserName() {
    return this.userName;
  }
}
