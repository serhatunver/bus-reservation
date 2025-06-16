<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ref, watch } from "vue";
import { cn } from "@/lib/utils";
import { Check, MapPin, X, ChevronsUpDown } from "lucide-vue-next";
import { Separator } from "@/components/ui/separator";

interface Stop {
	id: string;
	name: string;
}

const isOpen = ref(false);

const props = defineProps<{
	modelValue: string;
	placeholder?: string;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", stop: Stop): void;
}>();

function selectStop(stop: Stop) {
	console.log("Selected stop:", stop);
	emit("update:modelValue", stop);
	isOpen.value = false;
}

const searchTerm = ref("");
const stops = ref<Stop[]>([]);

const handleSearch = async () => {
	const response = await fetch(
		`http://localhost:3000/api/stop/search?q=${searchTerm.value}`
	);
	const data = await response.json();
	console.log("Fetched stops:", data);
	stops.value = data.stops;
	console.log("stops:", stops.value);
};

watch(searchTerm, () => {
	console.log("searchTerm:", searchTerm.value);
	handleSearch();
});

import { useId } from "vue";
const id = useId();
</script>

<template>
	<Popover v-model:open="isOpen">
		<PopoverTrigger as-child>
			<Button
				class="flex-1 h-10 w-full justify-start space-x-2 text-left text-sm font-normal"
				variant="outline"
				role="combobox"
				:aria-expanded="isOpen"
			>
				<MapPin class="" />
				{{
					props.modelValue ? props.modelValue.name : props.placeholder
				}}
				<ChevronsUpDown
					class="hidden sm:flex ml-auto size-4 shrink-0 opacity-50"
				/>
			</Button>
		</PopoverTrigger>
		<PopoverContent
			class="w-full p-1 rounded-xl"
			align="start"
			:avoid-collisions="true"
			:collision-padding="{
				left: 20,
				right: 32,
			}"
		>
			<Command class="w-sm">
				<CommandInput
					:id="id"
					:class="cn('h-12 pl-8 pr-4 text-base font-normal')"
					v-model="searchTerm"
					:placeholder="
						props.modelValue ? props.modelValue : props.placeholder
					"
				/>
				<Separator />
				<CommandList class="max-h-64 overflow-y-auto">
					<CommandEmpty
						v-if="stops.length === 0"
						:class="cn('text-muted-foreground')"
						>No results found.</CommandEmpty
					>
					<CommandGroup>
						<CommandItem
							:class="
								cn(
									'h-12 flex space-x-0 px-4 cursor-pointer text-base rounded-xl',
									props.modelValue === stop.name
										? 'bg-muted'
										: ''
								)
							"
							v-for="stop of stops"
							:key="stop.id"
							:value="stop.id"
							@select="
								() => {
									isOpen = false;
									selectStop(stop);
								}
							"
						>
							<Check
								:class="
									cn(
										'size-4',
										props.modelValue === stop.name
											? 'opacity-100'
											: 'opacity-0'
									)
								"
							/>
							<MapPin class="size-4" />
							{{ stop.name }}
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		</PopoverContent>
	</Popover>
</template>