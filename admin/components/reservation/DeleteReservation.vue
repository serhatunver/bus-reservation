<script setup lang="ts">
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-vue-next";

import { useReservationStore } from "@/stores/reservation";
const reservationStore = useReservationStore();

const { deleteReservation } = reservationStore;

import { ref } from "vue";
const open = ref(false);

const props = defineProps({
	reservationId: {
		type: String,
		required: true,
	},
});

const handleDeleteReservation = async () => {
	await deleteReservation(props.reservationId);
	open.value = false;
};
</script>

<template>
	<TooltipProvider>
		<AlertDialog>
			<Tooltip>
				<AlertDialogTrigger as-child>
					<TooltipTrigger as-child>
						<Button
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
					<p>Delete Reservation</p>
				</TooltipContent>
			</Tooltip>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Confirm Delete Reservation
					</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete this reservation? This
						action cannot be undone. Please confirm that you wish to
						proceed with the deletion.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel size="lg">Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						size="lg"
						@click="handleDeleteReservation"
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	</TooltipProvider>
</template>