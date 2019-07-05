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
					<text class="title">联采规则</text>
				</view>
				<view class="item-view">
					<text class="item-label">供应商报价截止日期</text>
					<view class="item-input">
						<zn-date-picker
							v-model="datePickerValue"
							@picker-confirm="handleDatePickerConfirm"></zn-date-picker>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">发票要求</text>
					<view class="item-input">
						<input
							v-model.trim="invoiceRequirement"
							type="text"
							:maxlength="120"
							placeholder="请填写发票要求"
                            disabled />
					</view>
				</view>
				<view class="item-view">
					<text class="item-label item-textarea-label">联采说明</text>
					<view class="item-input">
						<textarea
							v-model.trim="remark"
							:maxlength="120"
							placeholder="请填写联采说明"
							class="item-textarea"
							:auto-height="true"/>
					</view>
				</view>
				<view class="item-view-upload">
					<view class="label">上传附件</view>
					<zn-upload
						v-model="imageList"
						@upload-success="handleUploadSuccess"
						@delete-image="handleDeleteImage"></zn-upload>
					<view class="tip">
						您可以将招标文件或其他您认为需要让报价供应商知晓的内容以附件形式上传， 上传支持jpg、jpeg、gif、png等格式。
					</view>
				</view>
			</view>
			<view class="content-view">
				<view class="title-view">
					<text class="line"></text>
					<text class="title">收货信息</text>
				</view>
				<view class="item-view">
					<text class="item-label">收货地</text>
					<view class="item-input">
						<zn-address-picker
							v-model="addressPickerValue"
							@picker-item-change="handleAddressPickerChange"
							@picker-confirm="handleAddressPickerConfirm"></zn-address-picker>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">详细地址</text>
					<view class="item-input">
						<input
							v-model.trim="addressDetail"
							type="text"
							:maxlength="120"
							placeholder="请填写收货详细地址"/>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">收货人</text>
					<view class="item-input">
						<input
							v-model.trim=" receiver"
							type="text"
							:maxlength="120"
							placeholder="请填写收货人姓名"/>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">联系电话</text>
					<view class="item-input">
						<input
							v-model.trim="mobile"
							type="number"
							placeholder="请填写收货人联系电话"/>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">身份证号</text>
					<view class="item-input">
						<input
							v-model.trim="identityCard"
							type="text"
							placeholder="请填写收货人身份证号"/>
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
	import znDatePicker from '../../../../components/zn-date-picker.vue'
	import znAddressPicker from '../../../../components/zn-address-picker.vue'
	import dayjs from 'dayjs'
	
	const mobileReg = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/;
	export default {
		name: 'demand-edit-step2',
		components: {
			znSteps,
			znPicker,
			znUpload,
			znAccordion,
			znDatePicker,
			znAddressPicker
		},
		data() {
			return {
				token: this.$store.state.token,
				demandId: '',
				initSteps: [
					{
						desc: '基本信息',
						statusClass: 'step-is-finish'
					},
					{
						desc: '采购信息',
						statusClass: 'step-is-active'
					},
					{
						desc: '支付信息',
						statusClass: 'step-is-wait'
					}
				],
				currentStep: 2,
				datePickerValue: '',
				addressPickerValue: [],
				invoiceRequirement: '增值税发票',
				remark: '',
				addressDetail: '',
				receiver: '',
				mobile: '',
				identityCard: '',
				attachments: [],
				regionId: '',
				deadline: '',
				imageList: []
			}		
		},
		onLoad(option) {
			this.demandId = option.id;
			uni.showLoading({
				title: '加载中'
			})
			this.getDemandDetail() //联采单详情
				.then(res => {
					this.backFillDemandData(res)
				})
		},
		onReady() {
			uni.hideLoading()
		},
		methods: {
			handleDatePickerConfirm(pickerObj) { //日期选择器确定
				const { date } = pickerObj;
				this.deadline = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
			},
			handleAddressPickerChange(pickerObj) { //地址选择器选项更改事件
				
			},
			handleAddressPickerConfirm(pickerObj) { //处理地址选择器确定事件
				
			},
			handleUploadSuccess(imageArr) { //图片上传成功
				this.attachments = imageArr.map((item, index) => {
					return {
						original_name: item.originalFileName,
						path: item.newFileName
					}
				})
			},
			handleDeleteImage(imageArr) { //删除图片
				this.attachments = imageArr.map((item, index) => {
					return {
						original_name: item.originalFileName,
						path: item.newFileName
					}
				})
			},
			next() { //下一步
				const stepTwoData = {
					deadline: this.deadline,
					addressDetail: this.addressDetail,
					receiver: this.receiver,
					mobile: this.mobile,
					regionId: this.addressPickerValue[2]
				}
				const params = {
					token: this.token,
					step: 2,
					deadline: this.deadline,
					delivery_address_district_id: this.addressPickerValue[2],
					delivery_address_detail: this.addressDetail,
					consignee_name: this.receiver,
					consignee_mobile: this.mobile
				}
				const currentTime = dayjs();
				const deadline = dayjs(this.datePickerValue);
				if(currentTime.isAfter(deadline)) { //报价截止时间必须在当前时间之后
					uni.showToast({
						title: '报价截止时间必须在当前时间之后',
						icon: 'none'
					})
					return false
				}
				if(this.requiredValidator(stepTwoData)) { //非空校验
					return false
				}
				if(!mobileReg.test(this.mobile)) {
					uni.showToast({
						title: '请填写合法手机号',
						icon: 'none'
					})
					return false
				}
				if(this.remark) {
					stepTwoData.remark = this.remark;
					params.remark = this.remark;
				}
				if(this.identityCard) {
					stepTwoData.identityCard = this.identityCard;
					params.consignee_identity_card = this.identityCard;
				}
				if(this.imageList.length > 0) {
					stepTwoData.attachments = this.imageList;
					params.attachments = this.imageList.map((item, index) => {
						return {
							original_name: item.originalFileName,
							path: item.newFileName
						}
					});
				}
				this.editDemand(params, this.demandId)
			},
			requiredValidator(obj) { //非空校验
				const tips = {
					addressDetail: '详细地址为必填项',
					receiver: '收货人姓名为必填项',
					mobile: '收货人联系电话为必填项',
					regionId: '收货地为必填项',
					deadline: '供应商截止报价时间为必填项'
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
			editDemand(params, demandId) { //编辑联采需求
				this.$api.branchDemandApi.demandEdit(params, demandId)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							uni.hideLoading();
							uni.navigateTo({
								url: `/pages/branch/demand/edit/step3?id=${this.demandId}`
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
			getDemandDetail() { //获取联采需求详情
				const params = {
					token: this.token
				}
				return this.$api.branchDemandApi.demandDetail(params, this.demandId)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							const demandInfo = result.response;
							const provinceId = parseInt(demandInfo.delivery_address_province_id);
							const cityId = parseInt(demandInfo.delivery_address_city_id);
							const regionId = parseInt(demandInfo.delivery_address_district_id);
							const imageList = demandInfo.attachments.map(item => {
								return {
									src: item.path,
									originalFileName: item.original_name,
									newFileName: item.path
								}
							})
							return {
								deadline: demandInfo.deadline,
								invoiceRequirement: '',
								addressDetail: demandInfo.delivery_address_detail,
								receiver: demandInfo.consignee_name,
								mobile: demandInfo.consignee_mobile,
								regionId: demandInfo.delivery_address_district_id,
								remark: demandInfo.remark,
								identityCard: demandInfo.consignee_identity_card,
								addressPickerValue: [provinceId, cityId, regionId],
								datePickerValue: demandInfo.deadline,
								imageList: imageList
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
			backFillDemandData(demandData) { //回填数据
				this.deadline = demandData.deadline;
				this.addressDetail = demandData.addressDetail;
				this.receiver = demandData.receiver;
				this.mobile = demandData.mobile;
				this.regionId = demandData.regionId;
				this.remark = demandData.remark;
				this.identityCard = demandData.identityCard;
				this.imageList = demandData.imageList;
				this.addressPickerValue = demandData.addressPickerValue;
				this.datePickerValue = demandData.datePickerValue;
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
			margin: 140upx 30upx 20upx;
			button {
				background: $uni-color-primary;
			}
		}
	}
</style>
