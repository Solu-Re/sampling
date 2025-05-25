import { CookieManager } from '../utils/cookieManager.js';
import Swal from 'sweetalert2';

/**
 * Manages user welcome experience
 */
export class WelcomeManager {
    constructor() {
        this.userName = CookieManager.getCookie('userName');
    }

    /**
     * Set user's name and show welcome alert
     */
    async setUserName(name) {
        this.userName = name;
        CookieManager.setCookie('userName', name);
        this.updateUserInfo();
        
        // Show welcome alert
        await Swal.fire({
            title: `Hi ${name}! 👋`,
            text: 'Welcome to Community Events!',
            icon: 'success',
            confirmButtonColor: '#3563E9',
            timer: 3000,
            timerProgressBar: true
        });
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