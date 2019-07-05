<template>
	<view class="confirm-webprice-wrapper">
		<view class="main">
			<view class="content">
				<view class="steps-view">
					<zn-steps
						:steps="steps"
						:currentStep="currentStep"></zn-steps>			
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
                    		<text class="title">项目相关信息</text>
                    	</view>
                    	<view class="iconfont icon">&#xe63e;</view>
                    </view>
                    <view class="item-content">
                    	<view class="desc-content">
                    		<view class="desc">
                    			报价参考网址：<text class="desc-text">{{ webPriceReferenceText }}</text>
                    		</view>
                    		<view class="desc">
                    			报价参考地： <text class="desc-text">{{ referenceLocation }}</text>
                    		</view>
                    		<view class="desc">
                    			支付方式：<text class="desc-text">{{ paymentType }}</text>
                    		</view>
                    		<view class="desc">
                    			<text>订价日期</text>
                    			<view class="date-picker-view">
                    				<zn-date-picker
                    					v-model="datePickerValue"
                    					@picker-confirm="handleDatePickerConfirm"
                    					:disabled="canEdit"></zn-date-picker>
                    			</view>
                    		</view>
                    		<view class="desc">
                    			计划收货日期：<text class="desc-text">{{ receiveGoodsDate }}</text>
                    		</view>
                    	</view>
                    </view>
				</view>
				<view class="item-wrapper" v-for="(item, index) in slaveOrderConfigList" :key="index">
                    <view class="item-header" @click="foldChange(item)">
                    	<view class="title-view">
                    		<text class="line"></text>
                    		<text class="title">参数详情 ({{ index + 1 }})</text>
                    	</view>
                    	<view class="iconfont icon">&#xe63e;</view>
                    </view>
                    <view class="item-content" v-if="!item.isFold">
                    	<view class="desc-content">
                    		<view class="desc">
                    			<text class="label">产品名</text>
                    			<input
                    				type="text"
                    				v-model="item.name"
                    				:disabled="isDisabled" />
                    		</view>
                    		<view class="desc">
                    			<text class="label">直径（mm）</text>
                    			<input
                    				type="text"
                    				v-model="item.diameter"
                    				:disabled="isDisabled" />
                    		</view>
                    		<view class="desc">
                    			<text class="label">数量（吨）</text>
                    			<input
                    				type="text"
                    				v-model="item.count"
                    				:disabled="isDisabled"
                    				@blur="calculatePrice(item)" />
                    		</view>
                    		<view class="desc">
                    			<text class="label">抗震需求</text>
                    			<view class="picker-view">
                    				<zn-picker
                    					v-model="item.isSeismic"
                    					:pickerValueMulArray="selectRange"
                    					placeholder="请选择抗震与否"
                    					:disabled="isDisabled"></zn-picker>
                    			</view>
                    		</view>
                    		<view class="desc">
                    			<text class="label">长度（米）</text>
                    			<view class="picker-view">
                    				<zn-picker
                    					v-model="item.length"
                    					:pickerValueMulArray="lengthSelectRange"
                    					placeholder="请选择长度"
                    					:disabled="isDisabled"></zn-picker>
                    			</view>
                    		</view>
                    		<view class="desc">
                    			<text class="label">网上标价（元）</text>
                    			<input
                    				type="digit"
                    				placeholder="请填写价格"
                    				v-model="item.webPrice"
                    				:disabled="canEdit"
                    				@blur="calculatePrice(item)" />
                    		</view>
                    		<view class="desc">
                    			<text class="label">总额（元）</text><text class="desc-text">{{ item.supplierTotalMoney }}</text>
                    		</view>
                    		<view class="desc">
                    			<text class="label">备注</text>
                    			<input
                    				type="text"
                    				:placeholder="isDisabled ? '' : '请填写备注'"
                    				v-model="item.remark"
                    				:disabled="isDisabled" />
                    		</view>
                    	</view>
                    </view>
				</view>
				<!-- <view class="item-wrapper">
					<view class="item-content">
						<view class="desc-content">
							<view class="item-view">
								<text class="item-label">计划收货日期</text>
								<view class="item-input">
									<zn-date-picker
										v-model.trim="datePickerValue"
										@picker-confirm="handleDatePickerConfirm"></zn-date-picker>
								</view>
							</view>
						</view>
					</view>
				</view> -->
				<view class="tip">
					注：(网上标价如未知，可不填，网上标价为实际参考西本网，北京，北京市的网上标价，不含上下浮动价)
				</view>
			</view>
		</view>
		<view class="button-wrapper">
			<view
				class="button"
				v-if="slaveOrderStatus === 'WAIT_SUPPLIER_CONFIRM_GOODS_PRICE_AND_QUANTITY'"
				@click="submit">提交</view>
			<view
				class="button"
				v-if="slaveOrderStatus === 'WAIT_SUPPLIER_CONFIRM_RECEIVE_MONEY'"
				@click="confirmReceiveMoney">确认收款</view>
			<view
				class="button"
				v-if="slaveOrderStatus === 'WAIT_SEND_GOODS'"
				@click="sendGoods">确认发货</view>
			<view
				class="button"
				v-if="slaveOrderStatus === 'BRANCH_CONFIRM_PRICE_AND_QUANTITY_REJECT'"
				@click="submit">重新编辑</view>
		</view>
	</view>
</template>

<script>
	import znSteps from '../../../../../components/zn-steps.vue'
	import znAccordion from '../../../../../components/zn-accordion.vue'
	import znTimeline from '../../../../../components/zn-timeline.vue'
	import znDatePicker from '../../../../../components/zn-date-picker.vue'
	import znPicker from '../../../../../components/zn-picker.vue'
	import dayjs from 'dayjs'
	
	const webPriceReferenceText = {
		XB: '西本网',
		'MY_STEEL': '我的钢铁'
	}
	export default {
		name: 'slave-order-detail-supplier',
		components: {
			znSteps,
			znAccordion,
			znTimeline,
			znDatePicker,
			znPicker
		},
		data() {
			return {
				token: this.$store.state.token,
				orderId: '',
				slaveOrderId: '',
				slaveOrderNo: '',
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
				steps: [],
				currentStep: 0,
				timelineArr: [],
				webPriceReference: '',
				webPriceReferenceText: '',
				referenceLocation: '',
				paymentType: '',
				date: '',
				datePickerValue: '',
				webPriceDate: '',
				slaveOrderConfigList: [],
				slaveOrderStatus: '',
				receiveGoodsDate: ''
			}
		},
		computed: {
			isDisabled() {
				let isDisabled = true;
				if(this.slaveOrderStatus === 'WAIT_SEND_GOODS') {
					isDisabled = false;
				}
				return isDisabled
			},
			canEdit() { //能否编辑网价
				let canEdit = true;
				if(this.slaveOrderStatus === 'WAIT_SUPPLIER_CONFIRM_GOODS_PRICE_AND_QUANTITY'
					|| this.slaveOrderStatus === 'BRANCH_CONFIRM_PRICE_AND_QUANTITY_REJECT') {
					canEdit = false;
				}
				return canEdit
			}
		},
		onLoad(option) {
			this.orderId = option.orderId;
			this.slaveOrderId = option.slaveOrderId;
			this.slaveOrderNo = option.slaveOrderNo;
			this.getSlaveOrderProgress();
			this.getOrderDetail();
		},
		methods: {
            foldChange(item) { //折叠、展开
                item.isFold = !item.isFold;
            },
			/**
			 * 获取当前步状态的类名
			 * @param  {Number} index   当前循环项的index
			 * @param  {String} status  当前循环项的状态
			 * @return {String}         当前循环项的类名
			 */
			getStepStatusClass(index, status) {
				let statusClass = '';
				if(status === 'CHECK_REJECT' || status === 'STATUS_BRANCH_CONFIRM_REJECT') {
					statusClass = 'step-is-error';
					return statusClass
				}
				if(this.currentStep > index + 1) {
					statusClass = 'step-is-finish';
				} else if (this.currentStep === index + 1) {
					statusClass = 'step-is-active';
				} else {
					statusClass ='step-is-wait';
				}
				return statusClass
			},
			getSlaveOrderProgress() { //获取批次订单进度和日志
				const params = {
					token: this.token,
					process_type: 'SLAVE_ORDER',
					slave_order_id: this.slaveOrderId
				}
				this.$api.supplierOrderApi.orderProgress(params)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							const steps = result.response.processes;
							const jointList = result.response.jointList;
							const listLength = jointList.length;
							this.currentStep = result.response.step;
							this.steps = steps.map((item, index) => {
								let element = {};
								element.desc = item.title;
								element.statusClass = this.getStepStatusClass(index, item.status);
								return element
							})
							//操作日志
							let logList = jointList.map((item, index) => {
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
								if(item.demand_status == 'STATUS_BRANCH_CONFIRM_REJECT'){
							    	element.statusText = '不通过';
							    }else if(item.demand_status == 'FINISHED'){
							    	element.statusText = '已完成';
							    }else{
							    	element.statusText = '通过';
							    }
								return element
							})
							this.timelineArr = logList.reverse();
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
			getOrderDetail() { //获取订单详情
				const params = {
					token: this.token
				}
				this.$api.supplierOrderApi.slaveOrderDetail(params, this.slaveOrderId)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							this.webPriceReference = result.response.quoted_price_website;
							this.webPriceReferenceText = webPriceReferenceText[result.response.master_order.quoted_price_website];
							this.referenceLocation = result.response.reference_address;
							this.date = result.response.quotation_time || '--';
							this.paymentType = result.response.pay_description;
							this.slaveOrderStatus = result.response.status;
							this.receiveGoodsDate = result.response.receive_time;
							this.datePickerValue = result.response.quotation_time || new Date();
                            this.webPriceDate = result.response.quotation_time || dayjs(new Date()).format('YYYY-MM-DD') + ' 00:00:00';
							this.slaveOrderConfigList = result.response.get_slave_order_configures.map((item, index) => {
								const element = {
									id: item.id,
									name: item.brand_name,
									diameter: item.diameter,
									count: item.num,
									groupTotalMoney: item.group_total_money || '--',
									remark: item.remark,
									webPrice: item.price,
									supplierTotalMoney: item.supplier_total_money,
									groupPrice: item.group_price,
                                    isFold: true
								}
								const seismicIndex = this.selectRange[0].findIndex(select => select.value == item.is_seismic); //是否抗震的index
								const lengthIndex = this.lengthSelectRange[0].findIndex(length => length.value == item.length); //长度的index
								element.isSeismic = [seismicIndex];
								element.length = [lengthIndex];
								return element
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
			handleDatePickerConfirm(pickerObj) { //日期选择器确定
				const { date } = pickerObj;
				this.webPriceDate = dayjs(date).format('YYYY-MM-DD HH:mm:ss')
			},
			submit() { //提交货量价
				const params = {
					token: this.token,
					quotation_time: this.webPriceDate
				}
				const spec = this.slaveOrderConfigList.map(item => {
					const seicmicIndex = item.isSeismic[0];
					const lengthIndex = item.length[0];
					return {
						id: item.id,
						brand_name: item.name,
						diameter: item.diameter,
						is_seismic: this.selectRange[0][seicmicIndex]['value'],
						num: item.count,
						length: this.lengthSelectRange[0][lengthIndex]['value'],
						group_total_money: item.groupTotalMoney,
						remark: item.remark,
						webPrice: item.webPrice,
						supplier_total_money: item.supplierTotalMoney,
						group_price: item.groupPrice
					}
				})
				if(!this.webPriceDate) {
					uni.showToast({
						title: '请选择订价时间',
						icon: 'none'
					})
					return false
				}
				if(spec.some(item => !item.webPrice)) { //校验网价是否为空
					uni.showToast({
						title: '请填写网价',
						icon: 'none'
					})
					return false
				}
				params.spec = JSON.stringify(spec);
                uni.showLoading({
                	title: '提交中',
                	mask: true
                });
				this.$api.supplierOrderApi.slaveOrderCheck(params, this.slaveOrderId)
					.then(res => {
                        uni.hideLoading();
						const result = res.data;
						if(result.msg_code === 100000) {
                            uni.hideLoading();
                            this.$func.asyncShowToast({
                                title: '提交成功',
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
			confirmReceiveMoney() { //确认收款
				const params = {
					token: this.token
				}
                uni.showLoading({
                	title: '提交中',
                	mask: true
                });
				this.$api.supplierOrderApi.confirmReceiveMoney(params, this.slaveOrderId)
					.then(res => {
                        uni.hideLoading();
						const result = res.data;
						if(result.msg_code === 100000) {
                            this.$func.asyncShowToast({
                                title: '操作成功',
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
			sendGoods() { //确认发货
				const params = {
					token: this.token
				}
				const spec = this.slaveOrderConfigList.map((item, index) => {
					const element = {
						id: item.id,
						brand_name: item.name,
						diameter: item.diameter,
						num: item.count,
						group_total_money: item.groupTotalMoney,
						remark: item.remark,
						webPrice: item.webPrice,
						supplier_total_money: item.supplierTotalMoney,
						group_price: item.groupPrice
					}
					const seismicIndex = item.isSeismic[0];
					const lengthIndex = item.length[0];
					element.is_seismic = this.selectRange[0][seismicIndex]['value'];
					element.length = this.lengthSelectRange[0][lengthIndex]['value'];
					return element
				})
				params.spec= JSON.stringify(spec);
                uni.showLoading({
                	title: '提交中',
                	mask: true
                });
				this.$api.supplierOrderApi.sendGoods(params, this.slaveOrderId)
					.then(res => {
                        uni.hideLoading();
						const result = res.data;
						if(result.msg_code === 100000) {
                            this.$func.asyncShowToast({
                                title: '操作成功',
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
			 * 网上标价改变或数量计算货量价
			 * @param  {Object} item 当前批次订单规格
			 */
			calculatePrice(item){
				const reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
				const params = {
					token: this.token,
					configure_id: item.id,
					type: 'SUPPLIER_ACTUAL_MONEY',
					price: item.webPrice,
					num: item.count
				}
				this.$api.supplierOrderApi.webPriceCount(params)
					.then(res => {
						const result = res.data;
						if(result.msg_code===100000){
							item.supplierTotalMoney = result.response.supplierActualMoney;
						}else{
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
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}
	.confirm-webprice-wrapper {
		height: 100%;
		.main {
			min-height: 100%;
			.content {
				padding-bottom: 150upx;
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
						.line {
							display: inline-block;
							width: 6upx;
							height: 32upx;
							margin-right: 20upx;
							border-radius: 3upx;
							vertical-align: middle;
							background: $uni-color-primary;
						}
						.icon {
							font-weight: 400;
						}
					}
					.item-content {
						padding-top: 20upx;
						.desc-content {
							line-height: 56upx;
							font-size: 28upx;
							color: #999;
							overflow: hidden;
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
								.input-placeholder {
									color: $uni-text-color-placeholder;
								}
							}
							.desc {
								display: flex;
								text-overflow: ellipsis;
								white-space: nowrap;
								overflow: hidden;
								.desc-text {
									color: #666;
								}
								.label {
									display: inline-block;
									width: 200upx;
								}
								input {
									flex-grow: 1;
								}
								.picker-view {
									flex-grow: 1;
								}
								.date-picker-view {
									flex-grow: 1;
									margin-left: 20upx;
								}
							}
						}
					}
				}
				.tip {
					padding: 20upx 30upx;
					line-height: 36upx;
					font-size: 24upx;
					color: #EE1E1E;
					background: #eee;
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
