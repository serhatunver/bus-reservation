<script lang="ts" setup>
import { ref } from "vue";
import { Search, ArrowRightLeft } from "lucide-vue-next";
import { useSearchStore } from "@/stores/search";
import { storeToRefs } from "pinia";

const searchStore = useSearchStore();
const { searchForm } = storeToRefs(searchStore);
const { swapCities } = searchStore;

const isSwapping = ref(false);

function animateSwap() {
	isSwapping.value = true;
	setTimeout(() => {
		isSwapping.value = false;
	}, 300);
}

defineProps({
	searchButtonText: {
		type: String,
		default: "Search",
	},
});

const emit = defineEmits<{
	(e: "submit"): void;
}>();
</script>

<template>
	<div
		class="flex flex-col w-full max-w-5xl justify-center items-center space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2"
	>
		<div
			class="flex flex-col w-full relative space-y-0 sm:flex-row sm:h-auto sm:space-x-2"
		>
			<SearchInput
				class="w-full"
				v-model="searchForm.fromStop"
				:modelValue="searchForm.fromStop"
				placeholder="From Where"
			/>
			<Button
				class="absolute bottom-0 p-6 size-14 right-4 top-7 z-[2] flex items-center justify-center sm:static border border-gray-400 dark:border-gray-600"
				variant="secondary"
				size="icon"
				:disabled="isSwapping"
				@click="
					swapCities();
					animateSwap();
				"
			>
				<ArrowRightLeft
					:class="{ spin: isSwapping }"
					class="icon mx-6 size-6"
				/>
			</Button>
			<SearchInput
				class="w-full"
				v-model="searchForm.toStop"
				:modelValue="searchForm.toStop"
				placeholder="To Where"
			/>
		</div>
		<div
			class="flex flex-col w-full space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0"
		>
			<DatePicker
				class="flex w-full"
				v-model="searchForm.outboundDate"
				:modelValue="searchForm.outboundDate"
				:placeholder="'Departure Date'"
			/>
			<Button
				class="flex h-14 w-full sm:w-40 text-lg"
				@click="emit('submit')"
			>
				<Search class="size-5" />
				<span>{{ searchButtonText }}</span>
			</Button>
		</div>
	</div>
</template>

<style scoped>
.spin {
	animation: spin 0.3s ease;
}
@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(180deg);
	}
}
</style>