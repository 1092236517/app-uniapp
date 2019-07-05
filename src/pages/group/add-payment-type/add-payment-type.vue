<template>
	<view class="add-payment-type-wrapper">
		<view class="main">
			<view class="item-wrapper">
				<view class="item-header">
					<view class="title-view">
						<text class="line"></text>
						<text class="title">付款方式描述</text>
					</view>
				</view>
				<view class="item-content">
					<view class="item-input">
						<textarea
							v-model="paymentDesc"
							placeholder="请描述付款的方式"
							class="item-textarea"
							:maxlength="120"
							:auto-height="true"/>
					</view>
				</view>
			</view>
			<view class="item-wrapper">
				<view class="item-header">
					<view class="title-view">
						<text class="line"></text>
						<text class="title">时间选择</text>
					</view>
				</view>
				<view class="item-content">
					<radio-group @change="handleSelectChange">
						<view class="checkbox-view">
							<label class="checkbox-item">
								<radio
									value="PAY_IN_DAYS" 
									color="#0066cc"
									:checked="paymentSelected === 'PAY_IN_DAYS'" />
								<view class="desc">
									参照付款方式顺延天数
								</view>
							</label>
							<view>
								<input type="number" v-model="delayDays">
							</view>
							<text>天</text>
						</view>
						<view class="checkbox-view">
							<label class="checkbox-item">
								<radio
									value="DAY_IN_MONTH" 
									color="#0066cc"
									:checked="paymentSelected === 'DAY_IN_MONTH'" />
								<view class="desc">
									每月付款日期
								</view>
							</label>
							<view>
								<input type="number" v-model="payDate">
							</view>
							<text>日</text>
						</view>
						<view class="checkbox-view">
							<label class="checkbox-item">
								<radio
									value="PAY_IN_ANYTIME" 
									color="#0066cc"
									:checked="paymentSelected === 'PAY_IN_ANYTIME'" />
								<view class="desc">
									其他<text class="tip">（先发货后付款，支付日期不定）</text>
								</view>
							</label>
						</view>
					</radio-group>
				</view>
			</view>
		</view>
		<view class="button-wrapper">
			<view class="button" @click="addPayment">添加</view>
		</view>		
	</view>
</template>

<script>
	export default {
		name: 'add-payment-type',
		data() {
			return {
				token: this.$store.state.token,
				paymentDesc: '',
				paymentSelected: 'PAY_IN_DAYS',
				delayDays: '',
				payDate: '',
				payAnytime: '0'
			}
		},
		methods: {
			handleSelectChange(event) { //支付方式改变
				if(event.detail.value) {
					this.paymentSelected = event.detail.value;
				}
			},
			addPayment() { //添加付款方式
				const paymentMode = {
					'PAY_IN_DAYS': this.delayDays,
                    'DAY_IN_MONTH': this.payDate,
                    'PAY_IN_ANYTIME': this.payAnytime
				};
				const params = {
                    token: this.token,
                    description: this.paymentDesc,
                    pay_type: this.paymentSelected
                };
				if(!this.paymentDesc) {
					uni.showToast({
						title: '请填写付款方式',
						icon: 'none'
					})
					return false
				}
				if(!paymentMode[this.paymentSelected]) {
					uni.showToast({
						title: '请填写天数',
						icon: 'none'
					})
					return false
				}
				params.point_day = paymentMode[this.paymentSelected];
                uni.showLoading({
                	title: '提交中',
                	mask: true
                });
				this.$api.groupDemandApi.paymentTypeAdd(params)
					.then(res => {
                        uni.hideLoading();
						const result = res.data;
						if(result.msg_code === 100000) {
                            this.$func.asyncShowToast({
                                title: '添加成功',
                                icon: 'success'
                            })
                            .then(val => {
                                uni.navigateBack()
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
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%
	}
	.add-payment-type-wrapper {
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
					.checkbox-view {
						display: flex;
						align-items: center;
						font-size: 28upx;
						height: 90upx;
						color: #333;
						border-bottom: 1px solid #eee;
						.checkbox-item {
							display: flex;
							align-items: center;
							flex-grow: 1;
							.desc {
								margin-left: 30upx;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
						}
					}
					.item-textarea {
						width: 100%;
					}
					.textarea-placeholder {
						font-size: 28upx;
						color: $uni-text-color-placeholder;
					}
					input {
						width: 120upx;
						background: #eee;
						margin-right: 24upx;
						border-radius: 8upx;
					}
					.tip {
						color: #999;
					}
				}
			}
		}
		.button-wrapper {
			width: 100%;
			padding: 30upx;
			box-sizing: border-box;
			margin-top: -180upx;
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
