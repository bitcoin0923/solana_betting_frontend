export interface FontStyle {
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  lineHeight: string;
  uppercase?: boolean;
}

export interface Typography {
  regular: FontStyle;
  regularSmall: FontStyle;
  boldTitle: FontStyle;
  boldSubTitle: FontStyle;
  boldLarge: FontStyle;
  boldMediumLarge: FontStyle;
}

export const MainTypography: Typography = {
  regular: {
    fontFamily: 'Conthrax',
    fontWeight: 400,
    fontSize: '1.2rem',
    lineHeight: '2rem',
  },
  regularSmall: {
    fontFamily: 'Conthrax',
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: '1.125rem',
  },
  boldTitle: {
    fontFamily: 'Enter Sansman',
    fontWeight: 500,
    fontSize: '2.5rem',
    lineHeight: '4rem',
    uppercase: true,
  },
  boldSubTitle: {
    fontFamily: 'Enter Sansman',
    fontWeight: 500,
    fontSize: '1.5rem',
    lineHeight: '4rem',
    uppercase: true,
  },
  boldLarge: {
    fontFamily: 'Enter Sansman',
    fontWeight: 500,
    fontSize: '6rem',
    lineHeight: '4rem',
    uppercase: true,
  },
  boldMediumLarge: {
    fontFamily: 'Enter Sansman',
    fontWeight: 500,
    fontSize: '3rem',
    lineHeight: '4rem',
    uppercase: true,
  },
};
