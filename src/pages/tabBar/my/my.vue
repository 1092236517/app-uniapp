<template>
	<view class="my-wrapper">
		<template v-if="accountType === 'GROUP'">
			<my-group ref="myGroup"></my-group>
		</template>
		<template v-else-if="accountType === 'BRANCH'">
			<my-branch ref="myBranch"></my-branch>
		</template>
		<template v-else-if="accountType === 'SUPPLIER'">
			<my-supplier ref="mySupplier"></my-supplier>
		</template>
		<template v-else>
			<view class="default">没有您匹配到您账户信息</view>
		</template>
	</view>
</template>

<script>
	import myGroup from '../../group/my/my.vue'
	import myBranch from '../../branch/my/my.vue'
	import mySupplier from '../../supplier/my/my.vue'
	
	export default {
		name: 'my',
		components: {
			myGroup,
			myBranch,
			mySupplier,
		},
		data() {
			return{
				
			}
		},
		computed: {
			accountType() {
				return this.$store.state.accountType
			}
		},
		
	}
</script>

<style lang="scss">
</style>
