<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-vue-next";
import { useColorMode } from "@vueuse/core";

const mode = useColorMode({
	initialValue: "auto",
	storageKey: "vueuse-color-mode",
	disableTransition: false,
});

const { data } = useAuth();
</script>


<template>
	<SidebarProvider>
		<AppSidebar />
		<SidebarInset>
			<header
				class="flex justify-between pr-10 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear"
			>
				<div class="flex items-center gap-2 px-4">
					<SidebarTrigger class="-ml-1" />
					<Button
						class="size-10"
						variant="outline"
						size="icon"
						@click="mode = mode === 'dark' ? 'light' : 'dark'"
					>
						<MoonIcon
							class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
						/>
						<SunIcon
							class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
						/>
						<span class="sr-only">Toggle theme</span>
					</Button>
				</div>
				<RouterLink
					v-if="!data"
					to="/login"
					class="text-lg font-semibold text-muted-foreground"
				>
					<Button size="lg"> Login </Button>
				</RouterLink>
			</header>
			<div class="flex flex-1 flex-col gap-4 p-4 pt-0">
				<div class="p-2 w-full lg:p-6 max-w-[1440px]">
					<RouterView v-slot="{ Component }">
						<transition name="fade" mode="out-in">
							<component :is="Component"></component>
						</transition>
					</RouterView>
				</div>
			</div>
		</SidebarInset>
	</SidebarProvider>
</template>
