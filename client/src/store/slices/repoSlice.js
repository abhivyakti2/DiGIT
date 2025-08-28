import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4444/api'

// Async thunks for repository-related API calls
export const fetchRepoDetails = createAsyncThunk(
  'repo/fetchRepoDetails',
  async ({ owner, repo }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/details/${owner}/${repo}`)
      return {
        description: response.data.description,
        languages: response.data.languages,
        readmeHtml: response.data.readme,
        commits: response.data.commits,
        issues: response.data.open_issues,
        readme: response.data.readme,
        stars: response.data.stars,
        forks: response.data.forks,
        created_at: response.data.created_at,
        website: response.data.website
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch repository details')
    }
  }
)

export const fetchRepoCommitActivity = createAsyncThunk(
  'repo/fetchRepoCommitActivity',
  async ({ owner, repo }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/commits/${owner}/${repo}/activity`)
      const activity = response.data.activity || []
      if (Array.isArray(activity) && activity.length === 0) {
        throw new Error('Commit activity empty - retrying...')
      }
      return activity
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch commit activity')
    }
  }
)

export const fetchRepoContributors = createAsyncThunk(
  'repo/fetchRepoContributors',
  async ({ owner, repo }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/contributors/${owner}/${repo}`)
      return response.data.contributors || []
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contributors')
    }
  }
)

export const fetchRepoCommits = createAsyncThunk(
  'repo/fetchRepoCommits',
  async ({ owner, repo, page = 1, perPage = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/details/${owner}/${repo}/commits`, {
        params: { page, per_page: perPage }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch commits')
    }
  }
)

export const fetchRepoIssues = createAsyncThunk(
  'repo/fetchRepoIssues',
  async ({ owner, repo, page = 1, perPage = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/details/${owner}/${repo}/issues`, {
        params: { page, per_page: perPage }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch issues')
    }
  }
)

export const fetchRepoTree = createAsyncThunk(
  'repo/fetchRepoTree',
  async ({ owner, repo, branch = 'main' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/github/tree`, {
        params: { owner, repo, branch },
      })
      return response.data.tree || []
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch repository tree')
    }
  }
)

export const fetchFileContent = createAsyncThunk(
  'repo/fetchFileContent',
  async ({ owner, repo, path, branch = 'main' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/file/content`, {
        params: { owner, repo, path, branch },
      })
      return { path, content: response.data.content || '' }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch file content')
    }
  }
)

const initialState = {
  // Current repository details
  currentRepo: {
    data: null,
    loading: false,
    error: null,
  },
  // Commit activity
  commitActivity: {
    data: [],
    loading: false,
    error: null,
  },
  // Contributors
  contributors: {
    data: [],
    loading: false,
    error: null,
  },
  // Commits
  commits: {
    data: [],
    loading: false,
    error: null,
    currentPage: 1,
  },
  // Issues
  issues: {
    data: [],
    loading: false,
    error: null,
    currentPage: 1,
  },
  // Repository tree
  tree: {
    data: [],
    loading: false,
    error: null,
  },
  // File contents (path -> content)
  fileContents: {},
  // Loading states for individual files
  fileLoadingStates: {},
}

const repoSlice = createSlice({
  name: 'repo',
  initialState,
  reducers: {
    clearCurrentRepo: (state) => {
      state.currentRepo = {
        data: null,
        loading: false,
        error: null,
      }
    },
    clearRepoData: (state) => {
      return initialState
    },
    setCommitsPage: (state, action) => {
      state.commits.currentPage = action.payload
    },
    setIssuesPage: (state, action) => {
      state.issues.currentPage = action.payload
    },
  },
  extraReducers: (builder) => {
    // Fetch repository details
    builder
      .addCase(fetchRepoDetails.pending, (state) => {
        state.currentRepo.loading = true
        state.currentRepo.error = null
      })
      .addCase(fetchRepoDetails.fulfilled, (state, action) => {
        state.currentRepo.loading = false
        state.currentRepo.data = action.payload
      })
      .addCase(fetchRepoDetails.rejected, (state, action) => {
        state.currentRepo.loading = false
        state.currentRepo.error = action.payload
      })
    
    // Fetch commit activity
    builder
      .addCase(fetchRepoCommitActivity.pending, (state) => {
        state.commitActivity.loading = true
        state.commitActivity.error = null
      })
      .addCase(fetchRepoCommitActivity.fulfilled, (state, action) => {
        state.commitActivity.loading = false
        state.commitActivity.data = action.payload
      })
      .addCase(fetchRepoCommitActivity.rejected, (state, action) => {
        state.commitActivity.loading = false
        state.commitActivity.error = action.payload
      })
    
    // Fetch contributors
    builder
      .addCase(fetchRepoContributors.pending, (state) => {
        state.contributors.loading = true
        state.contributors.error = null
      })
      .addCase(fetchRepoContributors.fulfilled, (state, action) => {
        state.contributors.loading = false
        state.contributors.data = action.payload
      })
      .addCase(fetchRepoContributors.rejected, (state, action) => {
        state.contributors.loading = false
        state.contributors.error = action.payload
      })
    
    // Fetch commits
    builder
      .addCase(fetchRepoCommits.pending, (state) => {
        state.commits.loading = true
        state.commits.error = null
      })
      .addCase(fetchRepoCommits.fulfilled, (state, action) => {
        state.commits.loading = false
        state.commits.data = action.payload
      })
      .addCase(fetchRepoCommits.rejected, (state, action) => {
        state.commits.loading = false
        state.commits.error = action.payload
      })
    
    // Fetch issues
    builder
      .addCase(fetchRepoIssues.pending, (state) => {
        state.issues.loading = true
        state.issues.error = null
      })
      .addCase(fetchRepoIssues.fulfilled, (state, action) => {
        state.issues.loading = false
        state.issues.data = action.payload
      })
      .addCase(fetchRepoIssues.rejected, (state, action) => {
        state.issues.loading = false
        state.issues.error = action.payload
      })
    
    // Fetch repository tree
    builder
      .addCase(fetchRepoTree.pending, (state) => {
        state.tree.loading = true
        state.tree.error = null
      })
      .addCase(fetchRepoTree.fulfilled, (state, action) => {
        state.tree.loading = false
        state.tree.data = action.payload
      })
      .addCase(fetchRepoTree.rejected, (state, action) => {
        state.tree.loading = false
        state.tree.error = action.payload
      })
    
    // Fetch file content
    builder
      .addCase(fetchFileContent.pending, (state, action) => {
        const path = action.meta.arg.path
        state.fileLoadingStates[path] = true
      })
      .addCase(fetchFileContent.fulfilled, (state, action) => {
        const { path, content } = action.payload
        state.fileContents[path] = content
        state.fileLoadingStates[path] = false
      })
      .addCase(fetchFileContent.rejected, (state, action) => {
        const path = action.meta.arg.path
        state.fileLoadingStates[path] = false
      })
  },
})

export const {
  clearCurrentRepo,
  clearRepoData,
  setCommitsPage,
  setIssuesPage,
} = repoSlice.actions

export default repoSlice.reducer