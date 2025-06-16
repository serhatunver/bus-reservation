<script lang="ts" setup>
definePageMeta({
	auth: false,
});

import { ref, computed } from "vue";

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
import CustomInput from "@/components/CustomInput.vue";
import ReservationCard from "~/components/ReservationCard.vue";
import { Loader } from "lucide-vue-next";

import { useReservationStore } from "@/stores/reservation";
import { storeToRefs } from "pinia";
const reservationStore = useReservationStore();
const { fetchReservationDetails } = reservationStore;

import { useRouter } from "vue-router";
const router = useRouter();

const pnrNumber = ref("69047423");
const email = ref("serhat@example.com");
const isLoading = ref(false);
const reservationDetails = ref(null);

const handleTrackReservation = async () => {
	isLoading.value = true;
	try {
		const details = await fetchReservationDetails(
			pnrNumber.value,
			email.value
		);
		reservationDetails.value = details;
	} catch (error) {
		console.error("Error tracking reservation:", error);
	} finally {
		isLoading.value = false;
	}
};
</script>

<template>
	<div
		class="container mx-auto max-w-3xl py-4 flex flex-col items-center space-y-4"
	>
		<Card class="max-w-4xl w-full bg-background shadow-2xl">
			<CardHeader>
				<CardTitle class="text-xl font-bold"
					>Track Reservation</CardTitle
				>
				<CardDescription>
					Please enter your PNR Number and email address to track your
					reservation.
				</CardDescription>
			</CardHeader>
			<Separator />
			<CardContent class="space-y-4">
				<CustomInput
					v-model="pnrNumber"
					type="text"
					placeholder="Enter PNR Number"
					class="w-full"
				/>
				<CustomInput
					v-model="email"
					type="text"
					placeholder="Enter Email"
					class="w-full"
				/>

				<div v-if="isLoading" class="mt-4">
					<Loader class="animate-spin h-6 w-6 text-blue-500" />
				</div>
				<div v-if="reservationDetails" class="mt-8">
					<h2 class="text-xl font-semibold">Reservation Details</h2>
					<ReservationCard
						@reservation-cancelled="handleTrackReservation"
						:reservation="reservationDetails"
						class="p-4 border rounded-lg bg-background shadow-sm"
					/>
				</div>
			</CardContent>
			<Separator />
			<CardFooter>
				<Button
					@click="handleTrackReservation"
					class="w-full h-14 text-base"
					:disabled="isLoading"
				>
					{{ isLoading ? "Tracking..." : "Track Reservation" }}
				</Button>
			</CardFooter>
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