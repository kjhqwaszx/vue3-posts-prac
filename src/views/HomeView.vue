<template>
	<div>
		<h2>Home View</h2>
		<button class="btn btn-success" @click="goToAbout()">About 이동</button>
		<hr class="my-4" />
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const goToAbout = () => {
	router.push('/about');
};
</script>
