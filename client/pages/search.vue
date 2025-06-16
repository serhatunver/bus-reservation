<script lang="ts" setup>
definePageMeta({
	title: "Search",
	description: "Search for bus trips between stops",
	auth: false,
	path: "/search/:fromStopId/:toStopId",
});
import { ref, onBeforeMount, watch } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import SearchForm from "@/components/SearchForm.vue";
import BusCard from "@/components/BusCard.vue";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useSearchStore } from "@/stores/search";
import { storeToRefs } from "pinia";
const searchStore = useSearchStore();

const route = useRoute();
const router = useRouter();
// const availableTrips = ref();

const outboundDate = route.query.outboundDate;

console.log("Outbound Date:", outboundDate);

const isLoading = ref(false);

const { availableTrips, searchForm } = storeToRefs(searchStore);
const { fetchAvailableTrips } = searchStore;

const handleSearch = async () => {
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

const navigateToTrip = (tripId: string) => {
	router.push({
		name: "trip",
		params: {
			tripId,
			fromStopId: route.params.fromStopId as string,
			toStopId: route.params.toStopId as string,
		},
	});
};

onBeforeMount(async () => {
	// Initial fetch to populate available trips
	try {
		console.log("SearchView before mount");
		isLoading.value = true;
		await fetchAvailableTrips({
			fromStopId: route.params.fromStopId as string,
			toStopId: route.params.toStopId as string,
			outboundDate: route.query.outboundDate as string,
		});
		console.log("Available trips fetched:", availableTrips.value);
		isLoading.value = false;
	} catch (error) {
		console.error("Error fetching available trips:", error);
	} finally {
	}
});

watch(
	() => [route.params.fromStopId, route.params.toStopId],
	async () => {
		console.log("Route params changed, fetching trips...");
		isLoading.value = true;
		try {
			await fetchAvailableTrips({
				fromStopId: route.params.fromStopId as string,
				toStopId: route.params.toStopId as string,
				outboundDate: route.query.outboundDate as string,
			});
			console.log("Available trips updated:", availableTrips.value);
		} catch (error) {
			console.error("Error fetching available trips:", error);
		} finally {
			isLoading.value = false;
		}
	}
);
</script>

<template>
	<div class="h-full w-full pt-4 mx-auto flex flex-col items-center">
		<SearchForm :search-button-text="'Update'" @submit="handleSearch" />

		<div class="w-full flex flex-col items-center space-y-4">
			<div v-if="isLoading" class="w-full max-w-5xl space-y-2 mt-4">
				<Skeleton v-for="n in 3" :key="n" class="w-full h-42 mt-2" />
			</div>

			<div
				v-if="!isLoading && availableTrips.length === 0"
				class="w-full max-w-5xl text-center mt-4"
			>
				<p class="text-muted-foreground">
					No trips found for the selected route and date.
				</p>
			</div>

			<div
				v-else
				v-for="trip in availableTrips"
				@click="navigateToTrip(trip._id)"
				:key="trip._id"
				class="w-full max-w-5xl flex flex-col items-center"
			>
				<BusCard :trip="trip" class="mt-4" />
			</div>
		</div>
	</div>
</template>

<style scoped>
</style>