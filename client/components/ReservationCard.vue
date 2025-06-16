<script setup lang='ts'>
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Wifi, Plug, Venus, Mars, Trash2 } from "lucide-vue-next";
import { DateFormatter } from "@internationalized/date";

import { useUserStore } from "@/stores/user";
const userStore = useUserStore();

const { cancelMyReservation } = userStore;

// const mongodbDate = "2023-10-05T12:34:56.789Z"; // Örnek MongoDB ISO tarihi
// const dateValue = new Date(mongodbDate);

// Yerel saat dilimine göre formatlama
const formatter = new DateFormatter("tr-TR", {
	timeStyle: "short",
});

const props = defineProps({
	reservation: {
		type: Object,
		required: true,
	},
});

const emits = defineEmits(["reservationCancelled"]);

const handleCancelReservation = async () => {
	try {
		const res = await cancelMyReservation(
			props.reservation.pnr,
			props.reservation.email
		);

		if (res.reservation) {
			emits("reservationCancelled", res.reservation);
			console.log(
				"Reservation cancelled successfully:",
				res.reservation.pnr
			);
		}
	} catch (error) {
		console.error("Error cancelling reservation:", error);
	}
};

function formatDuration(minutes: number) {
	const hrs = Math.floor(minutes / 60);
	const mins = minutes % 60;

	if (hrs && mins) return `${hrs} hr${hrs > 1 ? "s" : ""} ${mins} mins`;
	if (hrs) return `${hrs} hr${hrs > 1 ? "s" : ""}`;
	if (mins) return `${mins} mins`;
	return "0 mins";
}
</script>

<template>
	<Card
		class="max-w-[1024px] w-full gap-2 hover:shadow-2xl transition-shadow duration-300 ease-in-out hover:cursor-pointer"
	>
		<CardHeader class="flex flex-col space-y-4">
			<div class="flex w-full items-center justify-between">
				<img class="h-8 w-auto" src="../assets/busio.png" alt="" />
				<div class="flex items-center">
					<Wifi class="size-5" />
					<Plug class="size-5" />
					<Venus class="size-5" />
					<Mars class="size-5" />
				</div>
			</div>
			<CardTitle class="flex w-full flex-col space-y-2">
				<div class="flex w-full items-center space-x-4">
					<div>
						{{
							formatter.format(
								new Date(reservation.trip.departureTime)
							)
						}}
					</div>
					<Separator
						class="h-4 border-1 border-gray-400"
						:label="formatDuration(reservation.price)"
					/>
					<div>
						{{
							formatter.format(
								new Date(reservation.trip.arrivalTime)
							)
						}}
					</div>
				</div>
				<div class="flex w-full items-center justify-between space-x-2">
					<CardDescription class="text-left text-base">
						{{ reservation.fromStop.name }}
					</CardDescription>
					<CardDescription class="text-right text-base">
						{{ reservation.toStop.name }}
					</CardDescription>
				</div>
			</CardTitle>
		</CardHeader>
		<CardContent> </CardContent>
		<CardFooter class="flex justify-between px-6">
			<!-- <Button
				variant="outline"
				class="h-12 px-6 flex items-center justify-between"
			>
				<span class="flex items-center">
					Price: {{ reservation.price }} TL
				</span>
				<span class="text-sm text-muted-foreground">
					Seat: {{ reservation.seatNumber }}
				</span>
				<span class="text-sm text-muted-foreground">
					Status: {{ reservation.status }}
				</span>
			</Button> -->
			<div class="flex items-center space-x-2">
				<span class="text-sm text-muted-foreground">
					Price: {{ reservation.price }} TL
				</span>
				<span class="text-sm text-muted-foreground">
					Seat: {{ reservation.seatNumber }}
				</span>
				<span class="text-sm text-muted-foreground">
					Status: {{ reservation.status }}
				</span>
			</div>
			<TooltipProvider>
				<AlertDialog>
					<Tooltip>
						<AlertDialogTrigger as-child>
							<TooltipTrigger as-child>
								<Button
									v-if="reservation.status === 'booked'"
									variant="outline"
									size="icon"
									@click="
										() =>
											console.log(
												'Open Delete Reservation Confirmation'
											)
									"
								>
									<Trash2 />
								</Button>
							</TooltipTrigger>
						</AlertDialogTrigger>
						<TooltipContent>
							<p>Cancel Reservation</p>
						</TooltipContent>
					</Tooltip>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Confirm Cancellation
							</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to cancel this
								reservation? This action cannot be undone.
								Please confirm that you wish to proceed with the
								cancellation of your reservation for the trip
								from
								{{ reservation.fromStop.name }} to
								{{ reservation.toStop.name }}.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel size="lg">
								No, go back
							</AlertDialogCancel>
							<AlertDialogAction
								variant="destructive"
								size="lg"
								@click="handleCancelReservation"
							>
								Yes, cancel reservation
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</TooltipProvider>
		</CardFooter>
	</Card>
</template>