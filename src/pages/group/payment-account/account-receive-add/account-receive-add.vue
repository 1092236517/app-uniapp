<template>
    <view class="account-receive-add-wrapper">
    	<view class="content-wrapper">
			<view class="content-view">
				<view class="title-view">
					<text class="line"></text>
					<text class="title">收款方信息</text>
				</view>
				<view class="item-view">
					<text class="item-label">账号名称</text>
					<view class="item-input">
						<input type="text" v-model.trim="account_name" placeholder="请填写付款账号名称"/>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">付款账号</text>
					<view class="item-input">
						<input type="text" v-model.trim="account" placeholder="请填写付款账号"/>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">银行名称</text>
					<view class="item-input">
						<input type="text" v-model.trim="bank_name" placeholder="请填写银行名称"/>
<!-- 						<zn-signle-picker 
						v-model="authGroup"
						:pickerValueList="authGroupList" 
						:placeholder="authGroupPlaceholder"></zn-signle-picker> -->
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">城市名称</text>
					<view class="item-input" >
						<zn-address-picker
						:placeholder="addressPlaceholder"
						v-model="pickedAddressArr"
						></zn-address-picker>
					</view>
				</view>
			</view>
		</view>
		<view class="button-view">
			<button type="primary" @click="auth">{{addtext}}</button>
		</view>
    </view>
</template>

<script>
	import znAddressPicker from '../../../../components/zn-address-picker.vue'
	import znSignlePicker from '../../../../components/zn-signle-picker.vue'
    export default {
        name: 'account-receive-add-group',
		components: {
			znSignlePicker,
			znAddressPicker
		},
        data() {
            return {
				token:this.$store.state.token,
				id:'',
				addtext:'添加',
// 				authGroup: [],
// 				authGroupList: [],
// 				authGroupPlaceholder: '请选择银行名称',
				/* 是否允许提交 */
				isAllowedSubmit: true,
                account_name:'',
				bank_name:'',
				account:'',
				addressPlaceholder: '请选择省/市/区',
				pickedAddressArr: [],
            }
        },
		async onLoad(option) {
			this.id = option.id;
			if(this.id){
				this.detailData();
				this.addtext = "编辑";
				uni.setNavigationBarTitle({
						title: "编辑收款信息"
				});
			};
// 			let groupList = await this.getGroupList();
// 			this.authGroupList = groupList.map((item, index) => {
// 				return {label: item.member_auth.auth_name, value: item.id}
// 			});
		},
        methods: {
			//账户详情
			detailData(){
				let that = this;
				let params = {
					token:that.token,
				}
				that.$api.groupAccountApi.accountDetail(that.id,params).then(response=>{
					let result = response.data;
					if (result.msg_code === 100000) {
						let data = result.response;
						that.account = data.account;
						that.account_name = data.account_name;
						that.bank_name = data.bank_name;
						that.pickedAddressArr = [data.address_province_id,data.address_city_id];
					}else{
						_this.$func.showFailToast(result.message);
						return false;
					}
					console.log(result)
				}).catch(error=>{
					_this.$func.showFailToast(JSON.stringify(error));
				})
			},
			//新增
            auth(){
				let _this = this;
				if (!_this.isAllowedSubmit) {
					return false;
				}
				let data = {
					token:_this.token,
					account_name:_this.account_name,
					bank_name:_this.bank_name,
					account:_this.account,
					address_province_id:_this.pickedAddressArr[0],
					address_city_id:_this.pickedAddressArr[1],
					account_type:'ACCOUNT_RECEIVE'
				}
				_this.isAllowedSubmit = false;
				if(_this.id){
					_this.$api.groupAccountApi.accountEdit(_this.id,data).then(response => {
						let result = response.data;
						if (result.msg_code === 100000) {
							uni.showToast({
								title: '操作成功!',
								icon: 'success'
							})
							uni.navigateBack({
								delta: 1
							});
						} else {
							_this.isAllowedSubmit = true;
							_this.$func.showFailToast(result.message);
							return false;
						}
					});
				}else{
					_this.$api.groupAccountApi.accountAdd(data).then(response => {
						let result = response.data;
						if (result.msg_code === 100000) {
							uni.showToast({
								title: '操作成功!',
								icon: 'success'
							})
							uni.navigateBack({
								delta: 1
							});
						} else {
							_this.isAllowedSubmit = true;
							_this.$func.showFailToast(result.message);
							return false;
						}
					});
				}
			},
			// 获取所有银行列表
			getGroupList() {
				let _this = this;
				let data = {
					token: this.token,
				};
				return _this.$api.groupAccountApi.bankList(data)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							return result.response
						}else {
							_this.$func.showFailToast(result.message);
						}
					}).catch(err => {
						_this.$func.showFailToast(JSON.stringify(err));
					})
			}
        }
    }
</script>

<style lang="scss">
    .account-receive-add-wrapper {
        font-size: 28upx;
        .content-wrapper {
        	display: block;
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
			margin: 30upx 30upx 30upx;
			button {
				background: $uni-color-primary;
			}
		}
	}
</style>
