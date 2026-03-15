<script lang="ts" setup>
import { ref, computed, onBeforeMount, defineEmits, defineProps } from "vue";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { useTripStore } from "@/stores/trip";
import { storeToRefs } from "pinia";
const tripStore = useTripStore();

const { selectSeat } = tripStore;

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import Seat from "@/components/TripView/Seat.vue";
import SeatLegend from "@/components/TripView/SeatLegend.vue";
import { X } from "lucide-vue-next";

interface SeatData {
	seatNumber: string;
	row: number;
	column: number;
	isAvailable: boolean;
	priority?: number | null;
	price?: number | null;
}

const selectedSeat = ref<SeatData | null>(null); // This will hold the selected seat data
const seats = ref([]); // This will be populated with the seats data from props
const isOpen = ref(false);

const props = defineProps({
	availableSeats: {
		type: Array,
		default: () => [],
	},
	selectedTrip: {
		type: Object,
		default: () => ({}),
	},
});

const mergeSeatData = (allSeats, availableSeats) => {
	const seatMap = new Map();

	for (const seat of availableSeats) {
		seatMap.set(seat.seatNumber, seat);
	}

	return allSeats.map((seat) => {
		const available = seatMap.get(seat.seatNumber);

		return {
			...seat,
			isAvailable: !!available,
			priority: available?.priority ?? null,
			price: available?.price ?? null,
		};
	});
};

onBeforeMount(() => {
	seats.value = mergeSeatData(
		props.selectedTrip.bus.seats,
		props.availableSeats
	);
	console.log("Available Seats:", props.availableSeats);
	console.log("Seats before merging:", seats.value);
});

const rows = 14; // 14 satır
const cols = 4; // 4 sütun

// Dikey versiyon için koltuk eşlemesi
const getSeat = (row: Number, col: Number) => {
	return seats.value.find((seat) => seat.row === row && seat.column === col);
};

const emits = defineEmits(["select"]);

const handleSelect = () => {
	if (selectedSeat.value) {
		emits("select", selectedSeat.value);
		isOpen.value = false; // Close the dialog after selection
	} else {
		console.warn("No seat selected");
	}
};

console.log("selectedTrip:", props.selectedTrip);
</script>

<template>
	<Dialog
		:open="isOpen"
		@update:open="(newOpenValue) => (isOpen = newOpenValue)"
	>
		<DialogTrigger class="w-full" as-child>
			<Button
				variant="outline"
				class="w-full justify-start h-14 text-base"
			>
				{{ selectedSeat?.seatNumber || "Select Seat" }}
			</Button>
		</DialogTrigger>
		<DialogContent class="w-full h-full max-w-full rounded-none p-0 gap-0">
			<DialogHeader class="text-center w-full mx-auto p-6">
				<DialogClose as-child>
					<Button
						class="absolute top-0 right-0 mr-4 mt-4 size-12"
						variant="outline"
						size="icon"
					>
						<X class="size-6" />
					</Button>
				</DialogClose>
				<DialogTitle class="text-2xl font-bold text-center">
					Select Seat
				</DialogTitle>
			</DialogHeader>
			<div class="overflow-auto">
				<div class="p-4 max-w-4xl mx-auto">
					<!-- Seat Legend -->
					<SeatLegend :seatList="seats" />
					<div
						class="mx-auto w-fit flex border-3 border-blue-900 dark:border-accent-foreground rounded-4xl p-4"
					>
						<div class="flex flex-col gap-2">
							<!-- Satırları (14) döngüyle çiz -->
							<div
								v-for="row in rows"
								:key="row"
								class="flex w-fit"
							>
								<!-- Her satırda 4 koltuk -->
								<ToggleGroup
									v-model="selectedSeat"
									type="single"
									class="flex items-center justify-center gap-2"
								>
									<ToggleGroupItem
										v-for="col in cols"
										:key="`${row}-${col}`"
										:disabled="
											!getSeat(row, col) ||
											!getSeat(row, col)?.isAvailable
										"
										:value="getSeat(row, col) ?? null"
										class="w-14 h-14 p-0 data-[state=on]:bg-transparent hover:bg-transparent"
										v-slot="{ pressed }"
									>
										<Seat
											:selected="pressed"
											:data="getSeat(row, col)"
											v-if="getSeat(row, col)"
											:class="
												cn(
													'flex items-center justify-center w-14 h-14 text-base font-bold'
												)
											"
										/>
										<div
											v-else
											class="w-14 h-14 rounded-xl"
										></div>
									</ToggleGroupItem>
								</ToggleGroup>
							</div>
						</div>
					</div>
				</div>
			</div>
			<DialogFooter class="p-4 max-w-100 mx-auto">
				<div class="flex items-center gap-2">
					<span> Your seat:</span>
					<Seat
						v-if="!selectedSeat"
						class="h-12 w-12"
						:data="{ isAvailable: false }"
						:selected="true"
					/>
					<!-- <div
						v-else
						v-for="(seat, index) in selectedSeats"
						:key="index"
					> -->
					<Seat
						v-else
						class="h-12 w-12"
						:data="selectedSeat"
						:selected="true"
					/>
					<!-- </div> -->
				</div>
				<div class="flex items-center justify-between">
					<div class="flex flex-col w-1/2">
						<div>Total Price:</div>
						<div v-if="selectedSeat">
							<strong> {{ selectedSeat?.price }} TL </strong>
						</div>
					</div>
					<Button
						type="button"
						size="lg"
						class="w-1/2"
						@click="handleSelect"
					>
						Select
					</Button>
				</div>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>

<style scoped>
</style>