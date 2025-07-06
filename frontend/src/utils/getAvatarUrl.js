// src/utils/getAvatarUrl.js

/**
 * Generates a unique avatar URL using DiceBear Avatars with varying styles.
 * @param {string} seed - A simple seed value (e.g., user's full name).
 * @returns {string} - The URL of the generated avatar.
 */
export const getAvatarUrl = (seed) => {
    const styles = ["human", "bottts", "avataaars", "jdenticon", "initials", "micah"];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    return `https://avatars.dicebear.com/api/${randomStyle}/${encodeURIComponent(seed)}.svg`;
  };
  