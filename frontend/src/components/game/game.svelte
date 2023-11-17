<script lang="ts">
	import type { Socket } from 'socket.io-client';
	import { onMount } from 'svelte';

	export let socket: Socket;
	export let roomId: string;
	export let opponentName: string = 'Opponent';
	export let yourName: string = 'You';
	export let side: string = 'left';

	let width = 0;
	let height = 0;

	$: console.log('This is the width', width);
	$: console.log('This is the height', height);

	/** @brief Convert the power of paddle into the red color */
	function getColorBasedOnValue(value: number) {
		value = Math.max(1, Math.min(100, value - 10));
		const red = 255 - (value - 1) * 2.55;
		return `rgb(255, ${red}, ${red})`;
	}

	document.addEventListener('keydown', function (event) {
		console.log('Key pressed', event.key);
		socket.emit('keyDown', { roomId: roomId, key: event.key });
	});

	document.addEventListener('keyup', function (event) {
		console.log('Key released', event.key);
		socket.emit('keyUp', { roomId: roomId, key: event.key });
	});

	onMount(() => {
		const court = document.getElementById('court');
		const ball = document.getElementById('ball');
		const paddleLeft = document.getElementById('paddleLeft');
		const paddleRight = document.getElementById('paddleRight');
		const playerOneScoreElement = document.getElementById('playerOneScore');
		const playerTwoScoreElement = document.getElementById('playerTwoScore');
		const playerOneNameElement = document.getElementById('playerOneName');
		const playerTwoNameElement = document.getElementById('playerTwoName');

		if (playerOneNameElement && playerTwoNameElement) {
			if (side === 'left') {
				playerOneNameElement.innerHTML = yourName;
				playerTwoNameElement.innerHTML = opponentName;
			} else {
				playerOneNameElement.innerHTML = opponentName;
				playerTwoNameElement.innerHTML = yourName;
			}
		}

		console.log('[Game] Entered the game room');
		/**
		 * @attention	change the px to % in the game state
		 */
		socket.on('gameState', (gameState) => {
			console.log('I started to recevie game state: ');
			if (
				!ball ||
				!paddleRight ||
				!paddleLeft ||
				!playerOneScoreElement ||
				!playerTwoScoreElement
			) {
				console.log('Ball', ball);
				console.log('Paddle right', paddleRight);
				console.log('Paddle left', paddleLeft);
				console.log('Player one score', playerOneScoreElement);
				console.log('Player two score', playerTwoScoreElement);
				return;
			}
			console.log('I started to recevie game state');
			ball.style.left = gameState.ball.x * width + 'px';
			ball.style.top = gameState.ball.y * width + 'px';
			ball.style.width = gameState.ball.radius * width + 'px';
			ball.style.height = gameState.ball.radius * width + 'px';

			paddleLeft.style.top = gameState.playerOne.y * width + 'px';
			paddleLeft.style.left = gameState.playerOne.x * width + 'px';
			paddleLeft.style.width = gameState.playerOne.width * width + 'px';
			paddleLeft.style.height = gameState.playerOne.height * width + 'px';
			paddleLeft.style.transform =
				'translate(-50%, -50%)' + 'rotate(' + gameState.playerOne.angle + 'deg)';
			paddleLeft.style.backgroundColor = getColorBasedOnValue(gameState.playerOne.attack);
			playerOneScoreElement.innerHTML = gameState.playerOne.score;

			paddleRight.style.top = gameState.playerTwo.y * width + 'px';
			paddleRight.style.left = gameState.playerTwo.x * width + 'px';
			paddleRight.style.width = gameState.playerTwo.width * width + 'px';
			paddleRight.style.height = gameState.playerTwo.height * width + 'px';
			paddleRight.style.transform =
				'translate(-50%, -50%)' + 'rotate(' + gameState.playerTwo.angle + 'deg)';
			paddleRight.style.backgroundColor = getColorBasedOnValue(gameState.playerTwo.attack);
			playerTwoScoreElement.innerHTML = gameState.playerTwo.score;
		});
	});
</script>

<div
	class="court relative h-full w-full flex items-center justify-center text-white text-lg"
	id="court"
	bind:clientWidth={width}
	bind:clientHeight={height}
>
	<div class="scoreboard" id="scoreboard">
		<span id="playerOneName">Player A</span>: <span id="playerOneScore">0</span> -
		<span id="playerTwoName">Player B</span>: <span id="playerTwoScore">0</span>
	</div>
	<div class="paddle" id="paddleLeft" />
	<div class="paddle" id="paddleRight" />
	<div class="ball" id="ball" />
	<!-- <div class="result" /> -->
</div>

<style>
	.ball {
		width: 15px;
		height: 15px;
		background-color: #fff;
		border-radius: 50%;
		position: absolute;
		top: 150px;
		left: 300px;
		transform: translate(-50%, -50%);
	}

	.paddle {
		width: 10px;
		height: 80px;
		background-color: #fff;
		position: absolute;
		border-radius: 10%;
	}

	#paddleLeft {
		top: 1/2;
		left: 20%;
		transform: translate(-50%, -50%);
	}

	#paddleRight {
		top: 200px;
		right: 10px;
		transform: translate(-50%, -50%);
	}

	/* Paddle hover effect */
	.paddle:hover {
		background-color: #777;
	}

	/* Scoreboard styles (optional) */
	.scoreboard {
		position: absolute;
		top: 10px;
		left: 50%;
		transform: translateX(-50%);
		color: #fff;
		font-size: 24px;
	}
</style>
