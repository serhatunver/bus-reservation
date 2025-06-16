<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

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
import CustomInput from "@/components/CustomInput.vue";

import { Loader } from "lucide-vue-next";

const formSchema = toTypedSchema(
	z.object({
		email: z.string().email("Invalid email address"),
		name: z
			.string()
			.min(2, "Name must be at least 2 characters")
			.max(32, "Name must not be longer than 32 characters")
			.trim(),
		surname: z
			.string()
			.min(2, "Surname must be at least 2 characters")
			.max(32, "Surname must not be longer than 32 characters")
			.trim(),
		phone: z
			.string()
			.min(10, "Phone number must be at least 10 characters")
			.max(15, "Phone number must not be longer than 15 characters")
			.trim(),
		password: z
			.string()
			.min(6, "Password must be at least 6 characters")
			.max(32, "Password must not be longer than 32 characters")
			.trim(),
	})
);

const form = useForm({
	validationSchema: formSchema,
});

const loading = ref(false);

const onSubmit = form.handleSubmit(async (values) => {
	console.log("Form submitted!", values);
	const res = await $fetch("http://localhost:3000/api/v1/auth/register", {
		method: "POST",
		credentials: "include",
		body: {
			email: values.email,
			name: values.name,
			surname: values.surname,
			phone: values.phone,
			password: values.password,
		},
	});
	console.log(res);
});
</script>

<template>
	<form class="grid gap-2" @submit="onSubmit">
		<Card>
			<CardHeader class="space-y-1">
				<CardTitle class="text-2xl"> Create an account </CardTitle>
				<CardDescription>
					Enter your email below to create your account
				</CardDescription>
			</CardHeader>
			<CardContent class="grid gap-4">
				<FormField v-slot="{ componentField }" name="name">
					<FormItem>
						<FormLabel>First Name</FormLabel>
						<FormControl>
							<CustomInput
								type="text"
								placeholder=""
								v-bind="componentField"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="surname">
					<FormItem>
						<FormLabel>Last Name</FormLabel>
						<FormControl>
							<CustomInput
								type="text"
								placeholder=""
								v-bind="componentField"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="email">
					<FormItem>
						<FormLabel>Email</FormLabel>
						<FormControl>
							<CustomInput
								type="text"
								placeholder=""
								v-bind="componentField"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="phone">
					<FormItem>
						<FormLabel>Phone Number</FormLabel>
						<FormControl>
							<CustomInput
								type="tel"
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
							<CustomInput
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
					<Loader class="animate-spin size-5 ml-2" v-if="loading" />
					{{ loading ? "Loading" : "Create Account" }}
				</Button>
				<Separator class="my-2" label="Or" />
				<div>Already have an account?</div>
				<RouterLink class="w-full rounded-full" to="/login">
					<Button class="w-full h-14 text-base rounded-2xl"
						>Login</Button
					>
				</RouterLink>
			</CardFooter>
		</Card>
	</form>
</template>