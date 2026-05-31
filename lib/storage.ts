"use client";
import { useEffect, useState } from "react";
import type { Item } from "./types";
import { seedItems } from "./seed";

const KEY = "grails:items:v1";

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      } else {
        setItems(seedItems);
        localStorage.setItem(KEY, JSON.stringify(seedItems));
      }
    } catch {
      setItems(seedItems);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(KEY, JSON.stringify(items));
      } catch {}
    }
  }, [items, loaded]);

  return { items, setItems, loaded };
}

export function resetItems(): Item[] {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  return seedItems;
}
