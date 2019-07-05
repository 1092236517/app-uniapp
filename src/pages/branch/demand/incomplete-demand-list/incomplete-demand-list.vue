<template>
	<view class="incomplete-demand-list-wrapper">
		<view class="incomplete-demand-list">
			<checkbox-group @change="checkboxChange">
				<view
					v-for="(item, index) in incompleteDemandList"
					:key="index"
					class="incomplete-demand-item"
					@click="incompleteDemandView(item.incompleteDemandId)">
					<view class="checkbox" :class="{'checkbox-edit': isEdit}">
						<checkbox
							:value="item.incompleteDemandId"
							:checked="item.checked"
							color="#0066cc" />
					</view>
					<view class="content" @click="selectItem(item)">
						<view class="title">
							{{ item.title }}
						</view>
						<view class="date">
							{{ item.date }}
						</view>
					</view>
					<view class="iconfont icon">
						&#xe620;
					</view>
				</view>
			</checkbox-group>
		</view>
		<view class="no-more-view" v-if="currentPage >= totalPage">
			<zn-no-more></zn-no-more>
		</view>
		<view class="button-wrapper" :class="{'button-wrapper-edit': isEdit}">
			<text class="btn-select-all" @click="selectAll">{{ selectAllText }}</text>
			<text class="btn-delete" @click="deleteIncompleteDemand">删除</text>
		</view>
	</view>
</template>

<script>
	import znNoMore from '../../../../components/zn-no-more.vue'
	
	export default {
		name: 'incomplete-demand-list',
		components: {
			znNoMore
		},
		data() {
			return {
				loading: false,
				token: this.$store.state.token,
				isEdit: false,
				incompleteDemandList: [],
				perPage: 10,
				currentPage: 1,
				total: 0
			}
		},
		computed: {
			isSelectAll() { //是否全选
				return this.incompleteDemandList.every(item => item.checked)
			},
			selectAllText() { //全选文案
				return this.isSelectAll ? '取消全选' : '全选'
			},
			totalPage() { //总页数
				return Math.ceil(this.total / this.perPage)
			}
		},
		onNavigationBarButtonTap(e) { //监听原生标题栏按钮点击事件
			const buttonIndex = e.index;
			this.isEdit = !this.isEdit;
			if(this.isEdit) {
				this.editAppTitleBtnText(buttonIndex, '完成');
			}else {
				this.editAppTitleBtnText(buttonIndex, '管理');
				this.reset()
			}
		},
		onReachBottom() { //页面上拉触底事件的处理函数
			this.loadMore();
		},
		onLoad() {
			this.getIncompleteDemandList();
		},
		methods: {
			checkboxChange(e) { //监听checkbox改变
				const selectedArr = e.detail.value;
				this.incompleteDemandList.forEach((incompleteDemandItem, incompleteDemandIndex) => { //更新不完整需求列表选中状态
					incompleteDemandItem.checked = false;
					selectedArr.forEach((selectedItem, selectedIndex) => {
						if(selectedItem === incompleteDemandItem.incompleteDemandId) {
							incompleteDemandItem.checked = true;
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
				if(this.isSelectAll) {
					this.incompleteDemandList.forEach((item, index) => {
						item.checked = false;
					})
				}else {
					this.incompleteDemandList.forEach((item, index) => {
						item.checked = true;
					})
				}
			},
			reset() { //重置列表选中状态
				this.incompleteDemandList.forEach((item, index) => {
					item.checked = false;
				})
			},
			deleteIncompleteDemand() { //删除确认
				const _this = this;
				const selectedArr = this.incompleteDemandList.filter(item => item.checked);
				if(selectedArr.length === 0) {
					uni.showToast({
						title: '你还没选择订单哦！',
						icon: 'none'
					})
					return false
				}
				const selectedIdArr = selectedArr.map(item => item.incompleteDemandId);
				const params = {
					token: this.token,
					id: selectedIdArr.join(',')
				}
				uni.showModal({
					title: '提示',
					content: '确定删除吗？',
					success(res) {
						if(res.confirm) {
							_this.incompleteDemandDelete(params)
						}
					}
				})
			},
			incompleteDemandDelete(params) { //删除不完整需求
				this.$api.branchDemandApi.demandDelete(params)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							});
							this.init();
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
			incompleteDemandView(incompleteDemandId) { //查看不完整需求
				if(this.isEdit) {
					return false
				}
				uni.navigateTo({
					url: `/pages/branch/demand/release/step1?incompleteDemandId=${incompleteDemandId}`
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
			getIncompleteDemandList() { //获取不完整需求列表
				const params = {
					token: this.token,
					per_page: this.perPage,
					current_page: this.currentPage
				};
				uni.showLoading({
					title: '加载中'
				})
				this.$api.branchDemandApi.incompleteDemandList(params)
					.then(res => {
						const result = res.data;
						uni.hideLoading();
						if(result.msg_code === 100000) {
							const list = result.response.data;
							this.total = result.response.total;
							list.forEach((item, index) => {
								let element = {
									title: item.project_name,
									date: item.updated_at,
									incompleteDemandId: item.id.toString(),
									checked: false
								};
								this.incompleteDemandList.push(element);
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
						uni.hideLoading();
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none'
						})
					})
			},
			loadMore() { //加载更多
				if(this.loading) {
					return false
				}
				if(this.isEdit) {
					return false
				}
				if(this.currentPage >= this.totalPage) {
					return false
				}
				this.currentPage += 1;
				this.getIncompleteDemandList()
			},
			init() { //初始化页面
				this.currentPage = 1;
				this.total = 0;
				this.incompleteDemandList = [];
				this.getIncompleteDemandList();
			}
		}
	}
</script>

<style lang="scss">
	.incomplete-demand-list-wrapper{
		.incomplete-demand-list {
			padding: 0 30upx 30upx;
			background: #fff;
			.incomplete-demand-item {
				display: flex;
				align-items: center;
				padding: 20upx 0;
				border-bottom: 1px solid #eee;
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
					color: #333;
					.title {
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					.date {
						font-size: 24upx;
						color: #999;
						margin-top: 10upx;
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
	}
</style>
