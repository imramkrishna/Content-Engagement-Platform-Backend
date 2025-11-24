export const extractGuestId = (raw?: string): string | undefined => {
  if (!raw || typeof raw !== "string") return undefined;

  const parts = raw.split(",");
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith("guestId=")) {
      return trimmed.split("guestId=")[1];
    }
    if (/^[0-9a-fA-F\-]{36}$/.test(trimmed)) {
      return trimmed;
    }
  }

  return undefined;
};
