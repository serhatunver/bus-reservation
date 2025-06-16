<script lang="ts" setup>
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ChevronRight } from "lucide-vue-next";
import { CalendarNext, type CalendarNextProps, useForwardProps } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";

const props = defineProps<
	CalendarNextProps & { class?: HTMLAttributes["class"] }
>();

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props;

	return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
	<CalendarNext
		data-slot="calendar-next-button"
		:class="
			cn(
				buttonVariants({ variant: 'outline' }),
				'absolute right-0 ',
				'size-12 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-xl',
				props.class
			)
		"
		v-bind="forwardedProps"
	>
		<slot>
			<ChevronRight class="size-6" />
		</slot>
	</CalendarNext>
</template>
