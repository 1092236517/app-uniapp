<template>
	<view class="home-wrapper">
		<view class="home-bg-view">
			<image src="../../../static/images/supplier/home/background.png" class="home-bg"></image>
			<view class="btn-wrapper">
				<view class="content">
					<view class="btn" @click="viewReceiveInfoList">
						<text class="iconfont icon">&#xe62e;</text>
						<text>收款信息列表</text>
					</view>
				</view>
			</view>
		</view>
		<view class="content-view">
			<view class="content-item" >
				<view class="icon">
					<image src="../../../static/images/supplier/home/demand.png"></image>
					<view class="tip" v-if="demandTipCount > 0">
						{{ demandTipCountText }}
					</view>
				</view>
				<view class="desc">
					联采订单
				</view>
				<view class="btn" :class="{'btn-disable': demandTipCount === 0}" @click="view('demand')">
					点击进入
				</view>
			</view>
			<view class="content-item">
				<view class="icon">
					<image src="../../../static/images/supplier/home/order.png"></image>
					<view class="tip" v-if="orderTipCount > 0">
						{{ orderTipCountText }}
					</view>
				</view>
				<view class="desc">
					批次订单
				</view>
				<view class="btn" :class="{'btn-disable': orderTipCount === 0}" @click="view('order')">
					点击进入
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'home-supplier',
		data() {
			return {
				token: this.$store.state.token,
				demandTipCount: 0,
				orderTipCount: 0,
				demandId: '',
				demandPurchaseQuotePriceRecordId: '',
				orderId: '',
				slaveOrderId: '',
				slaveOrderNo: ''
			}
		},
		computed: {
			demandTipCountText() { //需求消息数
				const demandTipCount = parseInt(this.demandTipCount);
				let demandTipCountText = demandTipCount;
				if(demandTipCount > 99) {
					demandTipCountText = '99+'
				}
				return demandTipCountText
			},
			orderTipCountText() { //订单消息数
				const orderTipCount = parseInt(this.orderTipCount);
				let orderTipCountText = orderTipCount;
				if(orderTipCount > 99) {
					orderTipCountText = '99+'
				}
				return orderTipCountText
			}
		},
		// created() {
		// 	this.getOperateCount();
		// },
  //       onShow() {
  //       	this.getOperateCount();
  //       },
		methods: {
			viewJonitList(type) { //查看联采列表
				this.$store.commit('saveJointListType', type)
				uni.switchTab({
					url: '/pages/tabBar/joint-list/joint-list'
				})
			},
			viewDetail(type) { //查看联采详情
				if(type === 'demand') { //跳转到需求详情页
					uni.navigateTo({
						url: `/pages/supplier/demand/detail/detail?demandPurchaseQuotePriceRecordId=${this.demandPurchaseQuotePriceRecordId}`
					})
				}else {
					uni.navigateTo({ //跳转到批次订单详情页
						url: `/pages/supplier/order/slave-order/detail/detail?orderId=${this.orderId}&slaveOrderNo=${this.slaveOrderNo}&slaveOrderId=${this.slaveOrderId}`
					})
				}
			},
			view(type) { //查看
				if(this[type + 'TipCount'] > 1) { //列表
					this.viewJonitList(type)
					return
				}
				if(this[type + 'TipCount'] === 1) { //详情
					this.viewDetail(type)
					return
				}
			},
            viewReceiveInfoList() { //查看收款账户列表
                uni.navigateTo({
                	url: '/pages/supplier/receive-info/receive-info-list/receive-info-list'
                })
            },
			getOperateCount() { //获取待操作的数量
				const params = {
					token: this.token
				}
				this.$api.supplierHomeApi.operateCount(params)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							const demandInfo = result.response.demandDetail;
							const slaveOrderInfo = result.response.slaveOrderDetail;
							this.demandTipCount = result.response.demand;
							this.orderTipCount = result.response.slaveorder;
							if(demandInfo) { //待操作数量为1时，有该需求的详情
								this.demandId = demandInfo.id;
								this.demandPurchaseQuotePriceRecordId = demandInfo.purchase_demand.demand_purchase_quoted_price_records[0].id;
							}
							if(slaveOrderInfo) { //待操作数量为1时，有该订单的详情
								this.slaveOrderId = slaveOrderInfo.id;
								this.slaveOrderNo = slaveOrderInfo.order_no;
								this.orderId = slaveOrderInfo.master_order_id;
							}
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
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none'
						})
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.home-wrapper {
		.home-bg-view {
			position: relative;
			width: 100%;
			height: 810upx;
			.home-bg {
				width: 100%;
				height: 100%;
			}
			.btn-wrapper {
				position: absolute;
				left: 0;
				bottom: -48upx;
				width: 100%;
				box-sizing: border-box;
				padding: 0 30upx;
				z-index: 9;
				.content {
					display: flex;
                    justify-content: center;
					width: 100%;
					height: 48upx;
					background: #fff;
					border-radius: 4px;
					padding: 24upx 0;
					font-size: 28upx;
					color: #333;
					.btn {
						display: flex;
						justify-content: center;
						align-items: center;
						width: 50%;
						font-weight: 600;
// 						&:first-child {
// 							border-right: 1px solid #999;
// 						}
						.icon {
							font-size: 30upx;
							color: $uni-color-primary;
							margin-right: 20upx;
							font-weight: 400;
						}
					}
				}
			}
		}
		.content-view {
			display: flex;
			justify-content: space-between;
			width: 100%;
			padding: 20upx;
			box-sizing: border-box;
			margin-top: 48upx;
			.content-item {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 345upx;
				height: 345upx;
				background: #fff;
				font-size: 24upx;
				font-weight: 600;
				color: #333;
				border-radius: 4px;
				.icon{
					position: relative;
					width: 75upx;
					height: 72upx;
					image {
						width: 100%;
						height: 100%;
					}
					.tip {
						position: absolute;
						top: -15upx;
						right: -15upx;
						width: 30upx;
						height: 30upx;
						line-height: 30upx;
						border-radius: 50%;
						background: #EE1E1E;
						color: #fff;
						font-size: 20upx;
						font-weight: 400;
						text-align: center;
					}
				}
				.desc {
					margin-top: 20upx;
				}
				.btn {
					margin-top: 30upx;
					width: 164upx;
					height: 44upx;
					line-height: 44upx;
					text-align: center;
					color: #fff;
					background: $uni-color-primary;
					border-radius: 4px;
					&.btn-disable {
						background: #ccc;
					}
				}
			}
		}
	}
</style>
