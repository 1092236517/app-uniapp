<template>
	<view class="payment-list-wrapper">
		<view class="content">
			<block v-for="(item, index) in demandList" :key="index">
				<view class="item-wrapper">
					<view class="item-header">
						<view class="title-view">
							<text class="line" :style="{background: item.statusColor}"></text>
							<text class="title">批次</text>
						</view>
						<view>
							<zn-label :labelText="item.statusText" :color="item.statusColor"></zn-label>
						</view>
					</view>
					<view class="item-content">
						<view class="content">
							<view class="desc">
								批次订单编号：{{ item.slaveOrderCode }}
							</view>
							<view class="desc">
								发货吨数： {{ item.count }}
							</view>
							<view class="desc">
								发货日期：{{ item.sendDate }}
							</view>
						</view>
						<view class="operation-wrapper">
							<view>查看订单详情</view>
							<view class="approve-view">
								<view class="desc">配置网价</view>
								<view class="btn">支付批次</view>
							</view>
						</view>
					</view>	
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import znLabel from '../../../components/zn-label.vue'
	
	const ORDER_COLOR_WAIT_FOR_PAY = '#0066CC';

	export default {
		name: 'payment-list-group',
		components: {
			znLabel
		},
		data() {
			return {
				searchValue: '',
				selectIndex: 2,
				selectRange: [
					{
						label: '全部',
						value: ''
					},
					{
						label: '待审核',
						value: 'waitForCheck'
					},
					{
						label: '发单成功',
						value: 'success'
					}
				],
				demandList: [
					{
						slaveOrderCode: 'S201903011748',
						count: '1000',
						sendDate: '2019-03-01 17:49',
						statusColor: ORDER_COLOR_WAIT_FOR_PAY,
						statusText: '待筑牛支付'
					}
				]
			}
		},
		onReachBottom() {
			console.log('加载中...')
		},
		methods: {
			selectChange(event) { //选择器改变
				this.selectIndex = event.detail.value;
			}
		}
	}
</script>

<style lang="scss">
	.payment-list-wrapper {
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
						.desc {
							text-align: center;
						}
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
	}
</style>

