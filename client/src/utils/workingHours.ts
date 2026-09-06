import { DayOfWeek } from '../features/restaurants/restaurantsSlice';

export const DAYS_OF_WEEK: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export const formatWorkingHoursTime = (time: string | null | undefined): string => {
  if (!time) return '';
  return time.slice(0, 5);
};
