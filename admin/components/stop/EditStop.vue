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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SquarePen } from "lucide-vue-next";
import { defineProps, ref, watch } from "vue";

import { useStopStore } from "@/stores/stop";
const stopStore = useStopStore();
const { updateStop } = stopStore;

const stopName = ref<string>("");
const open = ref(false);

const props = defineProps({
	stopId: {
		type: String,
		required: true,
	},
	stopName: {
		type: String,
		required: true,
	},
});

watch(open, (isOpen) => {
	if (isOpen) {
		stopName.value = props.stopName;
	}
});

const handleSubmit = async () => {
	console.log(
		`Updating stop with ID: ${props.stopId}, New Name: ${stopName.value}`
	);

	await updateStop(props.stopId, stopName.value);

	console.log("Stop updated successfully:", stopName.value);
	open.value = false;
};
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
							@click="() => console.log('Open Edit Stop Modal')"
						>
							<SquarePen />
						</Button>
					</TooltipTrigger>
				</DialogTrigger>
				<TooltipContent>
					<p>Edit Stop</p>
				</TooltipContent>
			</Tooltip>

			<DialogContent class="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Edit Stop</DialogTitle>
					<DialogDescription>
						Modify the details of the stop below. Ensure all fields
						are
					</DialogDescription>
				</DialogHeader>
				<div class="grid gap-4 py-4">
					<div class="flex flex-col gap-2">
						<Label for="name" class="text-right">Stop Name </Label>
						<Input
							id="name"
							v-model="stopName"
							class="col-span-3"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button size="lg" type="submit" @click="handleSubmit">
						Save Changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</TooltipProvider>
</template>