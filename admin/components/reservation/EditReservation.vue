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
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
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

import { useReservationStore } from "@/stores/reservation";
const reservationStore = useReservationStore();
const { updateReservation } = reservationStore;

const props = defineProps({
	reservation: {
		type: Object,
		required: true,
	},
});

import { reservationSchema } from "@/components/columns";
const formSchema = toTypedSchema(reservationSchema);

const { handleSubmit, resetForm } = useForm({
	validationSchema: formSchema,
});

const open = ref(false);

console.log("Reservation Object:", props.reservation);

watch(open, (isOpen) => {
	console.log("Dialog open state changed:", props.reservation);
	if (isOpen) {
		// Initialize newReservation with the reservation data when dialog opens
		// This will set the form values to the reservation data
		resetForm({
			values: {
				passengerName:
					props.reservation.passengerName ||
					props.reservation.passenger.name ||
					"",
				passengerSurname:
					props.reservation.passengerSurname ||
					props.reservation.passenger.surname ||
					"",
				phone:
					props.reservation.phone ||
					props.reservation.passenger.phone ||
					"",
				email:
					props.reservation.email ||
					props.reservation.passenger.email ||
					"",
				seatNumber: props.reservation.seatNumber || "",
			},
		});
	}
});

const onSubmit = handleSubmit(async (values) => {
	// Handle form submission logic here
	console.log(
		`Updating stop with ID: ${props.reservation._id}, New Reservation: ${values}`
	);

	// await updateReservation(props.reservation._id, values);

	console.log("Reservation updated successfully:", values);
	open.value = false; // Close the dialog after submission
});
</script>

<template>
	<TooltipProvider>
		<Dialog v-model:open="open">
			<Tooltip>
				<DialogTrigger as-child>
					<TooltipTrigger as-child>
						<Button
							variant="outline"
							size="icon"
							@click="
								() => console.log('Open Edit Reservation Modal')
							"
						>
							<SquarePen />
						</Button>
					</TooltipTrigger>
				</DialogTrigger>
				<TooltipContent>
					<p>Edit Reservation</p>
				</TooltipContent>
			</Tooltip>
			<DialogContent class="sm:max-w-[500px]">
				<DialogHeader class="px-4">
					<DialogTitle>Edit Reservation</DialogTitle>
					<DialogDescription>
						Modify the details of the reservation below. Ensure all
						fields are accurate before saving changes.
					</DialogDescription>
				</DialogHeader>
				<ScrollArea class="h-[500px]">
					<form class="space-y-6 px-4" @submit.prevent="onSubmit">
						<FormField
							v-slot="{ componentField }"
							name="passengerName"
						>
							<FormItem v-auto-animate="{ duration: 100 }">
								<FormLabel>Reservation Model</FormLabel>
								<FormControl>
									<Input
										v-bind="componentField"
										type="text"
										placeholder="Passenger Name"
									/>
								</FormControl>
								<FormDescription>
									Enter the passenger's name for the
									reservation.
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
	</TooltipProvider>
</template>