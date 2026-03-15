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
		email: "serhat@example.com",
		password: "12345678",
	},
});

const { signIn } = useAuth();

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
			{ callbackUrl: "/" }
		);
	} catch (error) {
		console.error(error);
	} finally {
		loading.value = false;
	}
});
</script>

<template>
	<form class="grid gap-2" @submit="onSubmit">
		<Card>
			<CardHeader class="space-y-1">
				<CardTitle class="text-2xl"> Login to your account </CardTitle>
				<CardDescription>
					Enter your credentials below to login to your account
				</CardDescription>
			</CardHeader>
			<CardContent class="grid gap-4">
				<FormField v-slot="{ componentField }" name="email">
					<FormItem>
						<FormLabel>Email</FormLabel>
						<FormControl>
							<CustomInput
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
					{{ loading ? "Loading" : "Login" }}
				</Button>
				<Separator class="my-2" label="Or" />
				<div>Don't have an account?</div>
				<RouterLink class="w-full rounded-full" to="/signup">
					<Button class="w-full h-14 text-base rounded-2xl">
						Sign Up
					</Button>
				</RouterLink>
			</CardFooter>
		</Card>
	</form>
</template>