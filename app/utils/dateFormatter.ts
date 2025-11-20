/**
 * Formats a Unix timestamp to a human-readable date string
 * @param timestamp - Unix timestamp in seconds
 * @returns Formatted date string (e.g., "12 December 2025")
 */
export const formatDate = (timestamp: number): string => {
  try {
    const date = new Date(timestamp * 1000);
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};
