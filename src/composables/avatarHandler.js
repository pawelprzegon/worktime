import { saveAvatar } from "@/fetchers.js";

/**
 * Waliduje plik przed wysłaniem na serwer
 * @param {File} file - Plik avatara
 * @param {Object} options - Opcje walidacji
 * @param {string} options.acceptedFormats - Dopuszczalne formaty pliku (np. ".png, .jpg")
 * @param {number} options.maxSize - Maksymalny rozmiar pliku w kilobajtach
 * @returns {Object|null} - Zwraca obiekt błędu lub `null`, jeśli plik jest poprawny
 */
export const validateAvatarFile = (file, options = { acceptedFormats: ".png, .jpg, .jpeg, .gif, .svg", maxSize: 5000 }) => {
  const { acceptedFormats, maxSize } = options;

  if (!file) {
    return { type: "error", message: "No file selected." };
  }

  const fileExtension = file.name.split('.').pop().toLowerCase();
  const allowedExtensions = acceptedFormats.replace(/\s/g, '').split(',').map(f => f.replace('.', ''));

  if (!allowedExtensions.includes(fileExtension)) {
    return { type: "error", message: `Invalid file format. Allowed formats: ${acceptedFormats}` };
  }

  if (file.size > maxSize * 1024) {
    return { type: "error", message: `File size exceeds the limit of ${maxSize} KB.` };
  }

  return null; // Walidacja pomyślna
};

/**
 * Wysyła avatar na serwer
 * @param {string} userId - ID użytkownika
 * @param {File} file - Plik do wysłania
 * @returns {Object} - Odpowiedź serwera
 */
export const uploadAvatar = async (userId, file) => {
  if (!file) {
    throw new Error("No file selected for upload.");
  }

  return await saveAvatar(userId, file);
};

/**
 * Obsługuje sukces i przekazuje wynik do alertu
 * @param {Object} alert - Funkcja wywołująca powiadomienie
 * @param {string} status - Status operacji
 * @param {string} message - Komunikat operacji
 */
export const handleSuccess = (alert, status, message) => {
  alert.show(status, message);
};
