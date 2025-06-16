<script setup lang="ts">
definePageMeta({
	auth: {
		unauthenticatedOnly: true,
		navigateAuthenticatedTo: "/trip",
	},
});

import { ref } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

const { signIn } = useAuth();

import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Loader } from "lucide-vue-next";

const formSchema = toTypedSchema(
	z.object({
		email: z.string().email("Invalid email address"),
		password: z
			.string()
			.min(6, "Password must be at least 6 characters")
			.max(32, "Password must not be longer than 32 characters")
			.trim(),
	})
);

const form = useForm({
	validationSchema: formSchema,
	initialValues: {
		email: "admin@example.com",
		password: "12345678",
	},
});

const loading = ref(false);

const onSubmit = form.handleSubmit(async (values) => {
	loading.value = true;
	try {
		console.log("Form submitted with values:", values);
		const res = await signIn(
			{
				email: values.email,
				password: values.password,
			},
			{ callbackUrl: "/trip" }
		);
	} catch (error) {
		console.error(error);
	} finally {
		loading.value = false;
	}
});
</script>

<template>
	<div
		class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px]"
	>
		<header
			class="text-center h-24 flex items-center justify-center text-2xl font-bold text-gray-800 dark:text-gray-200"
		>
			Admin Dashboard Login
		</header>
		<form class="grid gap-2" @submit="onSubmit">
			<Card>
				<CardHeader class="space-y-1">
					<CardTitle class="text-2xl">
						Login to Admin Dashboard
					</CardTitle>
					<CardDescription>
						Please enter admin credentials to access the admin
						dashboard.
					</CardDescription>
				</CardHeader>
				<CardContent class="grid gap-4">
					<FormField v-slot="{ componentField }" name="email">
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									class="rounded-2xl h-14"
									type="email"
									placeholder=""
									v-bind="componentField"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{ componentField }" name="password">
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input
									class="rounded-2xl h-14"
									type="password"
									placeholder=""
									v-bind="componentField"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
				</CardContent>
				<CardFooter class="flex flex-col gap-2">
					<Button
						type="submit"
						:disabled="loading"
						class="flex h-14 items-center justify-center w-full mb-2 rounded-2xl text-base"
					>
						<Loader
							class="animate-spin size-5 ml-2"
							v-if="loading"
						/>
						{{ loading ? "Loading" : "Login" }}
					</Button>
				</CardFooter>
			</Card>
		</form>
	</div>
</template>