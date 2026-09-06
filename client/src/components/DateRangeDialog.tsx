import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  Box
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { bg } from 'date-fns/locale/bg';
import { enGB } from 'date-fns/locale/en-GB';

interface DateRangeDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fromDate: Date | null;
  toDate: Date | null;
  onApply: (fromDate: Date | null, toDate: Date | null) => void;
}

const DateRangeDialog: React.FC<DateRangeDialogProps> = ({ open, onClose, title, fromDate, toDate, onApply }) => {
  const { t, i18n } = useTranslation();
  const [draftFrom, setDraftFrom] = useState<Date | null>(fromDate);
  const [draftTo, setDraftTo] = useState<Date | null>(toDate);

  useEffect(() => {
    if (open) {
      setDraftFrom(fromDate);
      setDraftTo(toDate);
    }
  }, [open, fromDate, toDate]);

  const handleApply = () => {
    onApply(draftFrom, draftTo);
    onClose();
  };

  const handleClear = () => {
    setDraftFrom(null);
    setDraftTo(null);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pr: 6, position: 'relative' }}>
        {title}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', right: 12, top: 12, color: 'text.secondary' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={i18n.language === 'bg' ? bg : enGB}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <DatePicker
              label={t('common.fromDate')}
              value={draftFrom}
              onChange={setDraftFrom}
              maxDate={draftTo || undefined}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <DatePicker
              label={t('common.toDate')}
              value={draftTo}
              onChange={setDraftTo}
              minDate={draftFrom || undefined}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Box>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 2 }}>
        <Button
          onClick={handleClear}
          variant="contained"
          color="error"
          startIcon={<ClearIcon />}
          sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2, flex: 1 }}
        >
          {t('common.clear')}
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          color="primary"
          startIcon={<CheckIcon />}
          sx={{ textTransform: 'none', fontWeight: 'bold', borderRadius: 2, flex: 1 }}
        >
          {t('common.apply')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DateRangeDialog;
