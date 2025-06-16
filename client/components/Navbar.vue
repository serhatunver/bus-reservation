<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-vue-next";

import DarkModeToggle from "@/components/DarkModeToggle.vue";
import MobileMenu from "./MobileMenu.vue";

const navigation = [
	{ name: "Home", href: "/" },
	{ name: "Reservation Tracker", href: "/track" },
	{ name: "About", href: "#" },
];

const { data, signOut, status } = useAuth();
</script>

<template>
	<section
		class="relative w-full flex items-center h-20 lg:h-24 border-b max-w-5xl"
	>
		<div class="w-full">
			<nav class="flex items-center justify-between">
				<NuxtLink to="/" class="flex items-center">
					<img
						class="h-8 md:h-12 md:w-50"
						src="../assets/busio.png"
						alt="busio logo"
					/>
				</NuxtLink>

				<!-- Desktop Navigation -->
				<div class="hidden md:flex items-center justify-between w-full">
					<div class="flex items-center justify-between mx-auto">
						<NuxtLink
							v-for="item in navigation"
							:key="item.name"
							:to="item.href"
							class="hover:bg-muted-foreground/10 px-3 py-3 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							{{ item.name }}
						</NuxtLink>
					</div>
					<div class="flex space-x-2">
						<DarkModeToggle />
						<div
							v-if="status === 'unauthenticated'"
							class="flex space-x-2"
						>
							<NuxtLink to="/login">
								<Button variant="outline" class="h-12 px-6">
									Log In
								</Button>
							</NuxtLink>
							<NuxtLink to="/signup">
								<Button variant="outline" class="h-12 px-6">
									Sign Up
								</Button>
							</NuxtLink>
						</div>
						<DropdownMenu v-if="status === 'authenticated'">
							<DropdownMenuTrigger as-child>
								<Button
									variant="outline"
									class="border-0 h-12 flex items-center max-w-[200px] w-full justify-start"
								>
									<Avatar class="h-8 w-8">
										<AvatarImage
											src="https://avatars.githubusercontent.com/u/96500903?v=4&size=64"
										></AvatarImage>
									</Avatar>
									<span
										class="ml-2 hidden md:flex justify-start flex-col items-start"
									>
										<p class="mb-0">
											{{
												data.user.name +
												" " +
												data.user.surname
											}}
										</p>
										<small
											class="text-xs text-slate-400 font-light"
										>
											{{ data.user.email }}
										</small>
									</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent class="w-56 relative mr-4">
								<DropdownMenuLabel>
									<div class="flex items-center space-x-2">
										<Avatar class="h-8 w-8">
											<AvatarImage
												src="https://avatars.githubusercontent.com/u/96500903?v=4&size=64"
											></AvatarImage>
										</Avatar>
										<span>
											{{
												data.user.name +
												" " +
												data.user.surname
											}}
										</span>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<NuxtLink
										to="/reservations"
										class="flex items-center"
									>
										<User class="mr-2 h-4 w-4" />
										<span>My Reservations</span>
									</NuxtLink>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									@click="() => signOut({ callbackUrl: '/' })"
								>
									<LogOut class="mr-2 h-4 w-4" />
									<span>Log out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				<!-- Mobile Navigation Button -->
				<div class="flex space-x-2 md:hidden">
					<DarkModeToggle />
					<DropdownMenu v-if="status === 'authenticated'">
						<DropdownMenuTrigger as-child>
							<Button
								variant="outline"
								class="border-0 h-12 flex items-center justify-start"
							>
								<Avatar class="h-8 w-8">
									<AvatarImage
										src="https://avatars.githubusercontent.com/u/96500903?v=4&size=64"
									></AvatarImage>
								</Avatar>
								<span
									class="ml-2 hidden md:flex justify-start flex-col items-start"
								>
									<p class="mb-0">
										{{
											data.user.name +
											" " +
											data.user.surname
										}}
									</p>
									<small
										class="text-xs text-slate-400 font-light"
									>
										{{ data.user.email }}
									</small>
								</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent class="w-56 relative mr-4">
							<DropdownMenuLabel>
								<div class="flex items-center space-x-2">
									<Avatar class="h-8 w-8">
										<AvatarImage
											src="https://avatars.githubusercontent.com/u/96500903?v=4&size=64"
										></AvatarImage>
									</Avatar>
									<span>
										{{
											data.user.name +
											" " +
											data.user.surname
										}}
									</span>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<NuxtLink
									to="/reservations"
									class="flex items-center"
								>
									<User class="mr-2 h-4 w-4" />
									<span>My Reservations</span>
								</NuxtLink>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								@click="() => signOut({ callbackUrl: '/' })"
							>
								<LogOut class="mr-2 h-4 w-4" />
								<span>Log out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<MobileMenu />
				</div>
			</nav>
		</div>
	</section>
</template>
