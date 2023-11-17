<script lang="ts">
	import { createGroup } from "../../../../services/gqlGroups";

	let name: string = '';
	let password: string = '';
	let isPrivate: boolean = false;
	let loading: boolean = false;

	async function handleClick() {
		if (name.length > 0 && ((isPrivate && password.length > 0) || !isPrivate)) {
			loading = true;
			try {
				if (isPrivate)
					await createGroup(name, isPrivate, password);
				else
					await createGroup(name, isPrivate, "");
				loading = false;
				isPrivate = false;
				name = "";
				password = "";
			} catch (e) {
				loading = false;
			}
		}
	}
</script>

<div class="mx-7">
	<div class="flex mt-5 justify-between">
		<div class="flex">
			<div class="mr-3">
				<img
					class="w-10 h-10 rounded-full mt-1"
					src="https://api.dicebear.com/7.x/bottts/svg?seed={name}"
					alt=""
				/>
			</div>
			<div>
				<p class="text-base font-semibold uppercase">Create channel</p>
				<p class="text-xs text-gray-300 mt-2">
					You can also create private channel by clicking lock icon
				</p>
			</div>
		</div>
		<button
			on:click={() => {
				isPrivate = !isPrivate;
			}}
			type="button"
			class="text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2"
		>
			{#if isPrivate}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
					/>
				</svg>
			{/if}
		</button>
	</div>
	<input
		type="text"
		bind:value={name}
		class="bg-gray-800 mt-5 mb-3 border text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
		placeholder="Enter the name"
	/>
	{#if isPrivate}
		<input
			type="password"
			bind:value={password}
			class="bg-gray-800 mb-3 border text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
			placeholder="Enter the password"
		/>
	{/if}

	<button
		on:click={handleClick}
		type="button"
		class="text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2"
	>
		{#if loading}
			<svg
				class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
			Loading
		{:else}
			Create
		{/if}
	</button>
</div>
