<script lang="ts" setup>
import { defineProps } from "vue";

const props = defineProps({
	data: {
		type: Object,
		default: () => ({}),
	},
	selected: {
		type: Boolean,
		default: false,
	},
});

function getFillColor() {
	// if (props.selected) return "#42e084";
	if (props.selected) return "#50a4f3";
	if (!props.data.isAvailable) return "#ddd";
	if (props.data.priority === 1) return "#A7F3D0";
	if (props.data.priority === 2) return "#FDE68A";
	return "#FCA5A5";
}

function getStrokeColor() {
	if (props.selected || props.data.isAvailable) return "#313131";
	return "#000";
}

function getBadgeColor(priority: number) {
	if (priority === 1) return "#10B981"; // green
	if (priority === 2) return "#F59E0B"; // yellow
	return "#EF4444"; // red
}
</script>


<template>
	<div class="relative flex items-center justify-center w-12 h-12">
		<svg
			class="size-14"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			version="1.1"
			baseProfile="full"
			width="50"
			height="50"
			viewBox="0 0 50 50"
		>
			<g
				transform="rotate(90 25 25)"
				:fill="getFillColor()"
				:stroke="getStrokeColor()"
			>
				<rect x="1" y="4" width="45" height="40" rx="10" ry="10" />
				<rect x="15" y="2" width="25" height="7" rx="5" ry="5" />
				<rect x="15" y="39" width="25" height="7" rx="5" ry="5" />
				<rect x="36" y="1" width="12" height="46" rx="6" ry="6" />
			</g>

			<!-- Seat number -->
			<text
				x="26"
				y="24"
				text-anchor="middle"
				dominant-baseline="middle"
				font-size="16"
				font-weight="bold"
			>
				{{ data.seatNumber ?? "" }}
			</text>

			<!-- Priority badge -->
			<circle
				v-if="data.isAvailable && !selected"
				:fill="getBadgeColor(data.priority)"
				cx="42"
				cy="8"
				r="8"
			/>
			<text
				v-if="data.isAvailable && !selected"
				x="42"
				y="8"
				text-anchor="middle"
				dominant-baseline="middle"
				font-size="9"
				fill="white"
			>
				P{{ data.priority }}
			</text>
		</svg>
	</div>
</template>

<style scoped>
</style>