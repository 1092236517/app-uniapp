<template>
	<view class="joint-list-wrapper">
		<view class="nav-wrapper">
			<view
				class="nav-item"
				v-for="(item, index) in navList"
				:key="index"
				:class="{active: index === activeIndex}"
				@click="toggleNav(index)">
				{{ item.label }}
			</view>
		</view>
		<view class="demand-list-content" :class="{show: activeIndex === 0}">
			<template v-if="accountType === 'GROUP'">
				<demand-list-group ref="demandListGroup"></demand-list-group>
			</template>
			<template v-else-if="accountType === 'BRANCH'">
				<demand-list-branch ref="demandListBranch"></demand-list-branch>
			</template>
			<template v-else-if="accountType === 'SUPPLIER'">
				<demand-list-supplier ref="demandListSupplier"></demand-list-supplier>
			</template>
			<template v-else>
				<view class="default">没有您匹配到您账户信息</view>
			</template>
		</view>
		<view class="order-list-content" :class="{show: activeIndex === 1}">
			<template v-if="accountType === 'GROUP'">
				<order-list-group ref="orderListGroup"></order-list-group>
			</template>
			<template v-else-if="accountType === 'BRANCH'">
				<order-list-branch ref="orderListBranch"></order-list-branch>
			</template>
			<template v-else-if="accountType === 'SUPPLIER'">
				<order-list-supplier ref="orderListSupplier"></order-list-supplier>
			</template>
			<template v-else>
				<view class="default">没有您匹配到您账户信息</view>
			</template>
		</view>
	</view>
</template>

<script>
	import demandListGroup from '../../group/demand/list/list.vue'
	import demandListBranch from '../../branch/demand/list/list.vue'
	import demandListSupplier from '../../supplier/demand/list/list.vue'
	import orderListGroup from '../../group/order/list/list.vue'
	import orderListBranch from '../../branch/order/list/list.vue'
	import orderListSupplier from '../../supplier/order/list/list.vue'
	
	export default {
		name: 'joint-list',
		components: {
			demandListGroup,
			demandListBranch,
			demandListSupplier,
			orderListGroup,
			orderListBranch,
			orderListSupplier
		},
		data() {
			return {
				navList: [
					{
						label: '联采需求订单'
					},
					{
						label: '联采批次订单'
					}
				],
				activeIndex: 0
			}
		},
		computed: {
			accountType() {
				return this.$store.state.accountType
			}
		},
		onShow() {
			const type = this.$store.state.jointListType;
            let accountTypeObj = {
            	'GROUP': 'Group',
            	'BRANCH': 'Branch',
            	'SUPPLIER': 'Supplier'
            }
            let accountType = accountTypeObj[this.accountType];
			if(type) { //初始化tab
				this.activeIndex = type === 'order' ? 1 : 0;
				this.$store.commit('saveJointListType', '') //重置联采列表type
			}
            // #ifdef APP-PLUS
            this.$refs['demandList' + accountType].init();
            this.$refs['orderList' + accountType].init();
            // #endif
            // #ifdef H5
            setTimeout(() => {
                this.$refs['demandList' + accountType].init();
                this.$refs['orderList' + accountType].init();
            }, 0)
            // #endif
		},
		onReachBottom() {
			let type = this.activeIndex === 0 ? 'demand' : 'order';
			let accountTypeObj = {
				'GROUP': 'Group',
				'BRANCH': 'Branch',
				'SUPPLIER': 'Supplier'
			}
			let accountType = accountTypeObj[this.accountType];
			let currentListComponetName = type + 'List' + accountType;
			this.$refs[currentListComponetName].loadMore(); //加载更多
		},
		methods: {
			toggleNav(index) { //导航栏切换
				this.activeIndex = index;
			}
		}
	}
</script>

<style lang="scss">
	.joint-list-wrapper {
		.nav-wrapper {
			display: flex;
			justify-content: center;
			font-size: 24upx;
			padding: 20upx 0;
			background: #fff;
			.nav-item {
				width: 200upx;
				height: 50upx;
				line-height: 50upx;
				color: $uni-color-primary;
				border: 1px solid $uni-color-primary;
				box-sizing: border-box;
				text-align: center;
			}
			.active {
				background: $uni-color-primary;
				color: #fff;
			}
		}
		.demand-list-content,
		.order-list-content{
			display: none;
			.default{
				padding: 10upx;
				font-size: 30upx;
				color: #666;
				text-align: center;
			}
		}
		.show {
			display: block;
		}
	}
</style>
