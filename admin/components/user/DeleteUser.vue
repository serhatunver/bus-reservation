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

import { useUserStore } from "@/stores/user";
const userStore = useUserStore();

const { deleteUser } = userStore;

import { ref } from "vue";
const open = ref(false);

const props = defineProps({
	userId: {
		type: String,
		required: true,
	},
});

const handleDeleteUser = async () => {
	await deleteUser(props.userId);
	open.value = false;
};
</script>

<template>
	<AlertDialog>
		<AlertDialogTrigger as-child>
			<Button
				variant="outline"
				size="icon"
				@click="() => console.log('Open Delete User Confirmation')"
			>
				<Trash2 />
			</Button>
		</AlertDialogTrigger>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle> Confirm Delete User </AlertDialogTitle>
				<AlertDialogDescription>
					Are you sure you want to delete this user? This action
					cannot be undone. Please confirm that you wish to proceed
					with the deletion.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel size="lg">Cancel</AlertDialogCancel>
				<AlertDialogAction
					variant="destructive"
					size="lg"
					@click="handleDeleteUser"
				>
					Delete
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
</template>