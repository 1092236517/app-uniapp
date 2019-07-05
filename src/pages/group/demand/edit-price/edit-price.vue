<template>
	<view class="edit-price-wrapper">
		<view class="main">
			<view class="wrapper">
				<view class="item-wrapper">
					<view class="item-header">
						<view class="title-view">
							<text class="line"></text>
							<text class="title">供应商报价</text>
						</view>
					</view>
					<view class="item-content">
						<view v-for="(item, index) in supplierPriceList" :key="index">
							<view class="desc-view">
								<view class="desc">
									{{ item.desc }}
								</view>
							</view>
							<view class="price-view">
								<text class="price">{{ item.price }}</text>
								<text class="unit">元/吨</text>
							</view>
						</view>
					</view>
				</view>
				<view class="item-wrapper">
					<view class="item-header">
						<view class="title-view">
							<text class="line"></text>
							<text class="title">筑牛报价</text>
						</view>
					</view>
					<view class="item-content">
						<view v-for="(item, index) in znPriceList" :key="index">
							<view class="desc-view">
								<view class="desc">
									{{ item.desc }}
								</view>
							</view>
							<view class="quote-input-view">
								<view class="select-view">
									<picker
										:range="selectRange"
										:value="item.selectIndex"
										range-key="label"
										@change="selectChange(item, $event)">
										<view>{{ selectRange[item.selectIndex].label }}</view>
									</picker>
									<text class="iconfont select-icon">&#xe63e;</text>
								</view>
								<view class="input-view">
									<input
										type="text"
										placeholder="请填写价格"
										v-model="item.price">
									<text class="unit">元/吨</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="button-wrapper">
			<view class="button" @click="submit">提交</view>
		</view>
	</view>
</template>

<script>
	import { func } from '../../../../common/utils/func.js'
	
	export default {
		name: 'edit-price',
		data() {
			return {
				token: this.$store.state.token,
				demandPurchaseId: '',
				recordId: '',
				quotedPriceRecordId: '',
				selectRange: [
					{
						label: '上浮',
						value: '+'
					},
					{
						label: '下浮',
						value: '-'
					}
				],
				supplierPriceListOriginal: [],
				supplierPriceList: [],
				znPriceList: []
			}
		},
		onLoad(option) {
			this.demandPurchaseId = option.demandPurchaseId;
			this.recordId = parseInt(option.recordId);
			this.getSupplierPriceList();
		},
		methods: {
			 /**
			 * 非负浮点数检测
			 * @param  {String}  number 待检测字符串
			 * @return {Boolean}        是否为非负浮点数
			 */
			isNumber(number){
				let numberReg = /^\d+(\.\d+)?$/;
				return numberReg.test(number);
			},
			selectChange(item, event) { //选择器改变
				item.selectIndex = event.detail.value;
			},
			submit() { //提交编辑价格
				const params = {
					token: this.token,
					bid_demand_purchase_quoted_price_record_id: this.recordId,
					quoted_price_record_id: this.quotedPriceRecordId,
					total_quote_price: this.znPriceList
				}
				if(this.znPriceList.some(item => !this.isNumber(item.price))) { //价格校验
					uni.showToast({
						title: '请填写价格',
						icon: 'none'
					})
					return false
				}
				const totalQuotePprice = {};
				totalQuotePprice.supplier = this.supplierPriceListOriginal;
				totalQuotePprice.zn = this.znPriceList.map((item, index) => {
					const sign = this.selectRange[item.selectIndex]['value'];
					return {
						description: item.desc,
						price: sign + item.price
					}
				})
				params.total_quote_price = JSON.stringify(totalQuotePprice);
                uni.showLoading({
                	title: '提交中',
                	mask: true
                });
				this.$api.groupDemandApi.selectSupplier(params, this.demandPurchaseId)
					.then(res => {
                        uni.hideLoading();
						const result = res.data;
						if(result.msg_code === 100000) {
                            this.$func.asyncShowToast({
                                title: '编辑成功',
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
			},
			getSupplierPriceList() { //获取供应商报价列表
				const params = {
					token: this.token
				}
				this.$api.groupDemandApi.demandPurchaseDetail(params, this.demandPurchaseId)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							const supplierQuoteList = result.response.demand_purchase_quoted_price_records;
							const index = supplierQuoteList.findIndex(item => item.id === this.recordId);
							const paymentObj = JSON.parse(supplierQuoteList[index]['super_quote_prices']);
							this.supplierPriceListOriginal = paymentObj['supplier'];
							this.quotedPriceRecordId = result.response.demand.quoted_price_record_id;
							paymentObj['supplier'].forEach((item, index) => {
								this.supplierPriceList.push({ //供应商报价
									desc: item.description,
									price: func.signToWords(item.price)
								});
								this.znPriceList.push({ //筑牛报价
									desc: item.description,
									price: '',
									selectIndex: 0
								})
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
	page {
		height: 100%;
	}
	.edit-price-wrapper {
		height: 100%;
		.main {
			min-height: 100%;
			.wrapper {
				padding-bottom: 160upx;
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
					font-size: 28upx;
					color: #666;
					.desc-view {
						height: 80upx;
						line-height: 80upx;
						border-bottom: 1px solid #eee;
					}
					.price-view {
						color: $uni-color-primary;
						height: 80upx;
						line-height: 80upx;
						.price {
							margin-left: 40upx;
							margin-right: 10upx;
						}
						.unit {
							color: #666;
						}
					}
					.quote-input-view {
						display: flex;
						align-items: center;
						justify-content: space-between;
						border-bottom: 1px solid #eee;
						font-size: 28upx;
						color: #999;
						height: 90upx;
						.select-view {
							display: flex;
							align-items: center;
							.select-icon {
								margin-left: 20upx;
								font-size: 30upx;
							}
						}
						.input-view {
							display: flex;
							align-items: center;
							input {
								width: 160upx;
							}
							.unit {
								color: #666;
							}
						}
						.input-placeholder {
							color: $uni-text-color-placeholder;
						}
					}
					.item-textarea {
						width: 100%;
					}
					.textarea-placeholder {
						font-size: 28upx;
						color: $uni-text-color-placeholder;
					}
				}
			}
		}
		.button-wrapper {
			width: 100%;
			padding: 30upx;
			box-sizing: border-box;
			margin-top: -150upx;
			background: #eee;
			.button {
				width: 100%;
				height: 88upx;
				line-height: 88upx;
				color: #fff;
				background: $uni-color-primary;
				font-size: 32upx;
				text-align: center;
				border-radius: 8upx;				
			}
		}
	}
</style>
