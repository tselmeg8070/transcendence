<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { activeColor } from '../../stores/currentNavigation';
	import Lobby from '$components/game/lobby.svelte';
	import { getGameSocket, initGameSocket } from '../../services/gameSocket';
	import Game from '$components/game/game.svelte';
	import type { Socket } from 'socket.io-client';

	let clickedPlay: boolean = false;
	let mouseX = 0;
	let mouseY = 0;
	let clickedMatchmaking: boolean = false;
	let clickedPlayWithFriends: boolean = false;
	let text: string = '';
	let tiltStrength = 4;
	let blobElement: HTMLElement;
	let laserElement: HTMLElement;
	let playElement: HTMLElement;
	let laserSpeed = 2;
	let currentTiltX = 0;
	let currentTiltY = 0;
	let showDiv = false;
	let roomId = '';
	const lerpFactor = 0.2;
	let yourName: string = '';
	let opponentName: string = '';
	let side: string = 'left';

	$: letters = text.split('');

	function clickedButton(button: string, bool?: boolean) {
		if (button == 'play') {
			clickedPlay = !clickedPlay;
		}
		if (button == 'matchmaking') {
			showDiv = false;
			clickedMatchmaking = !clickedMatchmaking;
			text = 'Searching a player';
		}
		if (button == 'friends') {
			showDiv = !showDiv;
			if (bool) {
				clickedPlayWithFriends = !clickedPlayWithFriends;
				text = 'Waiting for your friend';
				showDiv = false;
			}
		}
	}

	// integrer dans cette fonction le fait de pouvoir partir de la queue de matchmaking et de la queue de play with friend
	function back() {
		console.log(`Entered here in back method`);
		if (showDiv) {
			showDiv = false;
			clickedPlayWithFriends = false;
			clickedMatchmaking = false;
			return;
		}

		if (clickedPlay && (clickedPlayWithFriends || clickedMatchmaking)) {
			clickedPlayWithFriends = false;
			clickedMatchmaking = false;
		} else if (clickedPlay && !clickedPlayWithFriends && !clickedMatchmaking) {
			clickedPlay = false;
		}
	}

	function lerp(start: number, end: number, factor: number) {
		return start + (end - start) * factor;
	}

	function handleMouseMove(event: any) {
		if (!event.currentTarget || !blobElement) return;
		const rect = event.currentTarget.getBoundingClientRect();
		mouseX = event.clientX - rect.left;
		mouseY = event.clientY - rect.top;

		const percentX = (mouseX / rect.width) * 2 - 1;
		const percentY = (mouseY / rect.height) * 2 - 1;

		const tiltX = tiltStrength * percentY;
		const tiltY = tiltStrength * percentX;

		currentTiltX = lerp(currentTiltX, tiltX, lerpFactor);
		currentTiltY = lerp(currentTiltY, tiltY, lerpFactor);

		event.currentTarget.style.transform = `rotateX(${currentTiltX}deg) rotateY(${currentTiltY}deg)`;
		blobElement.style.width = '70%';
		blobElement.style.height = '70%';
		blobElement.style.transform = `translate(-50%, -50%) rotateX(${currentTiltX - 10}deg) rotateY(${
			currentTiltY - 10
		}deg)`;
		activeColor.set('');

		blobElement.style.backgroundColor = 'rgba(255, 0, 0, 0.25)';
	}

	function handleMouseLeave(event: any) {
		if (!event.currentTarget || !blobElement) return;
		const transitionDuration = 1000;
		event.currentTarget.style.transition = `transform ${transitionDuration}ms ease`;
		event.currentTarget.style.transform = `rotateX(0deg) rotateY(0deg)`;
		blobElement.style.width = '80%';
		blobElement.style.height = '80%';
		blobElement.style.transform = 'translate(-50%, -50%) rotateX(0deg) rotateY(0deg)';
		blobElement.style.backgroundColor = 'rgba(38, 97, 156, 0.25)';
		activeColor.set('rgba(38, 97, 156, 0.25)');
	}

	let gameSocket: Socket;
	let laserDirection = 'right';
	onMount(() => {
		if (!laserElement || !playElement || !blobElement) return;

		let posX = 0;
		let posY = 0;

		if (laserElement && playElement && blobElement) {
			setTimeout(() => {
				if (blobElement && blobElement.style)
					blobElement.style.opacity = '1';
				if (playElement && playElement.style) {
					playElement.style.opacity = '1';
					playElement.style.backgroundColor = 'white';
				}
				if (laserElement && laserElement.style) {
					laserElement.style.transform = `scale(1) rotateX(0deg) rotateY(0deg)`;
					laserElement.style.opacity = '1';
				}
			}, 250);
		}

		let animationFrameId: number;
		initGameSocket();
		gameSocket = getGameSocket();
		gameSocket.emit('checkGame', null, (response: any) => {
			if (response.roomId !== '-1') {
				console.log(`[home] The user is in the Game: ${response.roomId}`);
				gameSocket.emit('ready', { roomId: '0' });
				roomId = response.roomId;
				yourName = response.yourName;
				opponentName = response.opponentName;
				side = response.side;
			}
		});

		// function updateLaserPosition() {
		// 	if (laserElement) {
		// 		switch (laserDirection) {
		// 			case 'right':
		// 				posX += laserSpeed;
		// 				if (posX >= laserElement.clientWidth) {
		// 					laserDirection = 'down';
		// 					laserElement.style.setProperty('--laser-width', '2px');
		// 					laserElement.style.setProperty('--laser-height', '100px');
		// 					posX = laserElement.clientWidth - 2;
		// 					posY = 0;
		// 				}
		// 				break;
		// 			case 'down':
		// 				posY += laserSpeed;
		// 				if (posY >= laserElement.clientHeight) {
		// 					laserDirection = 'left';
		// 					laserElement.style.setProperty('--laser-width', '100px');
		// 					laserElement.style.setProperty('--laser-height', '2px');
		// 					posX = laserElement.clientWidth;
		// 					posY = laserElement.clientHeight - 2;
		// 				}
		// 				break;
		// 			case 'left':
		// 				posX -= laserSpeed;
		// 				if (posX <= 0) {
		// 					laserDirection = 'up';
		// 					laserElement.style.setProperty('--laser-width', '2px');
		// 					laserElement.style.setProperty('--laser-height', '100px');
		// 					posX = 2;
		// 					posY = laserElement.clientHeight;
		// 				}
		// 				break;
		// 			case 'up':
		// 				posY -= laserSpeed;
		// 				if (posY <= 0) {
		// 					laserDirection = 'right';
		// 					laserElement.style.setProperty('--laser-width', '100px');
		// 					laserElement.style.setProperty('--laser-height', '2px');
		// 					posX = 0;
		// 					posY = 2;
		// 				}
		// 				break;
		// 		}

		// 		laserElement.style.setProperty('--laser-pos-x', posX + 'px');
		// 		laserElement.style.setProperty('--laser-pos-y', posY + 'px');
		// 		animationFrameId = requestAnimationFrame(updateLaserPosition);
		// 	}
		// }

		// updateLaserPosition();
		// return () => {
		// 	cancelAnimationFrame(animationFrameId);
		// };
	});

	/*
		Here is the socket logic game.gateway.ts so its the receiver
	*/
</script>

<div class="parent-enter-effect relative w-full h-full flex items-center justify-center">
	<div
		class=" blob-bg opacity-0 absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-1/2 w-[80%] h-[80%] bg-[#26619c]/20 mix-blend-multiply filter blur-xl"
		bind:this={blobElement}
	/>
	<div
		on:mouseleave={handleMouseLeave}
		on:mousemove={handleMouseMove}
		class="w-[80%] aspect-video z-10 ring-1 ring-gray-600/20 backdrop-filter backdrop-blur-lg shadow-lg rounded-2xl transition duration-100 bg-black laser-effect"
		bind:this={laserElement}
	>
		<div
			class="absolute top-50% left-50% transform -translate-x-50% -translate-y-50% w-[130%] h-[130%]"
		>
			<div
				class="absolute top-0 left-0 w-72 h-72 bg-[#26619c] animate-blob rounded-full mix-blend-multiply filter blur-xl opacity-70"
			/>
			<div
				class="absolute top-0 right-0 w-72 h-72 bg-[#649fd9] animate-blob animation-delay-2000 rounded-full mix-blend-multiply filter blur-xl opacity-70"
			/>
			<div
				class="absolute top-1/2 left-1/2 transform -translate-x-50% -translate-y-50% w-72 h-72 bg-[#660011] animate-blob animation-delay-4000 rounded-full mix-blend-multiply filter blur-xl opacity-70"
			/>
		</div>
		<div class="w-full h-full flex items-center justify-center transparent">
			<div class="relative border border-white h-full w-full flex items-center justify-center">
				{#if !clickedPlay}
					<button
						on:click={() => clickedButton('play')}
						in:fade={{ delay: 100, duration: 500 }}
						class={`playButton hover:w-[80px] hover:h-[80px] play-button relative px-7 py-4 rounded-lg leading-none flex transition duration-500 ease-in-out cursor-none ${
							clickedPlay ? 'opacity-0' : 'opacity-100'
						}`}
						bind:this={playElement}
					/>
				{:else if clickedPlay}
					{#if roomId !== ''}
						<Game socket={gameSocket} {roomId} {opponentName} {yourName} {side} />
					{:else if gameSocket !== null}
						<Lobby socket={gameSocket} />
					{:else}
						{console.log('[lobby room] gameSocket is null')}
					{/if}
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
</style>
