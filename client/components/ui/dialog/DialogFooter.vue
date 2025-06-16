<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
	<div
		data-slot="dialog-footer"
		:class="cn('flex flex-col self-end w-full gap-2', props.class)"
	>
		<slot />
	</div>
</template>
