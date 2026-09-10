import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import App from './App';

test('renders Home Page heading', () => {
  render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
  const headingElement = screen.getByText(/Home Page/i);
  expect(headingElement).toBeInTheDocument();
});
