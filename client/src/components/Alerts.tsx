import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { removeAlert, Alert as AlertType } from '../features/alerts/alertsSlice';
import { Alert, Box } from '@mui/material';

const AlertItem = ({ alert }: { alert: AlertType }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeAlert(alert.id));
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [alert.id, dispatch]);

  return (
    <Alert
      severity={alert.type}
      onClose={() => dispatch(removeAlert(alert.id))}
      variant="filled"
    >
      {alert.message}
    </Alert>
  );
};

const Alerts = () => {
  const alerts = useSelector((state: RootState) => state.alerts.alerts);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1400,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {alerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} />
      ))}
    </Box>
  );
};

export default Alerts;