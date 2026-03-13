import React, { createContext, useState, ReactNode, useCallback, useMemo } from 'react';

interface EventContextType {
  events: string[];
  addEvent: (event: string) => void;
  clearEvents: () => void;
}

export const EventContext = createContext<EventContextType | undefined>(undefined);

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<string[]>([]);

  const addEvent = useCallback((event: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents(prev => {
      const next = [`[${timestamp}] ${event}`, ...prev];
      return next.slice(0, 50);
    });
  }, []);

  const clearEvents = useCallback(() => setEvents([]), []);

  const value = useMemo(() => ({ events, addEvent, clearEvents }), [events, addEvent, clearEvents]);

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};
