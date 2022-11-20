<template>
	<div class="container min-h-screen grid grid-cols-12 gap-x-8">
		<div class="col-span-3">
			<Sidebar />
		</div>
		<main class="col-span-9 py-6">
			<slot />
		</main>
	</div>
</template>
