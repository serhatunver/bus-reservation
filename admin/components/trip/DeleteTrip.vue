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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-vue-next";

import { useTripStore } from "@/stores/trip";
const tripStore = useTripStore();

const { deleteTrip } = tripStore;

import { ref } from "vue";
const open = ref(false);

const props = defineProps({
	tripId: {
		type: String,
		required: true,
	},
});

const handleDeleteTrip = async () => {
	await deleteTrip(props.tripId);
	open.value = false;
};
</script>

<template>
	<AlertDialog>
		<AlertDialogTrigger as-child>
			<Button
				variant="outline"
				size="icon"
				@click="() => console.log('Open Delete Trip Confirmation')"
			>
				<Trash2 />
			</Button>
		</AlertDialogTrigger>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle> Confirm Delete Trip </AlertDialogTitle>
				<AlertDialogDescription>
					Are you sure you want to delete this trip? This action
					cannot be undone. Please confirm that you wish to proceed
					with the deletion.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel size="lg">Cancel</AlertDialogCancel>
				<AlertDialogAction
					variant="destructive"
					size="lg"
					@click="handleDeleteTrip"
				>
					Delete
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
</template>