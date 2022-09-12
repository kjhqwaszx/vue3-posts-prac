<template>
	<div>
		<h2>게시글 목록</h2>
		<hr class="my-4" />
		<PostFilter
			v-model:title="params.title_like"
			v-model:limit="params._limit"
			@update:limit="changeLimit"
		>
		</PostFilter>
		<hr class="my4" />

		<AppLoading v-if="loading"></AppLoading>

		<AppError v-else-if="error" :message="error"></AppError>

		<template v-else-if="!isExist">
			<p class="text-center py-5 text-muted">No Results</p>
		</template>

		<template v-else>
			<AppGrid :items="posts" col-class="col-12 col-md-6 col-lg-4">
				<template v-slot="{ item }">
					<PostItem
						:title="item.title"
						:content="item.content"
						:createdAt="item.createdAt"
						@click="goPage(item.id)"
						@modal="openModal(item)"
					>
					</PostItem>
				</template>
			</AppGrid>

			<AppPagination
				:currentPage="params._page"
				:pageCount="pageCount"
				@page="uptPage"
			>
			</AppPagination>
		</template>

		<Teleport to="#modal">
			<PostModal
				v-model="show"
				:title="modalTitle"
				:content="modalContent"
				:createdAt="modalCreatedAt"
			>
			</PostModal>
		</Teleport>
	</div>
</template>

<script setup>
import PostFilter from '@/components/posts/PostFilter.vue';
import AppLoading from '@/components/app/AppLoading.vue';
import AppError from '@/components/app/AppError.vue';
import AppGrid from '@/components/app/AppGrid.vue';
import PostItem from '@/components/posts/PostItem.vue';
import PostModal from '@/components/posts/PostModal.vue';
import AppPagination from '@/components/app/AppPagination.vue';

import { getPosts } from '@/api/posts';
import { computed, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const params = ref({
	_sort: 'createdAt',
	_order: 'desc',
	_limit: 3,
	_page: 1,
	title_like: '',
});

const changeLimit = value => {
	params.value._limit = value;
	params.value._page = 1;
};

//data Fetching
const posts = ref([]);
const error = ref(null);
const loading = ref(false);
const totalCount = ref(0);

const fetchPosts = async () => {
	try {
		loading.value = true;
		const response = await getPosts(params.value);
		posts.value = response.data;
		//response Header에 totalCount값이 들어 있다.
		totalCount.value = response.headers['x-total-count'];
	} catch (err) {
		error.value = err.message;
	} finally {
		loading.value = false;
	}
};

watchEffect(fetchPosts);

const isExist = computed(() =>
	posts.value && posts.value.length > 0 ? true : false,
);
const pageCount = computed(() =>
	Math.ceil(totalCount.value / params.value._limit),
);

const goPage = id => {
	router.push({
		name: 'PostDetail',
		params: {
			id,
		},
	});
};

//pagination
const uptPage = page => {
	params.value._page = page;
};

//modal
const show = ref(false);
const modalTitle = ref('');
const modalContent = ref('');
const modalCreatedAt = ref('');

const openModal = ({ title, content, createdAt }) => {
	show.value = true;
	modalTitle.value = title;
	modalContent.value = content;
	modalCreatedAt.value = createdAt;
};
</script>

<style lang="scss" scoped></style>
