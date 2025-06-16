<script lang="ts" setup>
definePageMeta({
	auth: false,
	path: "/reservation-summary/:pnr",
});

import { ref } from "vue";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import ReservationCard from "~/components/ReservationCard.vue";

import { useReservationStore } from "@/stores/reservation";
const reservationStore = useReservationStore();
const { fetchReservationDetailsByPnr } = reservationStore;

import { useRouter } from "vue-router";
const route = useRoute();

const isLoading = ref(false);
const reservationDetails = ref(null);

onBeforeMount(async () => {
	if (!route.params.pnr) {
		console.error("PNR number is required to track reservation.");
		return;
	}
	isLoading.value = true;
	try {
		reservationDetails.value = await fetchReservationDetailsByPnr(
			route.params.pnr as string
		);
	} catch (error) {
		console.error("Error fetching reservation details:", error);
	} finally {
		isLoading.value = false;
	}
});
</script>

<template>
	<div
		class="container mx-auto max-w-3xl py-4 flex flex-col items-center space-y-4"
	>
		<Card class="max-w-4xl w-full bg-background shadow-2xl">
			<CardHeader>
				<CardTitle class="text-xl font-bold"
					>Your Reservation</CardTitle
				>
			</CardHeader>
			<Separator />
			<CardContent class="space-y-4">
				<div v-if="reservationDetails">
					<ReservationCard
						:reservation="reservationDetails"
						class="p-4 border rounded-lg bg-background shadow-sm"
					/>
				</div>
			</CardContent>
		</Card>
		<Card class="max-w-4xl w-full bg-background shadow-2xl">
			<CardHeader>
				<CardTitle class="text-xl font-bold">Help</CardTitle>
				<CardDescription>
					If you have any issues, please contact our support team.
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-4">
				<p class="text-gray-600">
					For assistance, please email us at
					<a
						href="mailto:support@example.com"
						class="text-blue-600 underline"
						>support@example.com</a
					>.
				</p>
				<p class="text-gray-600">
					You can also reach us at
					<a href="tel:+1234567890" class="text-blue-600 underline"
						>+1 (234) 567-890</a
					>.
				</p>
			</CardContent>
			<CardFooter>
				<Button
					@click="() => router.push('/')"
					class="w-full h-14 text-base"
				>
					Back to Home
				</Button>
			</CardFooter>
		</Card>
	</div>
</template>

<style scoped>
</style>