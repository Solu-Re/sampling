import { CookieManager } from '../utils/cookieManager.js';

/**
 * Manages user welcome experience
 */
export class WelcomeManager {
    constructor() {
        this.userName = CookieManager.getCookie('userName');
    }

    /**
     * Set user's name
     */
    setUserName(name) {
        this.userName = name;
        CookieManager.setCookie('userName', name);
        this.updateUserInfo();
    }

    /**
     * Update user info in navbar
     */
    updateUserInfo() {
        const userInfo = document.getElementById('userInfo');
        if (userInfo) {
            userInfo.textContent = `Welcome, ${this.userName}!`;
        }
    }

    /**
     * Get user's name
     */
    getUserName() {
        return this.userName;
    }
}