<script lang="ts" setup>
definePageMeta({
	auth: {
		unauthenticatedOnly: false,
		navigateUnauthenticatedTo: "/login",
	},
});
import { onBeforeMount } from "vue";
import { tripColumns } from "@/components/columns";
import DataTable from "@/components/DataTable.vue";
import AddTrip from "@/components/trip/AddTrip.vue";

import { useTripStore } from "@/stores/trip";
import { storeToRefs } from "pinia";
const tripStore = useTripStore();

const { fetchTrips } = tripStore;
const { trips } = storeToRefs(tripStore);

onBeforeMount(async () => {
	await fetchTrips();
});
</script>

<template>
	<div class="w-full">
		<div
			class="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4"
		>
			<div>
				<h2 class="text-2xl font-bold tracking-tight">Trips</h2>
				<p class="text-muted-foreground">
					Manage your trips here. You can add, edit, or delete trips
					as needed.
				</p>
			</div>
			<AddTrip />
		</div>
		<DataTable :columns="tripColumns" :data="trips" class="w-full" />
	</div>
</template>

<style scoped>
</style>