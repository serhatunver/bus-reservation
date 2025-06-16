<script setup lang="ts">
import { ref, watch } from "vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-vue-next";

import SearchStop from "./SearchStop.vue";

// Props olarak trip al
const props = defineProps<{
	trip: {
		route: {
			_id?: string;
			from: {
				name?: string;
				_id: string;
			};
			to: {
				name?: string;
				_id: string;
			};
			price: number;
			duration: number;
		}[];
	};
}>();

// Düzenlenebilir local kopya props varsa oradan al, yoksa boş bir dizi oluştur
const editableRoutes = ref(
	props.trip.route && props.trip.route.length > 0
		? props.trip.route.map((step) => ({
				from: {
					name: step.from.name || "",
					_id: step.from._id,
				},
				to: {
					name: step.to.name || "",
					_id: step.to._id,
				},
				price: step.price,
				duration: step.duration,
		  }))
		: []
);

// Yeni rota elemanı ekle
function addRouteStep() {
	editableRoutes.value.push({
		from: {
			name: "",
			_id: "",
		},
		to: {
			name: "",
			_id: "",
		},
		price: 0,
		duration: 0,
	});
}

// Rota elemanı sil
function removeRouteStep(index: number) {
	editableRoutes.value.splice(index, 1);
}

defineEmits(["update:routes"]);

// yeni bir to stop eklendiğinde onu bir sonraki route'un from stop'u olarak ayarla
watch(
	editableRoutes,
	(newRoutes) => {
		if (newRoutes.length > 0) {
			newRoutes.forEach((step, index) => {
				if (index < newRoutes.length - 1) {
					newRoutes[index + 1].from.name = step.to.name;
				}
			});
		}
	},
	{ deep: true }
);
</script>

<template>
	<div class="space-y-4">
		<h3 class="text-lg font-semibold">Trip Route Editor</h3>
		<div
			v-for="(step, index) in editableRoutes"
			:key="index"
			class="border pt-6 px-4 rounded-xl space-y-3 relative"
		>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<Label class="text-sm font-medium">From Stop</Label>
					<SearchStop
						v-model="step.from"
						placeholder="Search From Stop"
						class="mt-2"
					/>
				</div>
				<div>
					<Label class="text-sm font-medium">To Stop</Label>
					<SearchStop
						v-model="step.to"
						placeholder="Search To Stop"
						class="mt-2"
					/>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="text-sm font-medium">Price (₺)</label>
					<Input
						v-model="step.price"
						type="number"
						min="0"
						placeholder="e.g. 200"
					/>
				</div>
				<div>
					<label class="text-sm font-medium">Duration (min)</label>
					<Input
						v-model="step.duration"
						type="number"
						min="0"
						placeholder="e.g. 60"
					/>
				</div>
			</div>
			<Button
				type="button"
				variant="destructive"
				size="icon"
				class="absolute top-1 right-1"
				@click="removeRouteStep(index)"
			>
				<Trash2 class="w-4 h-4" />
			</Button>
		</div>

		<Button type="button" variant="secondary" @click="addRouteStep">
			<Plus class="w-4 h-4 mr-1" />
			Add Route Step
		</Button>
	</div>
</template>
