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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Plus, XIcon, CalendarIcon, ClockIcon } from "lucide-vue-next";
import { defineProps, ref, watch, computed, watchEffect } from "vue";

import { cn } from "@/lib/utils";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";
import {
	DateFormatter,
	type DateValue,
	getLocalTimeZone,
	today,
	parseDate,
	CalendarDate,
} from "@internationalized/date";

import TripRouteEditor from "@/components/trip/TripRouteEditor.vue";

import { useTripStore } from "@/stores/trip";
const tripStore = useTripStore();
const { updateTrip } = tripStore;

// import { tripSchema } from "@/components/columns";
const formSchema = toTypedSchema(
	z.object({
		name: z
			.string()
			.min(2, {
				message: "Trip name must be at least 2 characters.",
			})
			.max(64, {
				message: "Trip name must not be longer than 64 characters.",
			})
			.trim(),
		busId: z.string(),
		departureTime: z.string().optional(),
		departureDate: z.string().optional(),
		departureHourMinute: z.string().optional(),
	})
);

const { handleSubmit, resetForm, setFieldValue } = useForm({
	validationSchema: formSchema,
	initialValues: {
		name: "",
		departureTime: "",
	},
});

const df = new DateFormatter("en-US", {
	dateStyle: "long",
});

const isDialogOpen = ref(false);
const isDatePickerOpen = ref(false);

const departureTime = ref("");
const departureDate = ref<CalendarDate>(); // "2025-06-11"
const departureHourMinute = ref<string>("12:00"); // "12:00"

const trip = ref({});

watch([departureDate, departureHourMinute], ([date, time]) => {
	if (date && time) {
		const [hours, minutes] = time.split(":").map(Number);

		// Tarihi UTC olarak oluştur
		const jsDate = new Date(
			Date.UTC(date.year, date.month - 1, date.day, hours, minutes)
		);

		console.log("JS Date:", jsDate.toISOString());

		// `useForm()` ile tanımlı form değerine set et
		setFieldValue("departureTime", jsDate.toISOString());
	}
});

const onSubmit = handleSubmit(async (values) => {
	try {
		// Handle form submission logic here
		// console.log("Form values before submission:", values);
		console.log("ISO departure time to save:", values.departureTime);

		// await updateTrip(props.trip._id, values);

		console.log("Trip updated successfully:", values);
		isDialogOpen.value = false; // Close the dialog after submission
	} catch (error) {
		console.error("Error updating trip:", error);
	}
});
</script>

<template>
	<Dialog v-model:open="isDialogOpen">
		<DialogTrigger as-child>
			<Button
				size="lg"
				@click="() => console.log('Open Edit Trip Modal')"
			>
				Add Trip
				<Plus />
			</Button>
		</DialogTrigger>
		<DialogContent class="sm:max-w-[500px]">
			<DialogHeader class="p-4">
				<DialogTitle>Edit Trip</DialogTitle>
				<DialogDescription>
					Modify the details of the trip below. Ensure all fields are
					accurate before saving changes.
				</DialogDescription>
			</DialogHeader>
			<ScrollArea class="h-[500px]">
				<form
					id="edit-trip-form"
					class="space-y-6 px-4"
					@submit.prevent="onSubmit"
				>
					<FormField v-slot="{ componentField }" name="name">
						<FormItem v-auto-animate="{ duration: 100 }">
							<FormLabel>Trip Name</FormLabel>
							<FormControl>
								<Input
									v-bind="componentField"
									type="text"
									placeholder="Trip Name"
								/>
							</FormControl>
							<FormDescription>
								Enter the trip name (e.g., Malatya Adana).
							</FormDescription>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{ componentField }" name="busId">
						<FormItem v-auto-animate="{ duration: 100 }">
							<FormLabel>Bus</FormLabel>
							<FormControl>
								<Input
									v-bind="componentField"
									type="text"
									placeholder="Bus ID"
								/>
							</FormControl>
							<FormDescription>
								Enter the bus ID associated with this trip.
							</FormDescription>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{}" name="departureDate">
						<FormItem v-auto-animate="{ duration: 100 }">
							<FormLabel> Departure Date </FormLabel>
							<Popover v-model:open="isDatePickerOpen">
								<PopoverTrigger as-child>
									<FormControl>
										<Button
											variant="outline"
											:class="
												cn(
													'ps-3 text-start font-normal',
													!departureDate &&
														'text-muted-foreground'
												)
											"
										>
											<span>{{
												departureTime
													? df.format(
															new Date(
																departureTime
															)
													  )
													: "Pick a date"
											}}</span>
											<CalendarIcon
												class="ms-auto h-4 w-4 opacity-50"
											/>
										</Button>
										<input hidden />
									</FormControl>
								</PopoverTrigger>
								<PopoverContent class="w-auto">
									<Calendar
										:model-value="departureDate"
										@update:model-value="
											(v) => {
												if (v) {
													departureDate =
														new CalendarDate(
															v.year,
															v.month,
															v.day
														);
													isDatePickerOpen = false;
												}
											}
										"
										initial-focus
										:min-value="departureDate"
										:max-value="
											departureDate?.add({
												months: 2,
											})
										"
										:weekStartsOn="1"
										:weekday-format="'short'"
									/>
								</PopoverContent>
							</Popover>
							<FormDescription>
								Select the departure time
							</FormDescription>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{}" name="departureHourMinute">
						<FormItem v-auto-animate="{ duration: 100 }">
							<FormLabel> Departure Time </FormLabel>
							<FormControl>
								<div class="relative grow">
									<Input
										id="time-input"
										v-model="departureHourMinute"
										type="time"
										step="60"
										defaultValue="12:00"
										class="peer appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
										aria-label="Select time"
									/>
									<div
										class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50"
									>
										<ClockIcon
											aria-hidden="true"
											class="size-4"
										/>
									</div>
								</div>
							</FormControl>
							<FormDescription>
								Select the departure time in HH:MM format.
								Ensure it is in 24-hour format (e.g., 14:30 for
								2:30 PM).
							</FormDescription>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{}" name="route">
						<FormItem v-auto-animate="{ duration: 100 }">
							<!-- <FormLabel> Trip Route Editor </FormLabel> -->
							<FormControl>
								<TripRouteEditor
									:trip="trip"
									@update:routes="
										(routes) => console.log(routes)
									"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
				</form>
			</ScrollArea>
			<DialogFooter>
				<Button type="submit" @click="onSubmit" size="lg">
					Add Trip
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>