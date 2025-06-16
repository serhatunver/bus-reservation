<script lang="ts" setup>
definePageMeta({
	title: "404 - Page Not Found",
	auth: false,
});
import { Button } from "@/components/ui/button";
</script>

<template>
	<div
		class="flex items-center min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-6rem)] sm:px-6 md:px-8 lg:px-12 xl:px-16"
	>
		<div class="w-full space-y-6 text-center">
			<div class="space-y-3">
				<h1
					class="text-4xl font-bold tracking-tighter sm:text-5xl animate-bounce"
				>
					404 Page Not Found
				</h1>
				<p class="text-gray-600 dark:text-gray-300 text-lg">
					Sorry, we couldn't find the page you're looking for.
				</p>
			</div>
			<NuxtLink to="/" class="flex justify-center">
				<Button class="h-12 text-base"> Return to Home </Button>
			</NuxtLink>
		</div>
	</div>
</template>
        
<style scoped>
</style>