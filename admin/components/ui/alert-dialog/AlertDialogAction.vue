<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { AlertDialogAction, type AlertDialogActionProps } from "reka-ui";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

type AlertDialaogAction = VariantProps<typeof buttonVariants>;

const props = defineProps<
	AlertDialogActionProps & {
		class?: HTMLAttributes["class"];
		variant?: AlertDialaogAction["variant"];
		size?: AlertDialaogAction["size"];
	}
>();

const delegatedProps = reactiveOmit(props, ["class", "variant", "size"]);
</script>

<template>
	<AlertDialogAction
		v-bind="delegatedProps"
		:class="
			cn(
				buttonVariants({ variant: props.variant, size: props.size }),
				props.class
			)
		"
	>
		<slot />
	</AlertDialogAction>
</template>
