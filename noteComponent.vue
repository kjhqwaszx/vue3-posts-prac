/* eslint-disable */
<!-- 
	
	[ Component 관련해서는 Vue2.0과 비슷하다. ]
	- props
  - emit
	- provide & inject
	- Life Cycle Hook
  
  props & event branch참고
-->

<!-- 
  1. props
    - props: ['~~', '~~~'] 보다는 객체 타입으로 선언해주는 것을 권장한다.
      -> type: propsData의 타입 (Stringm, Number, Boolean, Array, Object ...)
      -> default: undefined를 전달 받을 경우 기본값
      -> required: 필수 여부
      -> validator: 유효성 검사
    - 전달받은 props 데이터를 setup() 에서 사용할 경우 setup(props) 로 선언해서 사용한다.
 -->
<script>
export default {
	props: {
		title: {
			type: String,
			required: true,
			default: '제목없음',
		},
		contents: {
			type: String,
			required: true,
		},
		isLike: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<!-- 
  2. emit
    - 자식 컴포넌트에서 부모 컴포넌트에게 이벤트를 발생시킬 때 사용한다.
    - Vue2때와는 다르게 this.$emit('이벤트명', parm) 으로 호출이 불가능 -> setup()에서는 렌더링 전이므로 this 접근 불가
    - setup(props, context)에서 context.emit('이벤트명')으로 호출하고
      props:['속성명'] 처럼
      emits:['이벤트명'] or emit:{} 객체형으로 선언할 수 있다.
      객체형으로 사용할 경우 validation 체크가 가능하다.
 -->

<script>
export default {
	emits: ['toggle-like'],
	setup(props, context) {
		const toggleLike = () => {
			context.emit('toggle-like');
		};

		return {
			toggleLike,
		};
	},
};
</script>

<!-- 
  3. provide & inject
    - 부모 컴포넌트에서 자식 컴포넌트에게 데이터를 전달 할 경우 props 속성을 사용하지만
		  컴포넌트가 더 깊어지면 props를 사용하는데 한계가 있다. 이때, provide와 inject를 사용한다.
		- 하위 컴포넌트에 제공할 데이터는 상위 컴포넌트에서 setup() 부분에 provide('주입key', '주입value')  이렇게 선언한다.
 -->

<!-- 부모 컴포넌트 -->
<template>
	<div class="container py-4">
		<div class="card">
			<div class="card-header">ProvideInject Component</div>
			<div class="card-body"><Child></Child></div>
			<button @click="count++">click</button>
		</div>
	</div>
</template>

<script>
import { provide, ref } from 'vue';
import Child from './Child.vue';
export default {
	components: {
		Child,
	},
	setup() {
		const staticMessage = 'static message';
		const message = ref('message');
		const count = ref(10);

		provide('static-message', staticMessage);
		provide('message', message);
		provide('count', count);
		return { count };
	},
};
</script>

<style lang="scss" scoped></style>

<!-- Deep자식 컴포넌트-->

<template>
	<div class="card">
		<div class="card-header">Deep Child Component</div>
		<div class="card-body">
			<p>staticMessage: {{ staticMessage }}</p>
			<p>message: {{ message }}</p>
			<p>count: {{ count }}</p>
		</div>
	</div>
</template>

<script>
import { inject } from 'vue';
export default {
	setup() {
		//inject의 두번째 param은 값이 없을경우 나오는 데이터이다.
		const staticMessage = inject('static-message', 'default message');
		const message = inject('message');
		const count = inject('count');
		return {
			staticMessage,
			message,
			count,
		};
	},
};
</script>

<style lang="scss" scoped></style>

<!-- 
  3. Life Cycle Hook
    - 크게 Creation(생성) -> Mounting(장착) -> Updating(수정) -> Destruction(소멸) 로 볼수 있다.
		- Creation(생성): 가장 빠른 시점이며 Dom에 추가되기 전이므로 this 접근이 불가능하다.
		  -> setup()
		- Mounting(장착): DOM에 컴포넌트를 삽입하는 단계이다.
			->  onBeforeMount, onMounted가 있으며 setup() 함수 내부에서 사용된다.
		- Updating(수정): 반응형 데이터가 변경되어 화면에 다시 렌더링 될때 호출된다.
			-> onBeforeUpdate, onUpdated    ** 화면이 바뀌어야(렌더링) 호출된다.
		- Destruction: 마운트가 해제될 때 시점이다. 예를들어 자식 컴포넌트가 v-if=false 로 사라질 때 자식컴포넌트에서 발생된다.
			-> onBeforeUnmount, onUnmounted
 -->

<!-- 
		[ Template refs ]
		 - Dom 요소에 직접 접근해야 하는 경우 ref 속성을 사용해서 접근할 수 있다.

-->

<template>
	<div>
		<input type="text" ref="input" />
		<!-- input은 렌더링 이후에 값이 할당되기 때문에 v-if를 해주어야 오류가 안난다 -->
		<p v-if="input">{{ input.value }}, {{ $refs.input.value }}</p>
		<hr />

		<ul>
			<!-- ref를 string 값으로 선언 -->
			<!-- <li v-for="fruit in fruits" :key="fruit" ref="itemRefs">{{ fruit }}</li> -->

			<!-- ref를 function으로 선언 -->
			<li
				v-for="fruit in fruits"
				:key="fruit"
				:ref="el => itemRefs.push(el.textContent)"
			>
				{{ fruit }}
			</li>
		</ul>
	</div>
</template>

<script>
import { onMounted, ref } from 'vue';
export default {
	setup() {
		//ref가 input인 태그 조사
		const input = ref(null);

		// 렌더링 이후 접근이 가능하므로 mounted 이후 접근이 가능하다.
		onMounted(() => {
			input.value.value = 'Hello World!!';
			console.log(input.value);

			// string으로 전달할 경우
			// itemRefs.value.forEach(item => {
			// 	console.log(item.textContent);
			// });

			//함수로 전달할 경우
			itemRefs.value.forEach(item => {
				console.log(item);
			});
		});

		const fruits = reactive(['사과', '딸기', '포도']);
		const itemRefs = ref([]);
		return {
			input,
			fruits,
			itemRefs,
		};
	},
};
</script>

<style lang="scss" scoped></style>

<!-- 
	[ script setup ]  _ ScriptSetup.vue 
	  - Single File Component 내에서 Composition API를 사용하기 위한 태그
		- 별다른 return이 없어도 된다.

		<script setup>									<script>
			console.log('hi');			==  		export default {
		</script>														setup() {
																					console.log('hi');				
																					return {};
																				},
																			}
																		</script>

		- props와 emit을 선언할때 defineProps() & defineEmits()를 사용한다 (<script setup> 전용 메서드 )
		- <script> 와 <script setup>는 같이 사용할 수 있다.

-->

<!-- return 없이 사용 가능하다. -->

<template>
	<div class="container py-4">
		{{ msg }}
		<br />
		{{ message }}
		<button @click="sayHello">click</button>
		<PostItem
			type="news"
			title="제목"
			contents="내용"
			is-like="true"
		></PostItem>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import PostItem from '@/components/setup/PostItem.vue';
//components:{} 를 선언하지 않아도 된다.

const msg = 'Hello World!!';
const message = ref('');
const sayHello = () => alert('Hello');

//return이 없어도 사용이 가능하다.
</script>

<style lang="scss" scoped></style>

<!-- props, emit 선언 변경 __ setupPostItem.vue -->
<template>
	<div class="card">
		<div class="card-body">
			<!-- type: news, notice -->
			<span class="badge bg-secondary">
				{{ typeName }}
			</span>
			<h5 class="card-title red" mt-2>{{ title }}</h5>
			<p class="card-text">
				{{ contents }}
			</p>
			<a ref="" href="#" :class="isLikeClass" @click="toggleLike">좋아요</a>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
	type: {
		type: String,
		default: 'news',
		validator: value => {
			return ['news', 'notice'].includes(value);
		},
	},
	title: {
		type: String,
		required: true,
	},
	contents: {
		type: String,
		// required: true,
	},
	isLike: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['toggle-like']);

const isLikeClass = computed(() =>
	props.isLike ? 'btn btn-danger' : 'btn btn-outline-danger',
);

const typeName = computed(() => (props.type === 'news' ? '뉴스' : '공지사항'));

const toggleLike = () => {
	emit('toggle-like');
};
</script>

<style scoped></style>

<!-- 
  [ 동적 컴포넌트 ] _ DynamicComponent.vue
	 - 컴포넌트를 동적으로 변경하고 싶을 때 :is 속성을 사용해서 변경할 수 있다. ( 기존의 view-link 전환 및 v-if로 컴포넌트 전환 대체)
			-> <component :is="컴포넌트 이름"></component>
	 - 


 -->

/* eslint-enable */
