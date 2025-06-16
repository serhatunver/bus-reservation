<script lang="ts" setup>
import { onBeforeMount } from "vue";
import { userColumns } from "@/components/columns";
import DataTable from "@/components/DataTable.vue";

import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const userStore = useUserStore();

const { fetchUsers } = userStore;
const { users } = storeToRefs(userStore);

onBeforeMount(async () => {
	await fetchUsers();
});
</script>

<template>
	<div class="w-full">
		<div
			class="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4"
		>
			<div>
				<h2 class="text-2xl font-bold tracking-tight">Users</h2>
				<p class="text-muted-foreground">
					Manage your users here. You can add, edit, or delete users
					as needed.
				</p>
			</div>
		</div>
		<DataTable :columns="userColumns" :data="users" class="w-full" />
	</div>
</template>

<style scoped>
</style>