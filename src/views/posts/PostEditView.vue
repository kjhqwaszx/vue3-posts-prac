<template>
	<AppLoading v-if="loading"></AppLoading>
	<AppError v-else-if="error" :message="error.message"></AppError>
	<div v-else>
		<h2>게시글 수정</h2>
		<hr class="my-4" />
		<AppError v-if="editError" :message="editError"></AppError>

		<PostForm
			v-model:title="form.title"
			v-model:content="form.content"
			@submit.prevent="edit"
		>
			<template #actions>
				<button
					type="button"
					class="btn btn-outline-danger"
					@click="goDetailPage"
				>
					취소
				</button>

				<button class="btn btn-primary" :disabled="editLoading">
					<template v-if="editLoading">
						<span
							class="spinner-grow spinner-grow-sm"
							role="status"
							aria-hidden="true"
						></span>
						<span class="visually-hidden">Loading...</span>
					</template>
					<template v-else>수정</template>
				</button>
			</template>
		</PostForm>
	</div>
</template>

<script setup>
import { useAlert } from '@/composables/alert';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPostById, updatePost } from '@/api/posts';
import AppLoading from '@/components/app/AppLoading.vue';
import AppError from '@/components/app/AppError.vue';
import PostForm from '@/components/posts/PostForm.vue';

//alert composable
const { vAlert, vSuccess } = useAlert();

const router = useRouter();
const route = useRoute();

const id = route.params.id;

const form = ref({
	title: null,
	content: null,
});
const error = ref(null);
const loading = ref(false);

const fetchPost = async () => {
	try {
		loading.value = true;
		const { data } = await getPostById(id);
		form.value.title = data.title;
		form.value.content = data.content;
	} catch (err) {
		error.value = err.message;
		vAlert('네트워크 오류', 'error');
	} finally {
		loading.value = false;
	}
};

fetchPost();

const goDetailPage = () => {
	router.push({
		name: 'PostDetail',
		params: { id },
	});
};

const editError = ref(null);
const editLoading = ref(false);

const edit = async () => {
	try {
		editLoading.value = true;
		await updatePost(id, { ...form.value, createdAt: Date.now() });
		vSuccess('수정이 완료되었습니다.');
		router.push({ name: 'PostDetail', params: { id } });
	} catch (err) {
		editError.value = err.message;
		vAlert(err.message, 'error');
	} finally {
		editLoading.value = false;
	}
};
</script>

<style lang="scss" scoped></style>
