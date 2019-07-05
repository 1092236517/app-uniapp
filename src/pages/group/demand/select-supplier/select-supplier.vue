<template>
	<view class="select-supplier-wrapper">
		<view class="main">
			<view class="product-picker-view">
				<text class="label">产品名称</text>
				<view class="item-input">
					<zn-picker
						v-model="productCategoryPickerValue"
						:pickerValueMulArray="productCategoryList"
						placeholder="请选择产品名称"
						@picker-item-change="handleProductCategoryPickerChange"
						@picker-confirm="handleProductCategoryPickerConfirm"></zn-picker>
				</view>
			</view>
			<view class="selected-view" v-if="selectedList.length > 0">
				<view class="item-view" v-for="(item, index) in selectedList" :key="index">
					<view class="text">{{ item.label }}</view>
					<text class="iconfont delete-icon" @click="cancelSelect(item)">&#xe6c9;</text>
				</view>
			</view>
			<view class="list">
				<checkbox-group @change="handleSelectChange">
					<label
						v-for="(item, index) in supplierList"
						:key="index"
						class="checkbox-item"
						:class="{'checkbox-item-active': item.checked}">
						<checkbox
							:value="item.value" 
							color="#0066cc"
							:checked="item.checked" />
						<view class="desc">
							{{ item.label }}
						</view>
					</label>
				</checkbox-group>
			</view>
			<template v-if="currentPage >= totalPage">
				<zn-no-more></zn-no-more>
			</template>
		</view>
		<view class="button-wrapper">
			<view class="button" @click="next(demandPurchaseId)">下一步</view>
		</view>
	</view>
</template>

<script>
	import znPicker from '../../../../components/zn-picker.vue'
	import znNoMore from '../../../../components/zn-no-more.vue'
	
	export default {
		name: 'select-supplier',
		components: {
			znPicker,
			znNoMore
		},
		data() {
			return {
				loading: false,
				token: this.$store.state.token,
				demandPurchaseId: '',
				productCategoryPickerValue: [],
				productCategoryList: [
					[],
					[]
				],
				supplierList: [],
				perPage: 20,
				currentPage: 1,
				total: '',
				categoryId: '',
				categoryType: '',
				supplierName: ''
			}
		},
		computed: {
			selectedList() { //选中项列表
				return this.supplierList.filter((item, index) => item.checked)
			},
			totalPage() { //总页数
				return Math.ceil(this.total / this.perPage)
			}
		},
		onLoad(option) {
			this.demandPurchaseId = option.demandPurchaseId;
			//产品种类
			this.getProductCategoryList() //获取第一级产品列表
				.then(val => {
					this.productCategoryList[0] = val.map((item, index) => {
						return {
							label: item.name,
							value: item.id,
							type: item.type
						}
					})
				})
			this.getProductCategoryList(1) //获取第二级产品列表
				.then(val => {
					this.productCategoryList[1] = val.map((item, index) => {
						return {
							label: item.name,
							value: item.id,
							type: item.type
						}
					});
				})
			this.getSupplierList({currentPage: 1})
		},
		onNavigationBarSearchInputClicked() { //监听原生标题栏搜索输入框点击事件
			
		},
		onNavigationBarSearchInputConfirmed(event) { //监听原生标题栏搜索输入框搜索事件，用户点击软键盘上的“搜索”按钮时触发
			this.search(event.text);
		},
		onNavigationBarSearchInputChanged() { //监听原生标题栏搜索输入框输入内容变化事件
			
		},
		onNavigationBarButtonTap(button) {
			console.log(JSON.stringify(button)) //button {"text":"取消","fontSize":"16px","__cb__":{"id":"plus161551239319056","htmlId":"157774022"},"index":0} 
		},
		onBackPress() { //监听页面返回
			
		},
		onReachBottom() { //页面上拉触底事件的处理函数
			this.loadMore();
		},
		onUnload() {
			this.$store.commit('saveSelectedSupplierIds', []) //清空store里保存的已选供应商id
		},
		methods: {
			/**
			 * 获取产品种类的列表
			 * @param  {Number} parentId 父级ID(不传则为第一层)
			 * @return {Promise}         当前父级ID下的子列表
			 */
			getProductCategoryList(parentId) {
				let params = {
					token: this.token
				}
				if(parentId) {
					params.parent_id = parentId;
				}
				return this.$api.publicApi.productCategory(params)
						.then(res => {
							const result = res.data;
							if(result.msg_code === 100000) {
								return result.response
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
			getSupplierList({currentPage, categoryId, supplierName}) { //获取供应商列表
				const params = {
					token: this.token,
					per_page: this.perPage,
					user_type:"COMPANY",
					auth_status:"APPROVE",
					current_page: currentPage || 1
				}
				if(categoryId) {
					params.category_id = categoryId;
				}
				if(supplierName) {
					params.auth_name = supplierName;
				}
				this.loading = true;
				uni.showLoading({
					title: '加载中'
				})
				this.$api.groupDemandApi.supplierList(params)
					.then(res => {
						const result = res.data;
						this.loading = false;
						this.currentPage = currentPage;
						uni.hideLoading();
						if(result.msg_code === 100000) {
							const supplierArr = result.response.data;
							this.total = result.response.total;
							supplierArr.forEach((item, index) => {
								let supplier = {
									label: item.member_auth.auth_name,
									value: item.id.toString(), //String类型
									checked: false
								};
								this.supplierList.push(supplier)
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
				if(this.currentPage >= this.totalPage) {
					return false
				}
				this.getSupplierList({
					currentPage: this.currentPage + 1,
					categoryId: this.categoryId,
					supplierName: this.supplierName,
				})
			},
			search(searchValue) { //搜索
				this.currentPage = 1; //重置当前页
				this.supplierList = []; //重置供应商列表
				this.supplierName = searchValue;
				this.getSupplierList({
					currentPage: this.currentPage,
					categoryId: this.categoryId,
					supplierName: this.supplierName,
				})
			},
			handleProductCategoryPickerChange(pickerObj) { //产品种类
				console.log(JSON.stringify(pickerObj));
			},
			handleProductCategoryPickerConfirm(pickerObj) { //已选的产品种类
				this.categoryId = pickerObj['itemArr'][1]['value'];
				this.categoryType = pickerObj['itemArr'][1]['type'];
				this.currentPage = 1; //重置当前页
				this.supplierList = []; //重置供应商列表
				this.getSupplierList({
					currentPage: this.currentPage,
					categoryId: this.categoryId,
					supplierName: this.supplierName,
				})
			},
			handleSelectChange(event) { //供应商列表选中项改变
				const selectedArr = event.detail.value;
				this.supplierList.forEach((item, index) => {
					item.checked = false;
					selectedArr.forEach((selectedItem, selectedIndex) => {
						if(item.value === selectedItem) {
							item.checked = true;
						}
					})
				})
			},
			cancelSelect(item) { //供应商已选列表取消选择
				item.checked = false;
			},
			next(demandPurchaseId) { //跳转到选择支付方式页面
				if(this.selectedList.length === 0) {
					uni.showToast({
						title: '请选择供应商！',
						icon: 'none'
					})
					return false
				}
				const idArr = this.selectedList.map(item => item.value)
				this.$store.commit('saveSelectedSupplierIds', idArr)
				uni.navigateTo({
					url: `/pages/group/demand/select-payment-type/select-payment-type?demandPurchaseId=${demandPurchaseId}`
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%
	}
	.select-supplier-wrapper {
		height: 100%;
		.main {
			min-height: 100%;
			padding-bottom: 150upx;
			.product-picker-view {
				display: flex;
				padding: 20upx 30upx;
				border-bottom: 1px solid #eee;
				background: #fff;
				font-size: 28upx;
				.label {
					display: flex;
					align-items: center;
					padding-right: 30upx;
					min-width: 130upx;
				}
				.item-input{
					flex-grow: 1;
					input {
						width: 100%;
					}
				}
			}
			.selected-view {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				padding: 30upx 30upx 0;
				.item-view {
					position: relative;
					width: 330upx;
					height: 50upx;
					line-height: 50upx;
					font-size: 24upx;
					color: #fff;
					background: $uni-color-primary;
					padding-left: 14upx;
					padding-right: 50upx;
					box-sizing: border-box;
					border-radius: 4upx;
					margin-bottom: 30upx;
					.text {
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					.delete-icon {
						position: absolute;
						top: 0;
						right: 0;
						width: 50upx;
						height: 50upx;
						color: #fff;
						text-align: center;
					}
				}			
			}
			.list {
				padding: 0 30upx;
				background: #fff;
				.checkbox-item {
					display: flex;
					font-size: 28upx;
					height: 90upx;
					line-height: 90upx;
					color: #999;
					border-bottom: 1px solid #eee;
					.desc {
						margin-left: 30upx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
				.checkbox-item-active {
					color: $uni-color-primary;
				}
			}
		}
		.button-wrapper {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			box-sizing: border-box;
			background: #eee;
			.button {
				width: 100%;
				height: 88upx;
				line-height: 88upx;
				color: #fff;
				background: $uni-color-primary;
				font-size: 32upx;
				text-align: center;				
			}
		}
	}
</style>
