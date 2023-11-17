<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { GroupActions, type GroupInterface, type GroupMemberInterface } from '../../interfaces/types';
	import { doGroupAction } from '../../services/gqlGroups';
	import { authentication, type AuthenticationType } from '../../stores/authentication';
	import { getAvatar } from '../../utils/avatarGetter';

	export let member: GroupMemberInterface;
	export let channel: GroupInterface;
	export let handleUpdate: () => void;

	let userStore: AuthenticationType;
	const unsubscribe = authentication.subscribe((value) => {
		userStore = value;
	});
	onDestroy(unsubscribe);

	let isAdmin = false;
	let hasAccess = false;
	let isOwner = channel.ownerId === member.id;

	for (let i = 0; i < channel.admins.length; i++) {
		if (channel.admins[i].id === member.id) isAdmin = true;
	}

	let menuOpen = false;

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	async function handleKick() {
		try {
			const result = await doGroupAction(
				channel.id,
				member.id,
				undefined,
				GroupActions.KICK
			);
			handleUpdate();
		} catch (e) {

		}

	}

	onMount(() => {
		hasAccess = channel.ownerId === userStore.id;
		for (let i = 0; i < channel.admins.length; i++) {
			if (channel.admins[i].id === userStore.id) hasAccess = true;
		}
		window.addEventListener('click', handleOutsideClick);
	});

	function handleOutsideClick(event: any) {
		const menuButton = document.getElementById('menu-button-' + member.id);
		if (menuButton && !menuButton.contains(event.target)) {
			menuOpen = false;
		}
	}
</script>

<div class="relative inline-block text-left">
	<div>
		<button
			type="button"
			id="menu-button-{member.id}"
			on:click={toggleMenu}
			aria-expanded={menuOpen}
			aria-haspopup="true"
			class="px-2 py-1 my-1 w-full flex items-center rounded-md font-title text-xs tracking-wide hover:text-gray-100 hover:bg-gray-600"
		>
			<img
				class="w-8 h-8 rounded-full bg-indigo-400"
				src={getAvatar(member.avatar, member.pseudo)}
				alt="chat-user"
			/>
			<div
				class="ml-3 flex flex-col justify-start content-start place-content-start justify-items-start"
			>
				<p class="text-sm text-left font-semibold text-gray-300">
					{member.name}
					{isOwner ? '👑' : ''}
					{isAdmin ? '🤡' : ''}
				</p>
			</div>
		</button>
	</div>

	{#if menuOpen}
		<div
			class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="menu-button"
			tabindex="-1"
		>
			{#if !isAdmin && userStore.id !== member.id && hasAccess}
			<div class="py-1 w-full" role="none">
				<button
					on:click={handleKick}
					class="text-gray-400 w-full text-left block px-4 py-2 text-sm hover:bg-gray-900 hover:text-white"
					role="menuitem"
					tabindex="-1"
					id="menu-item-0"
				>
					Kick
				</button>
			</div>
			{/if}
			<div class="py-1 w-full" role="none">
				<a
					href="/profile/{member.pseudo}"
					class="text-gray-400 w-full text-left block px-4 py-2 text-sm hover:bg-gray-900 hover:text-white"
					role="menuitem"
					tabindex="-1"
					id="menu-item-0"
				>
					See profile
				</a>
			</div>
		</div>
	{/if}
</div>
