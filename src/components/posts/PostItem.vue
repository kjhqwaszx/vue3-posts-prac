<template>
	<AppCard>
		<h5 class="card-title text-truncate">{{ title }}</h5>
		<p class="card-text text-truncate">{{ content }}</p>
		<p class="text-muted">{{ createdDate }}</p>
		<template #footer>
			<div class="d-flex flex-row-reverse">
				<button class="btn p-0" @click.stop="$emit('modal')">
					<i class="bi bi-emoji-sunglasses"></i>
				</button>
			</div>
		</template>
	</AppCard>
</template>

<script setup>
import AppCard from '@/components/app/AppCard.vue';
import { inject } from 'vue';
const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
	},
	createdAt: {
		type: [String, Date, Number],
	},
});

defineEmits(['modal']);
const dayjs = inject('dayjs');
const createdDate = dayjs(props.createdAt).format('YYYY.MM.DD HH:mm:ss');
</script>
