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
					<zn-accordion>
						<template slot="header">
							<view class="item-header">
								<view class="title-view">
									<text class="line"></text>
									<text class="title">项目相关信息</text>
								</view>
								<view class="iconfont icon">&#xe63e;</view>
							</view>
						</template>
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
									订价日期：<text class="desc-text">{{ date }}</text>
								</view>
                                <template v-if="type === 'webprice'">
                                	<view class="desc">
                                		实际收货日期：<text class="desc-text">{{ receiveGoodsTime }}</text>
                                	</view>
                                	<view>
                                		<text>收货凭证：</text>
                                        <zn-image-list :imageList="imageList"></zn-image-list>
                                	</view>
                                </template>
							</view>
						</view>
					</zn-accordion>
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
                    			<text class="label">产品名</text><text class="desc-text">{{ item.name }}</text>
                    		</view>
                    		<view class="desc">
                    			<text class="label">直径（mm）</text><text class="desc-text">{{ item.diameter }}</text>
                    		</view>
                    		<view class="desc">
                    			<text class="label">数量（吨）</text><text class="desc-text">{{ item.count }}</text>
                    		</view>
                    		<view class="desc">
                    			<text class="label">抗震需求</text><text class="desc-text">{{ item.isSeismic }}</text>
                    		</view>
                    		<view class="desc">
                    			<text class="label">长度（米）</text><text class="desc-text">{{ item.length }}</text>
                    		</view>
                    		<view class="desc">
                                <text class="label">网上标价（元）</text>
                                <template v-if="type === 'webprice'">
                                	<input
                                		type="digit"
                                		placeholder="请填写价格"
                                		v-model="item.webPrice"
                                		@blur="calculatePrice(item)" />
                                </template>
                                <template v-else>
                                	<text class="desc-text">{{ item.webPrice }}</text>
                                </template>
                    		</view>
                    		<view class="desc">
                    			<text class="label">总额（元）</text><text class="desc-text">{{ item.groupTotalMoney }}</text>
                    		</view>
                    		<view class="desc">
                    			<text class="label">备注</text><text class="desc-text">{{ item.remark }}</text>
                    		</view>
                    	</view>
                    </view>
				</view>
			</view>
		</view>
        <template v-if="type !== 'webprice'">
        	<view class="button-wrapper" v-if="slaveOrderStatus === 'WAIT_GROUP_PAY' && canPay && slaveOrderDetailAuthObj.payBtn.show">
        		<view class="button" @click="pay">支付批次</view>
        	</view>
        </template>
        <template v-if="type === 'webprice'">
        	<view class="button-wrapper">
        		<view class="button" @click="confirm">同意</view>
        	</view>
        </template>
	</view>
</template>

<script>
	import znSteps from '../../../../../components/zn-steps.vue'
	import znAccordion from '../../../../../components/zn-accordion.vue'
	import znTimeline from '../../../../../components/zn-timeline.vue'
	import znDatePicker from '../../../../../components/zn-date-picker.vue'
    import znImageList from '../../../../../components/zn-image-list.vue'
	
	const webPriceReferenceText = {
		XB: '西本网',
		'MY_STEEL': '我的钢铁'
	}
	export default {
		name: 'slave-order-detail-group',
		components: {
			znSteps,
			znAccordion,
			znTimeline,
			znDatePicker,
            znImageList
		},
		data() {
			return {
				token: this.$store.state.token,
                type: '',
				orderId: '',
				slaveOrderId: '',
				slaveOrderNo: '',
				steps: [],
				currentStep: 0,
				timelineArr: [],
				webPriceReference: '',
				webPriceReferenceText: '',
				referenceLocation: '',
				paymentType: '',
				date: '',
                receiveGoodsTime: '',
                imageList: [], //收货凭证
				datePickerValue: '',
				slaveOrderConfigList: [],
				slaveOrderStatus: '',
				canPay: '',
                slaveOrderDetailAuthObj: {
                    payBtn: {
                        chName: '支付批次',
                        show: false
                    }
                }
			}
		},
		onLoad(option) {
			this.orderId = option.orderId;
			this.slaveOrderId = option.slaveOrderId;
			this.slaveOrderNo = option.slaveOrderNo;
            if(option.type) {
                this.type = option.type;
            }
            if(this.type === 'webprice') { //修改导航栏标题
                uni.setNavigationBarTitle({
                    title: '配置网价'
                });
            }
			this.getSlaveOrderProcess();
			this.getSlaveOrderProcessLog();
			this.getOrderDetail();
            this.getAuth();
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
			getSlaveOrderProcess() { //获取批次订单进度条
				const params = {
					token: this.token,
					slave_order_id: this.slaveOrderId,
					process_type: 'SLAVE_ORDER'
				}
				this.$api.groupOrderApi.slaveOrderProcess(params)
					.then(res => {
						const result = res.data;
						if (result.msg_code === 100000) {
							const steps = result.response.processes;
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
			getSlaveOrderProcessLog() { //获取批次订单操作日志
				const params = {
					token: this.token
				}
				this.$api.groupOrderApi.slaveOrderLogList(params, this.slaveOrderNo)
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
			getOrderDetail() { //获取订单详情
				const params = {
					token: this.token
				}
				this.$api.groupOrderApi.slaveOrderDetail(params, this.slaveOrderId)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							const payType = result.response.paid_type;
							const canPay = result.response.is_can_pay;
							this.webPriceReference = result.response.quoted_price_website;
							this.webPriceReferenceText = webPriceReferenceText[result.response.master_order.quoted_price_website];
							this.referenceLocation = result.response.reference_address;
							this.date = result.response.quotation_time;
                            this.receiveGoodsTime = result.response.receive_time || '';
							this.paymentType = result.response.pay_description;
							this.slaveOrderStatus = result.response.status;
							this.canPay = this.groupCanPay(payType, canPay);
                            if(result.response.branch_sign_attachments && result.response.branch_sign_attachments.length > 0) {
                                this.imageList = result.response.branch_sign_attachments.map((item ,index) => {
                                    return {
                                        src: item.path,
                                        name: item.original_name
                                    }
                                })
                            }
							this.slaveOrderConfigList = result.response.get_slave_order_configures.map((item, index) => {
								let length = item.length;
								if(length === '0') {
									length = '无需求'
								}
								return {
									id: item.id,
									name: item.brand_name,
									diameter: item.diameter,
									isSeismic: item.is_seismic === '0' ? '不抗震' : '抗震',
									count: item.num,
									length,
									groupTotalMoney: item.group_total_money || '--',
									remark: item.remark,
									webPrice: item.price,
									supplierTotalMoney: item.supplier_total_money,
									groupPrice: item.group_price,
                                    isFold: true
								}
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
			},
			pay() { //支付批次
				uni.navigateTo({
					url: `/pages/group/order/select-payment/select-payment?slaveOrderId=${this.slaveOrderId}&slaveOrderNo=${this.slaveOrderNo}`
				})
			},
			groupCanPay(payType, canPay){ //财务部能否支付判断
			    if(payType == 'PAID_BEFORE'){
			        return true
			    }
			    if(payType != 'PAID_BEFORE' && canPay){
			        return true
			    }
			    return false
			},
            getAuth() { //获取权限
                const orderListPermissionObj = this.$store.getters.permissionList.MobileSlaveOrderList;
                this.$func.getAuth(orderListPermissionObj, this.slaveOrderDetailAuthObj);
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
            		type: 'GROUP_ACTUAL_MONEY',
            		price: item.webPrice,
            		num: item.count
            	}
            	this.$api.groupOrderApi.webPriceCount(params)
            		.then(res => {
            			const result = res.data;
            			if(result.msg_code===100000){
            				item.groupTotalMoney = result.response.groupActualMoney;
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
            },
            confirm() { //配置网价
                const params = {
                    token: this.token
                }
                const spec = this.slaveOrderConfigList.map(item => {
                	return {
                		id: item.id,
                		brand_name: item.name,
                		diameter: item.diameter,
                		is_seismic: item.isSeismic === '不抗震' ? '0': '1',
                		num: item.count,
                		length: item.length === '无需求' ? '0' : item.length,
                		group_total_money: item.groupTotalMoney,
                		remark: item.remark,
                		webPrice: item.webPrice,
                		supplier_total_money: item.supplierTotalMoney,
                		group_price: item.webPrice
                	}
                })
                params.spec = JSON.stringify(spec);
                uni.showLoading({
                	title: '提交中',
                	mask: true
                });
                this.$api.groupOrderApi.webPriceUpdate(params, this.slaveOrderId)
                    .then(res => {
                        uni.hideLoading();
                        const result = res.data;
                        if(result.msg_code === 100000) {
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
									width: 180upx;
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
			position: fixed;
			left: 0;
			bottom: 0;
			display: flex;
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
