<template>
	<view class="select-payment-type-wrapper">
		<view class="main">
			<view class="list">
				<checkbox-group @change="handleSelectChange">
					<label
						v-for="(item, index) in paymentList"
						:key="index"
						class="checkbox-item"
						:class="{'checkbox-item-active': item.checked}">
						<checkbox
							:value="item.value" 
							color="#0066cc"
							:checked="item.checked" />
						<view class="desc">
							{{ item.label }}
						</view>
					</label>
				</checkbox-group>
			</view>
			<view class="add-view" @click="addPaymentType">
				<text class="icon">+</text>
				<text class="text">添加付款方式</text>
			</view>
			<template v-if="currentPage >= totalPage">
				<zn-no-more></zn-no-more>
			</template>
		</view>
		<view class="button-wrapper">
			<view class="button" @click="push">推送</view>
		</view>		
	</view>
</template>

<script>
	import znNoMore from '../../../../components/zn-no-more.vue'
	export default {
		name: 'select-payment-type-wrapper',
		components: {
			znNoMore
		},
		data() {
			return {
				loading: false,
				token: this.$store.state.token,
				demandPurchaseId: '',
				paymentList: [],
				paymentSelectedList: [],
				currentPage: 1,
				total: 0,
				perPage: 20
			}
		},
		computed: {
			totalPage() { //总页数
				return Math.ceil(this.total / this.perPage)
			}
		},
		onLoad(option) {
			this.demandPurchaseId = option.demandPurchaseId;
		},
		onShow() {
            this.currentPage = 1; //重置当前页
            this.paymentList = []; //重置支付列表
            this.total = 0; //重置总数
			this.getPaymentList();
		},
		onHide() {
			console.log('page hide')
		},
		onReachBottom() { //页面上拉触底事件的处理函数
			this.loadMore();
		},
		methods: {
			handleSelectChange(event) { //选中项改变
				const selectedArr = event.detail.value;
				this.paymentSelectedList = [...selectedArr];
				this.paymentList.forEach((item, index) => {
					item.checked = false;
					selectedArr.forEach((selectedItem, selectedIndex) => {
						if(item.value === selectedItem) {
							item.checked = true;
						}
					})
				})
			},
			addPaymentType() { //添加付款方式
				uni.navigateTo({
					url: '/pages/group/add-payment-type/add-payment-type'
				})
			},
			getPaymentList() { //获取付款方式列表
				const params = {
					token: this.token,
					per_page: this.perPage,
					current_page: this.currentPage,
					status: 'VISIBLE'
				};
				this.loading = true;
				uni.showLoading({
					title: '加载中'
				})
				this.$api.groupDemandApi.paymentList(params)
					.then(res => {
						const result = res.data;
						this.loading = false;
						uni.hideLoading();
						if(result.msg_code === 100000) {
							const paymentArr = result.response.data;
							this.total = result.response.total;
							paymentArr.forEach((item, index) => {
								let payment = {
									label: item.description,
									value: item.id.toString(), //String类型
									payType: item.pay_type,
									checked: false
								};
								this.paymentList.push(payment);
							})
						}
					})
					.catch(err => {
						console.log(err);
						this.loading = false;
						uni.hideLoading();
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none'
						})
					})
			},
			loadMore() { //加载更多
				if(this.loading) {
					return false
				}
				if(this.currentPage >= this.totalPage) {
					return false
				}
				this.currentPage += 1;
				this.getPaymentList();
			},
			push() { //推送供应商
				if(this.paymentSelectedList.length === 0) {
					uni.showToast({
						title: '请选择支付方式！',
						icon: 'none'
					})
					return false
				}
				const params = {
					token: this.token,
					member_ids: this.$store.state.selectedSupplierIdList,
					demand_purchase_id: this.demandPurchaseId,
					pay_type: JSON.stringify(this.paymentSelectedList)
				}
                uni.showLoading({
                	title: '提交中',
                	mask: true
                });
				this.$api.groupDemandApi.push(params)
					.then(res => {
                        uni.hideLoading();
						const result = res.data;
						if(result.msg_code === 100000) {
							this.$store.commit('saveSelectedSupplierIds', []) //清空store里保存的已选供应商id
                            this.$func.asyncShowToast({
                                title: '推送成功',
                                icon: 'success',
                                duration: 3000
                            })
                            .then(val => {
                                uni.switchTab({
                                	url: '/pages/tabBar/joint-list/joint-list'
                                })
                            })
						}else {
							console.log(result);
							uni.showToast({
								title: result.message,
								icon: 'none'
							})
						}
					})
					.catch(err => {
						console.log(err);
						uni.hideLoading();
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none'
						})
					})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%
	}
	.select-payment-type-wrapper {
		height: 100%;
		.main {
			min-height: 100%;
			padding-bottom: 150upx;
			.list {
				padding: 0 30upx;
				background: #fff;
				.checkbox-item {
					display: flex;
					font-size: 28upx;
					height: 90upx;
					line-height: 90upx;
					color: #999;
					border-bottom: 1px solid #eee;
					.desc {
						margin-left: 30upx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
				.checkbox-item-active {
					color: $uni-color-primary;
				}
			}
			.add-view {
				width: 100%;
				height: 88upx;
				line-height: 88upx;
				color: $uni-color-primary;
				font-size: 28upx;
				text-align: center;
				background: #fff;
				.icon {
					display: inline-block;
					margin-right: 16upx;
				}
			}
		}
		.button-wrapper {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			box-sizing: border-box;
			background: #eee;
			.button {
				width: 100%;
				height: 88upx;
				line-height: 88upx;
				color: #fff;
				background: $uni-color-primary;
				font-size: 32upx;
				text-align: center;				
			}
		}
	}
</style>
