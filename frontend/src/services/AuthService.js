/**
 * AuthService - Handles user authentication, token management, and user data storage
 */
class AuthService {
  constructor() {
    this.token = localStorage.getItem('token') || null;
    this.user = JSON.parse(localStorage.getItem('user')) || null;
  }

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Promise with login response
   */
  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      this.setToken(data.token);
      this.setUser(data.user);

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise with registration response
   */
  async register(userData) {
    try {
      const response = await fetch('/api/auth/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Logout the current user
   */
  logout() {
    // Clear token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token = null;
    this.user = null;

    // Dispatch logout event for components to react
    window.dispatchEvent(new Event('auth-logout'));
  }

  /**
   * Set authentication token
   * @param {string} token - JWT token
   */
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  /**
   * Get the current authentication token
   * @returns {string|null} - JWT token or null if not authenticated
   */
  getToken() {
    return this.token;
  }

  /**
   * Set user data
   * @param {Object} user - User data object
   */
  setUser(user) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
    
    // Dispatch login event for components to react
    window.dispatchEvent(new Event('auth-login'));
  }

  /**
   * Get the current user data
   * @returns {Object|null} - User data or null if not authenticated
   */
  getUser() {
    return this.user;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if authenticated, false otherwise
   */
  isAuthenticated() {
    return !!this.token;
  }

  /**
   * Check if user is an admin
   * @returns {boolean} - True if user is admin, false otherwise
   */
  isAdmin() {
    return this.user && this.user.role === 'admin';
  }

  /**
   * Get authorization headers for API requests
   * @returns {Object} - Headers object with Authorization
   */
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise} - Promise with update response
   */
  async updateProfile(userData) {
    try {
      const response = await fetch('/api/user/update_profile.php', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      // Update stored user data
      this.setUser({...this.user, ...userData});

      return data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} - Promise with password change response
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await fetch('/api/user/change_password.php', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password change failed');
      }

      return data;
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }
  
  /**
   * Follow a congress
   * @param {number} congressId - Congress ID to follow
   * @returns {Promise} - Promise with follow response
   */
  async followCongress(congressId) {
    try {
      const response = await fetch('/api/follow/congress.php', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ congress_id: congressId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to follow congress');
      }

      return data;
    } catch (error) {
      console.error('Follow congress error:', error);
      throw error;
    }
  }
  
  /**
   * Follow a residency
   * @param {number} residencyId - Residency ID to follow
   * @returns {Promise} - Promise with follow response
   */
  async followResidency(residencyId) {
    try {
      const response = await fetch('/api/follow/residency.php', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ residency_id: residencyId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to follow residency');
      }

      return data;
    } catch (error) {
      console.error('Follow residency error:', error);
      throw error;
    }
  }

  /**
   * Login with Google ID token
   * @param {string} token - Google ID token
   * @returns {Promise} - Promise with login response
   */
  async loginWithGoogle(token) {
    try {
      const response = await fetch('/api/auth/google-login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Google login failed');
      }

      // Store token and user data
      this.setToken(data.token);
      this.setUser(data.user);

      return data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const authService = new AuthService();

export default authService; 