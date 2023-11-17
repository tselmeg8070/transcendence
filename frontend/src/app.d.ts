// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { AuthenticationType } from "./stores/authentication";

// and what to do when importing types
declare namespace App {
	interface Locals {
        authentication: AuthenticationType; // Your type here
    }
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface Platform {}
}
