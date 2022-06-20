import applicationReducer from '../features/applicationSlice'
import { configureStore } from '@reduxjs/toolkit'
import logger from '../features/logger'
import walletConnectReducer from '../features/walletConnectSlice'

const store = configureStore({
  reducer: {
    walletConnect: walletConnectReducer,
    application: applicationReducer,
  },
  preloadedState: {},
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})

export type StoreGetSate = typeof store.getState
export type RootState = ReturnType<StoreGetSate>
export type AppDispatch = typeof store.dispatch

export default store
