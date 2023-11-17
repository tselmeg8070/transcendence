<script lang="ts">
	import { goto } from '$app/navigation';
	import { userInformation } from '../../services/gqlUser';
	import { activePage } from '../../stores/currentNavigation';
	import { authentication, type AuthenticationType } from '../../stores/authentication';
	import { onDestroy } from 'svelte';
	export let sidebaricon: 'normal' | 'icon' = 'normal';

	let user: AuthenticationType;
	const unsubscribe = authentication.subscribe((value) => {
		user = value;
	});
	onDestroy(unsubscribe);

	function setActivePage(page: string) {
		activePage.set(page);
	}
</script>

<!--
	bg-white-s : must remove this one after the UI/UX is done
-->
<div
	class="flex flex-grow flex-col gap-y-5 overflow-y-auto bg-white-600 px-6 h-full w-full"
>
	<div class="flex h-16 pl-2 shrink-0 items-center">
		<button
			on:click={() => {
				setActivePage('dashboard');
				goto('/');
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				version="1.1"
				id="Layer_1"
				x="0px"
				y="0px"
				class="w-[50px] h-[50px]"
				viewBox="0 0 300 300"
				style="enable-background:new 0 0 300 300;"
				xml:space="preserve"
			>
				<style type="text/css">
					.st0 {
						fill: #010101;
					}
				</style>
				<g>
					<path
						class="st0"
						d="M154.24,149.58c0,20.09-15.64,35.76-37.93,35.76c-21.54,0-37.94-16.29-37.94-36.38   c0-20.09,16.32-36.63,37.13-36.63S154.24,126.36,154.24,149.58z M116.12,126.23c-12.62,0-23.22,9.98-23.22,22.6   c0,12.62,10.6,23.1,23.22,23.1c12.62,0,24.09-9.86,24.09-22.48C140.21,136.82,128.74,126.23,116.12,126.23z"
					/>
					<path
						class="st0"
						d="M278.14,185.44v-36.52H256.2v13.46h6.79v10.83c-10.71,0-19.37-12.81-19.54-21.77   c-0.23-11.49,8.94-23.19,23.58-23.47c5.91,0,8.02,1.4,11,2.46v-15.51c-4.45-1.75-9.77-1.99-11.76-1.99   c-7.43,0-13.32,2.01-19.02,5.27c-11.47,6.55-18.84,17.44-18.84,31.72c0,19.78,15.98,37.33,37.04,37.33   C270.71,187.26,275.51,186.44,278.14,185.44z"
					/>
					<path
						class="st0"
						d="M191.39,112.35c-13.85,0-24.56,9.07-24.56,22.32v50.64h14.64v-50.64c0-4.92,4.35-9.12,10.45-9.12   c7.59,0,10.5,4.78,10.5,9.12v50.64h14.64v-50.64C217.07,121.42,204.13,112.35,191.39,112.35z"
					/>
					<path
						class="st0"
						d="M67.04,135.14c0,14.57-11.79,23.39-22.54,23.39h-8.22v27.1H21.75v-71.9h23.09   C54.42,113.73,67.04,119.95,67.04,135.14z M46.89,126.74c-2.25,0-10.27,0-10.27,0v18.78h8.22c3.82,0,8.71-4.99,8.71-9.98   C53.54,130.55,49.14,126.74,46.89,126.74z"
					/>
				</g>
			</svg>
		</button>
	</div>
	<nav class="flex flex-1 flex-col">
		<ul role="list" class="flex flex-1 flex-col gap-y-7">
			<li>
				<ul role="list" class="-mx-2 space-y-1">
					<li>
						<!-- Current: "bg-white-s text-black", Default: "text-black hover:text-black hover:bg-white-s" -->
						<a
							on:click={() => {
								setActivePage('dashboard');
								goto('/');
							}}
							class={`${
								$activePage === 'dashboard' ? `bg-white-s text-black` : ''
							} text-black hover:text-black hover:bg-white-s group flex ${
								sidebaricon === 'icon' && 'items-center justify-center'
							} gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold`}
						>
							{#if sidebaricon === 'icon'}
								<svg
									aria-label="Accueil"
									class="h-6 w-6 shrink-0"
									color="rgb(0, 0, 0)"
									fill="rgb(0, 0, 0)"
									height="24"
									role="img"
									viewBox="0 0 24 24"
									width="24"
									><title>Accueil</title><path
										d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z"
										fill="none"
										stroke="currentColor"
										stroke-linejoin="round"
										stroke-width="2"
									/></svg
								>
							{:else}
								<svg
									aria-label="Accueil"
									class="h-6 w-6 shrink-0"
									color="rgb(0, 0, 0)"
									fill="rgb(0, 0, 0)"
									height="24"
									role="img"
									viewBox="0 0 24 24"
									width="24"
									><title>Accueil</title><path
										d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"
									/></svg
								>
							{/if}
							{#if sidebaricon === 'normal'}
								<p class="text-[16px] font-normal">Dashboard</p>
							{/if}
						</a>
					</li>
					<li>
						<a
							on:click={() => {
								setActivePage('messages');
								goto('/messages');
							}}
							class={`${
								$activePage === 'messages' ? `bg-white-s text-black` : ''
							} text-black hover:text-black hover:bg-white-s group flex ${
								sidebaricon === 'icon' && 'items-center justify-center'
							} gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold`}
						>
							{#if $activePage === 'messages'}
								<svg
									aria-label="Direct"
									class="x1lliihq x1n2onr6"
									color="rgb(0, 0, 0)"
									fill="rgb(0, 0, 0)"
									height="24"
									role="img"
									viewBox="0 0 24 24"
									width="24"
									><title>Direct</title><path
										d="M22.91 2.388a.69.69 0 0 0-.597-.347l-20.625.002a.687.687 0 0 0-.482 1.178L7.26 9.16a.686.686 0 0 0 .778.128l7.612-3.657a.723.723 0 0 1 .937.248.688.688 0 0 1-.225.932l-7.144 4.52a.69.69 0 0 0-.3.743l2.102 8.692a.687.687 0 0 0 .566.518.655.655 0 0 0 .103.008.686.686 0 0 0 .59-.337L22.903 3.08a.688.688 0 0 0 .007-.692"
										fill-rule="evenodd"
									/></svg
								>
							{:else}
								<svg
									aria-label="Direct"
									class="h-6 w-6 shrink-0 text-black group-hover:text-black"
									color="rgb(0, 0, 0)"
									fill="rgb(0, 0, 0)"
									height="24"
									role="img"
									viewBox="0 0 24 24"
									width="24"
									><title>Direct</title><line
										fill="none"
										stroke="currentColor"
										stroke-linejoin="round"
										stroke-width="2"
										x1="22"
										x2="9.218"
										y1="3"
										y2="10.083"
									/><polygon
										fill="none"
										points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
										stroke="currentColor"
										stroke-linejoin="round"
										stroke-width="2"
									/></svg
								>
							{/if}

							{#if sidebaricon === 'normal'}
								<p class="text-[16px] font-normal">Messages</p>
							{/if}
						</a>
					</li>
					<li>
						<a
							on:click={() => {
								setActivePage('profile');
								goto(`/profile/${user.pseudo}`);
							}}
							class={`${
								$activePage === 'profile' ? `bg-white-s text-black` : ''
							} text-black hover:text-black hover:bg-white-s group gap-x-3 flex ${
								sidebaricon === 'icon' && 'items-center justify-center'
							} rounded-md p-2 text-sm leading-6 font-semibold`}
						>
							<img
								src={user.avatar}
								class={`rounded-full ${
									$activePage === 'profile' && `border-[2.4px] border-black`
								} shadow-sm h-6 w-6 shrink-0 text-black group-hover:text-black`}
								alt={user.name}
							/>

							{#if sidebaricon === 'normal'}
								<p class="text-[16px] font-normal">Profile</p>
							{/if}
						</a>
					</li>
				</ul>
			</li>
		</ul>
	</nav>
</div>
