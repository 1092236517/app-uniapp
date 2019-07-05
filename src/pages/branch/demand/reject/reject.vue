<template>
	<view class="reject-wrapper">
		<view class="main">
			<view class="item-wrapper">
				<view class="item-header">
					<view class="title-view">
						<text class="line"></text>
						<text class="title">驳回原因</text>
					</view>
				</view>
				<view class="item-content">
					<view class="item-input">
						<textarea
							v-model="rejectReason"
							placeholder="请输入驳回原因(120字以内)"
							class="item-textarea"
							:maxlength="120"
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
	export default {
		name: 'demand-reject-branch',
		data() {
			return {
				token: this.$store.state.token,
				demandPurchaseId: '',
				rejectReason: ''
			}
		},
		onLoad(option) {
			this.demandPurchaseId = option.demandPurchaseId;
		},
		methods: {
			submit() { //提交驳回原因
				const params = {
					token: this.token,
					status: 'PRE_FINISH_REJECT',
					branch_reject_reason: this.rejectReason
				}
				if(!this.rejectReason) {
					uni.showToast({
						title: '请输入驳回原因',
						icon: 'none'
					})
					return false
				}
                uni.showLoading({
                	title: '提交中',
                	mask: true
                });
				this.$api.branchDemandApi.demandExamine(params, this.demandPurchaseId)
					.then(res => {
                        uni.hideLoading();
						const result = res.data;
						if (result.msg_code === 100000) {
							uni.showToast({
								title: '操作成功!',
								icon: 'success'
							})
							uni.switchTab({
								url: '/pages/tabBar/joint-list/joint-list'
							})
						} else {
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
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}
	.reject-wrapper {
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
			margin-top: -160upx;
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
