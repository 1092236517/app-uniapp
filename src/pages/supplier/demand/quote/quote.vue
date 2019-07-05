<template>
	<view class="quote-wrapper">
		<view class="main">
			<view class="item-wrapper">
				<view class="item-header">
					<view class="title-view">
						<text class="line"></text>
						<text class="title">参考数据</text>
					</view>
				</view>
				<view class="item-content">
					<view class="purchaser-content">
						<view class="desc">
							产品名称：<text class="desc-text">{{ productName }}</text>
						</view>
						<view class="desc">
							品牌：<text class="desc-text">{{ productBrand }}</text>
						</view>
						<view class="desc">
							数量（吨）：<text class="desc-text">{{ purchaseCount }}</text>
						</view>
						<view class="desc">
							直径：<text class="desc-text">{{ productSpec }}</text>
						</view>
						<view class="desc">
							网价参考： <text class="desc-text">{{ webPriceReference }}</text>
						</view>
						<view class="desc">
							参考地区：<text class="desc-text">{{ referenceLocation }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="item-wrapper">
				<view class="item-header">
					<view class="title-view">
						<text class="line"></text>
						<text class="title">填写成交报价</text>
					</view>
				</view>
				<view class="item-content">
					<checkbox-group @change="handleCheckboxChange">
						<view v-for="(item, index) in quoteList" :key="index">
							<label
								class="checkbox-item">
								<checkbox
									:value="item.value"
									:checked="item.checked"
									color="#0066cc" />
								<view class="desc">
									{{ item.label }}
								</view>
							</label>
							<view class="quote-input-view">
								<view class="select-view">
									<picker
										:range="priceSelectRange"
										:value="item.selectIndex"
										range-key="label"
										@change="priceSelectChange(item, $event)">
										<view>{{ priceSelectRange[item.selectIndex].label }}</view>
									</picker>
									<text class="iconfont select-icon">&#xe63e;</text>
								</view>
								<view class="input-view">
									<input
										type="number"
										placeholder="请填写价格"
										v-model="item.price">
									<text class="unit">元/吨</text>
								</view>
							</view>
						</view>
					</checkbox-group>
				</view>
			</view>
			<view class="item-wrapper">
				<view class="item-header">
					<view class="title-view">
						<text class="line"></text>
						<text class="title">备注</text>
					</view>
				</view>
				<view class="item-content">
					<view class="item-input">
						<textarea
							v-model="remark"
							placeholder="请描述付款的方式"
							class="item-textarea"
							:auto-height="true"/>
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
	const webPriceReferenceText = {
		XB: '西本网',
		MY_STEEL: '我的钢铁'
	}
	export default {
		name: 'demand-quote',
		data() {
			return {
				token: this.$store.state.token,
				demandPurchaseQuotePriceRecordId: '',
				productName: '',
				productBrand: '',
				purchaseCount: '',
				productSpec: '',
				webPriceReference: '',
				referenceLocation: '',
				priceSelectRange: [
					{
						label: '上浮',
						value: '+'
					},
					{
						label: '下浮',
						value: '-'
					}
				],
				quoteList: [],
				remark: ''
			}
		},
		onLoad(option) {
			this.demandPurchaseQuotePriceRecordId = option.demandPurchaseQuotePriceRecordId;
			this.getDemandDetail();
		},
		methods: {
			handleCheckboxChange(event) { //选择支付方式改变，更新列表选中状态
				const selectedArr = event.detail.value;
				if(selectedArr) {
					this.quoteList.forEach((item, index) => {
						item.checked = false;
						selectedArr.forEach((selectedItem, selectedIndex) => {
							if(item.value === selectedItem) {
								item.checked = true;
							}
						})
					})
				}
			},
			priceSelectChange(item, event) { //价格浮动选择器改变
				item.selectIndex = event.detail.value;
			},
			getDemandDetail() { //获取需求详情
				const params = {
					token: this.token
				};
				this.$api.supplierDemandApi.demandDetail(params, this.demandPurchaseQuotePriceRecordId)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							const demandInfo = result.response.demand_purchase.demand;
							const spec = JSON.parse(demandInfo.category_spec);
							const province = demandInfo.reference_province.region_name;
							const city = demandInfo.reference_city.region_name;
							const quoteList = result.response.pay_info;
							this.productName = demandInfo.category.name;
							this.productBrand = demandInfo.brand_name;
							this.purchaseCount = demandInfo.purchase_num;
							this.productSpec = `${spec.category_spec_min} - ${spec.category_spec_max}`;
							this.webPriceReference = webPriceReferenceText[demandInfo.quoted_price_website];
							this.referenceLocation = `${province},${city}`;
							this.quoteList = quoteList.map((item, index) => {
								return {
									label: item.description,
									value: item.id.toString(),
									price: '',
									checked: false,
									selectIndex: 0,
									float: ''
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
			submit() { //提交报价信息
				const paymentSelectedList = this.quoteList.filter(item => item.checked);
				if(paymentSelectedList.length === 0) {
					uni.showToast({
						title: '请选择支付方式',
						icon: 'none'
					})
					return false
				}
				if(paymentSelectedList.some(item => !item.price)) {
					uni.showToast({
						title: '请填写报价',
						icon: 'none'
					})
					return false
				}
                uni.showModal({
                	title: '提示',
                	content: '是否确认提交报价？',
                	cancelText: '否',
                	confirmText: '是',
                	success: res => {
                        if(res.confirm) {
                            const supplierQuoteArr = paymentSelectedList.map(item => {
                            	return {
                            		description: item.label,
                            		quote_id: item.value,
                            		price: this.priceSelectRange[item.selectIndex]['value'] + item.price,
                            		value: this.priceSelectRange[item.selectIndex]['value']
                            	}
                            })
                            const params = {
                            	token: this.token,
                            	super_quote_prices: JSON.stringify({
                            		supplier: supplierQuoteArr,
                            		zn: []
                            	}),
                            	remark: this.remark
                            }
                            uni.showLoading({
                            	title: '提交中',
                            	mask: true
                            });
                            this.$api.supplierDemandApi.quotePrice(params, this.demandPurchaseQuotePriceRecordId)
                            	.then(res => {
                                    uni.hideLoading();
                            		const result = res.data;
                            		if(result.msg_code === 100000) {
                                        this.$func.asyncShowToast({
                                            title: '报价成功！',
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
                                    uni.hideLoading();
                            		console.log(err);
                            		uni.showToast({
                            			title: JSON.stringify(err),
                            			icon: 'none'
                            		})
                            	})
                        }else if(res.cancel){
                            //取消
                        }
                    }
                });
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%
	}
	.quote-wrapper {
		height: 100%;
		.main {
			min-height: 100%;
			padding-bottom: 180upx;
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
					.checkbox-item {
						display: flex;
						align-items: center;
						font-size: 28upx;
						color: #666;
						.desc {
							flex-grow: 1;
							height: 90upx;
							line-height: 90upx;
							margin-left: 30upx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							border-bottom: 1px solid #eee;
						}
					}
					.quote-input-view {
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding-left: 100upx;
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
