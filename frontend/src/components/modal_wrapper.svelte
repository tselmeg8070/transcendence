<script lang="ts">
	import { fly } from 'svelte/transition';
	import { modalOpen } from '../stores/modal';
	export let isOpen = false;
</script>

{#if isOpen}
	<div class="fixed top-0 left-0 w-screen h-screen z-50" on:click={() => (isOpen = false)}>
		<div
			transition:fly={{ y: 200, duration: 200 }}
			class={`fixed ${$modalOpen === 'userMenu' && `sm:top-[50px] sm:right-[10px]`} ${
				$modalOpen === 'notifications' && 'top-[60px] right-[70px]'
			}`}
			on:click={(e) => e.stopPropagation()}
		>
			<slot />
		</div>
	</div>
{/if}
