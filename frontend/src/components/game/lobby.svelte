<script lang="ts">
	import { onMount } from 'svelte';
	import Game from './game.svelte';
	import Waiting from './waiting.svelte';
	import type { GameFound } from '../../interfaces/gameFound.js';
	import type { Socket } from 'socket.io-client';

	export let socket: Socket;

	let isModeSelected: boolean = false; /** Check if the user selected the mode */
	let mode: string = ''; /** selected mode: {mm/p_friend/p_bot}_selected */
	let isWaiting: boolean = true; /** State: waiting for an opponent */
	let roomId: string = ''; /** room id that we play */
	let opponentId: string = ''; /** opponent id */
	let opponentName: string = ''; /** opponent name */
	let yourName: string = ''; /** your name */
	let side: string = 'left'; /** side of the player */

	console.log('[Lobby room] Entered the lobby room');

	function clickedButton(button: string, bool?: boolean) {
		if (button === 'back_chosemode') {
			isModeSelected = false;
			mode = '';
		} else if (button === 'matchmaking') {
			isModeSelected = true;
			mode = 'mathchmaking';
			socket.emit('matchmaking');
		} else if (button === 'playFriend') {
			isModeSelected = true;
			mode = 'playFriend';
			socket.emit('playFriend', { opponentId: opponentId });
		} else if (button === 'playBot') {
			isModeSelected = true;
			mode = 'playBot';
			socket.emit('playBot');
		}
	}

	onMount(() => {
		socket.on('waiting', (data: any) => {
			console.log('[Lobby room] Waiting for an opponet', data);

			isWaiting = true;
		});

		socket.on('gameFound', (data: GameFound) => {
			console.log('[Lobby room] Game found. Room: ', data.roomId);

			opponentName = data.opponentName;
			yourName = data.yourName;
			side = data.side;
			socket.emit('ready', { roomId: data.roomId });
			roomId = data.roomId;
			isWaiting = false;
		});
	});
</script>

{#if isModeSelected === false}
	<div
		class={`relative flex flex-col items-center justify-center h-full w-full transition duration-500 transform ease-in-out gap-2 md:gap-2 ${'opacity-100'}`}
	>
		<div class="relative flex w-full max-w-[200px] rounded-md ring-1 ring-gray-500/20 group/1">
			<div
				class="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg blur opacity-50 group-hover/1:opacity-75 transition duration-1000 group-hover/1:duration-200 animate-tilt"
			/>
			<button
				class="uppercase relative w-full rounded-md bg-black text-white font-medium p-4 transition transform duration-500 hover:duration-300"
				on:click={() => clickedButton('matchmaking')}
			>
				<span />
				<p class="tracking-wider font-bold group-hover/1:font-extrabold">Matchmaking</p>
			</button>
		</div>
		<!-- <div class="relative flex w-full max-w-[200px] rounded-md ring-1 ring-gray-500/20 group/1">
			<div
				class="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg blur opacity-50 group-hover/1:opacity-75 transition duration-1000 group-hover/1:duration-200 animate-tilt"
			/>
			<button
				class="uppercase relative w-full rounded-md bg-black text-white font-medium p-4 transition transform duration-500 hover:duration-300"
				on:click={() => clickedButton('playFriend')}
			>
				<span />
				<p class="tracking-wider font-bold group-hover/1:font-extrabold">playFriend</p>
			</button>
		</div>
		<div class="relative flex w-full max-w-[200px] rounded-md ring-1 ring-gray-500/20 group/1">
			<div
				class="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg blur opacity-50 group-hover/1:opacity-75 transition duration-1000 group-hover/1:duration-200 animate-tilt"
			/>
			<button
				class="uppercase relative w-full rounded-md bg-black text-white font-medium p-4 transition transform duration-500 hover:duration-300"
				on:click={() => clickedButton('playBot')}
			>
				<span />
				<p class="tracking-wider font-bold group-hover/1:font-extrabold">playBot</p>
			</button>
		</div> -->
	</div>
{:else if isModeSelected === true}
	{#if mode === 'mathchmaking'}
		{#if isWaiting === true}
			<Waiting />
		{:else if isWaiting === false}
			<Game {socket} {roomId} {opponentName} {yourName} {side} />
		{/if}
	{:else if mode === 'playFriend'}
		{#if isWaiting === true}
			<Waiting />
		{:else if isWaiting === false}
			<Game {socket} {roomId} {opponentName} {yourName} {side} />
		{/if}
	{:else if mode === 'playBot'}
		{#if isWaiting === true}
			<Waiting />
		{:else if isWaiting === false}
			<Game {socket} {roomId} {opponentName} {yourName} {side} />
		{/if}
	{/if}
{:else}
	<p>Something went wrong</p>
{/if}

<style>
</style>
