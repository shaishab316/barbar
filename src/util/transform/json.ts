export const json = <T>(str?: string): T | undefined => {
  try {
    if (str) return JSON.parse(str);
  } catch (error) {
    return;
  }
};
