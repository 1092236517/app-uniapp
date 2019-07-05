<template>
	<view class="order-release-wrapper">
		<view class="main">
			<view class="content">
				<view class="item-wrapper">
					<view class="content-view">
						<view class="title-view">
							<text class="line"></text>
							<text class="title">项目相关信息</text>
						</view>
						<view class="item-view">
							<text class="item-label">报价参考网站</text>
							<text>{{ referenceWebText }}</text>
						</view>
						<view class="item-view">
							<text class="item-label">报价参考地</text>
							<view class="item-input">
								<text>{{ referenceAddress }}</text>
							</view>
						</view>
						<view class="item-view">
							<text class="item-label">支付方式</text>
							<view class="item-input">
								<zn-picker
									v-model="paymentTypePickerValue"
									:pickerValueMulArray="paymentTypeList"
									placeholder="请选择支付方式"
									@picker-confirm="handlePaymentTypePickerConfirm"></zn-picker>
							</view>
						</view>
						<view class="item-view">
							<text class="item-label">计划收货时间</text>
							<view class="item-input">
								<zn-date-picker
									v-model="datePickerValue"
									@picker-confirm="handleDatePickerConfirm"></zn-date-picker>
							</view>
						</view>
					</view>
				</view>
				<view class="item-wrapper">
					<view
						v-for="(item, index) in specList"
						:key="index"
						class="content-view">
						<view class="title-view">
							<text class="line"></text>
							<text class="title">参数详情 ({{ index + 1 }})</text>
							<text
								v-if="isShowDeleteIcon"
								class="iconfont icon"
								@click="deleteConfig(index)">&#xe609;</text>
						</view>
						<view class="item-view">
							<text class="item-label">产品名</text>
							<view class="item-input">
								<input
									v-model.trim="item.name"
									type="text"
									placeholder="请填写产品名称"/>
							</view>
						</view>
						<view class="item-view">
							<text class="item-label">直径（mm）</text>
							<view class="item-input">
								<input
									v-model.trim="item.spec"
									type="text"
									placeholder="请填写产品直径"/>
							</view>
						</view>
						<view class="item-view">
							<text class="item-label">数量（吨）</text>
							<view class="item-input">
								<input
									v-model.trim="item.count"
									type="text"
									placeholder="请填写产品数量"/>
							</view>
						</view>
						<view class="item-view">
							<text class="item-label">抗震</text>
							<view class="item-input">
								<zn-picker
									v-model="item.pickerValue"
									:pickerValueMulArray="selectRange"
									placeholder="请选择抗震与否"></zn-picker>
							</view>
						</view>
						<view class="item-view">
							<text class="item-label">长度（米）</text>
							<view class="item-input">
								<zn-picker
									v-model="item.lengthPickerValue"
									:pickerValueMulArray="lengthSelectRange"
									placeholder="请选择长度"></zn-picker>
							</view>
						</view>
						<view class="item-view">
							<text class="item-label">备注</text>
							<view class="item-input">
								<input
									v-model.trim="item.remark"
									type="text"
									placeholder="请填写备注"
                                    :maxlength="120"/>
							</view>
						</view>
					</view>
					<view class="add-slave-order" @click="addConfig">
						<text class="add-icon">+</text>添加参数详情
					</view>
				</view>
			</view>
		</view>
		<view class="button-wrapper">
			<view class="button" @click="createSlaveOrder">确定</view>
		</view>	
	</view>
</template>

<script>
	import znPicker from '../../../../components/zn-picker.vue'
	import znDatePicker from '../../../../components/zn-date-picker.vue'
	import dayjs from 'dayjs'
	
	const referenceWebText = {
		'XB': '西本网',
		'MY_STEEL': '我的钢铁'
	}
	export default {
		name: 'order-release',
		components: {
			znPicker,
			znDatePicker
		},
		data() {
			return {
				token: this.$store.state.token,
				orderId: '',
				selectRange: [
					[
						{
							label: '抗震',
							value: '1'
						},
						{
							label: '不抗震',
							value: '0'
						}
					]
				],
				lengthSelectRange: [
					[
						{
							label: 9,
							value: '9'
						},
						{
							label: 12,
							value: '12'
						},
						{
							label: '无需求',
							value: '0'
						}
					]
				],
				referenceWeb: '',
				referenceWebText: '',
				referenceAddress: '',
				datePickerValue: '',
				paymentTypePickerValue: [],
				paymentTypeList: [
					[]
				],
				payType: '',
				specList: [
					{
						name: '',
						spec: '',
						count: '',
						remark: '',
						pickerValue: [1],
						lengthPickerValue: [0]
					}
				]
			}
		},
		computed: {
			isShowDeleteIcon() { //是否显示删除按钮
				return this.specList.length > 1
			}
		},
		onLoad(option) {
			this.orderId = option.orderId;
			this.getOrderDetail();
		},
		methods: {
			handleDatePickerConfirm(pickerObj) { //日期选择器确定
				const { date } = pickerObj;
			},
			paymentTypeSelectChange(pickerObj) { //支付方式改变

			},
			handlePaymentTypePickerConfirm(pickerObj) { //支付方式确认
				this.payType = pickerObj.itemArr[0]['label']
			},
			addConfig() { //新增参数详情
				this.specList.push({
					name: '',
					spec: '',
					count: '',
					remark: '',
					pickerValue: [1],
					lengthPickerValue: [0]
				})
			},
			deleteConfig(index) { //删除参数详情
				this.specList.splice(index, 1)
			},
			getOrderDetail() { //获取订单详情
				const params = {
					token: this.token
				}
				this.$api.branchOrderApi.orderDetail(params, this.orderId)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							const demandInfo = result.response.demand;
							const demandPurchaseInfo = result.response.demand_purchase;
							this.referenceWeb = demandInfo.quoted_price_website;
							this.referenceWebText = referenceWebText[demandInfo.quoted_price_website];
							this.referenceAddress = result.response.reference_address;
							const priceList = JSON.parse(demandPurchaseInfo.branch_approve_price);
							const paymentTypeList = priceList.map((item, index) => {
								return {
									label: item.description,
									value: item.description,
									price: item.price
								}
							})
							this.paymentTypeList.splice(0, 1, paymentTypeList);
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
			createSlaveOrder() { //创建批次订单
                if(!this.payType) {
                    uni.showToast({
                    	title: '请选择支付方式',
                        icon: 'none'
                    })
                    return false
                }
                if(!this.datePickerValue) {
                    uni.showToast({
                    	title: '请选择计划收货时间',
                        icon: 'none'
                    })
                    return false
                }
                if(this.specList.some(item => !this.isFloatingNumber(item.spec))) {
                    uni.showToast({
                    	title: '请输入合法数值的直径',
                        icon: 'none'
                    })
                    return false
                }
                if(this.specList.some(item => !this.isFloatingNumber(item.count))) {
                    uni.showToast({
                    	title: '请输入合法数值的数量',
                        icon: 'none'
                    })
                    return false
                }
				const params = {
					token: this.token,
					master_order_id: this.orderId,
					paid_type: this.payType,
					receive_time: dayjs(this.datePickerValue).format('YYYY-MM-DD HH:mm:ss')
				}
				const specArr = this.specList.map((item, index) => {
					const seismicIndex = item.pickerValue[0];
					const lengthIndex = item.lengthPickerValue[0];
					return {
						brand_name: item.name,
						diameter: item.spec,
						num: item.count,
						is_seismic: this.selectRange[0][seismicIndex]['value'],
						length: this.lengthSelectRange[0][lengthIndex]['value'],
						remark: item.remark,
						price: 0,
						webPrice: 0,
						group_price: 0
					}
				})
				params.spec = JSON.stringify(specArr);
                uni.showLoading({
                	title: '提交中',
                	mask: true
                });
				this.$api.branchOrderApi.createSlaveOrder(params)
					.then(res => {
                        uni.hideLoading();
						const result = res.data;
						if(result.msg_code === 100000) {
                            this.$func.asyncShowToast({
                                title: '创建成功',
                                icon: 'success',
                                duration: 3000
                            })
                            .then(val => {
                                uni.switchTab({
                                	url: '/pages/tabBar/joint-list/joint-list'
                                })
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
                        uni.hideLoading();
						console.log(err);
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none'
						})
					})
			},
            /**
             * 正浮点数检测
             * @param  {String}  number 待检测字符串
             * @return {Boolean}        是否为正浮点数
             */
            isFloatingNumber(number){
                let numberReg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
                return numberReg.test(number);
            }
		}
	}
</script>

<style lang="scss">
	.order-release-wrapper {
		font-size: 28upx;
		color: #333;
		.main {
			.content {
				padding-bottom: 150upx;
				.item-wrapper {
					.content-view {
						margin-top: 20upx;
						padding: 10upx 30upx;
						background: #fff;
						.title-view {
							display: flex;
							align-items: center;
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
						.title {
							flex-grow: 1;
						}
						.icon {
							color: #EE1E1E;
							font-size: 30upx;
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
								min-width: 200upx;
								color: #666;
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
							picker {
								flex-grow: 1;
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
						}
					}
					.add-slave-order {
						width: 100%;
						height: 90upx;
						line-height: 90upx;
						color: $uni-color-primary;
						text-align: center;
						background: #fff;
						.add-icon {
							margin-right: 20upx;
						}
					}
				}
			}
		}
		.button-wrapper {
			width: 100%;
			padding: 30upx;
			box-sizing: border-box;
			margin-top: -150upx;
			background: #eee;
			.button {
				width: 100%;
				height: 88upx;
				line-height: 88upx;
				color: #fff;
				background: $uni-color-primary;
				font-size: 32upx;
				text-align: center;
				border-radius: 8upx;				
			}
		}
	}
</style>
