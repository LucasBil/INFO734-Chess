// stores/api.js
import { defineStore } from 'pinia'
import { errorMonitor } from 'ws';

export const useApiStore = defineStore('api', {
  state: () => ({
    apiUrl: 'http://localhost:3000/',
    token: null,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {

    // Register user
    async register(username, email, password) {
      try {
        const response = await fetch(this.apiUrl + 'auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        this.data = await response.json()
      } catch (err) {
        this.error = err.message
        console.error('Error fetching items:', err)
      }
    },


    // Login user
    async login(identifier, password) {
      try {
        const response = await fetch(this.apiUrl + 'auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ identifier, password })
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        this.token = (await response.json()).token
      } catch (err) {
        this.error = err.message
        console.error('Error logging in:', err)
      }
    },

    // Refresh token
    async refreshToken() {
      try {
        const response = await fetch(this.apiUrl + 'auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      } catch (err) {
        this.error = err.message
        console.error('Error refreshing token:', err)
      }
    },

    // Logout user
    async logout() {
      try {
        const response = await fetch(this.apiUrl + 'auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        this.token = null
      } catch (err) {
        this.error = err.message
        console.error('Error logging out:', err)
      }
    },

    // Get all games
    async fetchAllGames() {
        try {
            const response = await fetch(this.apiUrl + 'games', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data
        } catch (err) {
            this.error = err.message
            console.error('Error fetching games:', err)
        }
    },

    // Create a new game
    async createGame(sessionId, white, black) {
        try {
            const response = await fetch(this.apiUrl + 'games', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId, white, black })
            })
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }   
            const data = await response.json()
            return data
        } catch (err) {
            this.error = err.message
            console.error('Error creating game:', err)
        }
    },

    // Get all games for a user
    async fetchUserGames(userId) {
        try {
            const response = await fetch(this.apiUrl + `games/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data
        } catch (err) {
            this.error = err.message
            console.error('Error fetching user games:', err)
        }
    },

    // Get all games where user played white
    async fetchUserGames(userId) {
        try {
            const response = await fetch(this.apiUrl + `games/white/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data
        } catch (err) {
            this.error = err.message
            console.error('Error fetching user games:', err)
        }
    },

    // Get all games where user played black
    async fetchUserGames(userId) {
        try {
            const response = await fetch(this.apiUrl + `games/black/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data
        } catch (err) {
            this.error = err.message
            console.error('Error fetching user games:', err)
        }
    },

    // Get game by id
    async fetchGameById(gameId) {
        try {
            const response = await fetch(this.apiUrl + `games/${gameId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data
        } catch (err) {
            this.error = err.message
            console.error('Error fetching game by id:', err)
        }
    },

    // Update game (admin only)
    async updateGame(gameId, updateData) {
        try {
            const response = await fetch(this.apiUrl + `games/${gameId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(updateData)
            })
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data
        } catch (err) {
            this.error = err.message
            console.error('Error updating game:', err)
        }
    },

    // Delete game (admin only)
    async deleteGame(gameId) {
        try {
            const response = await fetch(this.apiUrl + `games/${gameId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                }
            })
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data
        } catch (err) {
            this.error = err.message
            console.error('Error deleting game:', err)
        }
    },

    // Add a move to a game (admin only)
    async addMoveToGame(gameId, moveData) {
        try {
            const response = await fetch(this.apiUrl + `games/${gameId}/move`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(moveData)
            })
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data
        } catch (err) {
            this.error = err.message
            console.error('Error adding move to game:', err)
        }
    },

    // Get all users
    async getAllUsers() {
        try {
            const response = await fetch(this.apiUrl + 'users', {
                 method: 'GET',
                 headers: {
                     'Content-Type': 'application/json',    
                 },
                 body: JSON.stringify()
                 })
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data
        } catch (err) {
            this.error = err.message
            console.error('Error fetching all users:', err)
        }
    },

    // Get user by username
    async getUserByUsername(username) {
        try {
            const response = await fetch(this.apiUrl + `users/username/${username}`, {
                 method: 'GET',
                 headers: {
                        'Content-Type': 'application/json',
                    },  
                    body: JSON.stringify()
                    })
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data
        } catch (err) {
            this.error = err.message
            console.error('Error fetching user by username:', err)
        }
    },

    // Get user by email
    async getUserByEmail(email) {
        try {
            const response = await fetch(this.apiUrl + `users/email/${email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify()
                    })
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data
        } catch (err) {
            this.error = err.message
            console.error('Error fetching user by email:', err)
        }   
    },

    // Get user by id
    async getUserById(userId) {
        try {
            const response = await fetch(this.apiUrl + `users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify()
                    })
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }   
            const data = await response.json()
            return data
        } catch (err) {
            this.error = err.message
            console.error('Error fetching user by id:', err)
        }
    },

    // Update user (admin only)
    async updateUser(userId, updateData) {
        try {   
            const response = await fetch(this.apiUrl + `users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(updateData)
            })
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data
        } catch (err) {
            this.error = err.message
            console.error('Error updating user:', err)
        }
    },

    // Delete user (admin only)
    async deleteUser(userId) {
        try {
            const response = await fetch(this.apiUrl + `users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                }
            })      
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            return data
        } catch (err) {
            this.error = err.message
            console.error('Error deleting user:', err)
        }
    },
}});