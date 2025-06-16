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

import { useBusStore } from "@/stores/bus";
const busStore = useBusStore();

const { deleteBus } = busStore;

import { ref } from "vue";
const open = ref(false);

const props = defineProps({
	busId: {
		type: String,
		required: true,
	},
});

const handleDeleteBus = async () => {
	await deleteBus(props.busId);
	open.value = false;
};
</script>

<template>
	<AlertDialog>
		<AlertDialogTrigger as-child>
			<Button
				variant="outline"
				size="icon"
				@click="() => console.log('Open Delete Bus Confirmation')"
			>
				<Trash2 />
			</Button>
		</AlertDialogTrigger>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle> Confirm Delete Bus </AlertDialogTitle>
				<AlertDialogDescription>
					Are you sure you want to delete this bus? This action cannot
					be undone. Please confirm that you wish to proceed with the
					deletion.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel size="lg">Cancel</AlertDialogCancel>
				<AlertDialogAction
					variant="destructive"
					size="lg"
					@click="handleDeleteBus"
				>
					Delete
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
</template>