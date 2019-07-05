<template>
	<view class="list-wrapper">
		<view class="content">
			<block v-for="(item, index) in slaveOrderList" :key="index">
				<view class="item-wrapper">
					<view class="item-header">
						<view class="title-view">
							<text class="line" :style="{background: item.statusColor}"></text>
							<text class="title">批次 {{ index + 1 }}</text>
						</view>
						<view>
							<zn-label :labelText="item.statusText" :color="item.statusColor"></zn-label>
						</view>
					</view>
					<view class="item-content">
						<view class="content">
							<view class="desc">
								批次订单号：{{ item.slaveOrderNo }}
							</view>
							<view class="desc">
								发货吨数：{{ item.count }}
							</view>
							<view class="desc">
								发货日期：{{ item.sendGoodsTime }}
							</view>
						</view>
						<view class="operation-wrapper">
							<view
                                v-if="slaveOrderListAuthObj.viewSlaveOrderDetailBtn.show"
                                @click="viewSlaveOrderDetail(orderId, item.slaveOrderNo, item.id)">查看订单详情</view>
                            <template v-if="slaveOrderListAuthObj.manageWebpriceBtn.show">
                            	<view v-if="item.canManageWebprice" @click="manageWebprice(orderId, item.slaveOrderNo, item.id)">
                            		配置网价
                            	</view>
                            </template>
							<view class="approve-view">
								<view
									class="btn"
									v-if="item.status === 'WAIT_GROUP_PAY' && slaveOrderListAuthObj.payBtn.show"
									@click="pay(orderId, item.slaveOrderNo, item.id)">支付批次</view>
							</view>
						</view>
					</view>	
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import znLabel from '../../../../../components/zn-label.vue'
	
	export default {
		name: 'slave-order-list-group',
		components: {
			znLabel
		},
		data() {
			return {
				token: this.$store.state.token,
				orderId: '',
				slaveOrderList: [],
                slaveOrderListAuthObj: {
                    viewSlaveOrderDetailBtn: {
                        chName: '查看批次详情',
                        show: false
                    },
                    payBtn: {
                        chName: '支付批次',
                        show: false
                    },
                    manageWebpriceBtn: {
                        chName: '配置网价',
                        show: false
                    }
                }
			}
		},
        onReachBottom() {
            
        },
		onLoad(option) {
			this.orderId = option.orderId;
			this.getDetail();
            this.getAuth();
		},
		methods: {
			getDetail() { //获取订单详情
				const params = {
					token: this.token
				}
				this.$api.groupOrderApi.orderDetail(params, this.orderId)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							const slaveOrderList = result.response.slave_orders;						
							this.slaveOrderList = slaveOrderList.map((item, index) => { //批次订单列表
								const { color, text } = this.getStatusInfo(item.status);
                                let canManageWebprice = false;
                                if(item.paid_type === 'PAID_BEFORE') {
                                    if(item.status === 'WAIT_GROUP_PAY') {
                                        canManageWebprice = true;
                                    }
                                }else {
                                    if(item.status === 'WAIT_SEND_GOODS'
                                        || item.status === 'WAIT_SIGN'
                                        || item.status === 'WAIT_GROUP_PAY') {
                                            canManageWebprice = true;
                                        }
                                }
								return {
									id: item.id,
									programName: result.response.project_name,
									slaveOrderNo: item.order_no,
									count: item.received_goods_num,
									sendGoodsTime: item.send_goods_time || '',
									statusColor: color,
									statusText: text,
									status: item.status,
                                    paidType: item.paid_type,
                                    canManageWebprice
								}
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
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none'
						})
					})
			},
			getStatusInfo(status) { //获取状态颜色和文案
				let color = '#0066cc';
				let text;
				switch (status) {
					case 'WAIT_SUPPLIER_CONFIRM_GOODS_PRICE_AND_QUANTITY':
						text = '待供应商确认货量价';
						break;
					case 'WAIT_BRANCH_CONFIRM_PRICE_AND_QUANTITY': 
						text = '待分公司确认量价';
						break;
					case 'BRANCH_CONFIRM_PRICE_AND_QUANTITY_REJECT': 
						text = '分公司拒绝量价';
						break;
					case 'WAIT_GROUP_PAY': 
						text = '待支付,集团财务部支付给筑牛';
						break;
					case 'WAIT_GROUP_CONFIRM_PAY': 
						text = '待确认支付信息';
						break;
					case 'WAIT_ZN_PAY': 
						text = '待支付';
						break;
					case 'WAIT_ZHUNIU_CONFIRM_PAY':
						text = '待确认支付信息';
						break;
					case 'WAIT_SUPPLIER_CONFIRM_RECEIVE_MONEY':
						text = '待供应商确认收款';
						break;
					case 'WAIT_SEND_GOODS':
						text = '待发货';
						break;
					case 'WAIT_SIGN':
						text = '待签收';
						break;
					case 'FINISHED':
						text = '订单完成';
						break;
					default:
						color = '#0066cc';
						text = ''
				}
				return {
					color,
					text
				}
			},
			viewSlaveOrderDetail(orderId, slaveOrderNo, slaveOrderId) { //查看批次订单详情
				uni.navigateTo({
					url: `/pages/group/order/slave-order/detail/detail?orderId=${orderId}&slaveOrderNo=${slaveOrderNo}&slaveOrderId=${slaveOrderId}`
				})
			},
			addSlaveOrder(orderId) { //创建批次订单
				uni.navigateTo({
					url: `/pages/group/order/order-release/order-release?orderId=${orderId}`
				})
			},
			pay(orderId, slaveOrderNo, slaveOrderId) { //支付批次
				uni.navigateTo({
					url: `/pages/group/order/slave-order/detail/detail?orderId=${orderId}&slaveOrderNo=${slaveOrderNo}&slaveOrderId=${slaveOrderId}`
				})
			},
            manageWebprice(orderId, slaveOrderNo, slaveOrderId) { //网价管理
            	uni.navigateTo({
            		url: `/pages/group/order/slave-order/detail/detail?orderId=${orderId}&slaveOrderNo=${slaveOrderNo}&slaveOrderId=${slaveOrderId}&type=webprice`
            	})
            },
            getAuth() { //获取权限
                const orderListPermissionObj = this.$store.getters.permissionList.MobileSlaveOrderList;
                this.$func.getAuth(orderListPermissionObj, this.slaveOrderListAuthObj);
            }
		}
	}
</script>

<style lang="scss">
	@mixin btn() {
		width: 50%;
		height: 100upx;
		text-align: center;
		line-height: 100upx;
		color: #fff;
		font-size: 32upx;
	}
	.list-wrapper {
		.header {
			display: flex;
			flex-wrap: nowrap;
			padding: 20upx 30upx;
			background: #fff;
			border-bottom: 1px solid #eee;
			.search-view {
				position: relative;
				flex-grow: 1;
				padding-right: 40upx;
				border-right: 1px solid #ddd;
				font-size: 24upx;
				input {
					background: #eee;
					padding-left: 56upx;
				}
				.input-placeholder {
					font-size: 24upx;
				}
				.search-icon {
					position: absolute;
					top: 12upx;
					left: 20upx;
					display: inline-block;
					font-size: 30upx;
					color: #999;
				}
			}
			.select-view {
				position: relative;
				width: 170upx;
				padding-right: 20upx;
				font-size: 28upx;
				line-height: 56upx;
				color: $uni-color-primary;
				text-align: center;
				.select-icon {
					position: absolute;
					top: 0;
					right: 0;
				}
			}
		}
		.content {
			.item-wrapper {
				background: #fff;
				padding: 10upx 30upx;
				margin-bottom: 20upx;
				.item-header {
					display: flex;
					justify-content: space-between;
					font-size: 32upx;
					color: #333;
					font-weight: 700;
					padding-top: 30upx;
					padding-bottom: 30upx;
					border-bottom: 1px solid #eee;
					.title-view {
						display: flex;
						align-items: center;
					}
					.line {
						display: inline-block;
						width: 6upx;
						height: 32upx;
						margin-right: 20upx;
						border-radius: 3upx;
						vertical-align: middle;
					}
				}
				.item-content {
					display: flex;
					flex-wrap: nowrap;
					padding-top: 30upx;
					.content {
						flex-grow: 1;
						line-height: 56upx;
						font-size: 28upx;
						color: #999;
						overflow: hidden;
						.desc {
							text-overflow: ellipsis;
							white-space: nowrap;
							overflow: hidden;
						}
					}
					.operation-wrapper {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						align-items: center;
						width: 180upx;
						font-size: 24upx;
						color: $uni-color-primary;
						.btn {
							width: 160upx;
							height: 48upx;
							line-height: 48upx;
							text-align: center;
							border: 1upx solid $uni-color-primary;
							border-radius: 4upx;
							margin-top: 20upx;
						}
					}
				}
			}
		}
		.button-wrapper {
			display: flex;
			flex-wrap: nowrap;
			width: 100%;
			padding: 20upx 30upx;
			box-sizing: border-box;
			.btn-add{
				@include btn();
				width: 100%;
				background: $uni-color-primary;
			}
		}
	}
</style>
