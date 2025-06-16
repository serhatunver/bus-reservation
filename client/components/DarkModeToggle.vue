<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-vue-next";
import { useColorMode } from "@vueuse/core";

const mode = useColorMode({
	initialValue: "auto",
	storageKey: "vueuse-color-mode",
	disableTransition: false,
});
</script>

<template>
	<div>
		<Button
			class="size-12"
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
		<!-- <Button @click="mode = 'light'">Light</Button>
		<Button @click="mode = 'dark'">Dark</Button> -->
	</div>
</template>