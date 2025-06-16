<script lang="ts" setup>
definePageMeta({
	auth: false,
});

import { useRouter } from "vue-router";
import SearchForm from "@/components/SearchForm.vue";

const router = useRouter();
import { useSearchStore } from "@/stores/search";
import { storeToRefs } from "pinia";
const searchStore = useSearchStore();

const { searchForm } = storeToRefs(searchStore);
const handleSearch = () => {
	router.push({
		name: "search",
		params: {
			fromStopId: searchForm.value.fromStop.id,
			toStopId: searchForm.value.toStop.id,
		},
		query: {
			outboundDate: searchForm.value.outboundDate,
		},
	});
};
</script>

<template>
	<div class="w-full flex flex-col items-center space-y-2">
		<div class="flex flex-col items-center text-center space-y-2 p-4">
			<h1 class="font-bold text-xl sm:text-4xl md:text-4xl lg:text-5xl">
				Find Your Bus Trip
			</h1>
			<p class="text-muted-foreground text-base sm:text-xl">
				Search for bus trips between stops, view available trips, and
				book your tickets online.
			</p>
		</div>
		<SearchForm :search-button-text="'Search'" @submit="handleSearch" />
	</div>
</template>

<style scoped>
</style>