<script lang="ts" setup>
import {
	createReusableTemplate,
	useDebounceFn,
	useMediaQuery,
} from "@vueuse/core";
import { ref, watch, useId } from "vue";
import { cn } from "@/lib/utils";
import { Check, MapPin, X, ChevronsUpDown } from "lucide-vue-next";
import { Separator } from "@/components/ui/separator";
import { useSearchStore } from "~/stores/search";
import type { Stop } from "~/types/stop";

const [DefineCommand, UseCommand] = createReusableTemplate();
const isDesktop = useMediaQuery("(min-width:640px)");
const id = useId();

const searchStore = useSearchStore();

const isOpen = ref(false);
const searchTerm = ref("");

const props = defineProps<{
	modelValue: Stop;
	placeholder?: string;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", stop: Stop): void;
}>();

function selectStop(stop: Stop) {
	emit("update:modelValue", stop);
	searchTerm.value = stop.name;
	isOpen.value = false;
	searchStore.clearStopResults();
}

const debouncedSearch = useDebounceFn(async (value: string) => {
	await searchStore.searchStops(value);
}, 300);

watch(searchTerm, async (value) => {
	const trimmedValue = value.trim();

	if (trimmedValue.length < 2) {
		searchStore.clearStopResults();
		return;
	}

	await debouncedSearch(trimmedValue);
});

watch(isOpen, (open) => {
	if (!open) {
		searchTerm.value = "";
		searchStore.clearStopResults();
	} else if (props.modelValue?.name) {
		searchTerm.value = props.modelValue.name;
	}
});
</script>

<template>
	<div>
		<DefineCommand class="">
			<Command class="w-sm" :ignoreFilter="true">
				<label
					v-if="!isDesktop"
					:for="id"
					class="bg-background text-blue-500 absolute start-11.5 top-4.5 z-10 block -translate-y-1/2 px-1 text-xs font-medium group-has-disabled:opacity-50"
				>
					{{ props.placeholder }}
				</label>

				<CommandInput
					:id="id"
					v-model="searchTerm"
					:class="
						cn(
							'h-14 pl-8 pr-4 text-base font-normal',
							!isDesktop &&
								'border-ring ring-1 ring-muted focus-visible:ring-blue-500 w-[calc(100%-4px)] mx-auto'
						)
					"
					:placeholder="props.modelValue?.name || props.placeholder"
					autocomplete="off"
				/>

				<Separator :class="cn('my-6', isDesktop && 'my-2')" />

				<CommandList class="max-h-64 overflow-y-auto">
					<div
						v-if="searchStore.stopSearchLoading"
						class="px-4 py-3 text-sm text-muted-foreground"
					>
						Searching...
					</div>

					<div
						v-else-if="searchStore.stopSearchError"
						class="px-4 py-3 text-sm text-red-500"
					>
						{{ searchStore.stopSearchError }}
					</div>

					<CommandEmpty
						v-else-if="
							searchTerm && searchStore.stopResults.length === 0
						"
						:class="
							cn('text-muted-foreground', isDesktop && 'text-sm')
						"
					>
						No results found.
					</CommandEmpty>

					<CommandGroup>
						<CommandItem
							v-for="stop of searchStore.stopResults"
							:key="stop._id"
							:value="stop._id"
							:class="
								cn(
									'h-12 flex space-x-0 px-4 cursor-pointer text-base rounded-xl',
									props.modelValue?._id === stop._id
										? 'bg-muted'
										: ''
								)
							"
							@select="() => selectStop(stop)"
						>
							<Check
								:class="
									cn(
										'size-4',
										props.modelValue?._id === stop._id
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

		<Popover
			v-if="isDesktop"
			:open="isOpen"
			@update:open="(newOpenValue) => (isOpen = newOpenValue)"
		>
			<PopoverTrigger as-child>
				<Button
					class="flex-1 h-14 w-full justify-start space-x-2 text-left text-base font-normal"
					variant="outline"
					role="combobox"
					:aria-expanded="isOpen"
				>
					<MapPin />
					{{ props.modelValue?.name || props.placeholder }}
					<ChevronsUpDown
						class="hidden sm:flex ml-auto size-4 shrink-0 opacity-50"
					/>
				</Button>
			</PopoverTrigger>

			<PopoverContent
				class="w-full p-1 rounded-xl"
				align="start"
				:avoid-collisions="true"
				:collision-padding="{ left: 20, right: 32 }"
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
					<MapPin />
					{{ props.modelValue?.name || props.placeholder }}
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

				<div>
					<UseCommand class="pt-1 w-full rounded-none" />
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