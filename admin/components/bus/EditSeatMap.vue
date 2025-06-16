<script lang="ts" setup>
import { ref, computed, onBeforeMount } from "vue";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import Seat from "@/components/bus/Seat.vue";

interface SeatData {
	seatNumber: string;
	row: number;
	column: number;
}

const props = defineProps({
	seats: {
		type: Array as () => SeatData[],
		required: true,
	},
});

const seatMap = ref<SeatData[]>([...props.seats]);

console.log("Seats data:", props.seats);

// props.seats kullanarak satır ve sütun sayısını hesapla
const rows = computed(() => {
	return Math.max(...seatMap.value.map((seat) => seat.row));
});
const cols = computed(() => {
	return Math.max(...seatMap.value.map((seat) => seat.column));
});

// Dikey versiyon için koltuk eşlemesi
const getSeat = (row: number, col: number) => {
	return seatMap.value.find(
		(seat) => seat.row === row && seat.column === col
	);
};

// Toggle: Koltuk varsa kaldır, yoksa ekle
function toggleSeat(row: number, col: number) {
	const existing = getSeat(row, col);
	if (existing) {
		// Koltuğu sil
		seatMap.value = seatMap.value.filter(
			(s) => !(s.row === row && s.column === col)
		);

		// Silmeden sonra numaraları yeniden sırala
		seatMap.value.sort((a, b) => a.row - b.row || a.column - b.column);
		seatMap.value.forEach((seat, index) => {
			seat.seatNumber = (index + 1).toString();
		});
	} else {
		// Tüm seatMap içinde sıraya göre index hesapla
		const seatCountBefore = seatMap.value.filter(
			(s) => s.row < row || (s.row === row && s.column < col)
		).length;

		const newSeat: SeatData = {
			seatNumber: (seatCountBefore + 1).toString(),
			row,
			column: col,
		};

		seatMap.value.push(newSeat);

		// Tüm seatNumber'ları yeniden sırala
		seatMap.value.sort((a, b) => a.row - b.row || a.column - b.column);
		seatMap.value.forEach((seat, index) => {
			seat.seatNumber = (index + 1).toString();
		});
	}
}

function addNewRow() {
	const newRow = rows.value + 1;
	const newSeats: SeatData[] = [];

	// Her sütun için yeni boş koltuk ekle
	for (let col = 1; col <= cols.value; col++) {
		newSeats.push({
			seatNumber: "", // Sonra numaralandıracağız
			row: newRow,
			column: col,
		});
	}

	// seatMap'e ekle
	seatMap.value.push(...newSeats);

	// Tüm koltukları sıralayıp numaralandır
	seatMap.value.sort((a, b) => a.row - b.row || a.column - b.column);
	seatMap.value.forEach((seat, index) => {
		seat.seatNumber = (index + 1).toString();
	});

	// boş koltukların seatNumber'i boş kalabilir
}
</script>

<template>
	<div class="p-4 max-w-4xl mx-auto space-y-4">
		<div
			class="mx-auto w-fit flex border-2 border-blue-900 dark:border-accent-foreground rounded-3xl p-4"
		>
			<div class="flex flex-col gap-2">
				<!-- Satırlar -->
				<div v-for="row in rows" :key="row" class="flex w-fit">
					<!-- Sütunlar -->
					<div
						v-for="col in cols"
						:key="`${row}-${col}`"
						class="w-14 h-14 p-0 cursor-pointer"
						@click="toggleSeat(row, col)"
					>
						<!-- Koltuk varsa -->
						<Seat
							v-if="getSeat(row, col)"
							:data="getSeat(row, col)"
							:class="
								cn(
									'w-14 h-14 flex items-center justify-center font-bold'
								)
							"
						/>
						<!-- Boş hücre -->
						<div
							v-else
							class="w-14 h-14 rounded-xl border border-dashed border-gray-400 opacity-30 hover:opacity-60"
						></div>
					</div>
				</div>
			</div>
		</div>
		<Button type="button" @click="addNewRow"> Add New Row </Button>

		<!-- Test: seatMap verisini logla -->
		<pre class="mt-4 bg-gray-100 p-2 rounded text-xs">{{ seatMap }}</pre>
	</div>
</template>

<style scoped>
</style>