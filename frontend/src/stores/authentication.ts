import { writable } from 'svelte/store';

export type AuthenticationType = {
	id: string;
	email: string;
	name: string;
	pseudo: string;
	avatar: string;
	isTwoFactorEnabled: boolean;
	status: string;
};
function createAuthentication() {
	const { subscribe, set, update } = writable<AuthenticationType>({
		id: "",
		email: "",
		name: "",
		pseudo: "",
		avatar: "",
		isTwoFactorEnabled: false,
		status: "ONLINE"
	});

	return {
		subscribe,
		update,
		setUser: (user: AuthenticationType) => {
			// console.log("storeUser", user);
			set({ ...user });
		},
		// Add other necessary methods or customizations here
	};
}

export const authentication = createAuthentication();
