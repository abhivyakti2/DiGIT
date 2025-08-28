import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4444/api'

// Async thunks for API calls
export const searchProfiles = createAsyncThunk(
  'search/searchProfiles',
  async ({ query, page = 1, perPage = 6 }, { rejectWithValue }) => {
    try {
      if (!query) return { users: [], totalCount: 0 }
      const response = await axios.get(`${API_URL}/users/search`, {
        params: { q: query, page, perPage },
      })
      return response.data || { users: [], totalCount: 0 }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search profiles')
    }
  }
)

export const searchRepositories = createAsyncThunk(
  'search/searchRepositories',
  async ({ query, page = 1, perPage = 100 }, { rejectWithValue }) => {
    try {
      if (!query) return { repositories: [], totalCount: 0 }
      const response = await axios.get(`${API_URL}/repos/search`, {
        params: { q: query, page, perPage },
      })
      return response.data || { repositories: [], totalCount: 0 }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search repositories')
    }
  }
)

const initialState = {
  // Search results
  profiles: {
    data: [],
    totalCount: 0,
    currentPage: 1,
    loading: false,
    error: null,
  },
  repositories: {
    data: [],
    totalCount: 0,
    currentPage: 1,
    loading: false,
    error: null,
  },
  // Recent searches (max 5)
  recentSearches: JSON.parse(localStorage.getItem('recentSearches') || '[]'),
  // Current search state
  currentQuery: '',
  currentType: 'profiles',
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setCurrentQuery: (state, action) => {
      state.currentQuery = action.payload
    },
    setCurrentType: (state, action) => {
      state.currentType = action.payload
    },
    addRecentSearch: (state, action) => {
      const query = action.payload.trim()
      if (!query) return
      
      // Remove if already exists
      state.recentSearches = state.recentSearches.filter(search => search !== query)
      
      // Add to beginning
      state.recentSearches.unshift(query)
      
      // Keep only 5 most recent
      state.recentSearches = state.recentSearches.slice(0, 5)
      
      // Save to localStorage
      localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches))
    },
    clearRecentSearches: (state) => {
      state.recentSearches = []
      localStorage.removeItem('recentSearches')
    },
    resetSearchResults: (state) => {
      state.profiles = {
        data: [],
        totalCount: 0,
        currentPage: 1,
        loading: false,
        error: null,
      }
      state.repositories = {
        data: [],
        totalCount: 0,
        currentPage: 1,
        loading: false,
        error: null,
      }
    },
  },
  extraReducers: (builder) => {
    // Search profiles
    builder
      .addCase(searchProfiles.pending, (state) => {
        state.profiles.loading = true
        state.profiles.error = null
      })
      .addCase(searchProfiles.fulfilled, (state, action) => {
        state.profiles.loading = false
        state.profiles.data = action.payload.users || []
        state.profiles.totalCount = action.payload.totalCount || 0
        state.profiles.currentPage = action.payload.currentPage || 1
      })
      .addCase(searchProfiles.rejected, (state, action) => {
        state.profiles.loading = false
        state.profiles.error = action.payload
      })
    
    // Search repositories
    builder
      .addCase(searchRepositories.pending, (state) => {
        state.repositories.loading = true
        state.repositories.error = null
      })
      .addCase(searchRepositories.fulfilled, (state, action) => {
        state.repositories.loading = false
        state.repositories.data = action.payload.repositories || []
        state.repositories.totalCount = action.payload.totalCount || 0
        state.repositories.currentPage = action.payload.currentPage || 1
      })
      .addCase(searchRepositories.rejected, (state, action) => {
        state.repositories.loading = false
        state.repositories.error = action.payload
      })
  },
})

export const {
  setCurrentQuery,
  setCurrentType,
  addRecentSearch,
  clearRecentSearches,
  resetSearchResults,
} = searchSlice.actions

export default searchSlice.reducer