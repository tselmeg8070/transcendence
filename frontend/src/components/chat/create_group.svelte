<script lang="ts">
	import { createGroup } from '../../services/gqlGroups';

	export let isOpen: boolean = false;
	export let onClose: any;
	export let onSuccess: any;

	let isLoading = false;
	let name: string = '';
	let isPrivate: boolean = false;
	let password: string = '';

	async function handleCreate() {
		if (name.length === 0 || isLoading) return;
		if (isPrivate && password.length === 0) return;
		isLoading = true;
		try {
			const result = await createGroup(name, isPrivate, password);
			name = '';
			isPrivate = false;
			password = '';
			isLoading = false;
			onSuccess();
		} catch (e) {
			console.log(e);
			isLoading = false;
		}
	}
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
											src="https://api.dicebear.com/7.x/thumbs/svg?seed={name}"
											alt=""
										/>
									</div>
									<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
										<h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">
											Create channel
										</h3>
										<div class="mt-2">
											<div class="mb-6">
												<input
													type="text"
													bind:value={name}
													class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
													placeholder="Name"
												/>
											</div>
											<div class="mb-3">
												<label class="relative inline-flex items-center cursor-pointer">
													<input type="checkbox" class="sr-only peer" bind:checked={isPrivate} />
													<div
														class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
													/>
													<span class="ml-3 text-sm font-medium text-gray-900">Is private</span>
												</label>
											</div>
											{#if isPrivate}
												<div class="mb-3">
													<input
														type="password"
														bind:value={password}
														class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
														placeholder="Password"
													/>
												</div>
											{/if}
										</div>
									</div>
								</div>
							</div>
							<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
								<button
									type="button"
									on:click={onClose}
									class="mt-3 ml-2 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
									>Cancel</button
								>
								<button
									type="button"
									on:click={handleCreate}
									class="mt-3 inline-flex w-full justify-center rounded-md bg-blue-800 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto"
									>{#if isLoading}
										<svg
											class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												class="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												stroke-width="4"
											/>
											<path
												class="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.96 7.96 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zm5 3.71a7.96 7.96 0 01-3-1.939l-3 2.646A8.003 8.003 0 0012 20v4c4.418 0 8-3.582 8-8h-4zm6.059-9.698l-2.647-3A7.96 7.96 0 0017 9.001v4c0 4.418-3.582 8-8 8v4c6.627 0 12-5.373 12-12h-4zm-9.06-3.608l-3 2.646a7.96 7.96 0 00-1.939-3l2.646-3a8.003 8.003 0 004.293 4.293zm-2.646 9.06l3 2.647A7.96 7.96 0 009.001 17h4c0-4.418 3.582-8 8-8v-4a7.96 7.96 0 01-1.939 3l-2.646-3zm9.06 2.646l2.646 3a7.96 7.96 0 01-3 1.939v-4c4.418 0 8 3.582 8 8h4c0-6.627-5.373-12-12-12v4z"
											/>
										</svg>
										Creating...
									{:else}
										Create
									{/if}</button
								>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
