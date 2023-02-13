/* eslint-disable @typescript-eslint/naming-convention */
export interface MEDIA_WIDTHS {
  upToExtraSmall: string;
  upToSmall: string;
  upToMedium: string;
  upToLarge: string;
  upToMediumLarge: string;
  upToExtraLarge: string;
}

export const APP_MEDIA_WIDTHS: MEDIA_WIDTHS = {
  upToExtraSmall: '@media (max-width: 480px)',
  upToSmall: '@media (max-width: 768px)',
  upToMedium: '@media (max-width: 960px)',
  upToLarge: '@media (max-width: 1200px)',
  upToMediumLarge: '@media (max-width: 1600px)',
  upToExtraLarge: '@media (min-width: 1601px)',
};
