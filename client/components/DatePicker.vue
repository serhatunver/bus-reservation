<script setup lang="ts">
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
	Calendar,
	// CalendarCell,
	// CalendarCellTrigger,
	// CalendarGrid,
	// CalendarGridBody,
	// CalendarGridHead,
	// CalendarGridRow,
	// CalendarHeadCell,
	// CalendarHeader,
	// CalendarHeading,
	// CalendarNextButton,
	// CalendarPrevButton,
} from "@/components/ui/calendar";
import {
	Popover,
	// PopoverAnchor,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Dialog,
	DialogClose,
	DialogContent,
	// DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import {
	DateFormatter,
	type DateValue,
	getLocalTimeZone,
	today,
} from "@internationalized/date";
import { CalendarIcon, X } from "lucide-vue-next";
import { ref } from "vue";
import { createReusableTemplate, useMediaQuery } from "@vueuse/core";
const isDesktop = useMediaQuery("(min-width:640px)");
const [DefineCalendar, UseCalendar] = createReusableTemplate();

const df = new DateFormatter("en-US", {
	dateStyle: "long",
});

const props = defineProps<{
	modelValue: DateValue;
	placeholder?: string;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: DateValue): void;
}>();

const emitValue = (value: DateValue | undefined) => {
	if (value) {
		emit("update:modelValue", value);
		isOpen.value = false;
	}
};

// const value = ref<DateValue>();
const isOpen = ref(false);
</script>

<template>
	<div>
		<DefineCalendar>
			<Calendar
				class="p-0"
				:model-value="modelValue"
				@update:model-value="emitValue"
				initial-focus
				:min-value="today(getLocalTimeZone())"
				:max-value="today(getLocalTimeZone()).add({ months: 2 })"
				:weekStartsOn="1"
				:weekday-format="'short'"
			/>
		</DefineCalendar>

		<Popover v-if="isDesktop" v-model:open="isOpen">
			<PopoverTrigger as-child>
				<Button
					variant="outline"
					:class="
						cn(
							'h-14 w-full justify-start text-left font-normal',
							!modelValue && 'text-muted-foreground'
						)
					"
				>
					<CalendarIcon class="" />
					{{ modelValue ? modelValue : "Pick a date" }}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				class="w-auto p-0 rounded-xl"
				align="start"
				:collision-padding="{
					top: 20,
					left: 20,
					right: 20,
				}"
			>
				<UseCalendar />
			</PopoverContent>
		</Popover>

		<Dialog
			v-else
			:open="isOpen"
			@update:open="(newOpenValue) => (isOpen = newOpenValue)"
		>
			<DialogTrigger class="w-full" as-child>
				<Button
					variant="outline"
					:class="
						cn(
							'h-14 grow-1 lg:max-w-xs justify-start text-left font-normal',
							!modelValue && 'text-muted-foreground'
						)
					"
				>
					<CalendarIcon class="" />
					{{
						modelValue
							? df.format(modelValue.toDate(getLocalTimeZone()))
							: "Pick a date"
					}}
				</Button>
			</DialogTrigger>
			<DialogContent
				class="w-full flex flex-col h-full max-w-full rounded-none overflow-y-scroll"
			>
				<template #close-button>
					<Button
						class="size-12 mr-2 mt-2"
						variant="outline"
						size="icon"
					>
						<X class="size-6" />
					</Button>
					<span class="sr-only">Close</span>
				</template>
				<DialogHeader class="items-start justify-center h-12 shrink-0">
					<DialogTitle class="text-base font-normal">
						{{ props.placeholder }}
					</DialogTitle>
					<!-- <DialogDescription>
						{{ props.placeholder }}
					</DialogDescription> -->
				</DialogHeader>
				<div class="mt-2">
					<UseCalendar class="pt-1 w-full rounded-none" />
				</div>
				<DialogFooter class="mt-auto">
					<DialogClose as-child>
						<Button type="button" variant="secondary" size="lg">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>