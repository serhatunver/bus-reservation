<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import { CalendarGridHead, type CalendarGridHeadProps } from "reka-ui";
import { Separator } from "@/components/ui/separator";

const props = defineProps<
	CalendarGridHeadProps & { class?: HTMLAttributes["class"] }
>();
</script>

<template>
	<CalendarGridHead data-slot="calendar-grid-head" v-bind="props">
		<slot />
		<Separator />
	</CalendarGridHead>
</template>
