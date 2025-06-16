<script lang="ts" setup>
import { computed } from "vue";
import Seat from "./Seat.vue";

const props = defineProps<{
	seatList: Array<{
		priority: number;
		isAvailable: boolean;
	}>;
}>();

// This computed property extracts unique priorities from the seatList and sorts them in ascending order.
const uniquePriorities = computed(() => {
	const priorities = props.seatList.map((s) => s.priority ?? 1);
	return [...new Set(priorities)].sort((a, b) => a - b);
});
</script>

<template>
	<div
		class="flex flex-wrap justify-between gap-4 mb-4 max-w-3xl mx-auto text-sm"
	>
		<!-- Dynamic Priority Seats -->
		<div
			v-for="priority in uniquePriorities"
			:key="priority"
			class="flex items-center gap-2"
		>
			<Seat
				:data="{ isAvailable: true, priority }"
				class="flex items-center justify-center w-14 h-14 text-base font-bold"
			/>
			<span>
				{{
					priority === 1
						? "Cheap"
						: priority === 2
						? "Medium"
						: "Expensive"
				}}
			</span>
		</div>

		<!-- Taken Seat -->
		<div class="flex items-center gap-2">
			<Seat
				:data="{ isAvailable: false }"
				class="flex items-center justify-center w-14 h-14 text-base font-bold"
			/>
			<span>Unavailable</span>
		</div>

		<!-- Selected Seat -->
		<div class="flex items-center gap-2">
			<Seat
				:data="{ isAvailable: true }"
				:selected="true"
				class="flex items-center justify-center w-14 h-14 text-base font-bold"
			/>
			<span>Selected</span>
		</div>
	</div>
</template>
