<template>
	<view class="wrapper">
		<view class="content-wrapper">
			<!-- 认证身份 -->
			<view class="content-view">
				<view class="title-view">
					<text class="line"></text>
					<text class="title">选择认证身份</text>
				</view>
				<!-- 选择认证身份 -->
				<view class="item-view">
					<text class="item-label">认证身份</text>
					<view class="item-input">
						<text>{{authRole}}</text>
						<!-- <zn-signle-picker 
						
						@confirmedValueChange="authRoleChange"
						:pickerValueList="authRoleList" 
						:placeholder="authRolePlaceholder"></zn-signle-picker> -->
					</view>
				</view>
				<!-- 选择所属集团 -->
				<view class="item-view">
					<text class="item-label">所属集团</text>
					<view class="item-input">
						<text>{{authGroup}}</text>
						<!-- <zn-signle-picker 
						v-model="authGroup"
						:pickerValueList="authGroupList" 
						:placeholder="authGroupPlaceholder"></zn-signle-picker> -->
					</view>
				</view>
			</view>
			<!-- 公司信息 -->
			<view class="content-view">
				<view class="title-view">
					<text class="line"></text>
					<text class="title">公司信息</text>
				</view>
				<view class="item-view">
					<text class="item-label">公司名称</text>
					<view class="item-input">
						<text>{{auth_name}}</text>
						<!-- <input type="text" v-model.trim="auth_name" placeholder="请填写公司名称"/> -->
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">法定代表人</text>
					<view class="item-input">
						<text>{{legal_person||"--"}}</text>
						<!-- <input type="text" v-model.trim="legal_person" placeholder="请填写法定代表人"/> -->
					</view>
				</view>	
				<view class="item-view">
					<text class="item-label">营业执照注册号</text>
					<view class="item-input">
						<text>{{licenseno||"--"}}</text>
						<!-- <input type="text" v-model.trim="licenseno" placeholder="请填写营业执照注册号"/> -->
					</view>
				</view>
				<view class="item-view">
					<view class="item-view-upload">
						<view class="label">上传营业执照</view>
						<zn-image-list :imageList="licenseList"></zn-image-list>
					</view>
				</view>	
			</view>
			<!-- 联系方式 -->
			<view class="content-view">
				<view class="title-view">
					<text class="line"></text>
					<text class="title">联系方式</text>
				</view>
				<view class="item-view">
					<text class="item-label">联系人</text>
					<view class="item-input">
						<text>{{contacter}}</text>
						<!-- <input type="text" v-model.trim="contacter" placeholder="请填写联系人姓名"/> -->
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">部门</text>
					<view class="item-input">
						<text>{{dept||'--'}}</text>
						<!-- <input type="text" v-model.trim="dept" placeholder="(选填) 请填写联系人所在部门"/> -->
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">职位</text>
					<view class="item-input">
						<text>{{position||'--'}}</text>
						<!-- <input type="text" v-model.trim="position" placeholder="(选填) 请填写联系人职位"/> -->
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">手机号码</text>
					<view class="item-input">
						<text>{{phone}}</text>
						<!-- <input type="text" v-model.trim="phone" placeholder="请填写联系人手机号码"/> -->
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">固定电话</text>
					<view class="item-input">
						<text>{{contact_tel||'--'}}</text>
						<!-- <input type="text" v-model.trim="contact_tel" placeholder="(选填) 例如: 0512-12345678"/> -->
					</view>
				</view>
			</view>
			<!-- 联系地址 -->
			<view class="content-view">
				<view class="title-view">
					<text class="line"></text>
					<text class="title">联系地址</text>
				</view>
				<view class="item-view">
					<text class="item-label">企业地址</text>
					<view class="item-input" >
						<text>{{pickedAddressArr}}</text>
						<!-- <zn-address-picker
						:placeholder="addressPlaceholder"
						v-model="pickedAddressArr"
						></zn-address-picker> -->
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">详细地址</text>
					<view class="item-input">
						<text>{{detail_address}}</text>
						<!-- <input type="text" v-model.trim="detail_address" placeholder="请填写详细地址"/> -->
					</view>
				</view>
			</view>
		</view>
		<view class="button-view" v-show="isaudit">
			<button type="primary" @click="agree">同意</button>
			<button type="primary" @click="reject">驳回</button>
		</view>
	</view>
</template>

<script>
	import znImageList from '../../../../components/zn-image-list.vue'
	
	export default {
		name:"my-auditdetail-group",
		components: {
			znImageList,
		},
		data() {
			return {
				userToken: '',
				id:'',
				/* 是否允许提交 */
				isAllowedSubmit: true,
				
				/* 认证身份 */
				authRole: "",
				
				/* 当认证身份为branch时, 需要选择所属group */
				authGroup: "",
				
				/* 当认证身份是 分公司 ，需要选中所属集团 */
				//isShowAuthRoleGroupPicker: false,
				
				
				/* 选择省市区 */
				//addressPlaceholder: '请选择省/市/区',
				pickedAddressArr: '',
				
				// 公司名称
				auth_name: '',
				// 法定代表人
				legal_person: '',
				// 营业执照注册号
				licenseno: '',
				// 营业执照
				licenseList: [],
				//license: '',
				
				// 联系人
				contacter: '',
				// 部门
				dept: '',
				// 职位
				position: '',
				// 手机号
				phone: '',
				// 固定电话
				contact_tel: '',
				// 企业地址，区县id
				// business_location_id: '',
				// 详细地址
				detail_address: '',
				//是否显示审核驳回按钮
				isaudit:true
			}		
		},
		async onLoad(option) {
			this.userToken = uni.getStorageSync('user_token');
			this.id = option.id;
			if (!this.userToken) {
				this.$func.showFailToast('用户token错误');
			}
			this.dataRestore();
		},
		onReady() {
			
		},
		methods: {
			// 数据回填
			dataRestore() {
				const params = {
					token: this.userToken,
				}
				this.$api.groupMyApi.branchDetail(params,this.id)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000){
							let userInfo = result.response[0];
							let userAuth = userInfo.member_auth;
							let userRecord = userInfo.member_record;
							let userExtend = userInfo.member_extend;
							let groupAuth = userInfo.group_auth;
							if (userInfo === null || userAuth === null || userRecord === null || userExtend === null || groupAuth===null) {
								return true;
							}
							
							this.isaudit = userInfo.status==0?true:false;
							
							// 认证身份
							switch(userRecord.account){
								case "BRANCH":
									this.authRole = "分公司";
									break;
								case "GROUP":
									this.authRole = "集团";
									break;
								case "SUPPLIER":
									this.authRole = "供应商";
									break;
								default:
									this.authRole = "分公司";
									break;
							}
							this.authGroup = groupAuth.auth_name;
											
							// 公司信息
							this.auth_name = userAuth.auth_name;
							this.legal_person = userAuth.legal_person;
							this.licenseno = userAuth.licenseno;
							this.licenseList = [{
								'src': userAuth.license
							}];
							
							// 联系方式
							this.contacter = userExtend.contacter;
							this.dept = userExtend.dept;
							this.position = userExtend.position;
							this.phone = userExtend.phone;
							this.contact_tel = userExtend.contact_tel;
							
							// 联系地址
							this.pickedAddressArr = userAuth.business_location;
							this.detail_address = userAuth.detail_address;
								
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
			//同意
			agree() {
				let _this = this;
				const params = {
					token:_this.userToken,
					auth_status:1
				}
				uni.showModal({
					title: '提示',
					content: '你确定同意吗？',
					success: function (res) {
						if (res.confirm) {
							_this.$api.groupMyApi.branchCheck(params,_this.id).then(res=>{
								let result = res.data;
								if(result.msg_code===100000){
									uni.showToast({
										title: '操作成功!',
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
			},
			reject(){
				uni.navigateTo({
					url: '/pages/group/my/auditreject/auditreject?id='+this.id,
				})
			}
				
		}
	}
</script>

<style lang="scss">
	.wrapper {
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
			text-align: center;
			button {
				background: $uni-color-primary;
				width: 30%;
				display: inline-block;
				margin-right: 10upx;
			}
			:last-child{
				margin-left: 10upx;
			}
		}
	}
</style>
