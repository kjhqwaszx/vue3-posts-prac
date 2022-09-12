<template>
	<div>
		<ul class="nav justify-content-center">
			<li class="nav-item">
				<router-link
					:to="{ name: 'NestedOne', replace: true }"
					class="nav-link"
					active-class="active"
				>
					Nested One
				</router-link>
			</li>
			<li class="nav-item">
				<router-link
					:to="{ name: 'NestedTwo', replace: true }"
					class="nav-link"
					active-class="active"
				>
					Nested Two
				</router-link>
			</li>
		</ul>
		<hr class="my-4" />
		<router-view></router-view>
	</div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
