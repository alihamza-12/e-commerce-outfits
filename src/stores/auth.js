import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null) || null,
    isAuthenticated: false,
    loading: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdminSetup: () => {
      return typeof localStorage !== 'undefined' ? 
        !!(localStorage.getItem('adminEmail') && localStorage.getItem('adminPassword')) : 
        false;
    }
  },

  actions: {
    async login(credentials) {
      this.loading = true;
      const storedEmail = typeof localStorage !== 'undefined' ? localStorage.getItem('adminEmail') : null;
      const storedPassword = typeof localStorage !== 'undefined' ? localStorage.getItem('adminPassword') : null;

      if (credentials.email === storedEmail && credentials.password === storedPassword) {
        this.isAuthenticated = true;
        this.token = 'admin-token'; // Simple token for local storage auth
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('token', this.token);
        }
        return { message: 'Login successful' };
      } else {
        throw new Error('Invalid credentials');
      }
    },

    async logout() {
      try {
        this.token = null;
        this.user = null;
        this.isAuthenticated = false;
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Logout error:', error);
      }
    },

    async registerAdmin(credentials) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('adminEmail', credentials.email);
        localStorage.setItem('adminPassword', credentials.password);
      }
      console.log('Admin registered successfully:', credentials);
      return { message: 'Admin registered successfully' };
    },

    async initializeAuth() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        await this.fetchUser();
      }
    },

    async fetchUser() {
      if (!this.token) return;
      try {
        const response = await axios.get('/api/auth/user');
        this.user = response.data;
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Fetch user error:', error);
        if (error.response?.status === 401) {
          this.logout();
        }
      }
    },

    async checkAdminSetup() {
      return this.isAdminSetup;
    }
  }
});
