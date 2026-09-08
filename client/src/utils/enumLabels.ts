import { TFunction } from 'i18next';

export const translateBookingStatus = (t: TFunction, status?: string | null): string => {
  if (!status) return '';
  const translated = t(`enums.bookingStatus.${status.toUpperCase()}`, { defaultValue: '' });
  return translated || status;
};

export const translateRole = (t: TFunction, role?: string | null): string => {
  if (!role) return '';
  const translated = t(`enums.role.${role.toUpperCase()}`, { defaultValue: '' });
  return translated || role;
};
