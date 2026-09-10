import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export type SortDirection = 'asc' | 'desc';

export interface SortFieldOption {
  value: string;
  label: string;
}

interface SortDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: SortFieldOption[];
  field: string;
  direction: SortDirection;
  onFieldSelect: (value: string) => void;
  onDirectionSelect: (value: SortDirection) => void;
}

const SortDialog: React.FC<SortDialogProps> = ({
  open,
  onClose,
  title,
  fields,
  field,
  direction,
  onFieldSelect,
  onDirectionSelect
}) => {
  const { t } = useTranslation();

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
      <DialogContent dividers sx={{ p: 0 }}>
        <List disablePadding subheader={<ListSubheader>{t('common.sortByField')}</ListSubheader>}>
          {fields.map((option) => {
            const isSelected = option.value === field;
            return (
              <ListItemButton
                key={option.value}
                selected={isSelected}
                onClick={() => onFieldSelect(option.value)}
              >
                <ListItemText
                  primary={option.label}
                  primaryTypographyProps={{ fontWeight: isSelected ? 'bold' : 'normal' }}
                />
                {isSelected && (
                  <ListItemIcon sx={{ minWidth: 'auto', color: 'primary.main' }}>
                    <CheckIcon />
                  </ListItemIcon>
                )}
              </ListItemButton>
            );
          })}
        </List>
        <Divider />
        <List disablePadding subheader={<ListSubheader>{t('common.sortDirection')}</ListSubheader>}>
          {([
            { value: 'asc' as const, label: t('common.ascending'), icon: <ArrowUpwardIcon fontSize="small" /> },
            { value: 'desc' as const, label: t('common.descending'), icon: <ArrowDownwardIcon fontSize="small" /> }
          ]).map((option) => {
            const isSelected = option.value === direction;
            return (
              <ListItemButton
                key={option.value}
                selected={isSelected}
                onClick={() => onDirectionSelect(option.value)}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{option.icon}</ListItemIcon>
                <ListItemText
                  primary={option.label}
                  primaryTypographyProps={{ fontWeight: isSelected ? 'bold' : 'normal' }}
                />
                {isSelected && (
                  <ListItemIcon sx={{ minWidth: 'auto', color: 'primary.main' }}>
                    <CheckIcon />
                  </ListItemIcon>
                )}
              </ListItemButton>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default SortDialog;
