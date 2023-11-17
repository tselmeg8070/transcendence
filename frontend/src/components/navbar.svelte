<script lang="ts">
	import { onDestroy } from 'svelte';
	import { modalOpen } from '../stores/modal';
	import { authentication, type AuthenticationType } from '../stores/authentication';
	import ModalWrapper from '$components/modal_wrapper.svelte';
	import OnlineUserImg from './action_components/online-user.svelte';
	import {
		getPendingFriendRequests,
		rejectFriendRequest,
		acceptFriendRequest,
		searchUsersByNameOrPseudo
	} from '../services/gqlFriends';
	import { onMount } from 'svelte';
	import type Request from './notifications/request.svelte';
	import type { searchUser } from '../interfaces/types';
	import { goto } from '$app/navigation';
	import { activeColor } from '../stores/currentNavigation';

	let user: AuthenticationType;
	let inputFocus: boolean = false;
	let pendingRequests: Request[] = [];
	let isModalOpen =
		$modalOpen === 'userMenu' ||
		$modalOpen === 'notifications' ||
		$modalOpen === 'mobileMenu' ||
		$modalOpen === 'searchSuggestion';
	let term = '';
	let users: searchUser[] = [];

	const unsubscribe = authentication.subscribe((value) => {
		user = value;
	});
	onDestroy(unsubscribe);

	$: isModalOpen =
		$modalOpen === 'userMenu' ||
		$modalOpen === 'notifications' ||
		$modalOpen === 'mobileMenu' ||
		$modalOpen === 'searchSuggestion';
	$: if (!isModalOpen && $modalOpen !== null) {
		modalOpen.set(null);
	}
	let radialColor: string;
	$: radialColor = $activeColor;
	async function handleSearch() {
		if (term.trim() === '') {
			users = [];
			return;
		}

		try {
			users = await searchUsersByNameOrPseudo(term);
		} catch (error) {
			console.error('Error fetchnig the user', error);
		}
	}

	function toggleModal(modalType: string) {
		if ($modalOpen) {
			modalOpen.set(null);
		} else {
			modalOpen.set(modalType);
			// console.log(`modalOpen === `, $modalOpen);
		}
	}
	onMount(loadPendingRequests);
	async function loadPendingRequests() {
		try {
			pendingRequests = await getPendingFriendRequests();
			// console.log(`This is the pending Request : `, pendingRequests);
		} catch (error) {
			console.error(`Erreur lors du chargement des demandes d'amis`);
		}
	}

	async function handleAcceptFriendRequest(pseudo: string) {
		try {
			// console.log(`It went here`, pseudo);
			const methodAcceptFriendRequest = await acceptFriendRequest(pseudo);
			// console.log(methodAcceptFriendRequest);
		} catch (error) {
			console.error(`Error during the mutation accept friend request`);
		}
	}

	async function handleRefuseFriendRequest(pseudo: string) {
		try {
			// console.log(`It went here`, pseudo);
			const methodRejectFriendRequest = await rejectFriendRequest(pseudo);
			// console.log(methodRejectFriendRequest);
		} catch (error) {
			console.error(`Error during the mutation reject friend request`);
		}
	}
	function handleInputFocus() {
		inputFocus = true;
		toggleModal('searchSuggestion');
	}
</script>

<div class="w-full flex items-center justify-center">
	<header
		class="mt-4 w-[80%] bg-gray-950/5 relative backdrop-blur-md py-[2px] lg:static lg:overflow-y-visible text-white border-y border-white/10 rounded-y rounded-full shadow-lg"
	>
		<div class="flex">
			<div
				class="transparent relative w-full flex flex-row items-center lg:gap-2 xl:grid xl:grid-cols-12"
			>
				<div
					class="flex pl-2 items-center md:absolute md:inset-y-0 md:left-0 lg:static xl:col-span-4"
				>
					<button
						class="flex flex-row gap-2 items-center justify-center"
						on:click={() => {
							goto('/');
						}}
					>
						<div class="relative w-[50px] h-[40px]">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="text-white absolute top-0 left-0 w-full h-full"
								width="50"
								height="50"
								viewBox="0 0 100 100"
								><path
									fill="#ffffff"
									d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L39.3342 97.1782c.6889.6889.0915 1.8189-.857 1.5964C20.0515 94.4522 5.54779 79.9485 1.22541 61.5228ZM.00189135 46.8891c-.01764375.2833.08887215.5599.28957165.7606L52.3503 99.7085c.2007.2007.4773.3075.7606.2896 2.3692-.1476 4.6938-.46 6.9624-.9259.7645-.157 1.0301-1.0963.4782-1.6481L2.57595 39.4485c-.55186-.5519-1.49117-.2863-1.648174.4782-.465915 2.2686-.77832 4.5932-.92588465 6.9624ZM4.21093 29.7054c-.16649.3738-.08169.8106.20765 1.1l64.77602 64.776c.2894.2894.7262.3742 1.1.2077 1.7861-.7956 3.5171-1.6927 5.1855-2.684.5521-.328.6373-1.0867.1832-1.5407L8.43566 24.3367c-.45409-.4541-1.21271-.3689-1.54074.1832-.99132 1.6684-1.88843 3.3994-2.68399 5.1855ZM12.6587 18.074c-.3701-.3701-.393-.9637-.0443-1.3541C21.7795 6.45931 35.1114 0 49.9519 0 77.5927 0 100 22.4073 100 50.0481c0 14.8405-6.4593 28.1724-16.7199 37.3375-.3903.3487-.984.3258-1.3542-.0443L12.6587 18.074Z"
								/></svg
							>
							<svg
								class="absolute top-0 left-0 w-full h-full"
								xmlns="http://www.w3.org/2000/svg"
								xmlns:xlink="http://www.w3.org/1999/xlink"
								version="1.1"
								id="Calque_1"
								x="0px"
								y="0px"
								viewBox="0 -200 960 960"
								enable-background="new 0 -200 960 960"
								xml:space="preserve"
							>
								<polygon
									id="polygon5"
									points="32,412.6 362.1,412.6 362.1,578 526.8,578 526.8,279.1 197.3,279.1 526.8,-51.1 362.1,-51.1   32,279.1 "
								/>
								<polygon id="polygon7" points="597.9,114.2 762.7,-51.1 597.9,-51.1 " />
								<polygon
									id="polygon9"
									points="762.7,114.2 597.9,279.1 597.9,443.9 762.7,443.9 762.7,279.1 928,114.2 928,-51.1 762.7,-51.1 "
								/>
								<polygon id="polygon11" points="928,279.1 762.7,443.9 928,443.9 " />
							</svg>
						</div>
					</button>
				</div>
				<div class="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-4">
					<div class="flex px-6 py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0">
						<div class="w-full relative rounded-md h-full flex items-center justify-center">
							<div
								class="absolute -inset-[0.0001px] bg-gradient-to-r from-red-500 to-blue-500 rounded-lg blur opacity-20 hover:opacity-50 transition duration-1000 hover:duration-200 animate-tilt"
							/>
							<label for="search" class="sr-only">Search</label>
							<div class="relative group w-full h-full shadow-gray-50">
								<div class="pointer-events-none absolute inset-y-1/2 left-1 flex items-center pl-3">
									<svg
										class="h-3 w-3 rotate-90 text-white/50 group-focus-within:text-white group-hover:text-white transition duration-200"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fill-rule="evenodd"
											d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
								<input
									id="search"
									name="search"
									class="block w-full h-full cursor-none caret-white bg-black shadow-black placeholder:text-white/50 group-hover:placeholder:text-white/80 transition ring-1 ring-gray-500/30 group/icon_search rounded-full shadow-lg border-0 py-2 pl-10 text-white placeholder:text-gray-400 focus:transition duration-200 focus:duration-300 focus:ring-1 focus:ring-inset focus:ring-blue-500/40 text-[11.5px] sm:text-[12px] sm:leading-6"
									placeholder="Search players"
									type="search"
									autocomplete="off"
									bind:value={term}
									on:focus={handleInputFocus}
									on:input={handleSearch}
								/>
							</div>
						</div>
					</div>
				</div>
				<div class="flex items-center md:absolute md:inset-y-0 md:right-0 lg:hidden">
					<!-- Mobile menu button -->
					<button
						type="button"
						class="relative -mx-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
						aria-expanded="false"
						on:click={() => toggleModal('mobileMenu')}
					>
						<span class="absolute -inset-0.5" />
						<span class="sr-only">Open menu</span>
						<!--
              Icon when menu is closed.

              Menu open: "hidden", Menu closed: "block"
            -->
						<svg
							class="block h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
							/>
						</svg>
						<!--
              Icon when menu is open.

              Menu open: "block", Menu closed: "hidden"
            -->
						<svg
							class="hidden h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div class="xl:col-span-4 hidden ml-14 px-4 lg:flex lg:items-center lg:justify-between">
					<button
						on:click={() => {
							goto('/messages/friends');
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6 text-white"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
							/>
						</svg>
					</button>
					<!-- <button
						type="button"
						class="relative ml-5 flex-shrink-0 rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
						on:click={() => toggleModal('notifications')}
					>
						<span class="absolute -inset-1.5" />
						<span class="sr-only">View notifications</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6 transition duration-200 text-white"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
							/>
						</svg>
						{#if pendingRequests.length > 1}
							<div
								class="absolute bottom-0 -right-1 rounded-full bg-red-500 text-white h-4 w-4 text-[8px] text-center flex items-center justify-center"
							>
								{pendingRequests.length}
							</div>
						{/if}
					</button> -->
					<!-- Profile dropdown -->
					<div class="relative ml-5 flex-shrink-0">
						<div>
							<button
								type="button"
								class="relative flex rounded-full bg-white focus:ring-offset-2"
								id="user-menu-button"
								aria-haspopup="true"
								on:click={() => toggleModal('userMenu')}
							>
								<span class="absolute -inset-1.5" />
								<span class="sr-only">Open user menu</span>
								<img
									class={`h-8 w-8 rounded-full ${
										$modalOpen === 'userMenu' && `border-[2.3px] border-black`
									}`}
									src={user.avatar}
									alt=""
								/>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Mobile menu, show/hide based on menu state. -->
	</header>
</div>
<ModalWrapper bind:isOpen={isModalOpen}>
	{#if $modalOpen === 'userMenu'}
		<div
			class="absolute right-12 z-10 bg-black mt-2 w-48 tracking-wide origin-top-right rounded-md py-1 shadow-2xl ring-1 ring-blue-500/10 focus:outline-none"
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="user-menu-button"
			tabindex="-1"
		>
			<a
				href={`/profile/${user.pseudo}`}
				class="block px-4 py-2 text-sm text-white hover:bg-gray-500/5 rounded-md"
				role="menuitem"
				tabindex="-1"
				id="user-menu-item-0">Profile</a
			>
			<a
				href="/settings"
				class="block px-4 py-2 text-sm text-white hover:bg-gray-500/5 rounded-md"
				role="menuitem"
				tabindex="-1"
				id="user-menu-item-1">Settings</a
			>
			<a
				href="/signout"
				class="block px-4 py-2 text-sm text-white hover:bg-gray-500/5 rounded-md"
				role="menuitem"
				tabindex="-1"
				id="user-menu-item-2">Sign out</a
			>
		</div>
	{:else if $modalOpen === 'notifications'}
		<div
			class="pl-4 absolute overflow-hidden right-16 h-48 w-[250px] text-white bg-black origin-top-right rounded-md shadow-2xl ring-1 ring-blue-500/10 ring-opacity-5 z-50"
		>
			<header class="pt-2 text-left h-[30%] w-full">
				<h1 class="font-medium text-[15px] tracking-wide">Notifications</h1>
				<p class="text-gray-500 text-[13px]">Here are your friend requests</p>
			</header>
			<ul class="overflow-y-auto h-[70%] w-full">
				{#if pendingRequests.length > 1}
					{#each pendingRequests as request}
						<li
							class="flex w-full h-1/3 mb-[5px] rounded-md p-2 border-1 border-gray-400/90 shadow-sm"
						>
							<div class="h-full w-[20%]">
								<img src={request.sender.avatar} class="w-7 h-7 rounded-md" alt="avatar" />
							</div>
							<p class="h-full w-[40%] truncate">
								{request.sender.name.split(' ')[0]}
							</p>
							<div class="w-[50%] h-full gap-2 flex flex-row">
								<button
									on:click={() => handleAcceptFriendRequest(request.sender.pseudo)}
									class="truncate w-1/2 p-1 bg-green-500 hover:bg-green-600 rounded-md text-[10px]"
								>
									Accept
								</button>
								<button
									on:click={() => handleRefuseFriendRequest(request.sender.pseudo)}
									class="truncate w-1/2 p-1 bg-red-500 hover:bg-red-600 rounded-md text-[10px]"
									>Refuse</button
								>
							</div>
						</li>
					{/each}
				{:else}
					<p>Aucune demande d'ami</p>
				{/if}
			</ul>
		</div>
	{:else if $modalOpen === 'mobileMenu'}
		<nav
			class="fixed p-2 rounded-md bg-white top-16 right-2 flex origin-top-right w-1/4"
			aria-label="Global"
		>
			<div
				class="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg blur opacity-50 group-hover/1:opacity-75 transition duration-1000 group-hover/1:duration-200 animate-tilt"
			/>
			<div class="absolute inset-0 bg-black z-1 rounded-md" />
			<div class="relative h-full flex flex-col z-2 w-full pt-2 pb-4 gap-4">
				<a
					href={`/notifications`}
					class="rounded-md bg-white/95 shadow-md text-[15px] ring-1 ring-slate-500/20 p-2 flex items-center justify-center"
					><svg
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
							d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
						/>
					</svg>
				</a>
				<a
					href={`/profile/${user.pseudo}`}
					class="rounded-md bg-white/95 shadow-md text-[15px] ring-1 ring-slate-500/20 p-2 flex items-center justify-center"
					><svg
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
							d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
				</a>
				<a
					href="/settings"
					class="rounded-md bg-white/95 shadow-md text-[15px] ring-1 ring-slate-500/20 p-2 flex items-center justify-center"
					><svg
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
							d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
				</a>
			</div>
		</nav>
	{:else if inputFocus && users.length}
		<div
			class="dropdown-menu overflow-auto no-scrollbar bg-black fixed top-14 right-[40%] sm:right-[50%] rounded-md ring-1 ring-blue-500/10 ring-opacity-5 p-2 shadow-lg flex flex-col gap-2 max-h-32 sm:max-h-60 h-auto w-auto"
		>
			{#each users as user (user.id)}
				<div
					class="flex items-center p-2 text-white w-full h-full gap-1 hover:bg-gray-400/10"
					on:click={() => {
						goto(`/profile/${user.pseudo}`);
						inputFocus = false;
					}}
				>
					<div class="h-full w-[30%]">
						<OnlineUserImg avatar={user.avatar} status={user.status} />
					</div>
					<div class="w-[70%] h-full text-white sm:text-medium flex items-center">
						<p>{user.name.split(' ')[0]}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</ModalWrapper>
