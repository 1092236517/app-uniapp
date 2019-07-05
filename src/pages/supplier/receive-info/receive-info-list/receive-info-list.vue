<template>
    <view class="payment-info-list-wrapper">
    	<view class="content">
    		<block v-for="(item, index) in orderList" :key="index">
    			<view class="item-wrapper" @click="demandDetail(item)">
    				<view class="item-header">
    	                <view class="title-view">
    	                	<text class="line"></text>
    	                	<text class="title">项目名称：{{ item.project_name }}</text>
    	                </view>
    				</view>
    				<view class="item-content">
    					<view class="content">
    						<view class="desc">
    							批次订单号：{{ item.slave_order_code }}
    						</view>
    						<view class="desc">
    							产品名称：{{ item.product_name }}
    						</view>
    						<view class="desc">
    							收款方户名：{{ item.payee_name }}
    						</view>
							<view class="desc">
								付款方户名：{{ item.payer_name }}
							</view>
							<view class="desc">
								金额：{{ item.money }}
							</view>
    					</view>
    				</view>
    			</view>
    		</block>
    	    <template v-if="currentPage >= totalPage">
    	        <zn-no-more></zn-no-more>
    	    </template>
    	</view>
    </view>
</template>

<script>
	import znNoMore from '../../../../components/zn-no-more.vue'
    export default {
        name: 'receive-info-list',
		components: {
			znNoMore
		},
        data() {
            return {
                loading: false,
                token: this.$store.state.token,
				searchValue:'',
				orderList: [],
				currentPage: 1,
				perPage: 10,
				total: 0,
            }
        },
		computed: {
			totalPage() { //总页数
				return Math.ceil(this.total / this.perPage)
			}
		},
		onReachBottom() {
			this.loadMore();
		},
		onShow() {
			this.init();
		},
		onNavigationBarSearchInputClicked() { //监听原生标题栏搜索输入框点击事件
			
		},
		onNavigationBarSearchInputConfirmed(event) { //监听原生标题栏搜索输入框搜索事件，用户点击软键盘上的“搜索”按钮时触发
			this.search(event.text);
		},
		onNavigationBarSearchInputChanged() { //监听原生标题栏搜索输入框输入内容变化事件
			
		},
        methods: {
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
			search(searchValue) { //搜索
				this.currentPage = 1; //重置当前页
				this.orderList = []; //重置供应商列表
				this.searchValue = searchValue;
				this.getOrderList();
			},
			getOrderList(){
				const params = {
					token: this.token,
					per_page: this.perPage,
					current_page: this.currentPage,
					type: 'ZhuNiuToSupplier',
				}
				if(this.searchValue){
					params.project_name = this.searchValue;
				}
				uni.showLoading({
					title: '加载中'
				})
				this.loading = true;
				this.$api.supplierReceiveApi.receiveAccountList(params)
					.then(res => {
						const result = res.data;
						this.loading = false;
						uni.hideLoading();
						if(result.msg_code === 100000){
							this.total = result.response.total;
							const orderArr = result.response.data
							orderArr.map(item=>{
								let category_spec = JSON.parse(item.slaveOrder.master_order.demand.category_spec);
								let category_spec_min = category_spec.category_spec_min;
								let category_spec_max = category_spec.category_spec_max;
								let itemData={
									id:item.id,
									product_name:item.product_name,
									project_code:item.slaveOrder.master_order.demand.project_code,
									slave_order_code:item.slave_order_code,
									project_name:item.slaveOrder.master_order.demand.project_name,
									payee_name:item.payee_name,
									payer_name:item.payer_name,
									money:item.money
								};
								this.orderList.push(itemData);
							});
						}else {
							console.log(result);
							uni.showToast({
								title: result.message,
								icon: 'none'
							})
						}
					}).catch(err=>{
						console.log(err);
						this.loading = false;
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none'
						})
					})
			},
			demandDetail(item){
				let id = item.id;
				uni.navigateTo({
					url: `/pages/supplier/receive-info/receive-info-detail/receive-info-detail?id=${id}`
				})
			}
        }
    }
</script>

<style lang="scss">
    .payment-info-list-wrapper {
        .content {
        	.item-wrapper {
        		background: #fff;
        		margin-bottom: 20upx;
				cursor: pointer;
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
						background:#0066cc;
        			}
        			.title {
        				flex-grow: 1;
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
        		}
        	}
        }
    }
</style>
