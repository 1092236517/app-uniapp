<template>
	<view class="home-wrapper">
        <template v-if="homeAuthObj.page.show">
        	<view class="home-bg-view">
        		<image src="../../../static/images/group/home/background.png" class="home-bg"></image>
        	</view>
        	<view class="title-view">
        		<view class="content">
        			<view class="line"></view>
        			<view class="title">
        				<text>待处理订单</text>
        			</view>
        		</view>
        	</view>
        	<view class="content-view">
        		<view v-if="demandTipCount > 0 && demandListAuthObj.page.show" class="content-item" @click="view('demand')">
        			<view class="icon">
        				<image src="../../../static/images/group/home/demand.png"></image>
        				<view class="tip">
        					{{ demandTipCountText }}
        				</view>
        			</view>
        			<view class="desc">
        				联采订单
        			</view>
        		</view>
        		<view v-if="orderTipCount > 0 && orderListAuthObj.page.show" class="content-item" @click="view('order')">
        			<view class="icon">
        				<image src="../../../static/images/group/home/order.png"></image>
        				<view class="tip">
        					{{ orderTipCountText }}
        				</view>
        			</view>
        			<view class="desc">
        				批次订单
        			</view>
        		</view>
        		<view class="no-result" v-if="demandTipCount === 0 && orderTipCount === 0">
        			没有需要操作的需求和订单
        		</view>
        	</view>
        	<view class="title-view" v-if="accountAuthObj.page.show">
        		<view class="content" @click="account">
        			<view class="line"></view>
        			<view class="title">
        				<text>账户管理</text>
        			</view>
        			<text class="iconfont icon">&#xe620;</text>
        		</view>
        	</view>
            <view class="title-view">
            	<view class="content" @click="viewPayInfoList">
            		<view class="line"></view>
            		<view class="title">
            			<text>支付信息列表</text>
            		</view>
            		<text class="iconfont icon">&#xe620;</text>
            	</view>
            </view>
            <view class="title-view">
            	<view class="content" @click="viewPaymentTypeList">
            		<view class="line"></view>
            		<view class="title">
            			<text>付款方式管理</text>
            		</view>
            		<text class="iconfont icon">&#xe620;</text>
            	</view>
            </view>
        </template>
		<template v-else>
			<view class="no-permission">请联系管理员配置权限</view>
		</template>
	</view>
</template>

<script>
	export default {
		name: 'home-group',
		data() {
			return {
				token: this.$store.state.token,
				demandTipCount: 120,
				orderTipCount: 0,
				demandId: '',
				orderId: '',
				slaveOrderId: '',
				slaveOrderNo: '',
                homeAuthObj: {
                    page: {
                        chName: '显示',
                        show: false
                    }
                },
                accountAuthObj: {
                    page: {
                        chName: '显示',
                        show: false
                    }
                },
                demandListAuthObj: {
                    page: {
                        chName: '显示',
                        show: false
                    }
                },
                orderListAuthObj: {
                    page: {
                        chName: '显示',
                        show: false
                    }
                }
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
		created() {
            this.getAuth();
		},
        // onShow() {
        // 	this.getOperateCount();
        // },
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
						url: `/pages/group/demand/detail/detail?demandId=${this.demandId}`
					})
				}else {
					uni.navigateTo({ //跳转到批次订单详情页
						url: `/pages/group/order/slave-order/detail/detail?orderId=${this.orderId}&slaveOrderNo=${this.slaveOrderNo}&slaveOrderId=${this.slaveOrderId}`
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
            viewPayInfoList() { //查看支付信息列表
                uni.navigateTo({
                	url: '/pages/group/payment-info/payment-info-list/payment-info-list'
                })
            },
            viewPaymentTypeList() { //查看付款方式列表
                uni.navigateTo({
                	url: '/pages/group/payment-type-manage/payment-type-manage'
                })
            },
			getOperateCount() { //获取待操作的数量
				const params = {
					token: this.token
				}
				this.$api.groupHomeApi.operateCount(params)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							const demandInfo = result.response.demandDetail;
							const slaveOrderInfo = result.response.slaveOrderDetail;
							this.demandTipCount = result.response.demand;
							this.orderTipCount = result.response.slaveorder;
							if(demandInfo) { //待操作数量为1时，有该需求的详情
								this.demandId = demandInfo.id;
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
			},
            getAuth() { //获取权限
                const indexPermissionObj = this.$store.getters.permissionList.MobileIndex;
                const accountPermissionObj = this.$store.getters.permissionList.MobileMyAccountInfo;
                const demandListPermissionObj = this.$store.getters.permissionList.MobileJointPurchaseOrderList;
                const orderListPermissionObj = this.$store.getters.permissionList.MobileSlaveOrderList;
                this.$func.getAuth(indexPermissionObj, this.homeAuthObj);
                this.$func.getAuth(accountPermissionObj, this.accountAuthObj);
                this.$func.getAuth(demandListPermissionObj, this.demandListAuthObj);
                this.$func.getAuth(orderListPermissionObj, this.orderListAuthObj);
            },
			account(){//账户管理
				uni.navigateTo({
					url: '/pages/group/payment-account/list/list'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.home-wrapper {
        padding-bottom: 20upx;
		.home-bg-view {
			position: relative;
			width: 100%;
			height: 660upx;
			.home-bg {
				width: 100%;
				height: 100%;
			}
		}
		.title-view {
			padding: 0 30upx;
			box-sizing: border-box;
			background: #fff;
			color: #333;
			font-size: 32upx;
			.content {
				display: flex;
				align-items: center;
				width: 100%;
				height: 96upx;
				border-bottom: 1px solid #eee;
				.line {
					width: 6upx;
					height: 30upx;
					background: $uni-color-primary;
					margin-right: 20upx;
					border-radius: 3upx;
				}
				.title {
					flex-grow: 1;
					font-weight: 600;
					.tip {
						color: #999;
						font-weight: 400;
						margin-left: 10upx;
					}
				}
				.icon {
					
				}
			}
		}
		.content-view {
			display: flex;
			width: 100%;
			padding: 0 20upx;
			box-sizing: border-box;
			background: #fff;
			margin-bottom: 20upx;
			.content-item {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 230upx;
				height: 230upx;
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
			}
			.no-result {
				width: 100%;
				padding: 30upx 0;
				box-sizing: border-box;
				font-size: 24upx;
				color: #ccc;
				text-align: center;
			}
		}
	}
</style>
