<script lang="ts" setup>
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css";
</script>


<template>
	<div>
		<NuxtRouteAnnouncer />
		<NuxtLoadingIndicator />
		<NuxtLayout>
			<Toaster />
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>
