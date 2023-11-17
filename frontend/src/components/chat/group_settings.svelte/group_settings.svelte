<script lang="ts">
	import type { GroupInterface } from '../../../interfaces/types';

	export let isOpen: boolean = false;
	export let group: GroupInterface;
	export let onClose: () => void;

	let isLoading = false;

</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 bg-gray-500 bg-opacity-75 transition-opacity">
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
										class="mx-auto flex h-12 w-12 flex-shrink-0 items-center rounded-md justify-center bg-green-100 sm:mx-0 sm:h-10 sm:w-10"
									>
										<img
											class="w-10 h-10 rounded-md"
											src="https://api.dicebear.com/7.x/thumbs/svg?seed={group.name}"
											alt=""
										/>
									</div>
									<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
										<h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
											{group.name}
										</h3>
										<p class="text-sm text-gray-400"> {group.admins.length} admins | {group.members.length + 1} members</p>
									</div>
								</div>
								<p class="text-gray-800 text-sm font-semibold mt-3">Members</p>
								<div class="relative mt-3">
									<input type="search" id="default-search" class="block w-full p-2 pl-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Psuedo..." required>
									<button type="submit" class="text-white absolute right-1.5 px-5 bottom-1.5 bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-xs px-2 py-1">Add</button>
								</div>

							</div>
							<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
								<button
									type="button"
									on:click={onClose}
									class="mt-3 ml-2 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
