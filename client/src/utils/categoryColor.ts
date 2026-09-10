/**
 * Generates a consistent, beautiful pastel color scheme (background, text, and border)
 * dynamically calculated based on the hash of the category name.
 */
export const getCategoryStyle = (name: string) => {
  if (!name) {
    return {
      backgroundColor: '#e0e0e0',
      color: '#333333',
      borderColor: '#cccccc',
    };
  }

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash % 360);
  const saturation = 65;
  const backgroundColor = `hsl(${hue}, ${saturation}%, 92%)`;
  const textColor = `hsl(${hue}, 75%, 25%)`;
  const borderColor = `hsl(${hue}, ${saturation}%, 80%)`;

  return {
    backgroundColor,
    color: textColor,
    borderColor,
    border: '1px solid',
  };
};