<script lang="ts" setup>
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useId } from "vue";

defineOptions({
	inheritAttrs: false,
});

const props = defineProps<{
	// modelValue: string;
	placeholder?: string;
	type?: string;
	class?: string;
}>();

const id = useId();
const inputId = `custom-input-${id}`;
</script>

<template>
	<div class="group relative w-full">
		<label
			:for="inputId"
			class="origin-start text-muted-foreground group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-base transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium"
		>
			<span class="bg-background inline-flex px-2">
				{{ placeholder }}
			</span>
		</label>
		<Input
			:class="cn('h-14 rounded-xl', props.class)"
			v-bind="$attrs"
			:id="inputId"
			:type="type"
			placeholder=""
		/>
	</div>
</template>

<style scoped>
</style>