/**
 * Congress API Service
 */

/**
 * Fetch congresses from the API with optional filters
 * @param {Object} filters - Filters to apply (search, state, specialty, month)
 * @returns {Promise<Array>} Array of congress objects
 */
export const fetchCongresses = async (filters = {}) => {
  try {
    // Construct URL with filter parameters
    let url = '/api/congressos.php'; // Path to PHP API that connects to MySQL database
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.state) params.append('state', filters.state);
    if (filters.specialty) params.append('specialty', filters.specialty);
    if (filters.month) params.append('month', filters.month);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Ensure consistent data format
    return data.map(congress => ({
      id: congress.id || 0,
      name: congress.name || '',
      state: congress.state || '',
      specialty: congress.specialty || '',
      location: congress.location || '',
      imageUrl: congress.image_url || 'https://via.placeholder.com/300x200',
      event_date: congress.event_date || '',
      registration_start: congress.registration_start || '',
      registration_end: congress.registration_end || '',
      website: congress.website || '#',
      description: congress.description || ''
    }));
  } catch (error) {
    console.error('Error fetching congresses:', error);
    throw error; // Propagate the error for handling in the UI
  }
};

/**
 * Follow a congress for the current user
 * @param {number} congressId - ID of the congress to follow
 * @returns {Promise<Object>} Result of the follow operation
 */
export const followCongress = async (congressId) => {
  try {
    const response = await fetch('/api/follow-congress.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ congress_id: congressId }),
      credentials: 'include' // Important for passing cookies/session data
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error following congress:', error);
    throw error;
  }
};

/**
 * Unfollow a congress for the current user
 * @param {number} congressId - ID of the congress to unfollow
 * @returns {Promise<Object>} Result of the unfollow operation
 */
export const unfollowCongress = async (congressId) => {
  try {
    const response = await fetch('/api/unfollow-congress.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ congress_id: congressId }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error unfollowing congress:', error);
    throw error;
  }
};

/**
 * Check if the current user is following a congress
 * @param {number} congressId - ID of the congress to check
 * @returns {Promise<boolean>} Whether the user is following the congress
 */
export const isFollowingCongress = async (congressId) => {
  try {
    const response = await fetch(`/api/is-following-congress.php?congress_id=${congressId}`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.following;
  } catch (error) {
    console.error('Error checking if following congress:', error);
    return false; // Default to not following on error
  }
};
