import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './slices/searchSlice'
import userReducer from './slices/userSlice'
import repoReducer from './slices/repoSlice'

export const store = configureStore({
  reducer: {
    search: searchReducer,
    user: userReducer,
    repo: repoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch