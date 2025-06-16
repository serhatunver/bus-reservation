<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { AlertDialogCancel, type AlertDialogCancelProps } from "reka-ui";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

type AlertDialaogAction = VariantProps<typeof buttonVariants>;

const props = defineProps<
	AlertDialogCancelProps & {
		class?: HTMLAttributes["class"];
		variant?: AlertDialaogAction["variant"];
		size?: AlertDialaogAction["size"];
	}
>();

const delegatedProps = reactiveOmit(props, ["class", "variant", "size"]);
</script>

<template>
	<AlertDialogCancel
		v-bind="delegatedProps"
		:class="
			cn(
				buttonVariants({
					variant: props.variant ?? 'outline',
					size: props.size,
				}),
				'mt-2 sm:mt-0',
				props.class
			)
		"
	>
		<slot />
	</AlertDialogCancel>
</template>
