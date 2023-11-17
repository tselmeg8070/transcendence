<script lang="ts">
	import { onMount } from "svelte";
	import { getFriends, getPendingFriendRequests, getUsers } from "../../services/gqlFriends";
	import type { AuthenticationType } from "../../stores/authentication";
	import { authentication } from "../../stores/authentication";
	import UserComponent from "./user_component.svelte";

	export let isOpen: boolean = false;
	export let onClose: any;
	let pseudo: string = "";
	let users: AuthenticationType[] = [];

	function handleSentFrientReq(mPseudo: string) {
		const i = users.findIndex(e => e.pseudo === mPseudo);
		if (i > -1) {
			users.splice(i, 1);
			users = [...users];
		}
	}

	onMount(async () => {
		try {
			const tempUsers = await getUsers();
			const tempFriends = await getFriends();
			const pendingRequests = await getPendingFriendRequests();
			tempUsers.forEach((element: AuthenticationType) => {
				if (!tempFriends.find((e: AuthenticationType) => e.pseudo === element.pseudo))
				{
					if (!pendingRequests.find((e:any) => e.receiverId === element.id) && $authentication.id !== element.id)
						users.push(element);
				}
			});
		} catch (e) {

		}
	})
</script>

{#if isOpen}
	<div class="fixed z-50 inset-0 bg-gray-500 bg-opacity-75 transition-opacity">
		<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
			<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
				<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity opacity-100" />
				<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
					<div
						class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
					>
						<div
							class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
						>
							<div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
								<div class="sm:flex sm:items-start">
									<div
										class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10"
									>
										<img
											class="w-10 h-10 rounded-full"
											src="https://api.dicebear.com/7.x/bottts/svg?seed={pseudo}"
											alt=""
										/>
									</div>
									<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
										<h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
											Add friend
										</h3>
										<div class="mt-2">
											<div class="mb-6">
												<input
													type="text"
													bind:value={pseudo}
													class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
													placeholder="Enter user pseudo"
												/>
											</div>
										</div>
										<div class="overflow-y-auto h-32">
											{#each users.filter(e => {
												const pattern = new RegExp(`\\b${pseudo}`, 'i');
												return pattern.test(e.pseudo);
											}) as user}
												<UserComponent user={user} handleSent={handleSentFrientReq}/>
  											{/each}
										</div>
									</div>
								</div>
							</div>
							<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
								<button
									type="button"
									on:click={onClose}
									class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
									>Cancel</button
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
