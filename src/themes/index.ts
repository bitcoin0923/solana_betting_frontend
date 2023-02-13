import { Colors, DARK_COLORS } from './colors';
import { APP_MEDIA_WIDTHS, MEDIA_WIDTHS } from './media_width';
import { MainTypography, Typography } from './typography';

export interface Theme {
  dark: boolean;

  colors: Colors;
  typography: Typography;
  media_width: MEDIA_WIDTHS;
}

export const DARK_THEME: Theme = {
  dark: true,

  colors: DARK_COLORS,
  typography: MainTypography,
  media_width: APP_MEDIA_WIDTHS,
};

export enum ThemeId {
  DARK = 'dark',
}

export const themeIdToTheme: Record<ThemeId, Theme> = {
  [ThemeId.DARK]: DARK_THEME,
};
