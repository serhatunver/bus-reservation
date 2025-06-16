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
	Dialog,
	DialogClose,
	DialogContent,
	// DialogDescription,
	DialogFooter,
	// DialogHeader,
	// DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { createReusableTemplate, useMediaQuery } from "@vueuse/core";
import { ref, watch } from "vue";
import { cn } from "@/lib/utils";
import { Check, MapPin, X, ChevronsUpDown } from "lucide-vue-next";
import { Separator } from "@/components/ui/separator";

interface Stop {
	id: string;
	name: string;
}

const [DefineCommand, UseCommand] = createReusableTemplate();
const isDesktop = useMediaQuery("(min-width:640px)");

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
	<div>
		<DefineCommand class="">
			<Command class="w-sm">
				<label
					v-if="!isDesktop"
					:for="id"
					class="bg-background text-blue-500 absolute start-11.5 top-4.5 z-10 block -translate-y-1/2 px-1 text-xs font-medium group-has-disabled:opacity-50"
				>
					{{ props.placeholder }}
				</label>
				<CommandInput
					:id="id"
					:class="
						cn(
							'h-14 pl-8 pr-4 text-base font-normal',
							!isDesktop &&
								'focus-visible:border-ring focus-visible:ring-[2px] focus-visible:ring-blue-500 w-[calc(100%-4px)] mx-auto'
						)
					"
					v-model="searchTerm"
					:placeholder="
						props.modelValue ? props.modelValue : props.placeholder
					"
				/>
				<Separator :class="cn('my-6', isDesktop && 'my-2')" />
				<CommandList class="max-h-64 overflow-y-auto">
					<CommandEmpty
						v-if="stops.length === 0"
						:class="
							cn('text-muted-foreground', isDesktop && 'text-sm')
						"
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
		</DefineCommand>

		<Popover v-if="isDesktop" v-model:open="isOpen">
			<PopoverTrigger as-child>
				<Button
					class="flex-1 h-14 w-full justify-start space-x-2 text-left text-base font-normal"
					variant="outline"
					role="combobox"
					:aria-expanded="isOpen"
				>
					<MapPin class="" />
					{{
						props.modelValue ? props.modelValue : props.placeholder
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
				<UseCommand />
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
					class="w-full justify-start h-14"
					:class="
						cn(
							props.placeholder == 'From Where' &&
								'rounded-b-none',
							props.placeholder == 'To Where' &&
								'rounded-t-none border-t-0'
						)
					"
				>
					<MapPin class="" />
					{{
						props.modelValue ? props.modelValue : props.placeholder
					}}
				</Button>
			</DialogTrigger>
			<DialogContent class="w-full h-full max-w-full rounded-none p-4">
				<template #close-button>
					<Button
						class="mr-3 mt-3 size-10"
						variant="outline"
						size="icon"
					>
						<X class="size-6" />
					</Button>
					<span class="sr-only">Close</span>
				</template>
				<div class="">
					<UseCommand class="pt-1 bg-red-0 w-full rounded-none" />
				</div>
				<DialogFooter>
					<DialogClose as-child>
						<Button type="button" variant="secondary">Close</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</div>
</template>