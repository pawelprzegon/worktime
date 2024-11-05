const apiURL = import.meta.env.VITE_APP_API_URL
console.log(apiURL)
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

