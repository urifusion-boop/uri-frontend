import React, { useState, createContext, ReactNode } from 'react';

interface NotificationSoundContextType {
  soundPlayed: boolean;
  setSoundPlayed: (played: boolean) => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

// Providing a default value that matches the shape of our context
const defaultContextValue: NotificationSoundContextType = {
  soundPlayed: false,
  setSoundPlayed: () => {},
  unreadCount: 0,
  setUnreadCount: () => {},
};

export const NotificationSoundContext = createContext<NotificationSoundContextType>(defaultContextValue);

export const NotificationSoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [soundPlayed, setSoundPlayed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <NotificationSoundContext.Provider value={{ soundPlayed, setSoundPlayed, unreadCount, setUnreadCount }}>
      {children}
    </NotificationSoundContext.Provider>
  );
};
