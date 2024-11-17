const apiURL = import.meta.env.VITE_APP_API_URL
export const url = apiURL

export function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = (seconds % 60).toFixed(0);

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
}

export function getTime(timestamp) {
  const date = new Date(timestamp);

  return date.toLocaleTimeString("pl-PL", {
    timeZone: "Europe/Warsaw",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

export function getDate(timestamp) {
  const date = new Date(timestamp);

  return  date.toLocaleDateString("pl-PL", {
    timeZone: "Europe/Warsaw",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit"
  });
}


export const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);


export const clearCache = () => {
  sessionStorage.clear();
}
