<template>
	<view class="detail-wrapper">
		<view class="main">
			<view class="wrapper">
				<view class="item-wrapper">
					<view class="item-header">
						<view class="title-view">
							<text class="line"></text>
							<text class="title">需求订单信息</text>
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
								项目编码：<text class="desc-text">{{ programCode }}</text>
							</view>
							<view class="desc">
								采购商：<text class="desc-text">{{ purchaser }}</text>
							</view>
							<view class="desc">
								供应商：<text class="desc-text">{{ supplier }}</text>
							</view>
							<view
								class="close-btn"
								v-if="orderStatus === 'PENDING'"
								@click="closeOrder">
								申请关闭
							</view>
						</view>
						<view class="content">
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
						<view class="content" v-if="isShowCloseCheckBtn">
							<view class="close-check-view">
								<view class="btn-reject" @click="closeReject">
									驳回关闭
								</view>
								<view class="btn-approve" @click="closeApprove">
									同意关闭
								</view>
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
						<view class="content">
							<view class="desc">
								订单生成时间：<text class="desc-text">{{ orderCreatedTime }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="item-wrapper">
					<view class="item-header">
						<view class="title-view">
							<text class="line"></text>
							<text class="title">成交价格</text>
						</view>
					</view>
					<view class="item-content">
						<view class="content">
							<view class="quote-view">
								<view class="title">
									{{ supplier }}
								</view>
								<view class="content">
									<view class="subtitle">
										订单支付方式
									</view>
									<view class="payment-list" v-for="(item, index) in supplierPaymentList" :key="index">
										<view class="payment-item">
											<view class="desc">
												{{ item.desc }}
											</view>
											<view class="price">
												{{ item.price }}
											</view>
										</view>
									</view>
								</view>
								<view class="content">
									<view class="desc">
										报价时间：<text class="desc-text">{{ orderQuotedTime }}</text>
									</view>
								</view>
							</view>
						</view>
						<view class="content">
							<view class="quote-view">
								<view class="title">
									筑牛报价
								</view>
								<view class="content">
									<view class="subtitle">
										订单支付方式
									</view>
									<view class="payment-list" v-for="(item, index) in znPaymentList" :key="index">
										<view class="payment-item">
											<view class="desc">
												{{ item.desc }}
											</view>
											<view class="price">
												{{ item.price }}
											</view>
										</view>
									</view>
								</view>
								<view class="content">
									<view class="desc">
										报价时间：<text class="desc-text">{{ orderQuotedTime }}</text>
									</view>
								</view>
							</view>
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
	import znAccordion from '../../../../components/zn-accordion.vue'
	import znTimeline from '../../../../components/zn-timeline.vue'
	import { func } from '../../../../common/utils/func.js'
	
	const DEMAND_COLOR_SUCCESS = '#0066CC';
	const DEMAND_COLOR_ERROR = '#EE1E1E';
	const ERROR_STATUS_LIST = ['REJECT'];
	const webPriceReferenceTextObj = {
		XB: '西本网',
		MY_STEEL: '我的钢铁'
	}
	export default {
		name: 'order-detail-branch',
		components: {
			znAccordion,
			znTimeline
		},
		data() {
			return {
				token: this.$store.state.token,
				orderId: '',
				programCode: '',
				purchaser: '',
				supplier: '',
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
				orderStatus: '',
				orderCreatedTime: '',
				orderQuotedTime: '',
				supplierPaymentList: [],
				znPaymentList: [],
				orderCloseStatus: ''
			}
		},
		computed: {
			statusText() {
				const statusText = {
					CLOSING: '关闭中',
					PENDING: '履约中',
					FINISHED: '已结束'
				}
				return statusText[this.orderStatus] || '--'
			},
			isShowCloseCheckBtn() {
				return this.orderStatus === 'CLOSING' && this.orderCloseStatus === 'WAIT_GROUP_AUTH'
			}
		},
		onLoad(option) {
			this.orderId = option.orderId;
			this.getDetail();
		},
		methods: {
			viewSlaveOrderList() { //查看批次列表
				uni.navigateTo({
					url: `/pages/group/order/slave-order/list/list?orderId=${this.orderId}`
                })
			},
			getDetail() { //获取联采订单详情
				const params = {
					token: this.token
				}
				this.$api.groupOrderApi.orderDetail(params, this.orderId)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							const demandInfo = result.response.demand;
							const demandPurchaseInfo = result.response.demand_purchase;
							const deliveryProvince = demandInfo.delivery_address_province;
							const deliveryCity = demandInfo.delivery_address_city;
							const deliverRegion = demandInfo.delivery_address_district;
							const deliverDetail = demandInfo.delivery_address_detail;
							const spec = JSON.parse(demandInfo.category_spec)
							const paymentObj = JSON.parse(result.response.quote_result);
							const supplierPaymentList = paymentObj.supplier;
							const znPaymentList = paymentObj.zn;
							
							this.programCode = demandInfo.project_code;
							this.purchaser = '';
							this.supplier = result.response.supplier_name; 
							this.orderNo = result.response.order_no;
							this.programName = demandInfo.project_name;
							this.receiver = demandInfo.consignee_name;
							this.mobile = demandInfo.consignee_mobile;
							this.identityCard = demandInfo.consignee_identity_card || '--';
							this.deliveryAddress = deliveryProvince + deliveryCity + deliverRegion + ' ' + deliverDetail;
							this.productName = demandPurchaseInfo.demand.category.name;
							this.webPriceReference = demandInfo.quoted_price_website;
							this.webPriceReferenceText = webPriceReferenceTextObj[demandInfo.quoted_price_website];
							this.productBrand = demandInfo.brand_name;
							this.referenceLocation = result.response.reference_address;
							this.productSpec = spec.category_spec_min + '-' + spec.category_spec_max;
							this.purchaseCount = result.response.purchase_num;
                            this.receiveCount = result.response.received_goods_num || '--';
							this.orderStatus = result.response.status;
							this.orderCloseStatus = result.response.close_status;
							this.orderCreatedTime = result.response.created_at;
							this.orderQuotedTime = demandPurchaseInfo.demand_purchase_choosed_quoted_price_record.created_at;
							this.supplierPaymentList = supplierPaymentList.map((item, index) => { //支付方式列表
								return {
									desc: item.description,
									price: func.signToWords(item.price)
								}
							})
							this.znPaymentList = znPaymentList.map((item, index) => { //支付方式列表
								return {
									desc: item.description,
									price: func.signToWords(item.price)
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
			closeOrder() { //申请关闭订单
				uni.navigateTo({
					url: `/pages/group/order/close/close?orderId=${this.orderId}`
				})
			},
			closeApprove() { //同意关闭
				const params = {
					token: this.token,
					close_status: 'WAIT_ZN_CONFIRM'
				}
				this.$api.groupOrderApi.orderCloseCheck(params, this.orderId)
					.then(res => {
						uni.showToast({
							title: '操作成功',
							icon: 'success'
						})
						this.getDetail()
					})
					.catch(err => {
						console.log(err);
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none'
						})
					})
			},
			closeReject() { //驳回关闭
				uni.navigateTo({
					url: `/pages/group/order/close-reject/close-reject?orderId=${this.orderId}`
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
			.wrapper {
				padding-bottom: 150upx;
			}
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
					.icon {
						font-weight: 400;
						transition: all .3s ease;
					}
					.icon-unfold {
						transform: rotateZ(-180deg);
					}
				}
				.item-content {
					.content {
						position: relative;
						line-height: 56upx;
						font-size: 28upx;
						color: #999;
						overflow: hidden;
						border-bottom: 1px solid #eee;
						&:last-child {
							border-bottom: none;
						}
						.desc {
							text-overflow: ellipsis;
							white-space: nowrap;
							overflow: hidden;
							.desc-text {
								color: #666;
							}
						}
						.close-btn {
							position: absolute;
							top: 0;
							right: 0;
							width: 140upx;
							height: 50upx;
							line-height: 50upx;
							background: #EE1E1E;
							color: #fff;
							text-align: center;
							font-size: 24upx;
							border-radius: 4px;
							z-index: 9;
						}
						.close-check-view {
							display: flex;
							justify-content: flex-end;
							padding: 20upx 0;
							.btn-reject {
								width: 160upx;
								height: 48upx;
								line-height: 48upx;
								color: #EE1E1E;
								border: 1px solid #EE1E1E;
								font-size: 28upx;
								text-align: center;
								margin-right: 20upx;
								border-radius: 4px;
							}
							.btn-approve {
								width: 160upx;
								height: 48upx;
								line-height: 48upx;
								color: $uni-color-primary;
								border: 1px solid $uni-color-primary;
								font-size: 28upx;
								text-align: center;
								border-radius: 4px;
							}
						}
						.quote-view {
							font-size: 28upx;
							color: #666;
							.title {
								height: 88upx;
								line-height: 88upx;
								border-bottom: 1px solid #eee;
							}
							.content {
								line-height: 56upx;
								.subtitle {
									color: #999;
								}
								.payment-item {
									display: flex;
									color: $uni-color-primary;
									.desc {
										width: 50%;
									}
									.price {
										width: 50%;
									}
								}
							}
						}
					}
					.count-view {
						display: flex;
						padding-top: 30upx;
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
					.pay-content {
						padding: 10upx 0;
						line-height: 56upx;
						font-size: 28upx;
						border-bottom: 1px solid #eee;
						.content {
							color: $uni-color-primary;
						}
					}
				}
			}
		}
		.button-wrapper {
			margin-top: -140upx;
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
