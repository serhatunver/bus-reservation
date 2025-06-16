<script lang="ts" setup>
definePageMeta({
	auth: false,
	path: "/trip/:tripId/:fromStopId/:toStopId",
});

import { ref, onBeforeMount } from "vue";
import { Button } from "@/components/ui/button";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import PassengerForm from "@/components/TripView/PassengerForm.vue";
import { ArrowRight, Loader } from "lucide-vue-next";

const route = useRoute();

import { useTripStore } from "@/stores/trip";
import { storeToRefs } from "pinia";
const tripStore = useTripStore();

const { selectedTrip, availableSeats } = storeToRefs(tripStore);
const { fetchTripDetails, fetchAvailableSeats } = tripStore;

const isLoading = ref(false);
onBeforeMount(async () => {
	isLoading.value = true;
	await fetchTripDetails(
		route.params.tripId as string,
		route.params.fromStopId as string,
		route.params.toStopId as string
	);
	await fetchAvailableSeats({
		tripId: route.params.tripId as string,
		fromStopId: route.params.fromStopId as string,
		toStopId: route.params.toStopId as string,
	});
	isLoading.value = false;
});
</script>


<template>
	<div
		class="container mx-auto max-w-3xl py-4 flex flex-col items-center space-y-4"
	>
		<Card class="max-w-4xl w-full bg-background shadow-2xl pb-0">
			<CardHeader>
				<CardTitle class="text-xl font-bold"> Trip Details</CardTitle>
				<CardDescription>
					Here are the details of your selected trip. Please review
					before proceeding.
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-4 p-0">
				<BusCard v-if="!isLoading" :trip="selectedTrip" />
			</CardContent>
		</Card>
		<PassengerForm v-if="!isLoading" />
	</div>
</template>
