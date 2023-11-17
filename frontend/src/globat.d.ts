import type { AuthenticationType } from "./stores/authentication";

declare module "@sveltejs/kit" {
	interface Locals {
		userInfo: AuthenticationType; // Include the 'userInfo' property based on the 'AuthenticationType' interface
	}
	// Add other custom interfaces if necessary
	// interface Error {}
	// interface Page {}
	// interface PageData {}
	// interface PageContext {}
}
