<template>
	<view class="wrapper">
		<view class="steps-view">
			<zn-steps
				:steps="initSteps"
				:currentStep="currentStep"></zn-steps>			
		</view>
		<view class="content-wrapper">
			<view class="content-view">
				<view class="title-view">
					<text class="line"></text>
					<text class="title">项目信息</text>
				</view>
				<view class="item-view">
					<text class="item-label">项目名称</text>
					<view class="item-input">
						<input
							v-model.trim="programName"
							type="text"
							:maxlength="120"
							placeholder="请填写项目名称"/>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">项目编号</text>
					<view class="item-input">
						<input
							v-model.trim="programCode"
							type="text"
							:maxlength="120"
							placeholder="请填写项目编号"/>
					</view>
				</view>	
			</view>
			<view class="content-view">
				<view class="title-view">
					<text class="line"></text>
					<text class="title">产品信息</text>
				</view>
				<view class="item-view">
					<text class="item-label">产品名称</text>
					<view class="item-input">
						<zn-picker
							v-model="productCategoryPickerValue"
							:pickerValueMulArray="productCategoryList"
							placeholder="请选择产品名称"
							@picker-item-change="handleProductCategoryPickerChange"
							@picker-confirm="handleProductCategoryPickerConfirm"></zn-picker>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">产品品牌</text>
					<view class="item-input">
						<input
							v-model.trim="productBrand"
							type="text"
							:maxlength="120"
							placeholder="请填写产品品牌"/>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">产品数量</text>
					<view class="item-input">
						<input
							v-model.trim="count"
							type="digit"
							:maxlength="120"
							:placeholder="countPlaceholder"/>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">产品规格</text>
					<view class="item-input spec-input">
						<input
							v-model.trim="specMin"
							type="digit"
							:maxlength="12"
							placeholder="最小规格"/>
					</view>
					<view class="spec-line">——</view>
					<view class="item-input spec-input">
						<input
							v-model.trim="specMax"
							type="digit"
							:maxlength="12"
							placeholder="最大规格"/>
					</view>
				</view>	
			</view>
		</view>
		<view class="button-view">
			<button type="primary" @click="next">下一步</button>
		</view>
	</view>
</template>

<script>
	import znSteps from '../../../../components/zn-steps.vue'
	import znPicker from '../../../../components/zn-picker.vue'
	import znUpload from '../../../../components/zn-upload.vue'
	import znAccordion from '../../../../components/zn-accordion.vue'
	import { validater } from '../../../../common/utils/validater.js'
	
	export default {
		name: 'demand-edit-step1',
		components: {
			znSteps,
			znPicker,
			znUpload,
			znAccordion
		},
		data() {
			return {
				token: this.$store.state.token,
				demandId: '',
				initSteps: [
					{
						desc: '基本信息',
						statusClass: 'step-is-active'
					},
					{
						desc: '采购信息',
						statusClass: 'step-is-wait'
					},
					{
						desc: '支付信息',
						statusClass: 'step-is-wait'
					}
				],
				currentStep: 1,
				productCategoryPickerValue: [],
				productCategoryList: [
					[],
					[]
				],
				programName: '',
				programCode: '',
				productBrand: '',
				count: '',
				countPlaceholder: '请填写产品数量',
				specMin: '',
				specMax: '',
				categoryId: '',
				categoryType: ''
			}		
		},
		onLoad(option) {
			this.demandId = option.demandId;
			uni.showLoading({
				title: '加载中'
			})
			//获取详情、初始化产品列表
			Promise.all([this.getProductCategoryList(), this.getProductCategoryList(1), this.getDemandDetail()])
				.then(result => {
					const productCategoryColumnOne = result[0]; //产品种类第一列
					const productCategoryColumnTwo = result[1]; //产品种类第二列
					const demandStepOneData = result[2]; //联采需求第一步数据
					const categoryId = demandStepOneData.categoryId;
					const categoryIndex = this.getProductCategoryIndex(productCategoryColumnTwo, categoryId);
					this.productCategoryList[0] = productCategoryColumnOne.map((item, index) => {
						return {
							label: item.name,
							value: item.id,
							type: item.type
						}
					})
					this.productCategoryList[1] = productCategoryColumnTwo.map((item, index) => {
						return {
							label: item.name,
							value: item.id,
							type: item.type
						}
					});
					this.getPurchaseMaxCount(productCategoryColumnTwo[0].type);
					this.productCategoryPickerValue = [0, categoryIndex];
					this.backFillDemandData(demandStepOneData)
				})
				.catch(err => {
					console.log(err);
					uni.showToast({
						title: JSON.stringify(err),
						icon: 'none'
					})
				})
		},
		onReady() {
			uni.hideLoading()
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
			/**
			 * 获取最大可采购数量
			 * @param  {String} categoryType 产品种类
			 */
			getPurchaseMaxCount(categoryType) {
				let params = {
					token: this.token,
					category_type: categoryType
				}
				this.$api.branchDemandApi.purchaseMaxCount(params)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							this.countPlaceholder = `最大可采购数量${result.response}吨`;
						}else {
							console.log(result);
								uni.showToast({
									title: result.message,
									icon: 'none'
								})
							}
						}
					)
					.catch(err => {
						console.log(err);
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none'
						})
					})
			},
			handleProductCategoryPickerChange(pickerObj) { //产品种类
				
			},
			handleProductCategoryPickerConfirm(pickerObj) { //已选的产品种类
				this.categoryId = pickerObj['itemArr'][1]['value'];
				this.categoryType = pickerObj['itemArr'][1]['type'];
			},
			next() { //下一步
				const stepOneData = {
					programName: this.programName,
					programCode: this.programCode,
					productBrand: this.productBrand,
					count: this.count,
					specMin: this.specMin,
					specMax: this.specMax,
					categoryId: this.categoryId,
					categoryType: this.categoryType
				}
				const params = {
					step: 1,
					token: this.token,
					project_name: this.programName,
					project_code: this.programCode,
					category_id: this.categoryId,
					brand_name: this.productBrand,
					category_spec_min: this.specMin,
					category_spec_max: this.specMax,
					purchase_num: this.count
				}
				if(this.requiredValidator(stepOneData)) { //非空校验
					return false
				}
				uni.showLoading();
				this.editDemand(params, this.demandId)
			},
			requiredValidator(obj) { //非空校验
				const tips = {
					programName: '项目名称为必填项',
					programCode: '项目编码为必填项',
					productBrand: '产品品牌为必填项',
					count: '采购数量为必填项',
					specMin: '最小规格为必填项',
					specMax: '最大规格为必填项',
					categoryId: '产品种类ID为必填项',
					categoryType: '产品类型为必填项'
				}
				return Object.keys(obj).some(key => {
					if(!obj[key]) {
						uni.showToast({
							title: tips[key],
							icon: 'none'
						})
					}
					return !obj[key]
				})
			},
			getDemandDetail() { //获取联采需求详情
				const params = {
					token: this.token
				}
				return this.$api.branchDemandApi.demandDetail(params, this.demandId)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							const demandInfo = result.response;
							const spec = JSON.parse(demandInfo.category_spec);
							return {
								programName: demandInfo.project_name,
								programCode: demandInfo.project_code,
								productBrand: demandInfo.brand_name,
								categoryId: demandInfo.category.id,
								specMin: spec.category_spec_min,
								specMax: spec.category_spec_max,
								count: demandInfo.purchase_num,
								categoryType: demandInfo.category_type
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
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none'
						})
					})
			},
			editDemand(params, demandId) { //编辑联采需求
				this.$api.branchDemandApi.demandEdit(params, demandId)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							uni.hideLoading();
							uni.navigateTo({
								url: `/pages/branch/demand/edit/step2?id=${this.demandId}`
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
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none'
						})
					})
			},
			/**
			 * 获取产品种类的index
			 * @param  {Array}  categoryList 产品种类列表
			 * @param  {Number} categoryId   产品的ID
			 * @return {Number}          	 当前项在列表中的index
			 */
			getProductCategoryIndex(categoryList, categoryId) {
				let categoryIndex = categoryList.findIndex(item => item.id === categoryId);
				if(categoryIndex === -1) {
					console.error('未匹配到该种类')
					return false
				}
				return categoryIndex
			},
			backFillDemandData(demandData) { //回填数据
				this.programName = demandData.programName;
				this.programCode = demandData.programCode;
				this.productBrand = demandData.productBrand;
				this.categoryId = demandData.categoryId;
				this.specMin = demandData.specMin;
				this.specMax = demandData.specMax;
				this.count = demandData.count;
				this.categoryType = demandData.categoryType;
			}
		}
	}
</script>

<style lang="scss">
	.wrapper {
		font-size: 28upx;
		.steps-view {
			background: #fff;
			padding: 30upx;
		}
		.content-wrapper {
			.content-view {
				margin-top: 20upx;
				padding: 10upx 30upx;
				background: #fff;
				.title-view {
					font-size: 32upx;
					color: #333;
					font-weight: 700;
					padding-top: 30upx;
					padding-bottom: 30upx;
					border-bottom: 1px solid #eee;
				}
				.line {
					display: inline-block;
					width: 6upx;
					height: 32upx;
					background: $uni-color-primary;
					margin-right: 20upx;
					border-radius: 3upx;
					vertical-align: middle;
				}
				.title{
					vertical-align: middle;
				}
				.item-view {
					display: flex;
					padding-top: 20upx;
					padding-bottom: 20upx;
					border-bottom: 1px solid #eee;
					.item-label {
						display: flex;
						align-items: center;
						font-size: 26upx;
						padding-right: 30upx;
						min-width: 130upx;
					}
					.item-input {
						flex-grow: 1;
						input {
							width: 100%;
						}
						switch {
							float: right;
						}
					}
					.spec-input {
						flex-grow: 0;
						width: 150upx;
					}
					.spec-line {
						margin-right: 50upx;
					}
					.item-textarea {
						width: 100%;
						height: 54upx;
						line-height: 54upx;
					}
					.item-textarea-label {
						align-self: flex-start;
					}
					.input-placeholder {
						color: $uni-text-color-placeholder;
					}
					.textarea-placeholder {
						font-size: 28upx;
						color: $uni-text-color-placeholder;
					}
					.accordion-content {
						padding: 20upx 0;
						color: #aaa;
					}
				}
				.item-view-upload {
					padding-top: 20upx;
				}
				.tip {
					font-size: 20upx;
					color: #999;
					line-height: 30upx;
				}
				.agreement {
					color: $uni-color-primary;
					text-decoration: underline;
				}
			}
		}
		.button-view {
			margin: 100upx 30upx 20upx;
			button {
				background: $uni-color-primary;
			}
		}
	}
</style>
