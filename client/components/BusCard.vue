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
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	ChevronRight,
	ChevronDown,
	Wifi,
	Plug,
	Venus,
	Mars,
} from "lucide-vue-next";

import { DateFormatter } from "@internationalized/date";

// const mongodbDate = "2023-10-05T12:34:56.789Z"; // Örnek MongoDB ISO tarihi
// const dateValue = new Date(mongodbDate);

// Yerel saat dilimine göre formatlama
const formatter = new DateFormatter("tr-TR", {
	timeStyle: "short",
});

const props = defineProps({
	trip: {
		type: Object,
		required: true,
	},
});

console.log("Trip:", props.trip);

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
								new Date(trip.fromStopDepartureTime)
							)
						}}
					</div>
					<Separator
						class="h-4 border-1 border-gray-400"
						:label="formatDuration(trip.durationBetweenStops)"
					/>
					<div>
						{{ formatter.format(new Date(trip.toStopArrivalTime)) }}
					</div>
				</div>
				<div class="flex w-full items-center justify-between space-x-2">
					<CardDescription class="text-left text-base">
						{{ trip.fromStopName }}
					</CardDescription>
					<CardDescription class="text-right text-base">
						{{ trip.toStopName }}
					</CardDescription>
				</div>
			</CardTitle>
		</CardHeader>
		<CardContent> </CardContent>
		<CardFooter class="flex justify-between px-6">
			<Button
				class="rounded-full flex items-center self-end h-6"
				variant="secondary"
			>
				<span> {{ trip.availableSeats.length ?? 0 }} Seats </span>
				<ChevronDown class="" />
			</Button>
			<!-- <div class="flex items-center space-x-2">
				<BusFront class="size-4" />
				<span class="text-sm text-muted-foreground">4 hrs</span>
			</div> -->
			<Button class="rounded-full flex items-center justify-center">
				<span> TRY {{ trip.lowestPrice }} </span>
				<ChevronRight class="" />
			</Button>
		</CardFooter>
	</Card>
</template>