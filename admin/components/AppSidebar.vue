<script setup lang="ts">
import type { SidebarProps } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import {
	AudioWaveform,
	Command,
	Frame,
	GalleryVerticalEnd,
	Map,
	PieChart,
	SquareTerminal,
	Ticket,
	BusFront,
	MapPin,
	User,
} from "lucide-vue-next";
import NavUser from "@/components/NavUser.vue";
import TeamSwitcher from "@/components/TeamSwitcher.vue";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

import { ChevronRight } from "lucide-vue-next";

const props = withDefaults(defineProps<SidebarProps>(), {
	collapsible: "icon",
});

const navMain = [
	{
		title: "Trips",
		url: "trip",
		icon: SquareTerminal,
	},
	{
		title: "Reservations",
		url: "reservation",
		icon: Ticket,
	},
	{
		title: "Buses",
		url: "bus",
		icon: BusFront,
	},
	{
		title: "Stops",
		url: "stop",
		icon: MapPin,
	},
	{
		title: "Users",
		url: "user",
		icon: User,
	},
];
</script>

<template>
	<Sidebar v-bind="props">
		<SidebarHeader>
			<img
				class="h-12 w-fit mt-2"
				src="../assets/busio.png"
				alt="busio logo"
			/>
		</SidebarHeader>
		<SidebarContent>
			<SidebarGroup>
				<SidebarMenu>
					<SidebarMenuItem v-for="item in navMain" :key="item.title">
						<SidebarMenuButton
							class="h-10 rounded-xl"
							:tooltip="item.title"
						>
							<NuxtLink
								:to="item.url"
								:class="
									cn(
										'group data-[state=open]/collapsible:bg-secondary data-[state=open]/collapsible:text-primary',
										$route.path === `/dashboard/${item.url}`
											? 'bg-secondary text-primary'
											: 'text-muted-foreground'
									)
								"
								class="flex flex-1 h-10 rounded-xl items-center gap-2 text-base font-medium transition-colors duration-200 hover:bg-secondary hover:text-primary"
							>
								<component :is="item.icon" class="size-4" />
								<span>{{ item.title }}</span>
								<ChevronRight
									class="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
								/>
							</NuxtLink>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarGroup>
		</SidebarContent>
		<SidebarFooter>
			<NavUser />
		</SidebarFooter>
		<SidebarRail />
	</Sidebar>
</template>
