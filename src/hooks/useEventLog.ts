import { useContext } from 'react';
import { EventContext } from '../context/EventContext';

export const useEventLog = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEventLog must be used within an EventProvider');
  }
  return context;
};
