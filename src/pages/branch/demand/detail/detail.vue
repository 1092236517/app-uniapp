<template>
	<view class="detail-wrapper">
		<view class="steps-view">
			<zn-steps :steps="steps" :currentStep="currentStep"></zn-steps>
		</view>
		<view class="accordion-view">
			<zn-accordion>
				<template slot="header">
					<view class="iconfont header">&#xe63e;</view>
				</template>
				<view class="content">
					<zn-timeline :timelineArr="timelineArr"></zn-timeline>
				</view>
			</zn-accordion>
		</view>
		<view class="item-wrapper">
			<view class="item-header">
				<view class="title-view">
					<text class="line"></text>
					<text class="title">需求订单信息</text>
				</view>
				<view class="status" :style="{color: demandStatusColor}">{{ statusText }}</view>
			</view>
			<view class="item-content">
				<view class="content">
					<view class="desc">
						订单编号：<text class="desc-text">{{ demandOrderNo }}</text>
					</view>
					<view class="desc">
						项目名称： <text class="desc-text">{{ programName }}</text>
					</view>
					<view class="desc">
						项目编码：<text class="desc-text">{{ programCode }}</text>
					</view>
                    <view class="desc">
                    	收货地：<text class="desc-text">{{ receiveAddress }}</text>
                    </view>
                    <view class="desc">
                    	详细地址：<text class="desc-text">{{ receiveAddressDetail }}</text>
                    </view>
                    <view class="desc">
                    	收货人：<text class="desc-text">{{ receiver }}</text>
                    </view>
                    <view class="desc">
                    	收货人电话：<text class="desc-text">{{ receiverMobile }}</text>
                    </view>
                    <view class="desc">
                    	收货人身份证：<text class="desc-text">{{ receiverIdentityCard }}</text>
                    </view>
					<view class="desc">
						采购商：<text class="desc-text">{{ purchaser }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="item-wrapper" v-if="demandStatus === 'REJECT'">
			<view class="item-header">
				<view class="title-view">
					<text class="line"></text>
					<text class="title">驳回原因</text>
				</view>
			</view>
			<view class="item-content">
				<view class="content">
					<view class="desc">
						驳回原因：<text class="desc-text">{{ rejectReason }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="item-wrapper" v-if="isShowCheckBtn">
			<view class="item-header">
				<view class="title-view">
					<text class="line"></text>
					<text class="title">选择成交价并填写付款方式</text>
				</view>
			</view>
			<view class="item-content">
				<checkbox-group @change="handleSelectChange">
					<view v-for="(item, index) in znPriceList" :key="index">
						<label class="checkbox-item">
							<checkbox :value="item.index" color="#0066cc" />
							<view class="desc">
								{{ item.desc }}
							</view>
						</label>
						<view class="price-view">
							<text class="price">{{ item.price }}</text>
							<text class="unit">元/吨</text>
						</view>
					</view>
				</checkbox-group>
			</view>
		</view>
		<view class="item-wrapper">
			<zn-accordion>
				<template slot="header">
					<view class="item-header">
						<view class="title-view">
							<text class="line"></text>
							<text class="title">采购信息</text>
						</view>
						<view class="iconfont icon">&#xe63e;</view>
					</view>
				</template>
				<view class="item-content">
					<view class="purchaser-content">
						<view class="desc">
							产品名称：<text class="desc-text">{{ productName }}</text>
						</view>
						<view class="desc">
							网价参考： <text class="desc-text">{{ webPriceReference }}</text>
						</view>
						<view class="desc">
							产品品牌：<text class="desc-text">{{ productBrand }}</text>
						</view>
						<view class="desc">
							参考地区：<text class="desc-text">{{ referenceLocation }}</text>
						</view>
						<view class="desc">
							产品规格：<text class="desc-text">{{ productSpec }}</text>
						</view>
						<view class="desc">
							采购吨数：<text class="desc-text">{{ purchaseCount }}</text>
						</view>
					</view>
					<view class="pay-content">
						<view class="title">
							付款方式
						</view>
						<view class="content">
							{{ paymentDesc }}
						</view>
					</view>
					<view class="content">
						<view class="desc">
							推荐供应商：<text class="desc-text">{{ recommendSupplier }}</text>
						</view>
						<view class="desc">
							供应商电话：<text class="desc-text">{{ recommendSupplierMobile }}</text>
						</view>
					</view>
				</view>
			</zn-accordion>
		</view>
		<view class="item-wrapper">
			<zn-accordion>
				<template slot="header">
					<view class="item-header">
						<view class="title-view">
							<text class="line"></text>
							<text class="title">联采规则</text>
						</view>
						<view class="iconfont icon">&#xe63e;</view>
					</view>
				</template>
				<view class="item-content">
					<view class="content">
						<view class="desc">
							供应商报价截止时间：<text class="desc-text">{{ deadline }}</text>
						</view>
						<view class="desc">
							发票要求： <text class="desc-text">增值税发票</text>
						</view>
						<view class="desc">
							联采说明：<text class="desc-text">{{ remark }}</text>
						</view>
						<view class="desc">
							<text>附件</text>
							<zn-image-list :imageList="imageList"></zn-image-list>
						</view>
					</view>
				</view>
			</zn-accordion>
		</view>
		<view class="button-wrapper" v-if="isShowCheckBtn">
			<view class="btn-reject" @click="reject(demandPurchaseId)" v-if="demandDetailAuthObj.rejectBtn.show">驳回</view>
			<view class="btn-approve" @click="approve" v-if="demandDetailAuthObj.approveBtn.show">确认并提交</view>
		</view>
		<view class="button-wrapper" v-if="isShowEditBtn && demandDetailAuthObj.editBtn.show">
			<view class="btn-edit" @click="edit(demandId)">编辑</view>
		</view>
	</view>
</template>

<script>
	import znSteps from '../../../../components/zn-steps.vue'
	import znAccordion from '../../../../components/zn-accordion.vue'
	import znImageList from '../../../../components/zn-image-list.vue'
	import znTimeline from '../../../../components/zn-timeline.vue'
	import { func } from '../../../../common/utils/func.js'

	const DEMAND_COLOR_SUCCESS = '#0066CC';
	const DEMAND_COLOR_ERROR = '#EE1E1E';
	const ERROR_STATUS_LIST = ['REJECT', 'PRE_FINISH_REJECT']
	export default {
		name: 'demand-detail-branch',
		components: {
			znSteps,
			znAccordion,
			znImageList,
			znTimeline
		},
		data() {
			return {
				token: this.$store.state.token,
				demandId: '',
				demandPurchaseId: '',
				steps: [],
				currentStep: 0,
				demandStatus: '',
				demandOrderNo: '',
				programName: '',
				programCode: '',
                receiveAddress: '',
                receiveAddressDetail: '',
                receiver: '',
                receiverMobile: '',
                receiverIdentityCard: '',
				purchaser: '',
				supplier: '',
				demandStatusColor: DEMAND_COLOR_SUCCESS,
				productName: '',
				webPriceReference: '',
				productBrand: '',
				referenceLocation: '',
				productSpec: '',
				purchaseCount: '',
				paymentDesc: '',
				imageList: [],
				timelineArr: [],
				znPriceList: [],
				selectPriceIndexArr: [],
				recommendSupplier: '',
				recommendSupplierMobile: '',
				rejectReason: '',
				deadline: '',
				remark: '',
                demandDetailAuthObj: {
                    editBtn: {
                        chName: '编辑',
                        show: false
                    },
                    rejectBtn: {
                        chName: '驳回',
                        show: false
                    },
                    approveBtn: {
                        chName: '同意成交',
                        show: false
                    }
                }
			}
		},
		computed: {
			statusText() {
				const statusText = {
					REJECT: '已驳回',
					PENDING: '待报价',
					CUSTOM_EXAMINE_WAIT: '待审核',
					QUOTING: '报价中',
					DEADLINE: '已截标',
					ABORT: '已流标',
					PRE_FINISH: '待确认',
					PRE_FINISH_REJECT: '分公司拒绝',
					FINISH: '已完成'
				}
				return statusText[this.demandStatus] || '--'
			},
			isShowCheckBtn() { //是否显示确认或驳回按钮
				return this.demandStatus === 'PRE_FINISH'
			},
			isShowEditBtn() { //是否显示编辑按钮
				return this.demandStatus === 'REJECT'
			}
		},
		onLoad(option) {
			this.demandId = option.demandId;
			this.init();
            this.getAuth();
		},
		methods: {
			handleSelectChange(event) { //checkbox改变
				const indexArr = event.detail.value;
				this.selectPriceIndexArr = indexArr.map(item => parseInt(item))
			},
			approve() { //确认
				const params = {
					token: this.token,
					status: 'FINISH'
				}
				const selectPriceList = this.selectPriceIndexArr.map(item => {
					return {
						description: this.znPriceList[item].desc,
						price: this.znPriceList[item].priceOriginal
					}
				})
				if(selectPriceList.length === 0) {
					uni.showToast({
						title: '请选择付款方式',
						icon: 'none'
					})
					return false
				}
				params.branch_approve_price = JSON.stringify(selectPriceList);
                uni.showLoading({
                	title: '提交中',
                	mask: true
                });
				this.$api.branchDemandApi.demandExamine(params, this.demandPurchaseId)
					.then(res => {
                        uni.hideLoading();
						const result = res.data;
						if (result.msg_code === 100000) {
							uni.showToast({
								title: '确认成功!',
								icon: 'success'
							})
							this.init();
						} else {
							console.log(result);
							uni.showToast({
								title: result.message,
								icon: 'none'
							})
						}
					})
					.catch(err => {
                        uni.hideLoading();
						console.log(err);
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none'
						})
					})
			},
			reject(demandPurchaseId) { //驳回
				uni.navigateTo({
					url: `/pages/branch/demand/reject/reject?demandPurchaseId=${demandPurchaseId}`
				})
			},
			getDemandProcess() { //获取联采需求进度条
				const params = {
					token: this.token,
					demand_id: this.demandId
				}
				this.$api.branchDemandApi.demandProcess(params, this.demandId)
					.then(res => {
						const result = res.data;
						if (result.msg_code === 100000) {
							const steps = result.response.process;
							this.currentStep = result.response.step;
							this.steps = steps.map((item, index) => {
								let element = {};
								element.desc = item.title;
								element.statusClass = this.getStepStatusClass(index, item.status);
								return element
							})
						} else {
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
			 * 获取当前步状态的类名
			 * @param  {Number} index   当前循环项的index
			 * @param  {String} status  当前循环项的状态
			 * @return {String}         当前循环项的类名
			 */
			getStepStatusClass(index, status) {
				let statusClass = '';
				if (status === 'CHECK_REJECT' || status === 'BRANCH_REJECT') {
					statusClass = 'step-is-error';
					return statusClass
				}
				if (this.currentStep > index + 1) {
					statusClass = 'step-is-finish';
				} else if (this.currentStep === index + 1) {
					statusClass = 'step-is-active';
				} else {
					statusClass = 'step-is-wait';
				}
				return statusClass
			},
			getDemandProcessLog() { //获取联采需求操作日志
				const params = {
					token: this.token,
					demand_id: this.demandId
				}
				this.$api.branchDemandApi.demandProcessLog(params, this.demandId)
					.then(res => {
						const result = res.data;
						if (result.msg_code === 100000) {
							const listLength = result.response.length;
							let logList = result.response.map((item, index) => {
								let element = {
									demandReleaser: item.demand_submitting_name || '--',
									releaseTime: item.created_at || '--',
									approver: item.demand_submitter || '--',
									approveTime: item.updated_at || '--',
									duration: item.format_diachronic || '--',
									remark: item.remarks || '--',
									log: item.demand_desc,
									isActive: index === listLength - 1
								}
								if (item.demand_status == 'REJECT') {
									element.statusText = '不通过';
								} else if (item.demand_status == 'BRANCH_REJECT') {
									element.statusText = '不通过';
								} else if (item.demand_status == 'BRANCH_ACCEPECT') {
									element.statusText = '已完成';
								} else {
									element.statusText = '通过';
								}
								return element
							})
							this.timelineArr = logList.reverse();
						} else {
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
			getDetail() { //获取联采需求详情
				const params = {
					token: this.token
				}
				this.$api.branchDemandApi.demandDetail(params, this.demandId)
					.then(res => {
						const result = res.data;
						if (result.msg_code === 100000) {
							const demandInfo = result.response;
							const webPriceReferenceText = {
								XB: '西本网',
								MY_STEEL: '我的钢铁'
							}
							const spec = JSON.parse(demandInfo.category_spec);
							this.demandOrderNo = 'M13254555520012';
							this.programName = demandInfo.project_name;
							this.programCode = demandInfo.project_code;
                            this.receiveAddress = demandInfo.delivery_address_province + demandInfo.delivery_address_city + demandInfo.delivery_address_district;
                            this.receiveAddressDetail = demandInfo.delivery_address_detail;
                            this.receiver = demandInfo.consignee_name;
                            this.receiverMobile = demandInfo.consignee_mobile;
                            this.receiverIdentityCard = demandInfo.consignee_identity_card || '--';
							this.purchaser = demandInfo.member.member_auth.auth_name;
							this.supplier = demandInfo.supplier_company_name || '';
							this.productName = demandInfo.category.name;
							this.webPriceReference = webPriceReferenceText[demandInfo.quoted_price_website];
							this.productBrand = demandInfo.brand_name;
							this.referenceLocation = demandInfo.reference_address;
							this.productSpec = spec.category_spec_min + '-' + spec.category_spec_max;
							this.purchaseCount = demandInfo.purchase_num;
							this.paymentDesc = demandInfo.pay_description;
							this.demandStatus = demandInfo.current_status;
							this.recommendSupplier = demandInfo.supplier_company_name || '--';
							this.recommendSupplierMobile = demandInfo.supplier_mobile || '--';
							this.rejectReason = demandInfo.reject_reason;
							this.deadline = demandInfo.deadline;
							this.remark = demandInfo.remark || '--';
							this.imageList = demandInfo.attachments.map((item, index) => {
								return {
									src: item.path,
									name: item.original_name
								}
							})
							if (demandInfo.purchase_demand) { //联采需求单ID
								this.demandPurchaseId = demandInfo.purchase_demand.id;
							}
							if (ERROR_STATUS_LIST.includes(demandInfo.current_status)) { //联采需求状态颜色
								this.demandStatusColor = DEMAND_COLOR_ERROR;
							}
							if (demandInfo.purchase_demand && demandInfo.purchase_demand.total_quote_price) { //筑牛报价列表
								const priceList = JSON.parse(demandInfo.purchase_demand.total_quote_price);
								this.znPriceList = priceList['zn'].map((item, index) => {
									return {
										index: index.toString(), //checkbox组件要求
										desc: item.description,
										priceOriginal: item.price,
										price: func.signToWords(item.price)
									}
								})
							}
						} else {
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
			edit(demandId) { //编辑联采需求
				uni.navigateTo({
					url: `/pages/branch/demand/edit/step1?demandId=${demandId}`
				})
			},
			init() { //初始化
				this.getDetail();
				this.getDemandProcess();
				this.getDemandProcessLog();
			},
            getAuth() { //获取权限
                const demandListPermissionObj = this.$store.getters.permissionList.MobileJointPurchaseOrderList;
                this.$func.getAuth(demandListPermissionObj, this.demandDetailAuthObj)
            }
		}
	}
</script>

<style lang="scss">
	@mixin btn() {
		width: 50%;
		height: 100upx;
		text-align: center;
		line-height: 100upx;
		color: #fff;
		font-size: 32upx;
	}

	.detail-wrapper {
		padding-bottom: 120upx;

		.steps-view {
			background: #fff;
			padding: 10upx 30upx;
		}

		.accordion-view {
			.header {
				background: #fff;
				height: 50upx;
				line-height: 50upx;
				text-align: center;
				border-top: 1px solid #E6E6E6;
				color: #999;
			}

			.content {
				padding: 0 30upx;
			}
		}

		.item-wrapper {
			background: #fff;
			padding: 10upx 30upx;
			margin-top: 20upx;

			.item-header {
				display: flex;
				justify-content: space-between;
				font-size: 32upx;
				color: #333;
				font-weight: 700;
				padding-top: 30upx;
				padding-bottom: 30upx;
				border-bottom: 1px solid #eee;

				.title-view {
					display: flex;
					align-items: center;
				}

				.status {
					font-size: 28upx;
					font-weight: 400;
				}

				.line {
					display: inline-block;
					width: 6upx;
					height: 32upx;
					margin-right: 20upx;
					border-radius: 3upx;
					vertical-align: middle;
					background: $uni-color-primary;
				}
			}

			.item-content {
				padding-top: 20upx;

				.content {
					line-height: 56upx;
					font-size: 28upx;
					color: #999;
					overflow: hidden;

					.desc {
						text-overflow: ellipsis;
						white-space: nowrap;
						overflow: hidden;

						.desc-text {
							color: #666;
						}
					}
				}

				.purchaser-content {
					display: flex;
					flex-wrap: wrap;
					line-height: 56upx;
					font-size: 28upx;
					color: #999;
					border-bottom: 1px solid #eee;
					padding: 10upx 0;

					.desc {
						width: 50%;
						text-overflow: ellipsis;
						white-space: nowrap;
						overflow: hidden;

						.desc-text {
							color: #666;
						}
					}
				}

				.pay-content {
					padding: 10upx 0;
					line-height: 56upx;
					font-size: 28upx;
					border-bottom: 1px solid #eee;

					.content {
						color: $uni-color-primary;
					}
				}

				.checkbox-item {
					display: flex;
					align-items: center;
					font-size: 28upx;
					color: #666;

					.desc {
						flex-grow: 1;
						height: 90upx;
						line-height: 90upx;
						margin-left: 30upx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						border-bottom: 1px solid #eee;
					}
				}

				.price-view {
					color: $uni-color-primary;
					height: 80upx;
					line-height: 80upx;
					font-size: 28upx;
					padding-left: 80upx;

					.price {
						margin-right: 10upx;
					}

					.unit {
						color: #666;
					}
				}
			}
		}

		.button-wrapper {
			position: fixed;
			left: 0;
			bottom: 0;
			display: flex;
			flex-wrap: nowrap;
			width: 100%;

			.btn-reject {
				@include btn();
				background: #1F89E7;
			}

			.btn-approve {
				@include btn();
				background: $uni-color-primary;
			}

			.btn-edit {
				@include btn();
				width: 100%;
				background: $uni-color-primary;
			}
		}
	}
</style>
