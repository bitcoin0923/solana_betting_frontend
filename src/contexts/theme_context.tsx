import React, { createContext, useContext, useState } from 'react';

import { ThemeProvider as DefaultThemeProvider } from 'styled-components';

import { Theme, ThemeId, themeIdToTheme } from '../themes';

type ThemeContextProps = {
  theme: Theme;
  themeId: ThemeId;
  setThemeId: (theme: ThemeId) => void;
};

const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

export const ThemeProvider = ({ children = null as any }) => {
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>(ThemeId.DARK);

  const value = {
    theme: themeIdToTheme[currentThemeId],
    themeId: currentThemeId,
    setThemeId: (theme: ThemeId) => {
      setCurrentThemeId(theme);
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      <DefaultThemeProvider theme={value.theme}>{children}</DefaultThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
