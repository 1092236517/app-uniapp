<template>
	<view class="supplier-quote-detail-wrapper">
		<view class="item-wrapper">
			<view class="item-header">
				<view class="title-view">
					<text class="line"></text>
					<text class="title">供应商报价</text>
				</view>
				<view class="status">{{ statusText }}</view>
			</view>
			<view class="item-content">
				<view
					v-for="(item, index) in supplierQuoteList"
					:key="index"
					class="quote-content">
					<view class="title-view">
						<text class="title">{{ item.supplierName }}</text>
						<text class="status">{{ item.statusText }}</text>
					</view>
					<view class="quote-list">
						<view class="label">订单支付方式</view>
						<template v-if="item.supplierPriceList">
							<view
								class="payment-desc"
								v-for="(priceItem, priceIndex) in item.supplierPriceList"
								:key="priceIndex">
								<text>{{ priceItem.paymentDesc }}</text>
								<text>{{ priceItem.price }} 元/吨</text>
							</view>
						</template>
						<template v-else>
							<view>--</view>
						</template>
					</view>
					<view class="btn-view">
						<text class="label">报价时间：{{ item.quoteDate }}</text>
						<text class="time">{{ item.time }}</text>
						<view
							v-if="item.status === 'QUOTED' && demandStatus !== 'PRE_FINISH'"
							class="btn"
							@click="editPrice(demandPurchaseId, item.id)">成交</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'supplier-quote-list',
		data() {
			return {
				token: this.$store.state.token,
				demandPurchaseId: '',
				demandStatus: '',
				supplierQuoteList: []
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
			}
		},
		onLoad(option) {
			this.demandPurchaseId = option.demandPurchaseId;
			this.getSupplierQuoteList();
		},
		methods: {
			getSupplierQuoteList() { //获取供应商报价列表
				const params = {
					token: this.token
				}
				this.$api.groupDemandApi.demandPurchaseDetail(params, this.demandPurchaseId)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							const supplierQuoteList = result.response.demand_purchase_quoted_price_records;
							this.demandStatus = result.response.running_status;
							this.supplierQuoteList = supplierQuoteList.map((item, index) => {
								const element = {
									supplierName: item.supplier.member_auth.auth_name,
									time: '',
									id: item.id,
									status: item.status,
									quoteDate: item.updated_at || '--'
								}
								element.statusText = this.getSupplierQuoteStatusText(item.status);
								if(item.super_quote_prices) {
									const priceObj = JSON.parse(item.super_quote_prices);
                                    const supplierPriceArr = priceObj.supplier; //供应商报价
									const znPriceArr = priceObj.zn; //筑牛报价
									element.supplierPriceList = supplierPriceArr.map((priceItem, priceIndex) => {
										return {
											paymentDesc: priceItem.description,
											price: this.$func.signToWords(priceItem.price)
										}
									});
                                    element.znPriceList = znPriceArr.map((priceItem, priceIndex) => {
                                    	return {
                                    		paymentDesc: priceItem.description,
                                    		price: this.$func.signToWords(priceItem.price)
                                    	}
                                    })
								}
								return element
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
			editPrice(demandPurchaseId, recordId) { //编辑成交价
				uni.navigateTo({
					url: `/pages/group/demand/edit-price/edit-price?demandPurchaseId=${demandPurchaseId}&recordId=${recordId}`
				})
			},
			getSupplierQuoteStatusText(status) { //获取供应商报价状态描述
				let statusText = '已成交';
				if(status === 'QUOTING') {
					statusText = '待报价';
				}
				if(status === 'REJECT') {
					statusText = '已流标';
				}
				if(status === 'WAIT_CHOOSE') {
					statusText = '待确认';
				}
				if(status === 'QUOTED') {
					statusText = '成交'
				}
				return statusText
			}
		}
	}
</script>

<style lang="scss">
	.supplier-quote-detail-wrapper {
		.item-wrapper {
			.item-header {
				display: flex;
				justify-content: space-between;
				padding: 10upx 30upx;
				font-size: 32upx;
				color: #333;
				background: #fff;
				font-weight: 700;
				padding-top: 30upx;
				padding-bottom: 30upx;
				border-bottom: 1px solid #eee;
				.title-view {
					display: flex;
					align-items: center;
				}
				.status {
					color: $uni-color-primary;
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
				.quote-content {
					padding: 10upx 30upx;
					background: #fff;
					margin-bottom: 20upx;
					font-size: 28upx;
					.title-view {
						display: flex;
						justify-content: space-between;
						align-items: center;
						height: 80upx;
						border-bottom: 1px solid #eee;
						.title {
							color: #333;
							font-weight: 600;
						}
						.status {
							color: $uni-color-primary;
						}
					}
					.quote-list {
						padding: 30upx 0;
						border-bottom: 1px solid #eee;
						.label {
							color: #999;
						}
						.payment-desc {
							display: flex;
							margin-top: 30upx;
							color: $uni-color-primary;
							text {
								display: inline-block;
								width: 50%;
							}
						}
					}
					.btn-view {
						display: flex;
						align-items: center;
						height: 80upx;
						color: #999;
						.time {
							color: #666;
							flex-grow: 1;
						}
						.btn {
							color: #fff;
							background: $uni-color-primary;
							width: 140upx;
							height: 60upx;
							line-height: 60upx;
							border-radius: 4px;
							text-align: center;
						}
					}
				}
			}
		}
	}
</style>
