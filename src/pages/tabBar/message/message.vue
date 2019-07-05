<template>
	<view class="message-container">
		<template v-if="accountType === 'GROUP'">
			<message-group ref="messageGroup"></message-group>
		</template>
		<template v-else-if="accountType === 'BRANCH'">
			<message-branch ref="messageBranch"></message-branch>
		</template>
		<template v-else-if="accountType === 'SUPPLIER'">
			<message-supplier ref="messageSupplier"></message-supplier>
		</template>
		<template v-else>
			<view class="default">没有您匹配到您账户信息</view>
		</template>
	</view>
</template>

<script>
	import messageGroup from '../../group/message/message.vue'
	import messageBranch from '../../branch/message/message.vue'
	import messageSupplier from '../../supplier/message/message.vue'
	
	const accountTypeObj = {
		GROUP: 'Group',
		BRANCH: 'Branch',
		SUPPLIER: 'Supplier'
	}
	export default {
		name: 'message',
		components: {
			messageGroup,
			messageBranch,
			messageSupplier
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
		onNavigationBarButtonTap(e) { //监听原生标题栏按钮点击事件
			const buttonIndex = e.index;
			const accountType = accountTypeObj[this.accountType];
			const currentMessageComponentName = 'message' + accountType;
			this.$refs[currentMessageComponentName].handleNavigationBarButtonTap(buttonIndex);
		},
		onReachBottom() { //页面上拉触底事件的处理函数
			const accountType = accountTypeObj[this.accountType];
			const currentMessageComponentName = 'message' + accountType;
			this.$refs[currentMessageComponentName].loadMore();
		},
        onPullDownRefresh() { //下拉刷新
            const accountType = accountTypeObj[this.accountType];
            const currentMessageComponentName = 'message' + accountType;
            Promise.all([
                this.$refs[currentMessageComponentName].init('system'),
                this.$refs[currentMessageComponentName].init('demand'),
                this.$refs[currentMessageComponentName].init('order')])
                .then(val => {
                    uni.stopPullDownRefresh()
                })
                .catch(error => {
                    uni.showToast({
                    	title: '刷新失败，请检查网络'
                    })
                })
        },
		methods: {
			
		}
	}
</script>

<style lang="scss">
</style>
