<template>
	<view class="list-wrapper">
        <template v-if="orderListAuthObj.page.show">
        	<view class="header">
        		<view class="search-view">
        			<input
        				type="text"
        				v-model="searchValue"
        				placeholder="请输入项目名称/产品名称"
        				@confirm="search" />
        			<text class="iconfont search-icon">&#xe62f;</text>
        		</view>
        		<view class="select-view">
        			<picker
        				:range="selectRange"
        				:value="selectIndex"
        				range-key="label"
        				@change="selectChange">
        				<view>{{ selectRange[selectIndex].label }}</view>
        			</picker>
        			<text class="iconfont select-icon">&#xe63e;</text>
        		</view>
        	</view>
        	<view class="content">
        		<block v-for="(item, index) in orderList" :key="index">
        			<view class="item-wrapper">
        				<view class="item-header">
        	                <view class="title-view" @click="handleFoldChange(item)">
        	                	<text class="line" :style="{background: item.statusColor}"></text>
        	                	<text class="title">项目名称：{{ item.programName }}</text>
        	                	<text class="iconfont icon" :class="{'icon-unfold': !item.isFold}">&#xe63e;</text>
        	                </view>
        	                <view class="content-wrapper" v-if="!item.isFold">
        	                	<view class="content">
        	                		<view class="desc">
        	                			项目编码：{{ item.programCode }}
        	                		</view>
        	                		<view class="desc">
        	                			产品名称：{{ item.productName }}
        	                		</view>
        	                		<view class="desc">
        	                			产品规格：{{ item.productSpec }}
        	                		</view>
        	                		<view class="desc">
        	                			拟采数量：{{ item.purchaseCount }}
        	                		</view>
        	                		<view class="desc">
        	                			发布时间：{{ item.startTime }}
        	                		</view>
        	                		<view class="desc">
        	                			报价截止：{{ item.endTime }}
        	                		</view>
        	                	</view>
        	                	<view class="operation-wrapper">
        	                		<view
        	                            v-if="orderListAuthObj.viewOrderDetailBtn.show"
        	                            @click="viewOrderDetail(item.id)">查看订单详情</view>
        	                	</view>
        	                </view>
        				</view>
        				<view class="item-content" v-for="(slaveItem, slaveIndex) in item.slaveOrderList" :key="slaveIndex">
        					<view class="content">
        						<view class="title">批次{{ slaveIndex + 1 }}</view>
        						<view class="desc">
        							批次订单号：{{ slaveItem.slaveOrderNo }}
        						</view>
        						<view class="desc">
        							发货吨数：{{ slaveItem.sendGoodsCount }}
        						</view>
        						<view class="desc">
        							发货日期：{{ slaveItem.sendGoodsTime }}
        						</view>
        					</view>
        					<view class="operation-wrapper">
        						<view
        	                        v-if="orderListAuthObj.viewSlaveOrderDetailBtn.show"
        	                        @click="viewSlaveOrderDetail(item.id, slaveItem.slaveOrderNo, slaveItem.id)">查看批次详情</view>
        						<view class="approve-view">
        							<view
        								class="btn"
        								v-if="slaveItem.status === 'WAIT_GROUP_PAY' && slaveItem.groupCanPay && orderListAuthObj.payBtn.show"
        								@click="pay(slaveItem.id, slaveItem.slaveOrderNo)">支付批次</view>
        						</view>
        					</view>
        				</view>
        			</view>
        		</block>
                <template v-if="currentPage >= totalPage">
                    <zn-no-more></zn-no-more>
                </template>
        	</view>
        </template>
        <template v-else>
        	<view class="no-permission">请联系管理员配置权限</view>
        </template>
	</view>
</template>

<script>
	import znAccordion from '../../../../components/zn-accordion.vue'
	import znNoMore from '../../../../components/zn-no-more.vue'

	const WAIT_FOR_OPERATE_STATUS_ARR = ['WAIT_GROUP_PAY', 'WAIT_GROUP_CONFIRM_PAY'];
	export default {
		name: 'order-list-group',
		components: {
			znAccordion,
			znNoMore
		},
		data() {
			return {
				loading: false,
				token: this.$store.state.token,
				searchValue: '',
				selectIndex: 1,
				selectRange: [
					{
						label: '全部',
						value: ''
					},
					{
						label: '待操作',
						value: 'WAIT_OPERATE'
					},
					{
						label: '待支付',
						value: 'WAIT_GROUP_PAY'
					},
					{
						label: '待确认支付',
						value: 'WAIT_GROUP_CONFIRM_PAY'
					},
                    {
                        label: '关闭中',
                        value: 'CLOSING'
                    },
                    {
                        label: '已关闭',
                        value: 'CLOSED'
                    }
				],
				orderList: [],
				currentPage: 1,
				perPage: 10,
				total: '',
                orderListAuthObj: {
                    page: {
                        chName: '显示',
                        show: false
                    },
                    viewOrderDetailBtn: {
                        chName: '查看详情',
                        show: false
                    },
                    payBtn: {
                        chName: '支付批次',
                        show: false
                    },
                    viewSlaveOrderDetailBtn: {
                        chName: '查看批次详情',
                        show: false
                    }
                }
			}
		},
		computed: {
			selectStatus() {
				return this.selectRange[this.selectIndex]['value']
			},
			totalPage() { //总页数
				return Math.ceil(this.total / this.perPage)
			}
		},
		created() {
            this.getAuth();
		},
// 		onReachBottom() {
// 			this.loadMore();
// 		},
		methods: {
			selectChange(event) { //选择器改变
				this.selectIndex = event.detail.value;
				this.init();
			},
			handleFoldChange(item) { //折叠、展开
				item.isFold = !item.isFold;
			},
			getOrderList() { //获取联采订单列表
				const params = {
					token: this.token,
					per_page: this.perPage,
					current_page: this.currentPage,
					status: this.selectStatus,
					project_name: this.searchValue,
					type: 'GROUP'
				}
				uni.showLoading({
					title: '加载中'
				})
				this.loading = true;
				this.$api.groupOrderApi.orderList(params)
					.then(res => {
						const result = res.data;
						this.loading = false;
						uni.hideLoading();
						if(result.msg_code === 100000){
							const orderArr = result.response.orders;
							this.total = result.response.totalNum;
							orderArr.forEach((item, index) => {
								const demandInfo = item.demand;
								const demandPurchaseInfo = item.demand_purchase;
								let element = {
									id: item.id,
									programName: demandInfo.project_name,
									programCode: demandInfo.project_code,
									productName: item.category.name,
									purchaseCount: item.purchase_num,
									startTime: item.created_at,
									endTime: demandPurchaseInfo.deadline,
									slaveOrderList: [],
									isFold: true,
									statusColor: '#0066cc'
								}
								const spec = JSON.parse(item.category_spec);
								element.productSpec = spec.category_spec_min + '-' + spec.category_spec_max;
								if(item.slave_orders.length > 0) { //批次订单
									item.slave_orders.forEach((slaveItem, slaveIndex) => {
										if(WAIT_FOR_OPERATE_STATUS_ARR.includes(slaveItem.status)) {
											element.slaveOrderList.push({
												id: slaveItem.id,
												slaveOrderNo: slaveItem.order_no,
												sendGoodsCount: '',
												sendGoodsTime: slaveItem.send_goods_time || '--',
												status: slaveItem.status,
												groupCanPay: this.groupCanPay(slaveItem)
											})
										}
									})
								}
								this.orderList.push(element);
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
						this.loading = false;
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none'
						})
					})
			},
            init() { //初始化
                this.currentPage = 1; //重置当前页
                this.orderList = []; //清空当前列表
                this.getOrderList();
            },
			loadMore() { //加载更多
				if(this.loading) {
					return false
				}
				if(this.currentPage >= this.totalPage) {
					return false
				}
				this.currentPage += 1;
				this.getOrderList()
			},
			search() { //搜索
				this.init();
			},
			viewSlaveOrderDetail(orderId, slaveOrderNo, slaveOrderId) { //查看批次订单详情
				uni.navigateTo({
					url: `/pages/group/order/slave-order/detail/detail?orderId=${orderId}&slaveOrderNo=${slaveOrderNo}&slaveOrderId=${slaveOrderId}`
				})
			},
			viewOrderDetail(orderId) { //查看订单详情
				uni.navigateTo({
					url: `/pages/group/order/detail/detail?orderId=${orderId}`
				})
			},
			pay(slaveOrderId, slaveOrderNo) { //支付批次
				uni.navigateTo({
					url: `/pages/group/order/select-payment/select-payment?slaveOrderId=${slaveOrderId}&slaveOrderNo=${slaveOrderNo}`
				})
			},
            groupCanPay(item){ //财务部能否支付判断
                const payType = item.paid_type;
                const canPay = item.is_can_pay;
                if(payType == 'PAID_BEFORE'){
                    return true
                }
                if(payType != 'PAID_BEFORE' && canPay){
                    return true
                }
                return false
            },
            getAuth() { //获取权限
                const orderListPermissionObj = this.$store.getters.permissionList.MobileSlaveOrderList;
                this.$func.getAuth(orderListPermissionObj, this.orderListAuthObj);
            }
		}
	}
</script>

<style lang="scss" scoped>
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
					color: $uni-color-primary;
					font-size: 30upx;
				}
			}
		}
		.content {
			.item-wrapper {
				background: #fff;
				margin-bottom: 20upx;
				.item-header {
					font-size: 32upx;
					color: #333;
					font-weight: 700;
					.title-view {
						display: flex;
						align-items: center;
						padding: 30upx;
						border-bottom: 1px solid #eee;
					}
					.line {
						display: inline-block;
						width: 6upx;
						height: 32upx;
						margin-right: 20upx;
						border-radius: 3upx;
						vertical-align: middle;
					}
					.title {
						flex-grow: 1;
					}
					.icon {
						font-weight: 400;
						color: #999;
						font-size: 30upx;
						transition: all .3s ease;
					}
					.icon-unfold {
						transform: rotateZ(-180deg);
					}
					.content-wrapper {
						display: flex;
						flex-wrap: nowrap;
						padding: 20upx 30upx;
						font-weight: 400;
						background: #eee;
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
				.item-content {
					display: flex;
					flex-wrap: nowrap;
					padding: 30upx;
					.content {
						flex-grow: 1;
						line-height: 56upx;
						font-size: 28upx;
						color: #999;
						overflow: hidden;
						.title {
							font-size: 30upx;
							color: #333;
						}
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
	}
</style>
