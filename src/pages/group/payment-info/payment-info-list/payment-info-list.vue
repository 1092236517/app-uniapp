<template>
    <view class="payment-info-list-wrapper">
    	<view class="nav-bar-view">
    		<view class="nav-bar">
    			<view
    				v-for="(item, index) in navList"
    				:key="index"
    				class="nav-item"
    				:class="{active: index === activeIndex}"
    				@click="handleNavClick(index)">
    				<text class="desc">
    					{{ item.label }}
    					<text class="tip" :class="{'tip-show': item.unreadCount > 0}"></text>
    				</text>
    			</view>
    		</view>
    		<view class="line" :style="{left: marginLeft}"></view>
    	</view>
    	<view class="content-wrapper" :class="{show: activeIndex === 0}">
    		<view class="message-list">
    				<view
    					v-for="(item, index) in all.messageList"
    					:key="index"
    					class="message-item-wrapper">
    					<view class="message-item">
    						<view class="content" @click="intoDetail(item)">
    							<view class="title">
									<text class="line"></text>
    								<text class="title-content">
    									项目名称 : {{item.product_name}}
    								</text>
    								<text class="tip" v-show="item.status == 'WAIT_PAY'" @click="intoDetail(item)">去支付</text>
    							</view>
    							<view class="accountItem">
    								<view><text class="accountTit">批次订单编号：</text><text class="accountCon">{{item.slave_order_code}}</text></view>
    								<view><text class="accountTit"> 产品名称：</text><text class="accountCon">{{item.project_name}}</text></view>
    								<view><text class="accountTit">收款方户名：</text><text class="accountCon">{{item.payee_account}}</text></view>
									<view><text class="accountTit">付款方户名：</text><text class="accountCon">{{item.payer_account}}</text></view>
									<view><text class="accountTit">支付金额：</text><text class="accountCon">{{item.money}}</text></view>
    							</view>
    						</view>
    					</view>
    				</view>
    		</view>
    		<view class="no-more-view" v-if="all.currentPage >= totalPageAll">
    			<zn-no-more></zn-no-more>
    		</view>
    	</view>
    	<view class="content-wrapper" :class="{show: activeIndex === 1}">
    		<view class="message-list">
    				<view
    					v-for="(item, index) in wait_pay.messageList"
    					:key="index"
    					class="message-item-wrapper">
    					<view class="message-item">
    						<view class="content" @click="intoDetail(item)">
    							<view class="title">
									<text class="line"></text>
    								<text class="title-content">
    									项目名称 : {{item.product_name}}
    								</text>
    								<text class="tip" v-show="item.status == 'WAIT_PAY'" @click="intoDetail(item)">去支付</text>
    							</view>
    							<view class="accountItem">
    								<view><text class="accountTit">批次订单编号：</text><text class="accountCon">{{item.slave_order_code}}</text></view>
    								<view><text class="accountTit"> 产品名称：</text><text class="accountCon">{{item.project_name}}</text></view>
    								<view><text class="accountTit">收款方户名：</text><text class="accountCon">{{item.payee_account}}</text></view>
    								<view><text class="accountTit">付款方户名：</text><text class="accountCon">{{item.payer_account}}</text></view>
    								<view><text class="accountTit">支付金额：</text><text class="accountCon">{{item.money}}</text></view>
    							</view>
    						</view>
    					</view>
    				</view>
    		</view>
    		<view class="no-more-view" v-if="wait_pay.currentPage >= totalPageWait">
    			<zn-no-more></zn-no-more>
    		</view>
    	</view>
		<view class="content-wrapper" :class="{show: activeIndex === 2}">
			<view class="message-list">
					<view
						v-for="(item, index) in pay_already.messageList"
						:key="index"
						class="message-item-wrapper">
						<view class="message-item">
							<view class="content" @click="intoDetail(item)">
								<view class="title">
									<text class="line"></text>
									<text class="title-content">
										项目名称 : {{item.product_name}}
									</text>
									<text class="tip" v-show="item.status == 'WAIT_PAY'" @click="intoDetail(item)">去支付</text>
								</view>
								<view class="accountItem">
									<view><text class="accountTit">批次订单编号：</text><text class="accountCon">{{item.slave_order_code}}</text></view>
									<view><text class="accountTit"> 产品名称：</text><text class="accountCon">{{item.project_name}}</text></view>
									<view><text class="accountTit">收款方户名：</text><text class="accountCon">{{item.payee_account}}</text></view>
									<view><text class="accountTit">付款方户名：</text><text class="accountCon">{{item.payer_account}}</text></view>
									<view><text class="accountTit">支付金额：</text><text class="accountCon">{{item.money}}</text></view>
								</view>
							</view>
						</view>
					</view>
			</view>
			<view class="no-more-view" v-if="pay_already.currentPage >= totalPageAlready">
				<zn-no-more></zn-no-more>
			</view>
		</view>
    </view>
</template>

<script>
	import znNoMore from '../../../../components/zn-no-more.vue'
    export default {
        name: 'payment-info-list',
		components: {
			znNoMore
		},
        data() {
            return {
                navList: [
                	{
                		label: '全部',
                		unreadCount: 0,
                		value: 'all'
                	},
                	{
                		label: '未支付',
                		unreadCount: 0,
                		value: 'wait_pay'
                	},
					{
						label: '已支付',
						unreadCount: 0,
						value: 'pay_already'
					}
                ],
                activeIndex: 0,
                token: this.$store.state.token,
				all: {
					loading: false,
					messageList: [],
					perPage: 10,
					currentPage: 1,
					total: 0,
				},
				wait_pay: {
					loading: false,
					messageList: [],
					perPage: 10,
					currentPage: 1,
					total: 0,
				},
				pay_already: {
					loading: false,
					messageList: [],
					perPage: 10,
					currentPage: 1,
					total: 0,
				},
            }
        },
		computed: {
			totalPageAll() { //付款账户总页数
				return Math.ceil(this.all.total / this.all.perPage)
			},
			totalPageWait() { //收款账户总页数
				return Math.ceil(this.wait_pay.total / this.wait_pay.perPage)
			},
			totalPageAlready() { //收款账户总页数
				return Math.ceil(this.pay_already.total / this.pay_already.perPage)
			},
			marginLeft() {
				return uni.upx2px(38 + 250 * this.activeIndex) + 'px'
			}
		},
		onShow() {
			this.init('all');
			this.init('wait_pay');
			this.init('pay_already');
		},
		onReachBottom() { //页面上拉触底事件的处理函数
			this.loadMore();
		},
		onNavigationBarSearchInputClicked() { //监听原生标题栏搜索输入框点击事件
			
		},
		onNavigationBarSearchInputConfirmed(event) { //监听原生标题栏搜索输入框搜索事件，用户点击软键盘上的“搜索”按钮时触发
			this.search(event.text);
		},
		onNavigationBarSearchInputChanged() { //监听原生标题栏搜索输入框输入内容变化事件
			
		},
        methods: {
            handleNavClick(index) { //导航栏tab点击
            	this.activeIndex = index;
            },
			loadMore() { //加载更多
				const index = parseInt(this.activeIndex);
				const type = this.navList[index]['value'];
				const totalPageObj = {
					all: 'totalPageAll',
					wait_pay: 'totalPageWait',
					pay_already:'totalPageAlready'
				}
				if(this[type]['loading']) {
					return false
				}
				if(this[type]['currentPage'] >= totalPageObj[type]) {
					return false
				}
				this[type]['currentPage'] += 1;
				const params = {
					status: type.toLocaleUpperCase(),
					perPage: this[type]['perPage'],
					currentPage: this[type]['currentPage']
				}
				this.getMessageList(params)
					.then(res => {
						const messageList = res.messageList;
						this[type]['messageList'].push(...messageList);
					})
			},
			search(searchValue) { //搜索
				this.searchValue = searchValue;
				const index = parseInt(this.activeIndex);
				const type = this.navList[index]['value'];
				const totalPageObj = {
					all: 'totalPageAll',
					wait_pay: 'totalPageWait',
					pay_already:'totalPageAlready'
				}
				if(this[type]['loading']) {
					return false
				}
				if(this[type]['currentPage'] >= totalPageObj[type]) {
					return false
				}
				this[type]['currentPage'] = 1;
				const params = {
					status: type.toLocaleUpperCase(),
					perPage: this[type]['perPage'],
					currentPage: this[type]['currentPage'],
					supplier_name:searchValue
				}
				this.getMessageList(params)
					.then(res => {
						const messageList = res.messageList;
						this[type]['messageList'] = messageList;
					})
			},
			/**
			 * 初始化页面
			 * @param {String} type 消息类型，值为'system'、'demand'和'order'
			 */
			init(type) {
				this[type]['currentPage'] = 1;
				this[type]['total'] = 0;
				this[type]['messageList'] = [];
				this.getMessageList({
					perPage: this[type]['perPage'],
					currentPage: 1,
					status: type.toLocaleUpperCase()
				})
				.then(res => {
					this[type]['total'] = res.total;
					this[type]['messageList'] = res.messageList;
					this.navList.forEach(item => { //更新导航栏未读消息
// 						if(item.value === type) {
// 							item.unreadCount = res.unreadTotal;
// 						}
					})
				})
			},
			getMessageList({status, perPage=10, currentPage=1} = {}) { //获取消息列表
				const params = {
					token: this.token,
					per_page: perPage,
					current_page: currentPage,
					type:'GroupToZhuNiu'
				};
				if(status!="ALL") {
					params.status = status;
				}
				uni.showLoading({
					title: '加载中'
				})
				return this.$api.groupPaymentInfoApi.infoList(params)
					.then(res => {
						const result = res.data;
						uni.hideLoading();
						if(result.msg_code === 100000) {
							const list = result.response.data;
							const total = result.response.total;
							const messageList = list.map(item=>{
								item.checked = false;
			                    item.id = item.id.toString();
								return item;
							});
							return {
								total,
								messageList
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
						uni.hideLoading();
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none'
						})
					})
			},
			intoDetail(item){
				console.log(111)
				uni.navigateTo({
					url: '/pages/group/payment-info/payment-info-detail/payment-info-detail?id='+item.id,
				})
			}
        }
    }
</script>

<style lang="scss">
    .payment-info-list-wrapper {
        position: relative;
        .nav-bar-view {
        	position: relative;
        	width: 100%;
        	height: 88upx;
        	line-height: 88upx;
        	background: #fff;
        	font-size: 32upx;
        	font-weight: 600;
        	color: #808080;
        	border-bottom: 1px solid #eee;
        	.nav-bar {
        		display: flex;
        		.nav-item {
        			width: 50%;
        			text-align: center;
        			.desc {
        				position: relative;
        				.tip {
        					position: absolute;
        					top: -3upx;
        					right: -6upx;
        					display: inline-block;
        					width: 12upx;
        					height: 12upx;
        					background: #EE1E1E;
        					border-radius: 50%;
        					visibility: hidden;
        					opacity: 0;
        					transform: scale(0);
        					transition: all .5s ease;
        				}
        				.tip-show {
        					visibility: visible;
        					opacity: 1;
        					transform: scale(1);
        				}
        			}
        		}
        		.active {
        			color: $uni-color-primary;
        		}
        	}
        	.line {
        		position: absolute;
        		left: 100upx;
        		bottom: 0;
        		width: 180upx;
        		height: 6upx;
        		border-radius: 3px;
        		background: $uni-color-primary;
        		transition: all .5s ease;
        	}
        }
        .content-wrapper {
        	display: none;
        	&.show {
        		display: block;
        	}
        }
        .message-list {
        	.message-item-wrapper {
        		.message-item {
        			display: flex;
        			align-items: center;
        			padding: 30upx;;
        			//border-bottom: 1px solid #eee;
        			margin-top: 20upx;
        			background: #fff;
        			.content {
        				flex-grow: 1;
        				font-size: 32upx;
        				color: #999;
        				.title {
        					border-bottom: 1upx solid #eee;
        					position: relative;
        					padding: 0 10upx 20upx 10upx;
							.line {
								display: inline-block;
								width: 6upx;
								height: 32upx;
								background: $uni-color-primary;
								margin-right: 20upx;
								border-radius: 3upx;
								vertical-align: middle;
							}
        					.title-content {
        						overflow: hidden;
        						white-space: nowrap;
        						text-overflow: ellipsis;
								font-size: 32upx;
								color: #333;
								font-weight: 700;
        					}
        					.tip {
        						position: absolute;
        						top: 0;
        						right: 10upx;
        						font-size:28upx;
        						font-weight:500;
        						color:rgba(0,102,204,1);
        					}
        				}
        				.accountItem {
        					font-size: 24upx;
        					color: #999;
        					line-height: 50upx;
        					padding: 10upx;
        					.accountTit{
        						display: inline-block;
        						width:200upx;
        					}
        					.accountCon{
        						font-size:28upx;
        						font-weight:500;
        						color:rgba(102,102,102,1);
        					}
        				}
        			}
        		}
        	}
        }
        .no-more-view {
        	background: #eee;
        	padding-bottom: 30upx;
        }
        
    }
</style>
