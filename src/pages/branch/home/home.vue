<template>
	<view class="home-wrapper">
        <template v-if="homeAuthObj.page">
        	<view class="home-bg-view">
        		<image src="../../../static/images/branch/home/background.png" class="home-bg"></image>
        		<view class="btn-release-demand" @click="releaseDemand" v-if="homeAuthObj.releaseDemandBtn.show">
        			<text class="iconfont icon">&#xe600;</text>
        			<text class="desc">发布联采需求</text>
        		</view>
        	</view>
        	<view class="title-view" @click="viewIncompleteDemand" v-if="incompleteDemandAuthObj.page.show">
        		<view class="line"></view>
        		<view class="title">
        			<text>不完整需求列表</text>
        			<text class="tip" v-if="incompleteTipCount > 0">({{ incompleteTipCount }})</text>
        		</view>
        		<text class="iconfont icon">&#xe620;</text>
        	</view>
        	<view class="content-view">
        		<view class="content-item" v-if="demandListAuthObj.page.show">
        			<view class="icon">
        				<image src="../../../static/images/branch/home/demand.png"></image>
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
        		<view class="content-item" v-if="orderListAuthObj.page.show">
        			<view class="icon">
        				<image src="../../../static/images/branch/home/order.png"></image>
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
        </template>
        <template v-else>
        	<view class="no-permission">请联系管理员配置权限</view>
        </template>
	</view>
</template>

<script>
	export default {
		name: 'home-branch',
		data() {
			return {
				token: this.$store.state.token,
				incompleteTipCount: 0,
				demandTipCount: 0,
				orderTipCount: 0,
				demandId: '',
				orderId: '',
				slaveOrderId: '',
				slaveOrderNo: '',
                homeAuthObj: {
                    page: {
                        chName: '显示',
                        show: false
                    },
                    releaseDemandBtn: {
                        chName: '发布联采需求',
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
                },
                incompleteDemandAuthObj: {
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
			releaseDemand() {
				uni.navigateTo({
					url: '/pages/branch/demand/release/step1'
				})
			},
			viewIncompleteDemand() {
				uni.navigateTo({
					url: '/pages/branch/demand/incomplete-demand-list/incomplete-demand-list'
				})
			},
			viewJonitList(type) { //查看联采列表
				this.$store.commit('saveJointListType', type)
				uni.switchTab({
					url: '/pages/tabBar/joint-list/joint-list'
				})
			},
			viewDetail(type) { //查看联采详情
				if(type === 'demand') { //跳转到需求详情页
					uni.navigateTo({
						url: `/pages/branch/demand/detail/detail?demandId=${this.demandId}`
					})
				}else {
					uni.navigateTo({ //跳转到批次订单详情页
						url: `/pages/branch/order/slave-order/detail/detail?orderId=${this.orderId}&slaveOrderNo=${this.slaveOrderNo}&slaveOrderId=${this.slaveOrderId}`
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
			getOperateCount() { //获取待操作的数量
				const params = {
					token: this.token
				}
				this.$api.branchHomeApi.operateCount(params)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							const demandInfo = result.response.demandDetail;
							const slaveOrderInfo = result.response.slaveOrderDetail;
							this.incompleteTipCount = result.response.incomplete;
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
                const incompleteDemandPermissionObj = this.$store.getters.permissionList.MobileIncompleteDemand;
                const demandListPermissionObj = this.$store.getters.permissionList.MobileJointPurchaseOrderList;
                const orderListPermissionObj = this.$store.getters.permissionList.MobileSlaveOrderList;
                this.$func.getAuth(indexPermissionObj, this.homeAuthObj);
                this.$func.getAuth(incompleteDemandPermissionObj, this.incompleteDemandAuthObj);
                this.$func.getAuth(demandListPermissionObj, this.demandListAuthObj);
                this.$func.getAuth(orderListPermissionObj, this.orderListAuthObj);
            }
		}
	}
</script>

<style lang="scss" scoped>
	.home-wrapper {
		.home-bg-view {
			position: relative;
			width: 100%;
			height: 745upx;
			.home-bg {
				width: 100%;
				height: 100%;
			}
			.btn-release-demand {
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				right: 0;
				bottom: 88upx;
				width: 224upx;
				height: 60upx;
				color: $uni-color-primary;
				font-size: 24upx;
				background: rgba(255, 255, 255, 0.7);
				border: 1px solid #fff;
				border-top-left-radius: 4px;
				border-bottom-left-radius: 4px;
				.icon {
					color: $uni-color-primary;
					margin-right: 10upx;
				}
			}
		}
		.title-view {
			display: flex;
			align-items: center;
			width: 100%;
			height: 96upx;
			padding: 0 30upx;
			box-sizing: border-box;
			background: #fff;
			color: #333;
			font-size: 32upx;
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
		.content-view {
			display: flex;
			justify-content: space-between;
			width: 100%;
			padding: 20upx;
			box-sizing: border-box;
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
					color: $uni-color-primary;
					border: 1px solid $uni-color-primary;
					border-radius: 22upx;
					&.btn-disable {
						background: #ccc;
						color: #999;
						border: 1px solid #ccc;
					}
				}
			}
		}
	}
</style>
