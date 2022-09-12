<template>
	<div>
		<h2>게시글 등록</h2>
		<hr class="my-4" />
		<AppError v-if="error" :message="error"></AppError>
		<PostForm
			v-model:title="form.title"
			v-model:content="form.content"
			@submit.prevent="save"
		>
			<template #actions>
				<button
					type="button"
					class="btn btn-outline-dark me-2k"
					@click="goListPage"
				>
					목록
				</button>
				<button class="btn btn-success" :disabled="loading">
					<template v-if="loading">
						<span
							class="spinner-grow spinner-grow-sm"
							role="status"
							aria-hidden="true"
						></span>
						<span class="visually-hidden">Loading...</span>
					</template>
					<template v-else>저장</template>
				</button>
			</template>
		</PostForm>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppError from '@/components/app/AppError.vue';
import PostForm from '@/components/posts/PostForm.vue';
import { createPost } from '@/api/posts';
import { useAlert } from '@/composables/alert';

const router = useRouter();
const loading = ref(false);
const error = ref(null);
const form = ref({
	title: null,
	content: null,
});
//alert용 composable
const { vAlert, vSuccess } = useAlert();
const save = async () => {
	try {
		loading.value = true;
		await createPost({
			...form.value,
			createdAt: Date.now(),
		});
		goListPage();
		vSuccess('등록이 완료되었습니다.');
	} catch (err) {
		error.value = err.message;
		vAlert(err.message, 'error');
	} finally {
		loading.value = false;
	}
};
const goListPage = () => {
	router.push({ name: 'PostList' });
};
</script>

<style lang="scss" scoped></style>
