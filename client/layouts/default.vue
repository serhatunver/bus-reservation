<script setup lang="ts">
import Navbar from "@/components/Navbar.vue";
</script>


<template>
	<main
		class="flex flex-col items-center bg-blue-50 dark:bg-background px-4 sm:px-6 md:px-8 min-h-screen"
	>
		<Navbar />
		<slot />
	</main>
</template>
