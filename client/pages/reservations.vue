<script lang="ts" setup>
definePageMeta({
	title: "My Reservations",
	// auth: {
	// 	unauthenticatedOnly: false,
	// 	navigateAuthenticatedTo: "/",
	// },
});

import ReservationCard from "~/components/ReservationCard.vue";

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();

const { myReservations } = storeToRefs(userStore);
const { fetchMyReservations } = userStore;

const { data } = useAuth();

onBeforeMount(async () => {
	await fetchMyReservations();
});
</script>

<template>
	<div class="container mx-auto max-w-3xl py-4">
		<h1 class="text-2xl font-bold mb-4">My Reservations</h1>
		<div
			v-if="myReservations.length === 0"
			class="text-center text-muted-foreground"
		>
			You have no reservations.
		</div>
		<ul v-else class="space-y-4">
			<ReservationCard
				v-for="reservation in myReservations"
				:key="reservation._id"
				:reservation="reservation"
				class="p-4 border rounded-lg bg-background shadow-sm"
			/>
		</ul>
	</div>
</template>

<style scoped>
</style>