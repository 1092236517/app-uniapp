<template>
	<view class="home-container">
		<template v-if="accountType === 'GROUP'">
			<home-group ref="homeGroup"></home-group>
		</template>
		<template v-else-if="accountType === 'BRANCH'">
			<home-branch ref="homeBranch"></home-branch>
		</template>
		<template v-else-if="accountType === 'SUPPLIER'">
			<home-supplier ref="homeSupplier"></home-supplier>
		</template>
		<template v-else>
			<view class="default">没有您匹配到您账户信息</view>
		</template>
	</view>
</template>

<script>
	import homeGroup from '../../group/home/home.vue'
	import homeBranch from '../../branch/home/home.vue'
	import homeSupplier from '../../supplier/home/home.vue'
	
	export default {
		name: 'home',
		components: {
			homeGroup,
			homeBranch,
			homeSupplier
		},
		data() {
			return {
				
			}
		},
		computed: {
			accountType() {
				return this.$store.state.accountType
			}
		},
        onShow() {
            const accountTypeObj = {
            	'GROUP': 'Group',
            	'BRANCH': 'Branch',
            	'SUPPLIER': 'Supplier'
            }
            const accountType = accountTypeObj[this.accountType];
            if(!accountType) return
            // #ifdef APP-PLUS
            this.$refs['home' + accountType].getOperateCount();
            // #endif
            // #ifdef H5
            setTimeout(() => {
                this.$refs['home' + accountType].getOperateCount();
            }, 0)
            // #endif
        },
		methods: {
			
		}
	}
</script>

<style lang="scss">
</style>
