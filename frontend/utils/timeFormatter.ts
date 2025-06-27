export function timeAgo(dateString: string): string {
  const now = new Date();
  const postedDate = new Date(dateString);
  const secondsAgo = Math.floor((now.getTime() - postedDate.getTime()) / 1000);

  if (secondsAgo < 60) return `${secondsAgo}s Ago`;
  const minutes = Math.floor(secondsAgo / 60);
  if (minutes < 60) return `${minutes}m Ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h Ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d Ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w Ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo Ago`;
  const years = Math.floor(days / 365);
  return `${years}y Ago`;
}
