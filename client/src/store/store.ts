import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { api } from '../services/api';
import registerFormReducer from '../features/auth/registerSlice';
import loginFormReducer from '../features/auth/loginSlice';
import authReducer from '../features/auth/authSlice';
import alertsReducer from '../features/alerts/alertsSlice';
import changePasswordFormReducer from '../features/auth/changePasswordSlice';
import { rtkQueryErrorLogger } from './middleware';

const rootReducer = combineReducers({
  auth: authReducer,
  registerForm: registerFormReducer,
  loginForm: loginFormReducer,
  alerts: alertsReducer,
  changePasswordForm: changePasswordFormReducer,
  [api.reducerPath]: api.reducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
  blacklist: [api.reducerPath, 'registerForm', 'loginForm', 'alerts'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware, rtkQueryErrorLogger),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;