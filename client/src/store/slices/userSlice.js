import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4444/api'

// Async thunks for user-related API calls
export const fetchUserDetails = createAsyncThunk(
  'user/fetchUserDetails',
  async (username, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/users/${username}`)
      return response.data.user
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user details')
    }
  }
)

export const fetchUserRepos = createAsyncThunk(
  'user/fetchUserRepos',
  async ({ username, filterByName, sortBy }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/repos/${username}`, {
        params: { filterByName, sortBy }
      })
      return response.data.repositories || []
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user repositories')
    }
  }
)

const initialState = {
  // Current user details
  currentUser: {
    data: null,
    loading: false,
    error: null,
  },
  // User repositories
  userRepos: {
    data: [],
    loading: false,
    error: null,
  },
  // Cache for user details (username -> user data)
  userCache: {},
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = {
        data: null,
        loading: false,
        error: null,
      }
    },
    clearUserRepos: (state) => {
      state.userRepos = {
        data: [],
        loading: false,
        error: null,
      }
    },
    cacheUserData: (state, action) => {
      const { username, userData } = action.payload
      state.userCache[username] = userData
    },
  },
  extraReducers: (builder) => {
    // Fetch user details
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.currentUser.loading = true
        state.currentUser.error = null
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.currentUser.loading = false
        state.currentUser.data = action.payload
        // Cache the user data
        if (action.payload?.username) {
          state.userCache[action.payload.username] = action.payload
        }
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.currentUser.loading = false
        state.currentUser.error = action.payload
      })
    
    // Fetch user repositories
    builder
      .addCase(fetchUserRepos.pending, (state) => {
        state.userRepos.loading = true
        state.userRepos.error = null
      })
      .addCase(fetchUserRepos.fulfilled, (state, action) => {
        state.userRepos.loading = false
        state.userRepos.data = action.payload
      })
      .addCase(fetchUserRepos.rejected, (state, action) => {
        state.userRepos.loading = false
        state.userRepos.error = action.payload
      })
  },
})

export const {
  clearCurrentUser,
  clearUserRepos,
  cacheUserData,
} = userSlice.actions

export default userSlice.reducer