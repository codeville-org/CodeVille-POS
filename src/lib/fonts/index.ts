import DMSansWoff2 from "./DMSans.ttf";
import NotoSansWoff2 from "./NotoSans.ttf";

export const fonts = {
  dmSans: DMSansWoff2,
  notoSans: NotoSansWoff2
};

export const loadFonts = () => {
  const dmSansFont = new FontFace("DM Sans", `url(${fonts.dmSans})`);
  const notoSansFont = new FontFace("Noto Sans", `url(${fonts.notoSans})`);

  document.fonts.add(dmSansFont);
  document.fonts.add(notoSansFont);

  return Promise.all([dmSansFont.load(), notoSansFont.load()]);
};
