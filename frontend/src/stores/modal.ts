import { writable } from "svelte/store";

export const modalOpen = writable<string | null>(null);