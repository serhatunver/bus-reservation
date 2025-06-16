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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-vue-next";
import { ref } from "vue";

import { useStopStore } from "@/stores/stop";
const stopStore = useStopStore();
const { addStop } = stopStore;

const open = ref(false);
const stopName = ref<string>("");

const handleSubmit = async () => {
	const newStopName = stopName.value.trim();
	if (newStopName) {
		const response = await addStop(newStopName);

		if (response) {
			console.log("Stop added successfully:", response);
		} else {
			console.error("Failed to add stop");
		}

		stopName.value = ""; // Clear the input after submission
		open.value = false; // Close the dialog after submission
	} else {
		console.error("Stop name cannot be empty");
	}
};
</script>

<template>
	<Dialog v-model:open="open">
		<DialogTrigger as-child>
			<Button size="lg" @click="() => console.log('Open Add Stop Modal')">
				Add Stop
				<Plus />
			</Button>
		</DialogTrigger>
		<DialogContent class="sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle>Add Stop</DialogTitle>
				<DialogDescription>
					Fill in the details below to add a new stop. Ensure all
					fields are completed accurately.
				</DialogDescription>
			</DialogHeader>
			<div class="grid gap-4 py-4">
				<div class="flex flex-col gap-2">
					<Label for="name" class="text-right">Stop Name </Label>
					<Input id="name" v-model="stopName" class="col-span-3" />
				</div>
			</div>
			<DialogFooter>
				<Button type="submit" @click="handleSubmit">Add Stop</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>