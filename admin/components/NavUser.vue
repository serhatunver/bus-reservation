<script setup lang="ts">
import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	CreditCard,
	LogOut,
	Sparkles,
} from "lucide-vue-next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

const { data, signOut } = useAuth();

const { isMobile } = useSidebar();
</script>

<template>
	<SidebarMenu v-if="data">
		<SidebarMenuItem>
			<DropdownMenu>
				<DropdownMenuTrigger as-child>
					<SidebarMenuButton
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<Avatar class="h-8 w-8 rounded-lg">
							<AvatarImage
								src="https://avatars.githubusercontent.com/u/96500903?v=4&size=64"
								:alt="data.user.name"
							/>
							<AvatarFallback class="rounded-lg">
								CN
							</AvatarFallback>
						</Avatar>
						<div
							class="grid flex-1 text-left text-sm leading-tight"
						>
							<span class="truncate font-semibold">{{
								data.user.name
							}}</span>
							<span class="truncate text-xs">{{
								data.user.email
							}}</span>
						</div>
						<ChevronsUpDown class="ml-auto size-4" />
					</SidebarMenuButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
					side="top"
					align="center"
					:side-offset="10"
				>
					<DropdownMenuLabel class="p-0 font-normal">
						<div
							class="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
						>
							<Avatar class="h-8 w-8 rounded-lg">
								<AvatarImage
									src="https://avatars.githubusercontent.com/u/96500903?v=4&size=64"
									:alt="data.user.name"
								/>
								<AvatarFallback class="rounded-lg">
									CN
								</AvatarFallback>
							</Avatar>
							<div
								class="grid flex-1 text-left text-sm leading-tight"
							>
								<span class="truncate font-semibold">{{
									data.user.name
								}}</span>
								<span class="truncate text-xs">{{
									data.user.email
								}}</span>
							</div>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						class="h-12"
						@click="() => signOut({ callbackUrl: '/login' })"
					>
						<LogOut />
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</SidebarMenuItem>
	</SidebarMenu>
</template>
