<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		const isMobile = window.matchMedia('(max-width: 767px)').matches;
		if (isMobile) {
			return;
		}
		const coords = { x: 0, y: 0 };
		const circles: NodeListOf<HTMLDivElement> = document.querySelectorAll('.circle');
		let isVisible: boolean = true;
		let animationFrameId: number;

		const colors: string[] = [
			'rgba(38, 97, 156, 0.5)',
			'rgba(42, 93, 150, 0.5)',
			'rgba(46, 89, 144, 0.5)',
			'rgba(50, 85, 138, 0.5)',
			'rgba(54, 81, 132, 0.5)',
			'rgba(58, 77, 126, 0.5)',
			'rgba(62, 73, 120, 0.5)',
			'rgba(66, 69, 114, 0.5)',
			'rgba(70, 65, 108, 0.5)',
			'rgba(74, 61, 102, 0.5)',
			'rgba(78, 57, 96, 0.5)',
			'rgba(82, 53, 90, 0.5)',
			'rgba(86, 49, 84, 0.5)',
			'rgba(90, 45, 78, 0.5)',
			'rgba(94, 41, 72, 0.5)',
			'rgba(98, 37, 66, 0.5)',
			'rgba(102, 33, 60, 0.5)',
			'rgba(106, 29, 54, 0.5)',
			'rgba(110, 25, 48, 0.5)',
			'rgba(114, 21, 42, 0.5)',
			'rgba(118, 17, 36, 0.5)',
			'rgba(122, 13, 30, 0.5)',
			'rgba(126, 9, 24, 0.5)',
			'rgba(130, 5, 18, 0.5)',
			'rgba(134, 1, 12, 0.5)',
			'rgba(138, 0, 6, 0.5)',
			'rgba(142, 0, 0, 0.5)'
		];

		function handleMouseOut() {
			isVisible = false;
			circles.forEach((circle) => {
				circle.style.visibility = 'hidden';
			});
		}

		function handleMouseOver() {
			isVisible = true;
			circles.forEach((circle) => {
				circle.style.visibility = 'visible';
			});
		}

		function handleMouseMove(e: MouseEvent) {
			coords.x = e.clientX;
			coords.y = e.clientY;
		}

		document.addEventListener('mouseout', handleMouseOut);
		document.addEventListener('mouseover', handleMouseOver);
		document.addEventListener('mousemove', handleMouseMove);

		circles.forEach(function (circle, index) {
			circle.dataset.x = '0';
			circle.dataset.y = '0';
			circle.style.backgroundColor = colors[index % colors.length];
		});
		function animateCircles() {
			if (!isVisible) {
				circles.forEach((circle) => {
					circle.style.visibility = 'hidden';
				});
			}
			let x = coords.x;
			let y = coords.y;
			circles.forEach(function (circle, index) {
				circle.style.left = x - 12 + 'px';
				circle.style.top = y - 12 + 'px';
				circle.style.transform = `scale(${(circles.length - index) / circles.length})`;
				circle.dataset.x = x.toString();
				circle.dataset.y = y.toString();
				const nextCircle = circles[index + 1] || circles[0];
				x += (parseFloat(nextCircle.dataset.x || '0') - x) * 0.3;
				y += (parseFloat(nextCircle.dataset.y || '0') - y) * 0.3;
			});
			animationFrameId = requestAnimationFrame(animateCircles);
		}

		animateCircles();

		return () => {
			cancelAnimationFrame(animationFrameId);
			document.removeEventListener('mouseout', handleMouseOut);
			document.removeEventListener('mouseover', handleMouseOver);
			document.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<!-- Circle Elements -->
{#each Array(24) as _, i}
	<div class="circle" />
{/each}

<style>
	.circle {
		height: 24px;
		width: 24px;
		border-radius: 24px;
		background-color: black;
		position: fixed;
		top: 0;
		left: 0;
		pointer-events: none;
		filter: blur(2px);
		z-index: 99999999;
	}
</style>
