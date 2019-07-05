<template>
	<view class="payment-type-list-wrapper">
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
					</text>
				</view>
			</view>
			<view class="line" :style="{left: marginLeft}"></view>
		</view>
		<view class="content-wrapper" :class="{show: activeIndex === 0}">
			<view class="payment-type-list">
				<checkbox-group @change="checkboxChange">
					<view
						v-for="(item, index) in all.paymentTypeList"
						:key="index"
						class="payment-type-item-wrapper">
						<view class="payment-type-item">
							<view class="checkbox" :class="{'checkbox-edit': isEdit}">
								<checkbox
									:value="item.paymentTypeId"
									:checked="item.checked"
									color="#0066cc" />
							</view>
							<view class="content" @click="selectItem(item)">
								<view class="title">
									<text class="title-content">
										付款方式
									</text>
                                    <view class="switch-view">
                                    	<switch
                                            :checked="item.isEnabled"
                                            :disabled="isEdit"
                                            @change="toggleEnable(item)"
                                            color="#0066CC" />
                                    </view>
								</view>
                                <view class="desc">
                                	{{ item.desc }}
                                </view>
								<view class="date">
									价格时间规则: {{ item.pointDayDesc }}
								</view>
							</view>
						</view>
					</view>
				</checkbox-group>
			</view>
			<view class="no-more-view" v-if="all.currentPage >= totalPageAll">
				<zn-no-more></zn-no-more>
			</view>
		</view>
		<view class="content-wrapper" :class="{show: activeIndex === 1}">
			<view class="payment-type-list">
				<checkbox-group @change="checkboxChange">
					<view
						v-for="(item, index) in enabled.paymentTypeList"
						:key="index"
						class="payment-type-item-wrapper">
						<view class="payment-type-item">
							<view class="checkbox" :class="{'checkbox-edit': isEdit}">
								<checkbox
									:value="item.paymentTypeId"
									:checked="item.checked"
									color="#0066cc" />
							</view>
							<view class="content" @click="selectItem(item)">
								<view class="title">
									<text class="title-content">
										付款方式
									</text>
							        <view class="switch-view">
							        	<switch
							                :checked="item.isEnabled"
							                :disabled="isEdit"
							                @change="toggleEnable(item)"
							                color="#0066CC" />
							        </view>
								</view>
							    <view class="desc">
							    	{{ item.desc }}
							    </view>
								<view class="date">
									价格时间规则: {{ item.pointDayDesc }}
								</view>
							</view>
						</view>
					</view>
				</checkbox-group>
			</view>
			<view class="no-more-view" v-if="enabled.currentPage >= totalPageEnabled">
				<zn-no-more></zn-no-more>
			</view>
		</view>
		<view class="content-wrapper" :class="{show: activeIndex === 2}">
			<view class="payment-type-list">
				<checkbox-group @change="checkboxChange">
					<view
						v-for="(item, index) in disabled.paymentTypeList"
						:key="index"
						class="payment-type-item-wrapper">
						<view class="payment-type-item">
							<view class="checkbox" :class="{'checkbox-edit': isEdit}">
								<checkbox
									:value="item.paymentTypeId"
									:checked="item.checked"
									color="#0066cc" />
							</view>
							<view class="content" @click="selectItem(item)">
								<view class="title">
									<text class="title-content">
										付款方式
									</text>
							        <view class="switch-view">
							        	<switch
							                :checked="item.isEnabled"
							                :disabled="isEdit"
							                @change="toggleEnable(item)"
							                color="#0066CC" />
							        </view>
								</view>
							    <view class="desc">
							    	{{ item.desc }}
							    </view>
								<view class="date">
									价格时间规则: {{ item.pointDayDesc }}
								</view>
							</view>
						</view>
					</view>
				</checkbox-group>
			</view>
			<view class="no-more-view" v-if="disabled.currentPage >= totalPageDisabled">
				<zn-no-more></zn-no-more>
			</view>
		</view>
		<view class="button-wrapper" :class="{'button-wrapper-edit': isEdit}">
			<text class="btn-select-all" @click="selectAll">{{ selectAllText }}</text>
			<view>
				<text class="btn-delete" @click="deletePaymentType">删除</text>
			</view>
		</view>
        <view class="add-payment-type-btn-wrapper" @click="addPaymentType">
        	<text class="add-payment-type-btn">添加付款方式</text>
        </view>
	</view>
</template>

<script>
	import znNoMore from '../../../components/zn-no-more.vue'
	
	export default {
		name: 'payment-type-manage',
		components: {
			znNoMore
		},
		data() {
			return {
				navList: [
					{
						label: '全部',
						value: 'all'
					},
					{
						label: '启用',
						value: 'enabled'
					},
					{
						label: '禁用',
						value: 'disabled'
					}
				],
				activeIndex: 0,
				token: this.$store.state.token,
				isEdit: false,
				all: {
					loading: false,
					paymentTypeList: [],
					perPage: 10,
					currentPage: 1,
					total: 0
				},
				enabled: {
					loading: false,
					paymentTypeList: [],
					perPage: 10,
					currentPage: 1,
					total: 0
				},
				disabled: {
					loading: false,
					paymentTypeList: [],
					perPage: 10,
					currentPage: 1,
					total: 0
				}
			}
		},
		computed: {
			isSelectAll() { //是否全选
				const index = parseInt(this.activeIndex);
				const type = this.navList[index]['value'];
				return this[type]['paymentTypeList'].every(item => item.checked)
			},
			selectAllText() { //全选文案
				return this.isSelectAll ? '取消全选' : '全选'
			},
			totalPageAll() { //系统消息总页数
				return Math.ceil(this.all.total / this.all.perPage)
			},
			totalPageEnabled() { //需求消息总页数
				return Math.ceil(this.enabled.total / this.enabled.perPage)
			},
			totalPageDisabled() { //订单消息总页数
				return Math.ceil(this.disabled.total / this.disabled.perPage)
			},
			marginLeft() {
				return uni.upx2px(38 + 250 * this.activeIndex) + 'px'
			}
		},
		onNavigationBarButtonTap(e) { //监听原生标题栏按钮点击事件
			const buttonIndex = e.index;
			this.handleNavigationBarButtonTap(buttonIndex)
		},
		onReachBottom() { //页面上拉触底事件的处理函数
			this.loadMore();
		},
		onShow() {
			this.init('all');
			this.init('enabled');
			this.init('disabled');
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
                const type = this.navList[parseInt(index)]['value'];
                this.init(type);
			},
            toggleEnable(item) { //启用或禁用
                this.paymentTypeEdit(item)
            },
			checkboxChange(e) { //监听checkbox改变
				const selectedArr = e.detail.value;
				const index = parseInt(this.activeIndex);
				const type = this.navList[index]['value'];
				this[type]['paymentTypeList'].forEach((paymentTypeItem, paymentTypeIndex) => { //更新不完整需求列表选中状态
					paymentTypeItem.checked = false;
					selectedArr.forEach((selectedItem, selectedIndex) => {
						if(selectedItem === paymentTypeItem.paymentTypeId) {
							paymentTypeItem.checked = true;
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
					this[type]['paymentTypeList'].forEach((item, index) => {
						item.checked = false;
					})
				}else {
					this[type]['paymentTypeList'].forEach((item, index) => {
						item.checked = true;
					})
				}
			},
			reset() { //重置列表选中状态
				const index = parseInt(this.activeIndex);
				const type = this.navList[index]['value'];
				this[type]['paymentTypeList'].forEach((item, index) => {
					item.checked = false;
				})
			},
			deletePaymentType() { //删除确认
				const _this = this;
				const index = parseInt(this.activeIndex);
				const type = this.navList[index]['value'];
				const selectedArr = this[type]['paymentTypeList'].filter(item => item.checked);
				if(selectedArr.length === 0) {
					uni.showToast({
						title: '你还没选择支付方式！',
						icon: 'none'
					})
					return false
				}
				const selectedIdArr = selectedArr.map(item => item.paymentTypeId);
				const params = {
					token: this.token,
					id: selectedIdArr.join(',')
				}
				uni.showModal({
					title: '提示',
					content: '确定删除吗？',
					success(res) {
						if(res.confirm) {
							_this.paymentTypeDelete(params, type)
						}
					}
				})
			},
			paymentTypeDelete(params, type) { //删除支付方式
				uni.showLoading({
					title: '提交中'
				});
				this.$api.groupDemandApi.paymentTypeDelete(params)
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
            paymentTypeEdit(item) { //启用或禁用支付方式
                const params = {
                    token: this.token,
                    status: item.status === 'VISIBLE' ? 'UNVISIBLE' : 'VISIBLE'
                }
                item.isEnabled = !item.isEnabled;
                uni.showLoading({
                	title: '提交中',
                    mask: true
                })
                this.$api.groupDemandApi.paymentTypeEdit(params, item.paymentTypeId)
                    .then(res => {
                        uni.hideLoading();
                        const result = res.data;
                        let tip = '';
                        if(result.msg_code === 100000) {
                            item.status = params.status;
                            if(params.status === 'VISIBLE') {
                                tip = '启用';
                            }else {
                                tip = '禁用';
                            }
                            uni.showToast({
                            	title: `${tip}成功`,
                                icon: 'success'
                            })
                        }else {
							console.log(result);
                            item.isEnabled = !item.isEnabled;
							uni.showToast({
								title: result.message,
								icon: 'none'
							})
						}
                    })
                    .catch(err => {
                    	console.log(err);
                        item.isEnabled = !item.isEnabled;
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
			 * 获取支付方式列表
			 * @param  {String} options.status         支付方式状态，值为''、'VISIBLE'和'UNVISIBLE'
			 * @param  {Number} options.perPage        每页数量，默认为10
			 * @param  {Number} options.currentPage    当前页数，默认为1
			 * @return {Object} Promise对象
			 */
			getPaymentTypeList({status, perPage=10, currentPage=1} = {}) { //获取支付方式列表
				const params = {
					token: this.token,
					per_page: perPage,
					current_page: currentPage,
                    status
				};
				uni.showLoading({
					title: '加载中'
				})
				return this.$api.groupDemandApi.paymentTypeList(params)
					.then(res => {
						const result = res.data;
						uni.hideLoading();
						if(result.msg_code === 100000) {
							const list = result.response.data;
							const total = result.response.total;
							const paymentTypeList = list.map((item, index) => {
								return {
									desc: item.description,
                                    payType: item.pay_type,
									pointDay: item.point_day,
                                    pointDayDesc: this.getPointDayText(item.pay_type, item.point_day),
                                    status: item.status,
									paymentTypeId: item.id.toString(),
									checked: false,
                                    isEnabled: item.status === 'VISIBLE'
								};
							})
							return {
								total,
								paymentTypeList
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
					all: 'totalPageAll',
					enabled: 'totalPageEnabled',
					disabled: 'totalPageDisabled'
				}
                const statusObj = {
                    all: '',
                    enabled: 'VISIBLE',
                    disabled: 'UNVISIBLE'
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
					status: statusObj[type],
					perPage: this[type]['perPage'],
					currentPage: this[type]['currentPage']
				}
				this.getPaymentTypeList(params)
					.then(res => {
						const paymentTypeList = res.paymentTypeList;
						this[type]['paymentTypeList'].push(...paymentTypeList);
					})
			},
			/**
			 * 初始化页面
			 * @param {String} type 支付方式类型，值为'all'、'enabled'和'disabled'
			 */
			init(type) {
				this[type]['currentPage'] = 1;
				this[type]['total'] = 0;
				this[type]['paymentTypeList'] = [];
                const statusObj = {
                    all: '',
                    enabled: 'VISIBLE',
                    disabled: 'UNVISIBLE'
                };
				return this.getPaymentTypeList({
					perPage: this[type]['perPage'],
					currentPage: 1,
					status: statusObj[type]
				})
				.then(res => {
					this[type]['total'] = res.total;
					this[type]['paymentTypeList'] = res.paymentTypeList;
				})
			},
			handleNavigationBarButtonTap(buttonIndex) { //处理导航栏按钮点击
				const index = parseInt(this.activeIndex);
				const type = this.navList[index]['value'];
				if(this[type]['paymentTypeList'].length === 0) {
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
            getPointDayText(payType, pointDay) { //获取支付方式的价格时间规则描述
                let desc = '';
                if(payType === 'PAY_IN_DAYS') {
                    desc = pointDay + '天';
                }else if(payType === 'DAY_IN_MONTH') {
                    desc = `每月${pointDay}日`;
                }else if(payType === 'PAY_IN_ANYTIME') {
                    desc = '随时付款';
                }
                return desc
            },
            addPaymentType() { //添加付款方式
                uni.navigateTo({
                	url: '/pages/group/add-payment-type/add-payment-type'
                })
            }
		}
	}
</script>

<style lang="scss">
	.payment-type-list-wrapper{
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
		.payment-type-list {
			padding-bottom: 30upx;
			.payment-type-item-wrapper {
                margin-top: 10upx;
				.payment-type-item {
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
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            font-size: 28upx;
                            color: #666;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
                            padding-bottom: 20upx;
                            border-bottom: 1px solid #eee;
						}
                        .desc {
                            color: #333;
                            padding: 20upx 0;
                            border-bottom: 1px solid #eee;
                        }
						.date {
							font-size: 24upx;
							color: #999;
							padding-top: 20upx;
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
            z-index: 9;
			.btn-select-all {
				color: #999;
			}
			.btn-delete {
				color: #EE1E1E;
			}
		}
		.button-wrapper-edit {
			bottom: 0;
		}
        .add-payment-type-btn-wrapper {
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 96upx;
            line-height: 96upx;
            padding: 0 30upx;
            box-sizing: border-box;
            font-size: 32upx;
            color: #fff;
            text-align: center;
            background: $uni-color-primary;
        }
	}
</style>
