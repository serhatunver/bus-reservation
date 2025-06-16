<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SquarePen } from "lucide-vue-next";
import { defineProps, ref, watch } from "vue";

import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";

import EditSeatMap from "@/components/bus/EditSeatMap.vue";

import { useBusStore } from "@/stores/bus";
const busStore = useBusStore();
const { updateBus } = busStore;

const props = defineProps({
	bus: {
		type: Object,
		required: true,
	},
});

const formSchema = toTypedSchema(
	z.object({
		model: z
			.string()
			.min(2, {
				message: "Bus model must be at least 2 characters.",
			})
			.max(32, {
				message: "Bus model must not be longer than 16 characters.",
			})
			.trim(),
		plateNumber: z
			.string()
			.min(2, {
				message: "Plate number must be at least 2 characters.",
			})
			.max(16, {
				message: "Plate number must not be longer than 16 characters.",
			})
			.trim(),
		modelYear: z
			.number()
			.min(1900, {
				message: "Model year must be at least 1900.",
			})
			.max(new Date().getFullYear(), {
				message: "Model year cannot be in the future.",
			}),
		capacity: z
			.number()
			.min(1, {
				message: "Capacity must be at least 1.",
			})
			.max(100, {
				message: "Capacity cannot exceed 100.",
			}),
		isActive: z.boolean(),
		seats: z
			.array(
				z.object({
					id: z.string(),
					row: z.number(),
					column: z.number(),
					isBooked: z.boolean(),
				})
			)
			.optional(),
	})
);

const { handleSubmit, resetForm } = useForm({
	validationSchema: formSchema,
});

const open = ref(false);

console.log("Bus Object:", props.bus);

watch(open, (isOpen) => {
	if (isOpen) {
		// Initialize newBus with the bus data when dialog opens
		// This will set the form values to the bus data
		resetForm({
			values: {
				model: props.bus.model,
				plateNumber: props.bus.plateNumber,
				modelYear: props.bus.modelYear,
				capacity: props.bus.capacity,
				isActive: props.bus.isActive,
			},
		});
	}
});

const onSubmit = handleSubmit(async (values) => {
	// Handle form submission logic here
	console.log(`Updating stop with ID: ${props.bus._id}, New Bus: ${values}`);

	await updateBus(props.bus._id, values);

	console.log("Bus updated successfully:", values);
	open.value = false; // Close the dialog after submission
});
</script>

<template>
	<Dialog v-model:open="open">
		<DialogTrigger as-child>
			<Button
				variant="outline"
				size="icon"
				@click="() => console.log('Open Edit Bus Modal')"
			>
				<SquarePen />
			</Button>
		</DialogTrigger>
		<DialogContent class="sm:max-w-[500px]">
			<DialogHeader class="px-4">
				<DialogTitle>Edit Bus</DialogTitle>
				<DialogDescription>
					Modify the details of the bus below. Ensure all fields are
					accurate before saving changes.
				</DialogDescription>
			</DialogHeader>
			<ScrollArea class="h-[500px]">
				<form class="space-y-6 px-4" @submit.prevent="onSubmit">
					<FormField v-slot="{ componentField }" name="model">
						<FormItem v-auto-animate="{ duration: 100 }">
							<FormLabel>Bus Model</FormLabel>
							<FormControl>
								<Input
									v-bind="componentField"
									type="text"
									placeholder="Bus Model"
								/>
							</FormControl>
							<FormDescription>
								Enter the bus model (e.g., Mercedes-Benz).
							</FormDescription>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{ componentField }" name="plateNumber">
						<FormItem v-auto-animate="{ duration: 100 }">
							<FormLabel>Plate Number</FormLabel>
							<FormControl>
								<Input
									v-bind="componentField"
									type="text"
									placeholder="Plate Number"
								/>
							</FormControl>
							<FormDescription>
								Enter the bus plate number (e.g., ABC-1234).
							</FormDescription>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{ componentField }" name="modelYear">
						<FormItem v-auto-animate="{ duration: 100 }">
							<FormLabel>Model Year</FormLabel>
							<FormControl>
								<Input
									v-bind="componentField"
									type="number"
									placeholder="Model Year"
								/>
							</FormControl>
							<FormDescription>
								Enter the model year of the bus (e.g., 2020).
							</FormDescription>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{ componentField }" name="capacity">
						<FormItem v-auto-animate="{ duration: 100 }">
							<FormLabel>Capacity</FormLabel>
							<FormControl>
								<Input
									v-bind="componentField"
									type="number"
									placeholder="Capacity"
								/>
							</FormControl>
							<FormDescription>
								Enter the seating capacity of the bus (e.g.,
								50).
							</FormDescription>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{ value, handleChange }" name="isActive">
						<FormItem
							v-auto-animate="{ duration: 100 }"
							class="flex flex-row items-center justify-between rounded-lg border p-4"
						>
							<div class="space-y-0.5">
								<FormLabel class="text-base">
									Is Active
								</FormLabel>
								<FormDescription>
									Toggle to mark the bus as active or
									inactive.
								</FormDescription>
							</div>
							<FormControl>
								<Switch
									:model-value="value"
									@update:model-value="handleChange"
								>
								</Switch>
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{ componentField }" name="seats">
						<FormItem v-auto-animate="{ duration: 100 }">
							<FormLabel>Seat Map</FormLabel>
							<FormControl>
								<EditSeatMap
									v-bind="componentField"
									:seats="props.bus.seats"
									class="w-full"
								/>
							</FormControl>
							<FormDescription>
								Adjust the seat map for the bus. Drag and drop
								to rearrange seats, and click on + to add new
								seats.
							</FormDescription>
							<FormMessage />
						</FormItem>
					</FormField>
				</form>
			</ScrollArea>
			<DialogFooter>
				<Button size="lg" @click="onSubmit"> Save Changes </Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>