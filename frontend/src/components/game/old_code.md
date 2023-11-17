```svelte
				{:else if clickedPlay && !clickedPlayWithFriends && !clickedMatchmaking && !showDiv}
					<div
						class={`relative flex flex-col items-center justify-center h-full w-full transition duration-500 transform ease-in-out gap-7 ${
							clickedPlay ? 'opacity-100' : `opacity-100`
						}`}
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
						<div
							class="relative flex w-full max-w-[200px] rounded-md ring-1 ring-gray-500/20 group/1"
						>
							<div
								class="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg blur opacity-50 group-hover/1:opacity-75 transition duration-1000 group-hover/1:duration-200 animate-tilt"
							/>
							<!-- trigger to say that he is on the waiting list -->
							<button
								class="uppercase relative w-full rounded-md bg-black text-white font-medium p-4 transition transform duration-500 hover:duration-300"
								on:click={() => clickedButton('matchmaking')}
							>
								<span />
								<p class="tracking-wider font-bold group-hover/1:font-extrabold">Matchmaking</p>
							</button>
						</div>
						<div
							class="relative flex w-full max-w-[200px] rounded-md ring-1 ring-gray-500/20 group/2"
						>
							<div
								class="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg blur opacity-50 group-hover/2:opacity-75 transition duration-1000 group-hover/2:duration-200 animate-tilt"
							/>
							<button
								class="uppercase relative rounded-md bg-black text-white p-4 font-medium hover:font-bold transition transform duration-500 hover:duration-300"
								on:click={() => clickedButton('friends')}
							>
								<span />
								<p class="tracking-wider font-bold group-hover/2:font-extrabold">
									Play with a friend
								</p>
							</button>
						</div>
					</div>
				{:else if showDiv}
					<div class="relative flex items-center justify-center h-full w-full">
						<!-- Bouton de retour -->
						<button
							class="absolute top-[-50px] left-[-10px] text-white/40 shadow-sm hover:scale-110 rounded-full"
							on:click={back}
						>
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
									d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</button>

						<!-- Contenu centré -->
						<div
							class="relative rounded-md bg-black z-1 text-white ring-1 ring-gray-600/20 backdrop-blur-2xl p-2 gap-4 flex flex-col shadow-md group/1 w-[200px] h-[250px] max-h-[250px]"
						>
							<div class="absolute inset-0 bg-black rounded-md" />

							<header
								class="z-50 w-full h-[15px] text-white font-bold flex items-center justify-center fixed uppercase"
							>
								Friends
							</header>
							<div class="z-50 no-scrollbar overflow-x-auto flex flex-col gap-4 h-full mt-8">
								{#each Array(5) as _, index (index)}
									<button
										class="border w-full group border-gray-600/10 shadow-lg hover:bg-gray-500/50 ring-1 ring-gray-600/20 rounded-md rounded-l-full h-1/2 flex items-center gap-2"
										on:click={() => clickedButton('friends', true)}
									>
										<img
											src="https://avatars.githubusercontent.com/u/59157371?v=4"
											class="rounded-full h-11 w-11 group-hover:border group-hover:border-white/20 group-hover:scale-110"
											alt=""
										/>
										<p class="truncate">Akadil</p>
										<div class="truncate hidden group-hover:block text-white/30 font-extrabold">
											Invite
										</div>
									</button>
								{/each}
							</div>
							<div
								class="absolute -inset-0.5 z-[-10] bg-gradient-to-r from-red-500 to-blue-500 rounded-lg blur opacity-50 group-hover/1:opacity-75 transition duration-1000 group-hover/1:duration-200 animate-tilt"
							/>
						</div>
					</div>
```