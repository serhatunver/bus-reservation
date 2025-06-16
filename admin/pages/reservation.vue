<script lang="ts" setup>
import { onBeforeMount } from "vue";
import { reservationColumns } from "@/components/columns";
import DataTable from "@/components/DataTable.vue";

import { useReservationStore } from "@/stores/reservation";
import { storeToRefs } from "pinia";
const reservationStore = useReservationStore();

const { fetchReservations } = reservationStore;
const { reservations } = storeToRefs(reservationStore);

onBeforeMount(async () => {
	await fetchReservations();
});
</script>

<template>
	<div class="w-full">
		<div
			className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4"
		>
			<div>
				<h2 className="text-2xl font-bold tracking-tight">
					Reservations
				</h2>
				<p className="text-muted-foreground">
					Manage your reservations here. You can add, edit, or delete
					reservations as needed.
				</p>
			</div>
		</div>
		<DataTable :columns="reservationColumns" :data="reservations" />
	</div>
</template>

<style scoped>
</style>