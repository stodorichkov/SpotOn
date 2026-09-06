import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  TextField,
  Box
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface NumberRangeDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fromLabel: string;
  toLabel: string;
  fromValue: number | null;
  toValue: number | null;
  onApply: (fromValue: number | null, toValue: number | null) => void;
  min?: number;
}

const NumberRangeDialog: React.FC<NumberRangeDialogProps> = ({
  open,
  onClose,
  title,
  fromLabel,
  toLabel,
  fromValue,
  toValue,
  onApply,
  min = 0
}) => {
  const { t } = useTranslation();
  const [draftFrom, setDraftFrom] = useState<string>(fromValue === null ? '' : String(fromValue));
  const [draftTo, setDraftTo] = useState<string>(toValue === null ? '' : String(toValue));

  useEffect(() => {
    if (open) {
      setDraftFrom(fromValue === null ? '' : String(fromValue));
      setDraftTo(toValue === null ? '' : String(toValue));
    }
  }, [open, fromValue, toValue]);

  const handleApply = () => {
    const parsedFrom = draftFrom === '' ? null : Number(draftFrom);
    const parsedTo = draftTo === '' ? null : Number(draftTo);
    onApply(parsedFrom, parsedTo);
    onClose();
  };

  const handleClear = () => {
    setDraftFrom('');
    setDraftTo('');
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label={fromLabel}
            type="number"
            fullWidth
            value={draftFrom}
            onChange={(e) => setDraftFrom(e.target.value)}
            inputProps={{ min }}
          />
          <TextField
            label={toLabel}
            type="number"
            fullWidth
            value={draftTo}
            onChange={(e) => setDraftTo(e.target.value)}
            inputProps={{ min }}
          />
        </Box>
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

export default NumberRangeDialog;
