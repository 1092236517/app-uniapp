<template>
    <view class="payment-account-list-wrapper">
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
				<checkbox-group @change="checkboxChange">
					<view
						v-for="(item, index) in account_pay.messageList"
						:key="index"
						class="message-item-wrapper">
						<view class="message-item">
							<view class="checkbox" :class="{'checkbox-edit': isEdit}">
								<checkbox
									:value="item.id"
									:checked="item.checked"
									color="#0066cc" />
							</view>
							<view class="content" @click="selectItem(item)">
								<view class="title">
									<text class="title-content">
										{{item.account_name}}
									</text>
									<text class="tip" @click="viewDesc(item,'ACCOUNT_PAY')">编辑</text>
								</view>
								<view class="accountItem">
									<view><text class="accountTit">银行账号：</text><text class="accountCon">{{item.account}}</text></view>
									<view><text class="accountTit">开户行：</text><text class="accountCon">{{item.bank_name}}</text></view>
									<view><text class="accountTit">城市名称：</text><text class="accountCon">{{item.address_city}}</text></view>
								</view>
								<view class="switchBox">
									<text class="title-content">设置为默认付款账户</text>
									<!-- <switch @click="switchChange(item,$event)" /> -->
									<image class="switchbtn" @click="switchChange(item)" v-if="item.status=='UnUsed'" src="../../../../static/images/group/payment-account/switch_uncheck.png"></image>
									<image class="switchbtn" v-else src="../../../../static/images/group/payment-account/switch_checked.png"></image>
								</view>
							</view>
						</view>
					</view>
				</checkbox-group>
			</view>
			<view class="message-item-btn"><button type="primary" class="btn" @click="addAccount('ACCOUNT_PAY')">添加付款账户</button></view>
			<view class="no-more-view" v-if="account_pay.currentPage >= totalPagePay">
				<zn-no-more></zn-no-more>
			</view>
		</view>
		<view class="content-wrapper" :class="{show: activeIndex === 1}">
			<view class="message-list">
				<checkbox-group @change="checkboxChange">
					<view
						v-for="(item, index) in account_receive.messageList"
						:key="index"
						class="message-item-wrapper">
						<view class="message-item">
							<view class="checkbox" :class="{'checkbox-edit': isEdit}">
								<checkbox
									:value="item.id"
									:checked="item.checked"
									color="#0066cc" />
							</view>
							<view class="content" @click="selectItem(item)">
								<view class="title">
									<text class="title-content">
										{{item.account_name}}
									</text>
									<text class="tip" @click="viewDesc(item,'ACCOUNT_RECEIVE')">编辑</text>
								</view>
								<view class="accountItem">
									<view><text class="accountTit">银行账号：</text><text class="accountCon">{{item.account}}</text></view>
									<view><text class="accountTit">开户行：</text><text class="accountCon">{{item.bank_name}}</text></view>
									<view><text class="accountTit">城市名称：</text><text class="accountCon">{{item.address_city}}</text></view>
								</view>
							</view>
						</view>
					</view>
				</checkbox-group>
			</view>
			<view class="message-item-btn"><button type="primary" class="btn" @click="addAccount('ACCOUNT_RECEIVE')">添加收款账户</button></view>
			<view class="no-more-view" v-if="account_receive.currentPage >= totalPageReceive">
				<zn-no-more></zn-no-more>
			</view>
		</view>
		<view class="button-wrapper" :class="{'button-wrapper-edit': isEdit}">
			<text class="btn-select-all" @click="selectAll">{{ selectAllText }}</text>
			<view>
				<text class="btn-delete" @click="deleteMessage">删除</text>
			</view>
		</view>
	</view>
</template>

<script>
	import znNoMore from '../../../../components/zn-no-more.vue'
	
    export default {
        name: 'payment-account-list-group',
		components: {
			znNoMore
		},
        data() {
            return {
                navList: [
                	{
                		label: '付款账户信息',
                		unreadCount: 0,
                		value: 'account_pay'
                	},
                	{
                		label: '收款账户信息',
                		unreadCount: 0,
                		value: 'account_receive'
                	},
                ],
                activeIndex: 0,
                token: this.$store.state.token,
                isEdit: false,
				account_pay: {
					loading: false,
					messageList: [],
					perPage: 10,
					currentPage: 1,
					total: 0,
					unreadTotal: 0
				},
				account_receive: {
					loading: false,
					messageList: [],
					perPage: 10,
					currentPage: 1,
					total: 0,
					unreadTotal: 0
				},
            }
        },
		computed: {
			isSelectAll() { //是否全选
				const index = parseInt(this.activeIndex);
				const type = this.navList[index]['value'];
				return this[type]['messageList'].every(item => item.checked)
			},
			selectAllText() { //全选文案
				return this.isSelectAll ? '取消全选' : '全选'
			},
			totalPagePay() { //付款账户总页数
				return Math.ceil(this.account_pay.total / this.account_pay.perPage)
			},
			totalPageReceive() { //收款账户总页数
				return Math.ceil(this.account_receive.total / this.account_receive.perPage)
			},
			marginLeft() {
				return uni.upx2px(70 + 380 * this.activeIndex) + 'px'
			}
		},
		onShow() {
			this.init('account_pay');
			this.init('account_receive');
		},
		onNavigationBarButtonTap(e) { //监听原生标题栏按钮点击事件
			const buttonIndex = e.index;
			this.handleNavigationBarButtonTap(buttonIndex)
		},
		onReachBottom() { //页面上拉触底事件的处理函数
			this.loadMore();
		},
        methods: {
			switchChange(item){
				let that = this;
				let context = '';
				if(item.status=='UnUsed'){
					context = '是否设为默认支付账户？';
				}else{
					context = '是否取消默认支付账户？';
				}
				let params = {
					token:that.token,
					id:item.id,
					type:'GROUP'
				};
				uni.showModal({
					title: '提示',
					content: context,
					success(res) {
						if(res.confirm) {
							that.$api.groupAccountApi.accountSet(params).then(response=>{
								let result = response.data
								if(result.msg_code===100000){
									uni.showToast({
										title: '操作成功！',
										icon: 'success'
									});
									that.init('account_pay');
								}else {
									console.log(result);
									uni.showToast({
										title: result.message,
										icon: 'none'
									})
								}
							}).catch(err => {
								console.log(err);
								uni.hideLoading();
								uni.showToast({
									title: JSON.stringify(err),
									icon: 'none'
								})
							})
						}
					}
				})
			},
            handleNavClick(index) { //导航栏tab点击
            	if(this.isEdit) {
            		uni.showToast({
            			title: '编辑状态下不可切换~',
            			icon: 'none'
            		});
            		return false
            	}
            	this.activeIndex = index;
            },
			checkboxChange(e) { //监听checkbox改变
				const selectedArr = e.detail.value;
				const index = parseInt(this.activeIndex);
				const type = this.navList[index]['value'];
				this[type]['messageList'].forEach((messageItem, messageIndex) => { //更新不完整需求列表选中状态
					messageItem.checked = false;
					selectedArr.forEach((selectedItem, selectedIndex) => {
						if(selectedItem == messageItem.id) {
							messageItem.checked = true;
						}
					})
				});
			},
			selectItem(item) { //选中
				if(!this.isEdit) {
					return false
				}
				item.checked = !item.checked;
			},
			selectAll() { //全选/取消全选
				const index = parseInt(this.activeIndex);
				const type = this.navList[index]['value'];
				if(this.isSelectAll) {
					this[type]['messageList'].forEach((item, index) => {
						item.checked = false;
					})
				}else {
					this[type]['messageList'].forEach((item, index) => {
						item.checked = true;
					})
				}
			},
			reset() { //重置列表选中状态
				const index = parseInt(this.activeIndex);
				const type = this.navList[index]['value'];
				this[type]['messageList'].forEach((item, index) => {
					item.checked = false;
				})
			},
			viewDesc(item,type) { //查看消息详情
				if(type=='ACCOUNT_PAY'){
					uni.navigateTo({
						url: '/pages/group/payment-account/account-pay-add/account-pay-add?id='+item.id,
					})
				}else{
					uni.navigateTo({
						url: '/pages/group/payment-account/account-receive-add/account-receive-add?id='+item.id,
					})
				}
			},
			deleteMessage() { //删除确认
				const _this = this;
				const index = parseInt(this.activeIndex);
				const type = this.navList[index]['value'];
				const selectedArr = this[type]['messageList'].filter(item => item.checked);
				if(selectedArr.length === 0) {
					uni.showToast({
						title: '你还没选择账户！',
						icon: 'none'
					})
					return false
				}
				const selectedIdArr = selectedArr.map(item => item.id);
				const params = {
					token: this.token,
					id: selectedIdArr.join(',')
				}
				uni.showModal({
					title: '提示',
					content: '确定删除吗？',
					success(res) {
						if(res.confirm) {
							_this.messageDelete(params, type)
						}
					}
				})
			},
			messageDelete(params, type) { //删除
				uni.showLoading({
					title: '提交中'
				});
				this.$api.groupAccountApi.accountDelete(params)
					.then(res => {
						uni.hideLoading();
						const result = res.data;
						if(result.msg_code === 100000) {
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							});
							this.init(type);
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
			editAppTitleBtnText(index, text) { //修改app原生导航栏按钮文案
				const pages = getCurrentPages();  
				const page = pages[pages.length - 1];  
				// #ifdef APP-PLUS  
				let currentWebview = page.$getAppWebview();  
				let titleObj = currentWebview.getStyle().titleNView;  
				if (!titleObj.buttons) {  
					return;  
				}  
				titleObj.buttons[index].text = text;  
				currentWebview.setStyle({  
					titleNView: titleObj  
				});  
				// #endif
			},
			/**
			 * 获取消息列表
			 * @param  {String} options.isRead         已读/未读，值为'read'和'unread'
			 * @param  {String} options.type           消息类型，值为'DEMAND'、'ORDER'和'SYSTEM'
			 * @param  {Number} options.perPage        每页数量，默认为10
			 * @param  {Number} options.currentPage    当前页数，默认为1
			 * @return {Object} Promise对象
			 */
			getMessageList({account_type, perPage=10, currentPage=1} = {}) { //获取消息列表
				const params = {
					token: this.token,
					per_page: perPage,
					current_page: currentPage,
					type:'GROUP'
				};
				if(account_type) {
					params.account_type = account_type;
				}
				uni.showLoading({
					title: '加载中'
				})
				return this.$api.groupAccountApi.accountList(params)
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
			loadMore() { //加载更多
				const index = parseInt(this.activeIndex);
				const type = this.navList[index]['value'];
				const totalPageObj = {
					account_pay: 'totalPagePay',
					account_receive: 'totalPageReceive',
				}
				if(this[type]['loading']) {
					return false
				}
				if(this.isEdit) {
					return false
				}
				if(this[type]['currentPage'] >= totalPageObj[type]) {
					return false
				}
				this[type]['currentPage'] += 1;
				const params = {
					account_type: type.toLocaleUpperCase(),
					perPage: this[type]['perPage'],
					currentPage: this[type]['currentPage']
				}
				this.getMessageList(params)
					.then(res => {
						const messageList = res.messageList;
						this[type]['messageList'].push(...messageList);
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
					account_type: type.toLocaleUpperCase()
				})
				.then(res => {
					this[type]['total'] = res.total;
					this[type]['unreadTotal'] = res.unreadTotal;
					this[type]['messageList'] = res.messageList;
					this.navList.forEach(item => { //更新导航栏未读消息
// 						if(item.value === type) {
// 							item.unreadCount = res.unreadTotal;
// 						}
					})
				})
			},
			handleNavigationBarButtonTap(buttonIndex) { //处理导航栏按钮点击
				const index = parseInt(this.activeIndex);
				const type = this.navList[index]['value'];
				if(this[type]['messageList'].length === 0) {
					uni.showToast({
						title: '没有消息可操作',
						icon: 'none'
					});
					return false
				}
				this.isEdit = !this.isEdit;
				if(this.isEdit) {
					this.editAppTitleBtnText(buttonIndex, '完成');
				}else {
					this.editAppTitleBtnText(buttonIndex, '管理');
					this.reset()
				}
			},
			addAccount(type){
				if(type=='ACCOUNT_PAY'){
					uni.navigateTo({
						url: '/pages/group/payment-account/account-pay-add/account-pay-add',
					})
				}else{
					uni.navigateTo({
						url: '/pages/group/payment-account/account-receive-add/account-receive-add',
					})
				}
			}
        }
    }
</script>

<style scoped>
	uni-switch .uni-switch-input{
		height:8upx !important;
	}
	uni-switch .uni-switch-input:after, uni-switch .uni-switch-input:before{
		height: 6upx !important;
	}
</style>
<style lang="scss">
    .payment-account-list-wrapper {
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
        		width: 230upx;
        		height: 6upx;
        		border-radius: 3px;
        		background: $uni-color-primary;
        		transition: all .5s ease;
        	}
        }
        .content-wrapper {
        	display: none;
			padding-bottom: 100upx;
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
					.checkbox {
						width: 0;
						opacity: 0;
						overflow: hidden;
						transition: all .5s ease;
					}
					.checkbox-edit {
						width: 80upx;
						opacity: 1;
					}
					.content {
						flex-grow: 1;
						font-size: 32upx;
						color: #999;
						.title {
							border-bottom: 1upx solid #eee;
							position: relative;
							padding: 0 10upx 20upx 10upx;
							.title-content {
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
								font-size:28upx;
								font-weight:500;
								color:rgba(102,102,102,1);
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
								width:140upx;
							}
							.accountCon{
								font-size:28upx;
								font-weight:500;
								color:rgba(102,102,102,1);
							}
						}
						.switchBox{
							border-top: 1upx solid #eee;
							position: relative;
							padding: 20upx 10upx 0upx 10upx;
							display: flex;
							line-height: 50upx;
							.title-content {
								flex-grow: 1;
								overflow: hidden;
								white-space: nowrap;
								text-overflow: ellipsis;
								font-size:28upx;
								font-weight:500;
								color:rgba(102,102,102,1);
								// line-height: 70upx;
							}
							.switchbtn{
								width: 100upx;
								height: 50upx;
								transition: all .5s ease;
							}
						}
					}
					.icon {
						font-size: 28upx;
						transition: all .3s ease;
					}
					.icon-unfold {
						transform: rotateZ(90deg)
					}
				}
				.message-desc {
					font-size: 24upx;
					color: #666;
					background: #eee;
					height: 0;
					opacity: 0;
					overflow: hidden;
					box-sizing: border-box;
					transition: all .3s ease;
					.desc {
						padding: 30upx;
						width: 100%;
						height: 100%;
						box-sizing: border-box;
					}
				}
				.message-desc-unfold {
					height: 160upx;
					opacity: 1;
				}
			}
		}
		.no-more-view {
			background: #eee;
			padding-bottom: 30upx;
		}
		.message-item-btn{
			position: fixed;
			bottom: 10upx;
			width: 100%;
			.btn{
				width: 98%;
			}
		}
		
		.button-wrapper{
			position: fixed;
			left: 0;
			bottom: -100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 96upx;
			padding: 0 30upx;
			box-sizing: border-box;
			font-size: 32upx;
			background: #fff;
			transition: all .3s ease-in-out;
			border-top: 1px solid #eee;
			box-shadow: 0 -2upx 2upx rgba(0, 0, 0, .1);
			.btn-select-all {
				color: #999;
			}
			.btn-delete {
				color: #EE1E1E;
			}
			.btn-read {
				color: $uni-color-primary;
				margin-right: 40upx;
			}
		}
		.button-wrapper-edit {
			bottom: 0;
		}
    }
</style>
