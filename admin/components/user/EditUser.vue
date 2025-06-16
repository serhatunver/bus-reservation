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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SquarePen } from "lucide-vue-next";
import { defineProps, ref, watch } from "vue";

import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";

import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const { updateUser } = userStore;

const props = defineProps({
	user: {
		type: Object,
		required: true,
	},
});

const formSchema = toTypedSchema(
	z.object({
		_id: z.string(),
		name: z.string(),
		surname: z.string(),
		email: z.string().email(),
		phone: z.string(),
	})
);

const { handleSubmit, resetForm } = useForm({
	validationSchema: formSchema,
});

const open = ref(false);

console.log("User Object:", props.user);

watch(open, (isOpen) => {
	if (isOpen) {
		// Initialize newUser with the user data when dialog opens
		// This will set the form values to the user data
		resetForm({
			values: {
				_id: props.user._id || "",
				name: props.user.name || "",
				surname: props.user.surname || "",
				email: props.user.email || "",
				phone: props.user.phone || "",
			},
		});
	}
});

const onSubmit = handleSubmit(async (values) => {
	console.log(
		`Updating stop with ID: ${props.user._id}, New User: ${values}`
	);

	await updateUser(props.user._id, values);

	console.log("User updated successfully:", values);
	open.value = false; // Close the dialog after submission
});
</script>

<template>
	<Dialog v-model:open="open">
		<DialogTrigger as-child>
			<Button
				variant="outline"
				size="icon"
				@click="() => console.log('Open Edit User Modal')"
			>
				<SquarePen />
			</Button>
		</DialogTrigger>
		<DialogContent class="sm:max-w-[500px]">
			<DialogHeader class="px-4">
				<DialogTitle>Edit User</DialogTitle>
				<DialogDescription>
					Modify the details of the user below. Ensure all fields are
					accurate before saving changes.
				</DialogDescription>
			</DialogHeader>
			<ScrollArea class="h-[500px]">
				<form class="space-y-6 px-4" @submit.prevent="onSubmit">
					<FormField v-slot="{ componentField }" name="name">
						<FormItem v-auto-animate="{ duration: 100 }">
							<FormLabel>User Name</FormLabel>
							<FormControl>
								<Input
									v-bind="componentField"
									type="text"
									placeholder="User Name"
								/>
							</FormControl>
							<FormDescription>
								Enter the user's name (e.g., John).
							</FormDescription>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{ componentField }" name="surname">
						<FormItem v-auto-animate="{ duration: 100 }">
							<FormLabel>User Surname</FormLabel>
							<FormControl>
								<Input
									v-bind="componentField"
									type="text"
									placeholder="User Surname"
								/>
							</FormControl>
							<FormDescription>
								Enter the user's surname (e.g., Doe).
							</FormDescription>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{ componentField }" name="email">
						<FormItem v-auto-animate="{ duration: 100 }">
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									v-bind="componentField"
									type="email"
									placeholder="Email"
								/>
							</FormControl>
							<FormDescription>
								Enter the user's email address.
							</FormDescription>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{ componentField }" name="phone">
						<FormItem v-auto-animate="{ duration: 100 }">
							<FormLabel>Phone</FormLabel>
							<FormControl>
								<Input
									v-bind="componentField"
									type="tel"
									placeholder="Phone"
								/>
							</FormControl>
							<FormDescription>
								Enter the user's phone number.
							</FormDescription>
							<FormMessage />
						</FormItem>
					</FormField>
				</form>
			</ScrollArea>
			<DialogFooter>
				<Button size="lg" @click="onSubmit"> Save Changes </Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
</template>