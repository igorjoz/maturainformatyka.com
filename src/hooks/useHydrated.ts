import { useEffect, useState } from "react";

// The server and the first client render deliberately expose the same complete content.
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
