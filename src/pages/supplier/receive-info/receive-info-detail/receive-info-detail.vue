<template>
    <view class="payment-info-detail-wrapper">
    	<view class="content">
    		<block>
    			<view class="item-wrapper">
    				<view class="item-header">
    	                <view class="title-view">
    	                	<text class="line"></text>
    	                	<text class="title">交易信息</text>
    	                </view>
    				</view>
    				<view class="item-content">
    					<view class="content">
    						<view class="desc">
    							付款时间：{{payInfo.created_at}}
    						</view>
    						<view class="desc">
    							项目名称：{{ project_name }}
    						</view>
    						<view class="desc">
    							批次订单号：{{ slave_order_code }}
    						</view>
    						<view class="desc">
    							产品名称：{{ product_name }}
    						</view>
    						<view class="desc">
    							付款单编号：{{ payInfo.payment_number }}
    						</view>
    						<view class="desc">
    							交易流水号：{{ payInfo.batch_number || '--' }}
    						</view>
							<view class="desc">
								收款人编号：{{ payee_account.receive_compony_code || '--' }}
							</view>
    					</view>
    				</view>
    			</view>
    		</block>
			<block>
				<view class="item-wrapper">
					<view class="item-header">
			            <view class="title-view">
			            	<text class="line"></text>
			            	<text class="title">付款方信息</text>
			            </view>
					</view>
					<view class="item-content">
						<view class="content">
							<view class="desc">
								账号名称：{{payInfo.payer_name}}
							</view>
							<view class="desc">
								付款账号：{{ payInfo.payer_account }}
							</view>
							<view class="desc">
								银行名称：{{ payInfo.payer_bank_name }}
							</view>
						</view>
					</view>
				</view>
			</block>
			<block>
				<view class="item-wrapper">
					<view class="item-header">
			            <view class="title-view">
			            	<text class="line"></text>
			            	<text class="title">收款方信息</text>
			            </view>
					</view>
					<view class="item-content">
						<view class="content">
							<view class="desc">
								账号名称：{{ payee_account.account_name }}
							</view>
							<view class="desc">
								收款账号：{{ payee_account.account }}
							</view>
							<view class="desc">
								银行名称：{{ payee_account.bank_name }}
							</view>
							<view class="desc">
								城市名称：{{ payee_account.address_province +'/'+ payee_account.address_city }}
							</view>
						</view>
					</view>
				</view>
			</block>
			<block>
				<view class="item-wrapper">
					<view class="item-header">
			            <view class="title-view">
			            	<text class="line"></text>
			            	<text class="title">支付信息</text>
			            </view>
					</view>
					<view class="item-content">
						<view class="content">
							<view class="desc">
								业务类型：{{payInfo.is_to_company=='TO_COMPANY'?'对公业务':'对私业务'}}
							</view>
							<view class="desc">
								支付金额：{{ payInfo.money }}
							</view>
							<view class="desc">
								确认金额：{{ payInfo.confirmation_money }}
							</view>
							<view class="desc">
								备注信息：{{ payInfo.remark }}
							</view>
							<view class="desc">
								附件：
								<zn-image-list :imageList="fileList"></zn-image-list>
							</view>
						</view>
					</view>
				</view>
			</block>
    	</view>
    </view>
</template>

<script>
	import znImageList from '../../../../components/zn-image-list.vue'
    export default {
        name: 'receive-info-detail',
		components: {
			znImageList,
		},
        data() {
            return {
				token: this.$store.state.token,
				id:'',
				payInfo:{},
				fileList:[],
				payee_account:{},
                project_name:'',
				slave_order_code:'',
				product_name:''
            }
        },
		onLoad(option){
			this.id = option.id;
			this.getDetail();
		},
        methods: {
            getDetail(){
				const params = {
					token: this.token,
				}
				this.$api.supplierReceiveApi.receiveAccountDetail(this.id,params).then(res=>{
					const result = res.data;
					if(result.msg_code === 100000){
						this.payInfo = result.response.payInfo;
						this.fileList = result.response.payInfo.attachments.map(item=>{
							return {'src': item.path}
						});
						this.payee_account = result.response.payInfo.payee_account;
						this.project_name = result.response.project_name;
						this.slave_order_code = result.response.slave_order_code;
						this.product_name = result.response.product_name;
					}else {
						console.log(result);
						uni.showToast({
							title: result.message,
							icon: 'none'
						})
					}
				}).catch(err=>{
						console.log(err);
						this.loading = false;
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
    .payment-info-detail-wrapper {
        .content {
        	.item-wrapper {
        		background: #fff;
        		margin-bottom: 20upx;
        		cursor: pointer;
        		.item-header {
        			font-size: 32upx;
        			color: #333;
        			font-weight: 700;
        			.title-view {
        				display: flex;
        				align-items: center;
        				padding: 30upx;
        				border-bottom: 1px solid #eee;
        			}
        			.line {
        				display: inline-block;
        				width: 6upx;
        				height: 32upx;
        				margin-right: 20upx;
        				border-radius: 3upx;
        				vertical-align: middle;
        				background:#0066cc;
        			}
        			.title {
        				flex-grow: 1;
        			}
        		}
        		.item-content {
        			display: flex;
        			flex-wrap: nowrap;
        			padding: 30upx;
        			.content {
        				flex-grow: 1;
        				line-height: 56upx;
        				font-size: 28upx;
        				color: #999;
        				overflow: hidden;
        				.title {
        					font-size: 30upx;
        					color: #333;
        				}
        				.desc {
//         					text-overflow: ellipsis;
//         					white-space: nowrap;
//         					overflow: hidden;
        				}
						:last-child{
							border-bottom: none;
						}
        			}
        		}
        	}
        }
    }
</style>
