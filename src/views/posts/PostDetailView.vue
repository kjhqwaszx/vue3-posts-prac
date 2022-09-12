<template>
	<AppLoading v-if="loading"></AppLoading>
	<AppError v-else-if="error" :message="error.message"></AppError>
	<div v-else>
		<h2>{{ post.title }}</h2>
		<p>{{ post.content }}</p>
		<p class="text-mued">
			{{ $dayjs(post.createdAt).format('YYYY.MM.DD HH:mm:ss') }}
		</p>
		<hr class="my-4" />
		<!-- buttons -->
		<AppError v-if="removeError" :message="removeError"></AppError>

		<div class="row g-2">
			<div class="col-auto">
				<button
					class="btn btn-outline-dark"
					@click="$router.push(`/post/${props.id - 1}`)"
				>
					이전글
				</button>
			</div>
			<div class="col-auto">
				<button
					class="btn btn-outline-dark"
					@click="$router.push(`/post/${parseInt(props.id) + 1}`)"
				>
					다음글
				</button>
			</div>
			<div class="col-auto me-auto"></div>
			<div class="col-auto">
				<button class="btn btn-outline-dark" @click="goListPage">목록</button>
			</div>
			<div class="col-auto">
				<button class="btn btn-outline-primary" @click="goEditPage">
					수정
				</button>
			</div>
			<!-- 삭제 -->
			<div class="col-auto">
				<button
					class="btn btn-primary"
					@click="remove"
					:disabled="removeLoading"
				>
					<template v-if="removeLoading">
						<span
							class="spinner-grow spinner-grow-sm"
							role="status"
							aria-hidden="true"
						></span>
						<span class="visually-hidden">Loading...</span>
					</template>
					<template v-else>삭제</template>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { getPostById, deletePost } from '@/api/posts';
import AppLoading from '@/components/app/AppLoading.vue';
import AppError from '@/components/app/AppError.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
	id: [String, Number],
});

//data Fetching
const post = ref({});
const error = ref(false);
const loading = ref(false);

const fetchPost = async () => {
	try {
		loading.value = true;
		const response = await getPostById(props.id);

		post.value.title = response.data.title;
		post.value.content = response.data.content;
		post.value.createdAt = response.data.createdAt;
	} catch (err) {
		error.value = err;
	} finally {
		loading.value = false;
	}
};

fetchPost();

const goListPage = () => {
	router.push({
		name: 'PostList',
	});
};
const goEditPage = () => {
	router.push({
		name: 'PostEdit',
		param: props.id,
	});
};
const removeError = ref(null);
const removeLoading = ref(false);

const remove = async () => {
	try {
		if (confirm('삭제 하시겠습니까?')) {
			removeLoading.value = true;
			await deletePost(props.id);
			router.push({ name: 'PostList' });
		}
	} catch (err) {
		removeError.value = err.message;
	} finally {
		removeLoading.value = false;
	}
};
</script>

<style lang="scss" scoped></style>
