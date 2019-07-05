<template>
    <view class="payment-info-detail-wrapper">
    	<view class="content-wrapper">
			<view class="content-view" v-show="status != '待支付'" >
				<view class="title-view">
					<text class="line"></text>
					<text class="title">付款单状态</text>
					<text class="status">{{status}}</text>
				</view>
			</view>
    		<!-- 认证身份 -->
    		<view class="content-view" v-show="status != '待支付'">
    			<view class="title-view">
    				<text class="line"></text>
    				<text class="title">交易信息</text>
    			</view>
    			<!-- 选择认证身份 -->
    			<view class="item-view">
    				<text class="item-label">付款时间</text>
    				<view class="item-input">
    					<text>{{pay_time}}</text>
    				</view>
    			</view>
    			<!-- 选择所属集团 -->
    			<view class="item-view">
    				<text class="item-label">状态描述</text>
    				<view class="item-input">
    					<text>{{bank_payment_desc}}</text>
    				</view>
    			</view>
				<view class="item-view">
					<text class="item-label">批次订单号</text>
					<view class="item-input">
						<text>{{slave_order_code}}</text>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">产品名称</text>
					<view class="item-input">
						<text>{{product_name}}</text>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">付款单编号</text>
					<view class="item-input">
						<text>{{payment_number}}</text>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">交易流水号</text>
					<view class="item-input">
						<text>{{batch_number||'--'}}</text>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">收款人编号</text>
					<view class="item-input">
						<text>{{receive_compony_code}}</text>
					</view>
				</view>
    		</view>
    		<!-- 公司信息 -->
    		<view class="content-view">
    			<view class="title-view">
    				<text class="line"></text>
    				<text class="title">付款方信息</text>
    			</view>
    			<view class="item-view">
    				<text class="item-label">账号名称</text>
    				<view class="item-input">
    					<text>{{payer_name}}</text>
    				</view>
    			</view>
    			<view class="item-view">
    				<text class="item-label">付款账号</text>
    				<view class="item-input">
    					<text>{{payer_account}}</text>
    				</view>
    			</view>	
    			<view class="item-view">
    				<text class="item-label">银行名称</text>
    				<view class="item-input">
    					<text>{{payer_bank_name}}</text>
    				</view>
    			</view>
    		</view>
    		<!-- 联系方式 -->
    		<view class="content-view">
    			<view class="title-view">
    				<text class="line"></text>
    				<text class="title">收款方信息</text>
    			</view>
    			<view class="item-view">
    				<text class="item-label">账号名称</text>
    				<view class="item-input">
    					<text>{{payee_name}}</text>
    				</view>
    			</view>
    			<view class="item-view">
    				<text class="item-label">收款账号</text>
    				<view class="item-input">
    					<text>{{payee_account||'--'}}</text>
    				</view>
    			</view>
    			<view class="item-view">
    				<text class="item-label">银行名称</text>
    				<view class="item-input">
    					<text>{{payee_bank_name}}</text>
    				</view>
    			</view>
    			<view class="item-view">
    				<text class="item-label">城市名称</text>
    				<view class="item-input">
    					<text>{{address_province + '/' + address_city}}</text>
    				</view>
    			</view>
    		</view>
    		<!-- 联系地址 -->
    		<view class="content-view">
    			<view class="title-view">
    				<text class="line"></text>
    				<text class="title">支付信息</text>
    			</view>
    			<view class="item-view">
    				<text class="item-label">加急程度</text>
    				<view class="item-input" >
    					<text>{{is_urgent}}</text>
    				</view>
    			</view>
    			<view class="item-view">
    				<text class="item-label">业务类型</text>
    				<view class="item-input">
    					<text>{{is_to_company}}</text>
    				</view>
    			</view>
				<view class="item-view">
					<text class="item-label">支付金额</text>
					<view class="item-input">
						<text>{{money}}</text>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">确认金额</text>
					<view class="item-input">
						<text>{{confirmation_money}}</text>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">备注信息</text>
					<view class="item-input">
						<text>{{remark||'--'}}</text>
					</view>
				</view>
				<view class="item-view">
					<view class="item-view-upload">
						<view class="label">上传附件</view>
						<zn-image-list :imageList="attachmentList"></zn-image-list>
					</view>
				</view>	
    		</view>
    	</view>
    	<view class="button-view" v-show="status == '待支付'">
    		<button type="primary" @click="agree">确认支付</button>
    	</view>
    </view>
</template>

<script>
	import znImageList from '../../../../components/zn-image-list.vue'
    export default {
        name: 'payment-info-detail',
		components: {
			znImageList,
		},
        data() {
            return {
                userToken: this.$store.state.token,
                id:'',
				//付款单状态
				status:'',
				
                pay_time: '',
                bank_payment_desc: '',
				slave_order_code:'',
				product_name:'',
				payment_number:'',
				batch_number:'',
				receive_compony_code:'',
                
                payer_name: '',
				payer_account:'',
				payer_bank_name:'',
				
				payee_name: '',
				payee_account:'',
				payee_bank_name:'',
				address_province:'',
				address_city:'',
				
				is_urgent:'',
				is_to_company:'',
				money:'',
				confirmation_money:'',
				remark:'',
				attachmentList:[]
            }
        },
		onLoad(option){
			this.id = option.id;
			this.dataRestore();
		},
        methods: {
            // 数据回填
            dataRestore() {
            	const params = {
            		token: this.userToken,
            	}
            	this.$api.groupPaymentInfoApi.infoDetail(this.id,params)
            		.then(res => {
            			const result = res.data;
            			if(result.msg_code === 100000){
							let dataObj = result.response;
							switch(dataObj.status){
								case 'WAIT_PAY':
									this.status = '待支付';
									break;
								case 'WAIT_BANK_PAY':
									this.status = '待银行确认';
									break;
								case 'PAY_ALREADY':
									this.status = '已支付';
									break;
								case 'PAY_FAIL':
									this.status = '支付失败';
									break;
								default:
									this.status = '--';
									break;
							};
							this.slave_order_id = dataObj.slave_order_id;
							this.pay_time = dataObj.pay_time;
							this.bank_payment_desc = dataObj.bank_payment_desc;
							this.slave_order_code = dataObj.slave_order_code;
							this.product_name = dataObj.product_name;
							this.payment_number = dataObj.payment_number;
							this.batch_number = dataObj.batch_number;
							this.receive_compony_code = dataObj.receive_compony_code;
							this.payer_name = dataObj.payer_name;
							this.payer_account = dataObj.payer_account;
							this.payer_bank_name = dataObj.payer_bank_name;
							this.payee_name = dataObj.payee_name;
							this.payee_account = dataObj.payee_account;
							this.payee_bank_name = dataObj.payee_bank_name;
							this.address_province = dataObj.address_province;
							this.address_city = dataObj.address_city;
							this.is_urgent = dataObj.is_urgent=='PAY_URGENTLY'?'加急':'不加急';
							this.is_to_company = dataObj.is_to_company=="TO_COMPANY"?'对公业务':'对私业务';
							this.money = dataObj.money;
							this.confirmation_money = dataObj.confirmation_money;
							this.remark = dataObj.remark;
							this.attachmentList = dataObj.attachments.map(item=>{
								return{
									'src':item.path
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
            //确认支付
            agree() {
            	let _this = this;
            	const params = {
            		token:_this.userToken,
					slave_order_id:this.slave_order_id,
            		id:this.id,
            	}
            	uni.showModal({
            		title: '提示',
            		content: '是否确认支付？',
            		success: function (res) {
            			if (res.confirm) {
            				_this.$api.groupPaymentInfoApi.infoToPay(params).then(res=>{
            					let result = res.data;
            					if(result.msg_code===100000){
            						uni.showToast({
            							title: '支付成功!',
            							icon: 'success'
            						})
            						uni.navigateBack({
            							delta: 1
            						});
            					}else {
            						console.log(result);
            						uni.showToast({
            							title: result.message,
            							icon: 'none'
            						})
            					}
            				}).catch(err => {
            					console.log(err);
            					uni.showToast({
            						title: JSON.stringify(err),
            						icon: 'none'
            					})
            				})
            			} else if (res.cancel) {
            				console.log('用户点击取消');
            			}
            		}
            	});
            }
        }
    }
</script>

<style lang="scss">
    .payment-info-detail-wrapper {
        font-size: 28upx;
        .content-wrapper {
        	display: block;
        	.content-view {
        		margin-bottom: 20upx;
        		padding: 10upx 30upx;
        		background: #fff;
        		.title-view {
        			font-size: 32upx;
        			color: #333;
        			font-weight: 700;
        			padding-top: 30upx;
        			padding-bottom: 30upx;
        			border-bottom: 1px solid #eee;
					.status{
						float: right;
						font-weight: normal;
						font-size: 26upx;
						line-height: 50upx;
						color: #0066CC;
					}
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
        		}
        		.item-view-upload {
        			padding-top: 20upx;
        		}
        		.tip {
        			font-size: 20upx;
        			color: #999;
        			line-height: 40upx;
        		}
        	}
        }
        .button-view {
        	text-align: center;
        	button {
        		background: $uni-color-primary;
        		width: 96%;
        		display: inline-block;
        		margin-right: 10upx;
        	}
        	:last-child{
        		margin-left: 10upx;
        	}
        }
    }
</style>
