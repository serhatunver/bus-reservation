<script lang="ts" setup>
import { onBeforeMount } from "vue";
import { stopColumns } from "@/components/columns";
import DataTable from "@/components/DataTable.vue";
import AddStop from "@/components/stop/AddStop.vue";

import { useStopStore } from "@/stores/stop";
import { storeToRefs } from "pinia";
const stopStore = useStopStore();

const { fetchStops } = stopStore;
const { stops } = storeToRefs(stopStore);

onBeforeMount(async () => {
	await fetchStops();
});
</script>

<template>
	<div class="w-full">
		<div
			className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4"
		>
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Stops</h2>
				<p className="text-muted-foreground">
					Manage your stops here. You can add, edit, or delete stops
					as needed.
				</p>
			</div>
			<AddStop />
		</div>
		<DataTable :columns="stopColumns" :data="stops" />
	</div>
</template>

<style scoped>
</style>