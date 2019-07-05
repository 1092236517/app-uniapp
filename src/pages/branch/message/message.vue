<template>
	<view class="message-wrapper">
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
						v-for="(item, index) in system.messageList"
						:key="index"
						class="message-item-wrapper">
						<view class="message-item" @click="viewDesc(item)">
							<view class="checkbox" :class="{'checkbox-edit': isEdit}">
								<checkbox
									:value="item.messageId"
									:checked="item.checked"
									color="#0066cc" />
							</view>
							<view class="content" @click="selectItem(item)">
								<view class="title">
									<text class="title-content" :class="{'title-content-bold': item.isRead === 0}">
										{{ item.title }}
										<text class="tip" :class="{'tip-show': item.isRead === 0}"></text>
									</text>
								</view>
								<view class="date">
									{{ item.date }}
								</view>
							</view>
							<view class="iconfont icon" :class="{'icon-unfold': !item.isFold}">
								&#xe620;
							</view>
						</view>
						<view class="message-desc" :class="{'message-desc-unfold': !item.isFold}">
							<view class="desc">
								{{ item.content }}
							</view>
						</view>
					</view>
				</checkbox-group>
			</view>
			<view class="no-more-view" v-if="system.currentPage >= totalPageSystem">
				<zn-no-more></zn-no-more>
			</view>
		</view>
		<view class="content-wrapper" :class="{show: activeIndex === 1}">
			<view class="message-list">
				<checkbox-group @change="checkboxChange">
					<view
						v-for="(item, index) in demand.messageList"
						:key="index"
						class="message-item-wrapper">
						<view class="message-item" @click="viewDesc(item)">
							<view class="checkbox" :class="{'checkbox-edit': isEdit}">
								<checkbox
									:value="item.messageId"
									:checked="item.checked"
									color="#0066cc" />
							</view>
							<view class="content" @click="selectItem(item)">
								<view class="title">
									<text class="title-content" :class="{'title-content-bold': item.isRead === 0}">
										{{ item.title }}
										<text class="tip" :class="{'tip-show': item.isRead === 0}"></text>
									</text>
								</view>
								<view class="date">
									{{ item.date }}
								</view>
							</view>
							<view class="iconfont icon" :class="{'icon-unfold': !item.isFold}">
								&#xe620;
							</view>
						</view>
						<view class="message-desc" :class="{'message-desc-unfold': !item.isFold}">
							<view class="desc">
								{{ item.content }}
							</view>
						</view>
					</view>
				</checkbox-group>
			</view>
			<view class="no-more-view" v-if="demand.currentPage >= totalPageDemand">
				<zn-no-more></zn-no-more>
			</view>
		</view>
		<view class="content-wrapper" :class="{show: activeIndex === 2}">
			<view class="message-list">
				<checkbox-group @change="checkboxChange">
					<view
						v-for="(item, index) in order.messageList"
						:key="index"
						class="message-item-wrapper">
						<view class="message-item" @click="viewDesc(item)">
							<view class="checkbox" :class="{'checkbox-edit': isEdit}">
								<checkbox
									:value="item.messageId"
									:checked="item.checked"
									color="#0066cc" />
							</view>
							<view class="content" @click="selectItem(item)">
								<view class="title">
									<text class="title-content" :class="{'title-content-bold': item.isRead === 0}">
										{{ item.title }}
										<text class="tip" :class="{'tip-show': item.isRead === 0}"></text>
									</text>
								</view>
								<view class="date">
									{{ item.date }}
								</view>
							</view>
							<view class="iconfont icon" :class="{'icon-unfold': !item.isFold}">
								&#xe620;
							</view>
						</view>
						<view class="message-desc" :class="{'message-desc-unfold': !item.isFold}">
							<view class="desc">
								{{ item.content }}
							</view>
						</view>
					</view>
				</checkbox-group>
			</view>
			<view class="no-more-view" v-if="order.currentPage >= totalPageOrder">
				<zn-no-more></zn-no-more>
			</view>
		</view>
		<view class="button-wrapper" :class="{'button-wrapper-edit': isEdit}">
			<text class="btn-select-all" @click="selectAll">{{ selectAllText }}</text>
			<view>
				<text class="btn-read" @click="batchReadMessage">标记为已读</text>
				<text class="btn-delete" @click="deleteMessage">删除</text>
			</view>
		</view>
	</view>
</template>

<script>
	import znNoMore from '../../../components/zn-no-more.vue'
	
	export default {
		name: 'message-branch',
		components: {
			znNoMore
		},
		data() {
			return {
				navList: [
					{
						label: '系统消息',
						unreadCount: 0,
						value: 'system'
					},
					{
						label: '需求消息',
						unreadCount: 0,
						value: 'demand'
					},
					{
						label: '订单信息',
						unreadCount: 0,
						value: 'order'
					}
				],
				activeIndex: 0,
				token: this.$store.state.token,
				isEdit: false,
				system: {
					loading: false,
					messageList: [],
					perPage: 10,
					currentPage: 1,
					total: 0,
					unreadTotal: 0
				},
				demand: {
					loading: false,
					messageList: [],
					perPage: 10,
					currentPage: 1,
					total: 0,
					unreadTotal: 0
				},
				order: {
					loading: false,
					messageList: [],
					perPage: 10,
					currentPage: 1,
					total: 0,
					unreadTotal: 0
				}
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
			totalPageSystem() { //系统消息总页数
				return Math.ceil(this.system.total / this.system.perPage)
			},
			totalPageDemand() { //需求消息总页数
				return Math.ceil(this.demand.total / this.demand.perPage)
			},
			totalPageOrder() { //订单消息总页数
				return Math.ceil(this.order.total / this.order.perPage)
			},
			marginLeft() {
				return uni.upx2px(38 + 250 * this.activeIndex) + 'px'
			}
		},
// 		onNavigationBarButtonTap(e) { //监听原生标题栏按钮点击事件
// 			const buttonIndex = e.index;
// 			this.handleNavigationBarButtonTap(buttonIndex)
// 		},
// 		onReachBottom() { //页面上拉触底事件的处理函数
// 			this.loadMore();
// 		},
		created() {
			this.init('system');
			this.init('demand');
			this.init('order');
		},
		methods: {
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
						if(selectedItem === messageItem.messageId) {
							messageItem.checked = true;
						}
					})
				})
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
			viewDesc(item) { //查看消息详情
				if(this.isEdit) {
					return false
				}
				item.isFold = !item.isFold;
				if(item.isRead === 0) { //标记已读
					this.readMessage(item)
				}
			},
			readMessage(item) { //标记消息为已读
                const index = parseInt(this.activeIndex);
                const type = this.navList[index]['value'];
				const params = {
					token: this.token,
					id: item.messageId,
                    type: type.toLocaleUpperCase()
				}
				this.$api.branchMessageApi.messageRead(params)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							const unreadTotal = result.response;
							item.isRead = 1;
							this.navList[index]['unreadCount'] = unreadTotal;
							this[type]['unreadTotal'] = unreadTotal;
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
			batchReadMessage() { //批量标记消息为已读
				const index = parseInt(this.activeIndex);
				const type = this.navList[index]['value'];
				const selectedArr = this[type]['messageList'].filter(item => item.checked);
				if(selectedArr.length === 0) {
					uni.showToast({
						title: '你还没选择消息！',
						icon: 'none'
					})
					return false
				}
				const selectedIdArr = selectedArr.map(item => item.messageId);
				const params = {
					token: this.token,
					id: selectedIdArr.join(','),
                    type: type.toLocaleUpperCase()
				}
				uni.showLoading({
					title: '提交中',
				    mask: true
				});
				this.$api.branchMessageApi.messageRead(params)
					.then(res => {
						const result = res.data;
						uni.hideLoading();
						if(result.msg_code === 100000) {
                            const unreadTotal = result.response;
							uni.showToast({
								title: '操作成功！',
								icon: 'success'
							});
							this[type]['messageList'].forEach((item, index) => {
								if(item.checked) {
									item.isRead = 1;
									item.checked = false;
								}
							})
                            this.navList[index]['unreadCount'] = unreadTotal;
                            this[type]['unreadTotal'] = unreadTotal;
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
			deleteMessage() { //删除确认
				const _this = this;
				const index = parseInt(this.activeIndex);
				const type = this.navList[index]['value'];
				const selectedArr = this[type]['messageList'].filter(item => item.checked);
				if(selectedArr.length === 0) {
					uni.showToast({
						title: '你还没选择消息！',
						icon: 'none'
					})
					return false
				}
				const selectedIdArr = selectedArr.map(item => item.messageId);
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
			messageDelete(params, type) { //删除不完整需求
				uni.showLoading({
					title: '提交中'
				});
				this.$api.branchMessageApi.messageDelete(params)
					.then(res => {
						const result = res.data;
						uni.hideLoading();
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
			getMessageList({isRead, type, perPage=10, currentPage=1} = {}) { //获取消息列表
				const params = {
					token: this.token,
					per_page: perPage,
					current_page: currentPage
				};
				const readObj = {
					read: 1,
					unread: 0
				}
				if(isRead) {
					params.is_read = readObj[isRead] || ''
				}
				if(type) {
					params.type = type;
				}
				uni.showLoading({
					title: '加载中'
				})
				return this.$api.branchMessageApi.messageList(params)
					.then(res => {
						const result = res.data;
						uni.hideLoading();
						if(result.msg_code === 100000) {
							const list = result.response.data;
							const total = result.response.total;
							const unreadTotal = result.response.unReadTotal;
							const messageList = list.map((item, index) => {
								return {
									title: item.title,
									date: item.created_at,
									messageId: item.id.toString(),
									checked: false,
									isRead: item.is_read,
									content: item.message,
									isFold: true
								};
							})
							return {
								total,
								unreadTotal,
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
					system: 'totalPageSystem',
					demand: 'totalPageDemand',
					order: 'totalPageOrder'
				}
                const totalPageName = totalPageObj[type];
				if(this[type]['loading']) {
					return false
				}
				if(this.isEdit) {
					return false
				}
				if(this[type]['currentPage'] >= this[totalPageName]) {
					return false
				}
				this[type]['currentPage'] += 1;
				const params = {
					type: type.toLocaleUpperCase(),
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
				return this.getMessageList({
					perPage: this[type]['perPage'],
					currentPage: 1,
					type: type.toLocaleUpperCase()
				})
				.then(res => {
					this[type]['total'] = res.total;
					this[type]['unreadTotal'] = res.unreadTotal;
					this[type]['messageList'] = res.messageList;
					this.navList.forEach(item => { //更新导航栏未读消息
						if(item.value === type) {
							item.unreadCount = res.unreadTotal;
						}
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
			}
		}
	}
</script>

<style lang="scss">
	.message-wrapper{
		.nav-bar-view {
			position: sticky;
			/* #ifdef APP-PLUS */
			top: 0;
			/* #endif */
			/* #ifdef H5 */
			top: var(--window-top);
			/* #endif */
			width: 100%;
			height: 88upx;
			line-height: 88upx;
			background: #fff;
			font-size: 32upx;
			font-weight: 600;
			color: #808080;
			border-bottom: 1px solid #eee;
            z-index: 9;
			.nav-bar {
				display: flex;
				.nav-item {
					width: 33.333333%;
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
			padding-bottom: 30upx;
			.message-item-wrapper {
				.message-item {
					display: flex;
					align-items: center;
					padding: 30upx;;
					border-bottom: 1px solid #eee;
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
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
							.title-content {
								position: relative;
								.tip {
									position: absolute;
									top: 0;
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
							.title-content-bold {
								color: #333;
								font-weight: 600;
							}
						}
						.date {
							font-size: 24upx;
							color: #999;
							margin-top: 10upx;
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
