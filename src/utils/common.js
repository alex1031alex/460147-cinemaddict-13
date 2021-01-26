export const isKeyEscape = (key) => {
  const ESCAPE_FULL_NAME = `Escape`;
  const ESCAPE_SHORT_NAME = `Esc`;

  return (key === ESCAPE_FULL_NAME || key === ESCAPE_SHORT_NAME);
};
