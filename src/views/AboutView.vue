<template>
	<div>
		<h2>About View</h2>
		<button class="btn btn-success" @click="$router.push('/')">Home</button>
		<hr />
		<h2>Store</h2>
		<p>title: {{ store.title }}</p>
		<p>counter: {{ store.counter }}</p>
		<p>double counter: {{ store.doubleCount }}</p>
		<button @click="store.increment()">Increase!</button>
	</div>
</template>

<script setup>
import { useCounterStore } from '@/store/counter';

const store = useCounterStore();
</script>

<style lang="scss" scoped></style>
