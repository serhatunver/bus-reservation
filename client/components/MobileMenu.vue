<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-vue-next";
import { Menu, X } from "lucide-vue-next";
import { ref } from "vue";
const isOpen = ref(false);

const { status, data, signOut } = useAuth();
</script>

<template>
	<Sheet v-model:open="isOpen" class="md:hidden">
		<SheetTrigger as-child>
			<Button variant="outline" size="icon" class="size-12">
				<Menu class="size-4" />
			</Button>
		</SheetTrigger>
		<SheetContent class="w-full md:hidden">
			<SheetHeader
				class="flex flex-row justify-between items-center px-4"
			>
				<img
					class="h-8 w-auto"
					src="https://busbud-pubweb-assets.global.ssl.fastly.net/horizon/BrandLogos/busbud/logo-color-lg.svg"
					alt="busbud logo"
				/>
				<SheetClose as-child>
					<Button
						class="self-end z-1 size-12 border shadow-xl"
						variant="outline"
						size="icon"
					>
						<X class="" />
					</Button>
				</SheetClose>
			</SheetHeader>
			<div class="grid gap-4 px-4">
				<NuxtLink to="/track" @click="isOpen = false">
					<Button variant="outline" class="w-full h-12 text-base">
						Track Reservation
					</Button>
				</NuxtLink>
			</div>
			<SheetFooter>
				<div
					v-if="status === 'unauthenticated'"
					class="flex flex-col space-y-2"
				>
					<NuxtLink to="/login" @click="isOpen = false">
						<Button class="w-full h-12 text-base"> Log In </Button>
					</NuxtLink>
					<NuxtLink to="/signup" @click="isOpen = false">
						<Button class="w-full h-12 text-base"> Sign Up </Button>
					</NuxtLink>
				</div>
				<div>
					<NuxtLink v-if="status === 'authenticated'">
						<Button
							class="w-full h-12 text-base"
							@click="
								() => {
									signOut({ callbackUrl: '/' });
									isOpen = false;
								}
							"
						>
							<LogOut class="size-4 mr-2" />
							Log Out
						</Button>
					</NuxtLink>
				</div>
			</SheetFooter>
		</SheetContent>
	</Sheet>
</template>