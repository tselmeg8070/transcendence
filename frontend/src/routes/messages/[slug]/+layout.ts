import type { AuthenticationType } from '../../../stores/authentication.js'

export async function load({params}){
	console.log("Loading layout", params);
	return { slug: params.slug }
}

export type PageDataInterface = {
	user: AuthenticationType;
	slug: string;
}
