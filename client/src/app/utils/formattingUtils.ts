export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatRelativeTime = (dateString: string) => {
  const created = new Date(dateString).getTime();
  const now = new Date().getTime();
  const secondsLeft = Math.floor((now - created) / 1000);

  if (secondsLeft < 60) return "Just now";

  const minutes = Math.floor(secondsLeft / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
