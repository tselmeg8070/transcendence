import { writable } from "svelte/store";

export const activePage = writable('dashboard');
export const activeColor = writable('blue');