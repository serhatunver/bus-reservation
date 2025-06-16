<script setup lang="ts">
import SignUpForm from "@/components/SignUpView/SignUpForm.vue";
definePageMeta({
	auth: {
		unauthenticatedOnly: true,
		navigateAuthenticatedTo: "/",
	},
});
</script>

<template>
	<div
		class="m-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px]"
	>
		<SignUpForm />
		<p class="px-8 text-center text-sm text-muted-foreground">
			By clicking continue, you agree to our
			<a
				href="/terms"
				class="underline underline-offset-4 hover:text-primary"
			>
				Terms of Service
			</a>
			and
			<a
				href="/privacy"
				class="underline underline-offset-4 hover:text-primary"
			>
				Privacy Policy
			</a>
			.
		</p>
	</div>
</template>