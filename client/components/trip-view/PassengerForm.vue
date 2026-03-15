<script setup lang="ts">
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { toast } from "vue-sonner";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { h, ref } from "vue";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import CustomInput from "@/components/CustomInput.vue";
import SelectSeat from "@/components/TripView/SelectSeat.vue";
import { ArrowRight, Loader } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();

import { useTripStore } from "@/stores/trip";
import { useReservationStore } from "@/stores/reservation";
import { storeToRefs } from "pinia";
const tripStore = useTripStore();
const reservationStore = useReservationStore();

const { selectedTrip, availableSeats } = storeToRefs(tripStore);
const { makeReservation } = reservationStore;

const { status } = useAuth();

const formSchema = toTypedSchema(
	z.object({
		passengerName: z
			.string()
			.min(2, {
				message: "First name must be at least 2 characters.",
			})
			.max(16, {
				message: "First name must not be longer than 16 characters.",
			})
			.trim(),
		passengerSurname: z
			.string()
			.min(2, {
				message: "Last name must be at least 2 characters.",
			})
			.max(16, {
				message: "Last name must not be longer than 16 characters.",
			})
			.trim(),
		email: z
			.string({
				required_error: "Email is required",
			})
			.email(),
		phone: z.string(),
		seat: z.object({
			seatNumber: z.number(),
			price: z.number(),
		}),
	})
);

const { handleSubmit } = useForm({
	validationSchema: formSchema,
	initialValues: {
		passengerName: "Serhat",
		passengerSurname: "Ünver",
		email: "serhat@example.com",
		phone: "123123123123",
	},
});

const onSubmit = handleSubmit(async (values) => {
	console.log("Form submitted:", values);
	try {
		const res = await makeReservation({
			tripId: selectedTrip.value._id,
			fromStopId: route.params.fromStopId as string,
			toStopId: route.params.toStopId as string,
			seatNumber: values.seat.seatNumber,
			price: values.seat.price,
			passengerName: values.passengerName,
			passengerSurname: values.passengerSurname,
			email: values.email,
			phone: values.phone,
		});
		console.log("Reservation response:", res.reservation);
		if (res.reservation._id) {
			toast("You submitted the following values:", {
				description: h(
					"pre",
					{ class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" },
					h(
						"code",
						{ class: "text-white" },
						JSON.stringify(values, null, 2)
					)
				),
			});
			if (status.value === "authenticated") {
				router.push("/reservations");
			} else {
				router.push({
					name: "reservation-summary",
					params: { pnr: res.reservation.pnr },
				});
			}
		} else {
			toast.error("Failed to make reservation. Please try again.");
		}
	} catch (error) {
		toast.error("Failed to make reservation. Please try again.");
		console.error("Error making reservation:", error);
	}
});
</script>

<template>
	<Card class="max-w-4xl w-full bg-background shadow-2xl">
		<CardHeader>
			<CardTitle class="text-xl font-bold">Passenger Details</CardTitle>
			<CardDescription>
				Please fill in your details and select a seat.
			</CardDescription>
		</CardHeader>
		<Separator />
		<CardContent class="space-y-4">
			<form
				v-if="status === 'authenticated'"
				class="space-y-6"
				@submit.prevent="onSubmit"
			>
				<FormField v-slot="{ componentField }" name="seat">
					<FormItem v-auto-animate>
						<FormLabel>Select Seat</FormLabel>
						<FormControl>
							<SelectSeat
								@select="componentField.onChange"
								:seat-number="componentField.value"
								v-bind="componentField"
								:available-seats="availableSeats"
								:selected-trip="selectedTrip"
							/>
						</FormControl>
						<FormDescription>
							Please select a seat for your trip.
						</FormDescription>
						<FormMessage />
					</FormItem>
				</FormField>
			</form>
			<form v-else class="space-y-6" @submit.prevent="onSubmit">
				<FormField v-slot="{ componentField }" name="passengerName">
					<FormItem v-auto-animate>
						<FormControl>
							<CustomInput
								v-bind="componentField"
								type="text"
								placeholder="Passenger Name"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="passengerSurname">
					<FormItem v-auto-animate>
						<FormControl>
							<CustomInput
								type="text"
								placeholder="Passenger Surname"
								v-bind="componentField"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="email">
					<FormItem v-auto-animate>
						<FormControl>
							<CustomInput
								type="email"
								placeholder="Email"
								v-bind="componentField"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="phone">
					<FormItem v-auto-animate>
						<FormControl>
							<CustomInput
								type="tel"
								placeholder="Phone Number"
								v-bind="componentField"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="seat">
					<FormItem v-auto-animate>
						<FormLabel>Select Seat</FormLabel>
						<FormControl>
							<SelectSeat
								@select="componentField.onChange"
								:seat-number="componentField.value"
								v-bind="componentField"
								:available-seats="availableSeats"
								:selected-trip="selectedTrip"
							/>
						</FormControl>
						<FormDescription>
							Please select a seat for your trip.
						</FormDescription>
						<FormMessage />
					</FormItem>
				</FormField>
			</form>
		</CardContent>
		<Separator />
		<CardFooter>
			<Button
				@click="onSubmit"
				:disabled="false"
				class="w-full h-14 text-base"
			>
				Make Reservation
				<Loader v-if="false" class="animate-spin size-5 ml-2" />
				<ArrowRight v-else class="size-5 ml-2" />
			</Button>
		</CardFooter>
	</Card>
</template>