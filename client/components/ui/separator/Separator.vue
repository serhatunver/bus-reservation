<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { reactiveOmit } from "@vueuse/core";
import { Separator, type SeparatorProps } from "reka-ui";

const props = withDefaults(
    defineProps<
        SeparatorProps & { class?: HTMLAttributes["class"]; label?: string }
    >(),
    {
        orientation: "horizontal",
        decorative: true,
    }
);

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
	<Separator
		data-slot="separator-root"
		v-bind="delegatedProps"
		:class="
			cn(
				'bg-border relative data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
				props.orientation === 'vertical'
					? 'w-px h-full'
					: 'h-px w-full',
				props.class
			)
		"
	>
		<span
			v-if="props.label"
			:class="
				cn(
					'text-sm text-muted-foreground bg-background absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center',
					props.orientation === 'vertical'
						? 'w-[1px] px-1 py-2'
						: 'h-[1px] py-1 px-2'
				)
			"
		>
			{{ props.label }}
		</span>
	</Separator>
</template>
