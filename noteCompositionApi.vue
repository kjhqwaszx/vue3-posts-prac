/* eslint-disable */

<!-- 
	
	[ Options API vs Composition API ]
	- Composition API는 옵션(data, methods, ... )을 선언하는 대신 가져온 함수(ref, onMounted, ...)를 사용하여 Vue 컴포넌트를 작성할 수 있는 API 세트를 말한다.
	- 기존의 Options은 data 선언부, methods 선언부가 나눠져 있어 해당 data를 처리하는 로직을 찾기가 쉽지 않다 ( 스크롤링을 계속 해야함 ), 하지만 Composition는 그럴 필요가 없다. 
	  * 데이터 선언, 처리 로직이 모여있기 때문에 유틸이나 모듈로 빼 재사용하기 편하다. ( Composable 함수 라고 부름) -> Mixin의 모든 단점을 해결

		-->

<!-- Optionsal -->

<template>
	<div>
		<button v-on:click="increment">Counter: {{ counter }}</button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			counter: 0,
		};
	},
	methods: {
		increment() {
			this.counter++;
		},
	},
	mounted() {
		console.log('컴포넌트가 마운트 되었습니다!');
	},
};
</script>

<style lang="scss" scoped></style>

<!-- Composition -->

<template>
	<div>
		<button v-on:click="increment">Counter: {{ counter }}</button>
	</div>
</template>

<script>
import { onBeforeMount, onMounted, ref } from 'vue';
export default {
	setup() {
		const counter = ref(0);
		const increment = () => counter.value++;
		onMounted(() => {
			console.log('컴포넌트가 마운트 되었습니다!');
		});
		return {
			counter,
			increment,
		};
	},
};
</script>

<style lang="scss" scoped></style>

<!-- 
	[ CompositonAPI의 Reactive ]
  - API의 성격에 따라 아래와 같이 나뉘어진다.
	0. setup()
	  * 가장 빠른 시점 으로 첫번째 인자로 props, 두번째 인자로 context가 온다.
	1. Reactivity API ( 반응형 API)
	   * ref(), reactive(), reactive state(반응상태), computed, state(계산된상태), watchers(감시자) 등...
	2. Lifecycle Hooks
	   * onMounted(), onUnmounted() 등...
	3. D/I 
		 * provide(), inject() 등 ...
	
	-->

<!-- 1.1 ref -->

<template>
	<div>Hello Vue3</div>
	<h2>반응형 메시지</h2>
	<!-- 변경 가능 -->
	<p>{{ reactiveMessage }}</p>
	<button @click="addReactiveMessage">Add Message</button>

	<h2>일반 메시지</h2>
	<!-- 변경 불가능 -->
	<p>{{ normalMessage }}</p>
	<button @click="addNormalMessage">Add Message</button>
</template>

<script>
import { isRef, ref } from 'vue'; // import 필수

export default {
	setup() {
		// setup()에서 선언한 값들은 return 해줘야 사용가능하다.
		console.log('setup()');

		const reactiveMessage = ref('Hello Reactive Message'); //반응형 객체로 만들어 준 것이다. reactiveMessage.value로 접근
		const addReactiveMessage = () => {
			reactiveMessage.value = reactiveMessage.value + '!';
		};

		let normalMessage = 'Hello Reactive Message'; // 정적인 변수이므로 변경이 불가능
		const addNormalMessage = () => {
			normalMessage = normalMessage + '!';
		};

		console.log(isRef(reactiveMessage)); // 반응형 객체인지를 확인

		onMounted(() => {
			console.log('onMounted');
		});

		onBeforeMount(() => {
			console.log('onBeforeMounted');
		});

		return {
			reactiveMessage,
			normalMessage,
			addReactiveMessage,
			addNormalMessage,
		};
	},
};
</script>
<style scoped></style>

<!-- 

	1.2 reactive()
	  - ref()는 String, Numver, boolean 타입으로 선언할 때 사용하고, reactive()는 객체나 배열 타입을 반응형으로 만들 수 있다.

-->
<script>
import { reactive } from 'vue';

export default {
	setup() {
		const state = reactive({
			count: 0,
			deep1: {
				count: 0,
			},
		});

		const increment1 = () => {
			state.count++;
		};
		const increment2 = () => {
			state.deep1.count++;
		};

		return {
			state,
			increment1,
			increment2,
		};
	},
};
</script>

<!-- 
	1.2.1 ref()로 선언한 변수를 reactive()에 추가하기.
-->
<script>
import { reactive, ref } from 'vue';
export default {
	setup() {
		const count = ref(1);

		// ref()로 선언한 number형 count를 객체 형식의 reactive로 만들때는 recObj.count 뒤에 .value를 붙이지 않아도 된다.
		const recObj = reactive({
			count,
		});
		console.log('##1 recObj: ', recObj.count); // 1

		// 반면에 배열 형식의 reactive로 만들 때는 recArr[0]뒤에 .value를 붙여야 접근 가능하다.
		const recArr = reactive([count]);
		console.log('##2 recArr', recArr[0]); // 1

		return {
			count,
			recObj,
			recArr,
		};
	},
};
</script>

<!-- 
	1.2.2 reactive() ref()로 선언한 변수를 reactive()에 추가하기.
-->
<template>
	<div>
		<p>{{ author }}</p>
		<p>{{ title }}</p>
	</div>
</template>

<script>
import { reactive, ref, toRef, toRefs } from 'vue';
export default {
	setup() {
		const book = reactive({
			author: 'Vue Team',
			year: '2022',
			title: 'Vue 3 Guide',
			price: '무료',
		});

		const { author, title } = toRefs(book); // book의 author, title을 ref타입으로 만든다.

		// const author = toRef(book,'author')  // 하나씩 바꿀 때는 toRef 사용
		// const title = toRef(book, 'title')

		return {
			book,
			author,
			title,
		};
	},
};
</script>

<!-- 
	1.2.3 reactive() 객체를 변경 불가능 하도록 readonly로 만들기
-->

<script>
import { reactive, readonly } from 'vue';
export default {
	setup() {
		const original = reactive({
			count: 0,
		});
		original.count++;

		const copy = readonly(original);
		copy.count++; // vue Warn

		return {
			original,
			copy,
		};
	},
};
</script>

<!-- 
	1.3 computed()
	  - 계산된 속성 값
-->

<template>
	<div>
		<h2>{{ teacher.name }}</h2>
		<h3>강의가 있습니까?</h3>
		<p>{{ hasLecture }}</p>
	</div>
</template>

<script>
import { computed, reactive, ref } from 'vue';
export default {
	setup() {
		const teacher = reactive({
			name: '짐코딩',
			lecture: ['HTML', 'CSS', 'JavaScript', 'Vue3'],
		});

		// ** 화살표 함수에서 return 값이 있고 한줄이면 {}, return 생략 가능
		const hasLecture = computed(() =>
			teacher.lecture.length > 0 ? '있음' : '없음',
		);
		/*
		const hasLecture = computed(() => {
			// callback 함수로 return
			return teacher.lecture.length > 0 ? '있음' : '없음';
		});
*/
		//computed()는 기본적으로 getter 전용이지만 새로운 계산된 속성이
		//필요할 경우 setter를 적용할 수 있다.
		const firstName = ref('홍');
		const lastName = ref('길동');
		const fullName = computed({
			get() {
				return firstName.value + lastName.value;
			},
			set(value) {
				console.log('value: ', value); // '짐 코딩'
				[firstName.value, lastName.value] = value.split(' '); // 파라메터를 구조분해 시킨다. ( first : '짐', last: '코딩')
				// -> firstName과 lastName을 const로 선언했기 때문에 앞에 let, const를 붙이지 못한다.
			},
		});

		console.log('Before fullName: ', fullName.value); // 홍길동

		// computed 변수의 setter 호출 방법.
		fullName.value = '짐 코딩';

		console.log('After fullName: ', fullName.value); // 짐코딩

		return {
			teacher,
			hasLecture,
			fullName,
		};
	},
};
</script>

<!-- 
	[ Class 바인딩 ]
	  - 조건에 따라 Class를 주입할 수 있다.
-->
<template>
	<div>
		<!-- class 바인딩은 기본 class와 같이 사용이 가능하며 ','로 연결해서 여러개의 class명(active, text-danger)을 주입할 수 있다.-->
		<!-- isActive가 true일 경우 class 명이 active가 된다. -->
		<div class="text" :class="{ active: isActive, 'text-danger': hasError }">
			텍스트 입니다.
		</div>
		<!-- 주입하는 클레스가 많을경우 객체로 바인딩이 가능하다. -->
		<div class="text" :class="classObject">[객체 바인딩]텍스트 입니다.</div>

		<button @click="toggle">toggle Active</button>
		<button @click="hasError = !hasError">toggle Error</button>
	</div>
</template>

<script>
import { computed, ref } from 'vue';

export default {
	setup() {
		const isActive = ref(true);
		const hasError = ref(false);

		const toggle = () => {
			isActive.value = !isActive.value;
		};

		const classObject = computed(() => {
			return {
				active: isActive.value,
				'text-danger': hasError.value,
			};
		});

		console.log(classObject['text-danger']);
		return {
			isActive,
			toggle,
			hasError,
			classObject,
		};
	},
};
</script>

<style scoped>
.active {
	font-weight: 900;
}
.text-danger {
	color: red;
}
</style>

<!-- 
	[ in-line Style 바인딩 ]
	  - 조건에 따라 style 값을 변경할 수 있다.
-->

<template>
	<div>
		<div :style="styleObject">
			Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi rem
			magnam at ratione. Maxime iste aliquam quaerat consequuntur cum eaque
			architecto eum non ducimus praesentium animi nesciunt consectetur, tempore
			nobis!
		</div>
		<!-- 버튼에 따라 글자 크기가 변경된다. -->
		<button @click="fontSize++">+</button>
		<button @click="fontSize--">-</button>
	</div>
</template>

<script>
import { computed, ref } from 'vue';
export default {
	setup() {
		const fontSize = ref(15);

		// const styleObject = reactive({
		// 	color: 'red',
		// 	fontSize: '13px',
		// });

		const styleObject = computed(() => {
			return {
				color: 'red',
				fontSize: fontSize.value + 'px',
			};
		});

		return {
			fontSize,
			styleObject,
		};
	},
};
</script>

<style lang="scss" scoped></style>

<!-- 
	[ v-on 이벤트 처리: target 및 input 태그 누른 키 확인]
	  - https://www.gymcoding.co/4f1190043f28407686cd11c1f9e464c9 
-->

<template>
	<div>
		<button @click="printEventInfo('Hello Vue3', $event)">
			inline event handler
		</button>

		<input type="text" @keyup="onKeyupHnadler" />
	</div>
</template>

<script>
export default {
	setup() {
		const printEventInfo = (message, event) => {
			console.log('message', message);
			console.log('event.target', event.target); // <button>inline event handler</button>
			console.log('event.target.tagName', event.target.tagName); // BUTTON
		};

		const onKeyupHnadler = event => {
			console.log('event.key ', event.key); // 입력한 key들이 출력된다.
			if (event.key === 'g') alert('g clicked');
		};

		return {
			printEventInfo,
			onKeyupHnadler,
		};
	},
};
</script>

<style lang="scss" scoped></style>

<!-- 
	[ v-on 이벤트 처리: 이벤트 수식어]
	  - https://www.gymcoding.co/4f1190043f28407686cd11c1f9e464c9
-->

<template>
	<div>
		<div id="modifiers">
			<div @click="clickDiv">
				DIV 영역
				<p @click="clickP">
					P 영역
					<!-- 이벤트 전파를 방지한다. -->
					<span @click.stop="clickSpan"> SPAN 영역 </span>
				</p>
			</div>
		</div>
		<!-- 특정 태그의 기능을 막을 수 있다. ( a태그의 경우 링크 이동을 막는다. ) -->
		<a href="https://naver.com" @click.prevent="clickA"> a 영역</a>
	</div>
</template>

<script>
export default {
	/**
	 * span 태그 영역을 선택 할 경우 이벤트 전파에 의해
	 * span -> p -> div 순으로 console이 찍히게 된다.
	 * 이벤트가 전파되는것을 막기 위해 @click.stop을 사용할 수 있다.
	 * 특정 태그의 기능을 막고 싶을때에는 @click.prevent를 사용할 수 있다.
	 *   -> @click.prevent.stop 이렇게도 사용이 가능
	 * .capture, .self, .once 등 다양한 기능들이 있다.
	 * */

	setup() {
		const clickDiv = () => {
			console.log('click Div');
		};
		const clickP = () => {
			console.log('click P');
		};
		const clickSpan = () => {
			console.log('click Span');
		};
		const clickA = () => {
			alert('@click.prevent로 이동 막기!');
		};
		return {
			clickDiv,
			clickP,
			clickSpan,
			clickA,
		};
	},
};
</script>

<style scoped>
#modifiers div,
#modifiers p,
#modifiers span {
	padding: 40px;
}
#modifiers div {
	background-color: #ccc;
}
#modifiers p {
	background-color: #999;
}
#modifiers span {
	background-color: #666;
	display: block;
}
</style>

<!-- 
	[ v-on 이벤트 처리: 눌린 키 확인]
	  - https://www.gymcoding.co/4f1190043f28407686cd11c1f9e464c9
-->
<template>
	<div>
		<!-- .enter, tab, delete(backspace 포함), esc, space, up, down, left, right 등 ... -->
		<input type="text" @keyup.enter="addTodo" />
		<ul>
			<li v-for="(todo, index) in todos" :key="index">
				{{ todo }}
			</li>
		</ul>
	</div>
</template>

<script>
import { reactive } from 'vue';
export default {
	setup() {
		const todos = reactive([]);
		const addTodo = event => {
			//event.target.value 에서는 enter, control, alt 등은 인식 불가. ( evnet.key로 확인 가능)
			// if (event.key === 'Enter')
			// 이렇게 눌린 key에 따라 분기가 가능하지만 주로 @keyup.enter 로 사용한다.
			// @keyup.enter.ctrl 이렇게 두개가 동시에 눌려야 사용 가능하게도 할 수 있다.

			todos.push(event.target.value);
			event.target.value = '';
			event.target.focus();
		};
		return {
			todos,
			addTodo,
		};
	},
};
</script>

<style lang="scss" scoped></style>

<!-- 
	[ v-model 데이터 양방향 바인드]
	  - html 태그별 데이터 바인딩 처리
-->
<template>
	<div>
		<h2>input value</h2>
		<!--
			입력값을 number형으로 바꾸거나, 앞뒤 공백을 바로 지울 수 있다. 
			<input type="text" v-model.number="inputValue" />
			<input type="text" v-model.trim="inputValue" />
		 -->
		<input type="text" v-model="inputValue" />
		<div>{{ inputValue }}</div>

		<h2>checkbox value</h2>
		<input type="checkbox" v-model="checkboxValue" />
		<div>{{ checkboxValue }}</div>

		<h2>radiobox value</h2>
		<label>
			<input type="radio" name="type" value="O" v-model="radioValue" />
			O형
		</label>
		<label>
			<input type="radio" name="type" value="A" v-model="radioValue" />
			A형
		</label>
		<div>{{ radioValue }}</div>

		<h2>select value</h2>
		<select v-model="selectValue">
			<option value="html">HTML 수업</option>
			<option value="css">CSS 수업</option>
			<option value="javascript">JavaScript 수업</option>
		</select>
		<div>{{ selectValue }}</div>
	</div>
</template>

<script>
import { ref } from 'vue';

export default {
	setup() {
		const inputValue = ref(null);
		const checkboxValue = ref(true);
		const radioValue = ref('O');
		const selectValue = ref('');

		return {
			inputValue,
			checkboxValue,
			radioValue,
			selectValue,
		};
	},
};
</script>

<style lang="scss" scoped></style>

<!-- 
	1.4 watch()
	  - computed()와 비슷한 기능이지만, computed()는 변경을 가지하여 계산 정도의 작업을 할 대 사용하고
		  watch()는 call api, push route 등을 취하고자 할 때 주로 사용한다.
			
	  - 반응형 상태가 변경될때를 감지해 작업을 수행한다.
		watch(감지대상, (newValue, oldValue) =>{
			console.log('newValue', newValue)
			console.log('oldValue', oldValue)
		} )
-->

<template>
	<div></div>
</template>

<script>
import { reactive, ref, watch } from 'vue';
export default {
	setup() {
		const obj = reactive({
			count: 0,
		});
		const x = ref(0);
		const y = ref(0);

		// 감시 대상에는 ref(), reactive(), getter, Array 함수 등이 올 수 있다.
		//getter는 감시할 대상을 조합할 수 있음. ex) x.value + y.value

		// return 한줄이므로 아래와 같이 생략 가능
		// watch(() => {
		// 	return x.value + y.value;
		// });

		// watch(() => x.value + y.value, (new,old)=> {~~})

		/**
		 * 1. 감시대상: reactive Obj
		 * obj의 count 속성만의 변화감지는 불가능하다. ( obj는 reactive형 이지만 obj.number는 number형이다.)
		 * 감지가 필요한 경우 getter함수를 사용 '() => obj.count' 를 감지대상 부분에 작성
		 */
		watch(obj, (newObj, oldObj) => {
			console.log('newObj.count ', newObj.count);
			console.log('oldOjb.count ', oldObj.count); // newObj와 동일한 값이 찍힌다.
		});

		/**
		 * 2. 감시대상: getter 함수
		 */
		// watch(
		// 	() => x.value + y.value,
		// 	(sum, oldValue) => {
		// 		// oldValue는 필요 없을 경우에는 'sum => {}' 이런식으로 하나만 사용해도 된다.
		// 		console.log('sum: ', sum);
		// 		console.log('oldValue: ', oldValue);
		// 	},
		// );

		/**
		 * 3.감시대상: Array
		 */

		// watch([x, y], ([newX, newY]) => {
		// 	console.log('newX ', newX);
		// 	console.log('newY ', newY);
		// });

		return {
			x,
			y,
			obj,
		};
	},
};
</script>

<style lang="scss" scoped></style>

/* eslint-enable */
