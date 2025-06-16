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

import { useStopStore } from "@/stores/stop";
const stopStore = useStopStore();

const { deleteStop } = stopStore;

import { ref } from "vue";
const open = ref(false);

const props = defineProps({
	stopId: {
		type: String,
		required: true,
	},
});

const handleDeleteStop = async () => {
	await deleteStop(props.stopId);
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
									console.log('Open Delete Stop Confirmation')
							"
						>
							<Trash2 />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Delete Stop</p>
					</TooltipContent>
				</AlertDialogTrigger>
			</Tooltip>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle> Confirm Delete Stop </AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete this stop? This action
						cannot be undone. Please confirm that you wish to
						proceed with the deletion.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel size="lg">Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						size="lg"
						@click="handleDeleteStop"
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	</TooltipProvider>
</template>