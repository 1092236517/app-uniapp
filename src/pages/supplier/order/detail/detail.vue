<template>
	<view class="detail-wrapper">
		<view class="main">
			<view class="item-wrapper">
				<view class="item-header">
					<view class="title-view">
						<text class="line"></text>
						<text class="title">订单信息</text>
					</view>
					<view class="status" :style="{color: orderStatusColor}">{{ statusText }}</view>
				</view>
				<view class="item-content">
					<view class="content">
						<view class="desc">
							订单编号：<text class="desc-text">{{ orderNo }}</text>
						</view>
						<view class="desc">
							项目名称： <text class="desc-text">{{ programName }}</text>
						</view>
						<view class="desc">
							收货人：<text class="desc-text">{{ receiver }}</text>
						</view>
						<view class="desc">
							联系电话：<text class="desc-text">{{ mobile }}</text>
						</view>
						<view class="desc">
							身份证：<text class="desc-text">{{ identityCard }}</text>
						</view>
						<view class="desc">
							收货地址：<text class="desc-text">{{ deliveryAddress }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="item-wrapper">
				<view class="item-header">
					<view class="title-view">
						<text class="line"></text>
						<text class="title">采购信息</text>
					</view>
				</view>
				<view class="item-content">
					<view class="count-view">
						<view class="count-item">
							<view class="count">
								{{ purchaseCount }}
							</view>
							<view class="desc">
								采购吨数
							</view>
						</view>
						<view class="count-item">
							<view class="count">
								{{ receiveCount }}
							</view>
							<view class="desc">
								已发吨数
							</view>
						</view>
					</view>
					<view class="purchaser-content">
						<view class="desc">
							产品名称：<text class="desc-text">{{ productName }}</text>
						</view>
						<view class="desc">
							网价参考： <text class="desc-text">{{ webPriceReferenceText }}</text>
						</view>
						<view class="desc">
							产品品牌：<text class="desc-text">{{ productBrand }}</text>
						</view>
						<view class="desc">
							参考地区：<text class="desc-text">{{ referenceLocation }}</text>
						</view>
						<view class="desc">
							产品规格：<text class="desc-text">{{ productSpec }}</text>
						</view>
						<view class="desc">
							采购吨数：<text class="desc-text">{{ purchaseCount }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="button-wrapper">
			<view class="btn-select-supplier" @click="viewSlaveOrderList">查看批次订单列表</view>
		</view>
	</view>
</template>

<script>
	const DEMAND_COLOR_SUCCESS = '#0066CC';
	const DEMAND_COLOR_ERROR = '#EE1E1E';
	const ERROR_STATUS_LIST = ['REJECT']
	const webPriceReferenceTextObj = {
		XB: '西本网',
		MY_STEEL: '我的钢铁'
	}
	export default {
		name: 'order-detail-supplier',
		data() {
			return {
				token: this.$store.state.token,
				orderId: '',
				orderNo: '',
				programName: '',
				receiver: '',
				mobile: '',
				identityCard: '',
				deliveryAddress: '',
				orderStatusColor: DEMAND_COLOR_SUCCESS,
				productName: '',
				webPriceReference: '',
				webPriceReferenceText: '',
				productBrand: '',
				referenceLocation: '',
				productSpec: '',
				purchaseCount: '',
                receiveCount: '',
				paymentDesc: '',
				orderStatus: '',
                closeStatus: ''
			}
		},
		computed: {
			statusText() {
				const statusTextObj = {
					PENDING: '履约中',
					CLOSING: '关闭中',
                    FINISHED: '已结束'
				}
                let statusText = statusTextObj[this.orderStatus];
                if(this.orderStatus === 'FINISHED' && this.closeStatus === 'SUCCESS') {
                    statusText = '已关闭';
                }
				return statusText || '--'
			}
		},
		onLoad(option) {
			this.orderId = option.orderId;
			this.getDetail();
		},
		methods: {
			viewSlaveOrderList() { //查看批次订单列表
				uni.navigateTo({
					url: `/pages/supplier/order/slave-order/list/list?orderId=${this.orderId}`
				})
			},
			getDetail() { //获取联采需求详情
				const params = {
					token: this.token
				}
				this.$api.supplierOrderApi.orderDetail(params, this.orderId)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							const orderInfo = result.response;
							const demandInfo = result.response.demand;
							const demandPurchaseInfo = result.response.demand_purchase;
							const province = demandInfo.delivery_address_province;
							const city = demandInfo.delivery_address_city;
							const region = demandInfo.delivery_address_district;
							const addressDetail = demandInfo.delivery_address_detail;
							const spec = JSON.parse(orderInfo.category_spec);
							
							this.orderNo = orderInfo.order_no;
							this.programName = orderInfo.project_name;
							this.receiver = demandInfo.consignee_name;
							this.mobile = demandInfo.consignee_mobile;
							this.identityCard = demandInfo.consignee_identity_card || '--';
							this.deliveryAddress = province + city + region + addressDetail;
							this.productName = demandPurchaseInfo.demand.category.name;
							this.webPriceReference = orderInfo.quoted_price_website;
							this.webPriceReferenceText = webPriceReferenceTextObj[orderInfo.quoted_price_website];
							this.productBrand = orderInfo.brand_name;
							this.referenceLocation = orderInfo.reference_address;
							this.productSpec = spec.category_spec_min + ' - ' + spec.category_spec_max;
							this.purchaseCount = orderInfo.purchase_num;
                            this.receiveCount = orderInfo.received_goods_num || '--';
							this.paymentDesc = demandInfo.pay_description;
							this.orderStatus = orderInfo.status;
                            this.closeStatus = orderInfo.close_status;
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

<style lang="scss">
	@mixin btn() {
		width: 50%;
		height: 100upx;
		text-align: center;
		line-height: 100upx;
		color: #fff;
		font-size: 32upx;
	}
	page {
		height: 100%;
	}
	.detail-wrapper {
		height: 100%;
		.main {
			min-height: 100%;
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
					.status {
						font-size: 28upx;
						font-weight: 400;
					}
					.line {
						display: inline-block;
						width: 6upx;
						height: 32upx;
						margin-right: 20upx;
						border-radius: 3upx;
						vertical-align: middle;
						background: $uni-color-primary;
					}
				}
				.item-content {
					padding-top: 20upx;
					.content {
						line-height: 56upx;
						font-size: 28upx;
						color: #999;
						overflow: hidden;
						.desc {
							text-overflow: ellipsis;
							white-space: nowrap;
							overflow: hidden;
							.desc-text {
								color: #666;
							}
						}
					}
					.count-view {
						display: flex;
						padding-bottom: 30upx;
						border-bottom: 1px solid #eee;
						.count-item {
							width: 50%;
							text-align: center;
							color: $uni-color-primary;
							&:first-child {
								border-right: 1px solid #eee;
							}
							.count {
								font-size: 40upx;
							}
							.desc {
								font-size: 20upx;
							}
						}
					}
					.purchaser-content {
						display: flex;
						flex-wrap: wrap;
						line-height: 56upx;
						font-size: 28upx;
						color: #999;
						border-bottom: 1px solid #eee;
						padding: 10upx 0;
						.desc {
							width: 50%;
							text-overflow: ellipsis;
							white-space: nowrap;
							overflow: hidden;
							.desc-text {
								color: #666;
							}
						}					
					}
				}
			}
		}
		.button-wrapper {
			margin-top: -160upx;
			display: flex;
			flex-wrap: nowrap;
			width: 100%;
			padding: 20upx 30upx;
			box-sizing: border-box;
			.btn-select-supplier{
				@include btn();
				width: 100%;
				background: $uni-color-primary;
			}
		}
	}
</style>
