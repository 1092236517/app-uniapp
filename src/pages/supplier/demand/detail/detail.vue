<template>
	<view class="detail-wrapper">
		<view class="item-wrapper">
			<view class="item-header">
				<view class="title-view">
					<text class="line"></text>
					<text class="title">需求订单信息</text>
				</view>
				<view class="status" :style="{color: demandStatusColor}">{{ statusText }}</view>
			</view>
			<view class="item-content">
				<view class="content">
					<view class="desc">
						订单编号：<text class="desc-text">{{ demandOrderNo }}</text>
					</view>
					<view class="desc">
						项目名称： <text class="desc-text">{{ programName }}</text>
					</view>
					<view class="desc">
						发布时间：<text class="desc-text">{{ createAt }}</text>
					</view>
                    <view class="desc">
                    	收货地：<text class="desc-text">{{ receiveAddress }}</text>
                    </view>
					<view class="desc">
						采购商：<text class="desc-text">江苏筑牛</text>
					</view>
				</view>
			</view>
		</view>
		<view class="item-wrapper">
			<zn-accordion>
				<template slot="header">
					<view class="item-header">
						<view class="title-view">
							<text class="line"></text>
							<text class="title">采购信息</text>
						</view>
						<view class="iconfont icon">&#xe63e;</view>
					</view>
				</template>
				<view class="item-content">
					<view class="purchaser-content">
						<view class="desc">
							产品名称：<text class="desc-text">{{ productName }}</text>
						</view>
						<view class="desc">
							网价参考： <text class="desc-text">{{ webPriceReference }}</text>
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
					<!-- <view class="pay-content">
						<view class="title">
							付款方式
						</view>
						<view class="content">
							每批先付订货款，后发货，价格按款到账日
						</view>
						<view class="content">
							每批先付订货款，后发货，价格按款到账日
						</view>
					</view>
					<view class="content">
						<view class="desc">
							推荐采购商：<text class="desc-text">{{ purchaser }}</text>
						</view>
						<view class="desc">
							供应商电话：<text class="desc-text">{{ supplierMobile }}</text>
						</view>
					</view> -->
				</view>
			</zn-accordion>
		</view>
		<view class="item-wrapper">
			<zn-accordion>
				<template slot="header">
					<view class="item-header">
						<view class="title-view">
							<text class="line"></text>
							<text class="title">联采规则</text>
						</view>
						<view class="iconfont icon">&#xe63e;</view>
					</view>
				</template>
				<view class="item-content">
					<view class="content">
						<view class="desc">
							供应商报价截止时间：<text class="desc-text">{{ deadline }}</text>
						</view>
						<view class="desc">
							发票要求： <text class="desc-text">增值税发票</text>
						</view>
						<view class="desc">
							联采说明：<text class="desc-text">{{ remark }}</text>
						</view>
						<view class="desc">
							<text>附件</text>
							<zn-image-list :imageList="imageList"></zn-image-list>
						</view>
					</view>
				</view>
			</zn-accordion>
		</view>
		<view class="item-wrapper">
			<view class="item-header">
				<view class="title-view">
					<text class="line"></text>
					<text class="title">供应商报价</text>
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
							<view class="payment-list">
								<view class="payment-item" v-for="(item, index) in paymentList" :key="index">
									<view class="desc">
										{{ item.desc }}
									</view>
									<view class="price">
										{{ item.price }}
                                        <text>元/吨</text>
									</view>
								</view>
							</view>
						</view>
						<view class="">
							报价时间：{{ quoteDate }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="button-wrapper" v-if="isShowQuoteBtn">
			<view class="btn-select-supplier" @click="toQuote(demandPurchaseQuotePriceRecordId)">填写报价</view>
		</view>
	</view>
</template>

<script>
	import znAccordion from '../../../../components/zn-accordion.vue'
	import znImageList from '../../../../components/zn-image-list.vue'
	import { func } from '../../../../common/utils/func.js'
	
	const DEMAND_COLOR_SUCCESS = '#0066CC';
	const DEMAND_COLOR_ERROR = '#EE1E1E';
	const ERROR_STATUS_LIST = ['REJECT', 'PRE_FINISH_REJECT']
	export default {
		name: 'demand-detail-group',
		components: {
			znAccordion,
			znImageList
		},
		data() {
			return {
				demandPurchaseQuotePriceRecordId: '',
				token: this.$store.state.token,
				demandOrderNo: '',
                createAt: '',
				programName: '',
				programCode: '',
				purchaser: '',
				supplier: '',
				demandStatus: '',
				demandStatusColor: DEMAND_COLOR_SUCCESS,
				productName: '',
				webPriceReference: '',
				productBrand: '',
				referenceLocation: '',
				productSpec: '',
				purchaseCount: '',
				deadline: '',
				remark: '',
                receiveAddress: '',
				supplierMobile: '',
				imageList : [],
				quoteStatus: '',
				paymentList: [],
				quoteDate: ''
			}
		},
		computed: {
			statusText() {
				const statusText = {
					REJECT: '已驳回',
					PENDING: '待报价',
					CUSTOM_EXAMINE_WAIT: '待审核',
					QUOTING: '报价中',
					DEADLINE: '已截标',
					ABORT: '已流标',
					PRE_FINISH: '待确认',
					PRE_FINISH_REJECT: '分公司拒绝',
					FINISH: '已完成'
				}
				return statusText[this.demandStatus] || '--'
			},
			isShowQuoteBtn() { //是否显示报价按钮
				return this.quoteStatus === 'QUOTING'
			}
		},
		onLoad(option) {
			this.demandPurchaseQuotePriceRecordId = option.demandPurchaseQuotePriceRecordId;
			this.getDetail();
		},
		methods: {
			toQuote(demandPurchaseQuotePriceRecordId) { //去报价
				uni.navigateTo({
					url: `/pages/supplier/demand/quote/quote?demandPurchaseQuotePriceRecordId=${demandPurchaseQuotePriceRecordId}`
				})
			},
			getDetail() { //获取联采需求详情
				const params = {
					token: this.token
				}
				this.$api.supplierDemandApi.demandDetail(params, this.demandPurchaseQuotePriceRecordId)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							const demandInfo = result.response.demand_purchase.demand;
							const province = demandInfo.reference_province.region_name;
							const city = demandInfo.reference_city.region_name;
							const webPriceReferenceText = {
								XB: '西本网',
								MY_STEEL: '我的钢铁'
							}
							const spec = JSON.parse(demandInfo.category_spec);
							this.demandOrderNo = result.response.demand_purchase.order_no;
                            this.createAt = result.response.demand_purchase.created_at;
							this.programName = demandInfo.project_name;
							this.programCode = demandInfo.project_code;
							this.purchaser = demandInfo.member_auth.auth_name;
							this.supplier = result.response.supplier.member_auth.auth_name;
							this.productName = demandInfo.category.name;
							this.webPriceReference = webPriceReferenceText[demandInfo.quoted_price_website];
							this.productBrand = demandInfo.brand_name;
							this.referenceLocation = province + '，' + city;
							this.productSpec = spec.category_spec_min + '-' + spec.category_spec_max;
							this.purchaseCount = demandInfo.purchase_num;
							this.paymentDesc = demandInfo.pay_description;
							this.demandStatus = result.response.current_status;
							this.recommendSupplier = demandInfo.supplier_company_name;
							this.supplierMobile = demandInfo.supplier_mobile;
							this.deadline = result.response.demand_purchase.deadline;
							this.remark = demandInfo.remark || '--';
							this.quoteStatus = result.response.current_status;
							this.quoteDate = result.response.updated_at || '--';
                            this.receiveAddress = demandInfo.delivery_address_province + demandInfo.delivery_address_city;
							this.imageList = demandInfo.attachments.map((item, index) => {
								return {
									src: item.path,
									name: item.original_name
								}
							})
							if(demandInfo.purchase_demand) {
								this.demandPurchaseId = demandInfo.purchase_demand.id;
							}
							if(ERROR_STATUS_LIST.includes(demandInfo.current_status)) {
								this.demandStatusColor = DEMAND_COLOR_ERROR;
							}
							if(result.response.super_quote_prices) {
								const paymentList = JSON.parse(result.response.super_quote_prices);
                                const supplierPaymentList = paymentList['supplier'];
                                if(supplierPaymentList) {
                                    this.paymentList = supplierPaymentList.map((item, index) => {
                                    	return {
                                    		desc: item.description,
                                    		price: func.signToWords(item.price)
                                    	}
                                    })
                                }
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

<style lang="scss">
	@mixin btn() {
		width: 50%;
		height: 100upx;
		text-align: center;
		line-height: 100upx;
		color: #fff;
		font-size: 32upx;
	}
	.detail-wrapper {
		padding-bottom: 120upx;
		.steps-view {
			background: #fff;
			padding: 10upx 30upx;
		}
		.accordion-view {
			.header {
				background: #fff;
				height: 50upx;
				line-height: 50upx;
				text-align: center;
				border-top: 1px solid #E6E6E6;
				color: #999;				
			}
		}
		.item-wrapper {
			background: #fff;
			padding: 10upx 30upx;
			margin-top: 20upx;
			&:first-child {
				margin-top: 0;
			}
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
		.button-wrapper {
			position: fixed;
			left: 0;
			bottom: 0;
			display: flex;
			flex-wrap: nowrap;
			width: 100%;
			.btn-reject {
				@include btn();
				background: #1F89E7;
			}
			.btn-approve {
				@include btn();
				background: $uni-color-primary;
			}
			.btn-select-supplier{
				@include btn();
				width: 100%;
				background: $uni-color-primary;
			}
		}
	}
</style>
