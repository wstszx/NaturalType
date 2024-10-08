export const getNextChar = (text: string, index: number): string | null => {
  if (index < text.length) {
    return text[index].toLowerCase();
  }
  return null;
};