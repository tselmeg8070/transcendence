<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { activeColor } from '../../stores/currentNavigation';

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
	const lerpFactor = 0.2;

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

		blobElement.style.backgroundColor = 'red';
	}

	let laserDirection = 'right';
	onMount(() => {
		if (!laserElement || !playElement || !blobElement) return;

		let posX = 0;
		let posY = 0;

		if (laserElement && playElement && blobElement) {
			setTimeout(() => {
				blobElement.style.opacity = '1';
				playElement.style.opacity = '1';
				playElement.style.backgroundColor = 'white';
				laserElement.style.transform = `scale(1) rotateX(0deg) rotateY(0deg)`;
				laserElement.style.opacity = '1';
			}, 250);
		}

		let animationFrameId: number;

		function updateLaserPosition() {
			if (laserElement) {
				switch (laserDirection) {
					case 'right':
						posX += laserSpeed;
						if (posX >= laserElement.clientWidth) {
							laserDirection = 'down';
							laserElement.style.setProperty('--laser-width', '2px');
							laserElement.style.setProperty('--laser-height', '100px');
							posX = laserElement.clientWidth - 2;
							posY = 0;
						}
						break;
					case 'down':
						posY += laserSpeed;
						if (posY >= laserElement.clientHeight) {
							laserDirection = 'left';
							laserElement.style.setProperty('--laser-width', '100px');
							laserElement.style.setProperty('--laser-height', '2px');
							posX = laserElement.clientWidth;
							posY = laserElement.clientHeight - 2;
						}
						break;
					case 'left':
						posX -= laserSpeed;
						if (posX <= 0) {
							laserDirection = 'up';
							laserElement.style.setProperty('--laser-width', '2px');
							laserElement.style.setProperty('--laser-height', '100px');
							posX = 2;
							posY = laserElement.clientHeight;
						}
						break;
					case 'up':
						posY -= laserSpeed;
						if (posY <= 0) {
							laserDirection = 'right';
							laserElement.style.setProperty('--laser-width', '100px');
							laserElement.style.setProperty('--laser-height', '2px');
							posX = 0;
							posY = 2;
						}
						break;
				}

				laserElement.style.setProperty('--laser-pos-x', posX + 'px');
				laserElement.style.setProperty('--laser-pos-y', posY + 'px');
				animationFrameId = requestAnimationFrame(updateLaserPosition);
			}
		}

		updateLaserPosition();
		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	});
</script>

<div
	class="relative text-white flex flex-col gap-6 items-center justify-center w-[200px] h-[200px]"
>
	<button
		class="absolute top-[-50px] left-[-10px] text-white/40 shadow-sm hover:scale-110 rounded-full"
		on:click={back}
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
				d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	</button>
	<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 24 24"
		><style>
			.spinner_EUy1 {
				animation: spinner_grm3 1.2s infinite, colorChange 3s infinite;
				fill: #f56565;
			}
			.spinner_f6oS {
				animation-delay: 0.1s;
			}
			.spinner_g3nX {
				animation-delay: 0.2s;
			}
			.spinner_nvEs {
				animation-delay: 0.3s;
			}
			.spinner_MaNM {
				animation-delay: 0.4s;
			}
			.spinner_4nle {
				animation-delay: 0.5s;
			}
			.spinner_ZETM {
				animation-delay: 0.6s;
			}
			.spinner_HXuO {
				animation-delay: 0.7s;
			}
			.spinner_YaQo {
				animation-delay: 0.8s;
			}
			.spinner_GOx1 {
				animation-delay: 0.9s;
			}
			.spinner_4vv9 {
				animation-delay: 1s;
			}
			.spinner_NTs9 {
				animation-delay: 1.1s;
			}
			.spinner_auJJ {
				transform-origin: center;
				animation: spinner_T3O6 6s linear infinite;
			}
			@keyframes spinner_grm3 {
				0%,
				50% {
					animation-timing-function: cubic-bezier(0.27, 0.42, 0.37, 0.99);
					r: 1px;
				}
				25% {
					animation-timing-function: cubic-bezier(0.53, 0, 0.61, 0.73);
					r: 2px;
				}
			}
			@keyframes spinner_T3O6 {
				0% {
					transform: rotate(360deg);
				}
				100% {
					transform: rotate(0deg);
				}
			}
			@keyframes colorChange {
				0% {
					fill: #f56565;
				}
				50% {
					fill: #4299e1;
				}
				100% {
					fill: #f56565;
				}
			}
		</style><g class="spinner_auJJ"
			><circle class="spinner_EUy1" cx="12" cy="3" r="1" /><circle
				class="spinner_EUy1 spinner_f6oS"
				cx="16.50"
				cy="4.21"
				r="1"
			/><circle class="spinner_EUy1 spinner_NTs9" cx="7.50" cy="4.21" r="1" /><circle
				class="spinner_EUy1 spinner_g3nX"
				cx="19.79"
				cy="7.50"
				r="1"
			/><circle class="spinner_EUy1 spinner_4vv9" cx="4.21" cy="7.50" r="1" /><circle
				class="spinner_EUy1 spinner_nvEs"
				cx="21.00"
				cy="12.00"
				r="1"
			/><circle class="spinner_EUy1 spinner_GOx1" cx="3.00" cy="12.00" r="1" /><circle
				class="spinner_EUy1 spinner_MaNM"
				cx="19.79"
				cy="16.50"
				r="1"
			/><circle class="spinner_EUy1 spinner_YaQo" cx="4.21" cy="16.50" r="1" /><circle
				class="spinner_EUy1 spinner_4nle"
				cx="16.50"
				cy="19.79"
				r="1"
			/><circle class="spinner_EUy1 spinner_HXuO" cx="7.50" cy="19.79" r="1" /><circle
				class="spinner_EUy1 spinner_ZETM"
				cx="12"
				cy="21"
				r="1"
			/></g
		></svg
	>
	<p class="wave-text text-white">
		{#each letters as letter, index (index)}
			{#if letter !== ' '}
				<span style="animation-delay: {index * 0.05}s">{letter}</span>
			{:else}
				&nbsp; &nbsp;
			{/if}
		{/each}
	</p>
</div>
