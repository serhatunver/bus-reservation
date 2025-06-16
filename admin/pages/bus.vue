<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import type { Bus } from "@/components/columns";
import { busColumns } from "@/components/columns";
import DataTable from "@/components/DataTable.vue";
import AddBus from "@/components/bus/AddBus.vue";

import { useBusStore } from "@/stores/bus";
import { storeToRefs } from "pinia";
const busStore = useBusStore();

const { fetchBuses } = busStore;
const { buses } = storeToRefs(busStore);

onBeforeMount(async () => {
	await fetchBuses();
});
</script>

<template>
	<div class="w-full">
		<div
			className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4"
		>
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Buses</h2>
				<p className="text-muted-foreground">
					Manage your buses here. You can add, edit, or delete buses
					as needed.
				</p>
			</div>
			<AddBus />
		</div>
		<DataTable :columns="busColumns" :data="buses" />
	</div>
</template>

<style scoped>
</style>