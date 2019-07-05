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
						<zn-signle-picker 
						v-model="authRole"
						@confirmedValueChange="authRoleChange"
						:pickerValueList="authRoleList" 
						:placeholder="authRolePlaceholder"></zn-signle-picker>
					</view>
				</view>
				<!-- 选择所属集团 -->
				<view class="item-view" v-if="isShowAuthRoleGroupPicker">
					<text class="item-label">所属集团</text>
					<view class="item-input">
						<zn-signle-picker 
						v-model="authGroup"
						:pickerValueList="authGroupList" 
						:placeholder="authGroupPlaceholder"></zn-signle-picker>
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
						<input type="text" v-model.trim="auth_name" placeholder="请填写公司名称"/>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">法定代表人</text>
					<view class="item-input">
						<input type="text" v-model.trim="legal_person" placeholder="请填写法定代表人"/>
					</view>
				</view>	
				<view class="item-view">
					<text class="item-label">营业执照注册号</text>
					<view class="item-input">
						<input type="text" v-model.trim="licenseno" placeholder="请填写营业执照注册号"/>
					</view>
				</view>
				<view class="item-view">
					<view class="item-view-upload">
						<view class="label">上传营业执照</view>
						<zn-upload
							v-model="licenseList"
							:limit="1"
							@upload-success="handleUploadSuccess"
							@delete-image="handleDeleteImage"></zn-upload>
						<view class="tip">
							请上传完整，清晰的公司营业执照
						</view>
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
						<input type="text" v-model.trim="contacter" placeholder="请填写联系人姓名"/>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">部门</text>
					<view class="item-input">
						<input type="text" v-model.trim="dept" placeholder="(选填) 请填写联系人所在部门"/>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">职位</text>
					<view class="item-input">
						<input type="text" v-model.trim="position" placeholder="(选填) 请填写联系人职位"/>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">手机号码</text>
					<view class="item-input">
						<input type="text" v-model.trim="phone" placeholder="请填写联系人手机号码"/>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">固定电话</text>
					<view class="item-input">
						<input type="text" v-model.trim="contact_tel" placeholder="(选填) 例如: 0512-12345678"/>
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
						<zn-address-picker
						:placeholder="addressPlaceholder"
						v-model="pickedAddressArr"
						></zn-address-picker>
					</view>
				</view>
				<view class="item-view">
					<text class="item-label">详细地址</text>
					<view class="item-input">
						<input type="text" v-model.trim="detail_address" placeholder="请填写详细地址"/>
					</view>
				</view>
			</view>
		</view>
		<view class="button-view">
			<button type="primary" @click="auth">提交</button>
		</view>
	</view>
</template>

<script>
	import znUpload from '../../components/zn-upload.vue'
	import znSignlePicker from '../../components/zn-signle-picker.vue'
	import znAddressPicker from '../../components/zn-address-picker.vue'
	import {validater} from '../../common/utils/validater.js'
	
	export default {
		components: {
			znUpload,
			znSignlePicker,
			znAddressPicker
		},
		data() {
			return {
				userToken: '',
				
				/* 是否允许提交 */
				isAllowedSubmit: true,
				
				/* 认证身份 */
				authRole: [],
				authRolePlaceholder: '请选择需要认证的身份',
				authRoleList: [{'label': '集团', 'value': 'GROUP'}, {'label': '分公司', 'value': 'BRANCH'}],
				
				/* 当认证身份为branch时, 需要选择所属group */
				authGroup: [],
				authGroupList: [],
				authGroupPlaceholder: '请选择分公司所属集团',
				
				/* 当认证身份是 分公司 ，需要选中所属集团 */
				isShowAuthRoleGroupPicker: false,
				
				
				/* 选择省市区 */
				addressPlaceholder: '请选择省/市/区',
				pickedAddressArr: [],
				
				// 公司名称
				auth_name: '',
				// 法定代表人
				legal_person: '',
				// 营业执照注册号
				licenseno: '',
				// 营业执照
				licenseList: [],
				license: '',
				
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
				business_location_id: '',
				// 详细地址
				detail_address: ''
			}		
		},
		async onLoad(option) {
			let isregister = option.isregister;
			console.log(!isregister)
			if(!isregister){
				this.userToken = uni.getStorageSync('user_token');
				let groupList = await this.getGroupList();
				this.authGroupList = groupList.map((item, index) => {
					return {label: item.member_auth.auth_name, value: item.id}
				})
				this.dataRestore();
			}else{
				this.userToken = uni.getStorageSync('user').token;
				let groupList = await this.getGroupList();
				this.authGroupList = groupList.map((item, index) => {
					return {label: item.member_auth.auth_name, value: item.id}
				})
			}
// 			if (!this.userToken) {
// 				this.$func.showFailToast('用户token错误');
// 			}
		},
		
		methods: {
			// 数据回填
			dataRestore() {
				let userInfo = uni.getStorageSync('user_info');
				let userAuth = userInfo.member_auth;
				let userRecord = userInfo.member_record;
				let userExtend = userInfo.member_extend;
				if (userInfo === null || userAuth === null || userRecord === null || userExtend === null) {
					return true;
				}
				
				// 认证身份
				if (userRecord.account === 'BRANCH') {
					this.isShowAuthRoleGroupPicker = true;
					this.authGroup = [userRecord.group_id];
				}
				this.authRole = userRecord.account?[userRecord.account]:[];
								
				// 公司信息
				this.auth_name = userAuth.auth_name;
				this.legal_person = userAuth.legal_person;
				this.licenseno = userAuth.licenseno;
				this.license = userAuth.license;
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
				this.pickedAddressArr = userAuth.full_addr||[];
				this.detail_address = userAuth.detail_address;
			},
			// 身份认证
			authRoleChange(role) {
				if (role[0] === 'BRANCH') {
					this.isShowAuthRoleGroupPicker = true;
				} else {
					this.isShowAuthRoleGroupPicker = false;
				}
			},
			//上传成功
			handleUploadSuccess(imageArr) { 
				this.license = imageArr[0]['newFileName'];
			},
			//删除图片
			handleDeleteImage(imageArr) { 
				this.license = '';
			},
			//认证
			auth() {
				let _this = this;
				if (!_this.isAllowedSubmit || !_this.dataCheck()) {
					return false;
				}
				let data = {
					role: _this.authRole[0],
					group_id: _this.authGroup.length > 0 ? _this.authGroup[0] : '',
					auth_name: _this.auth_name,
					legal_person: _this.legal_person,
					licenseno: _this.licenseno,
					legal_person: _this.legal_person,
					licenseno: _this.licenseno,
					license: _this.license,
					contacter: _this.contacter,
					dept: _this.dept,
					position: _this.position,
					phone: _this.phone,
					contact_tel: _this.contact_tel,
					business_location_id: _this.pickedAddressArr[2],
					detail_address: _this.detail_address,
					token: this.userToken
				}
				_this.isAllowedSubmit = false;
				_this.$api.publicApi.userAuth(data).then(response => {
					let result = response.data;
					if (result.msg_code === 100000) {
						uni.reLaunch({
							url: 'status_wait'
						})
					} else {
						_this.isAllowedSubmit = true;
						_this.$func.showFailToast(result.message);
						return false;
					}
				});
			},
			// 参数校验
			dataCheck() {
				let _this = this;				
				/* 认证身份 */
				if (_this.authRole.length <= 0) {
					_this.$func.showFailToast('请选择认证身份');
					return false;
				}
				
				if (_this.authRole[0] === 'BRANCH' && _this.authGroup.length <= 0) {
					_this.$func.showFailToast('请选择所属集团');
					return false;
				}
				
				/* 公司名称 */
				if (_this.auth_name === '') {
					_this.$func.showFailToast('请填写公司名称');
					return false;
				}
				
				/* 法定代表人 */
				if (_this.legal_person === '') {
					_this.$func.showFailToast('请填写法定代表人');
					return false;
				}
				
				/* 营业执照注册号 */
				if (_this.licenseno === '') {
					_this.$func.showFailToast('请填写营业执照号');
					return false;
				}
				
				/* 营业执照 */
				if (_this.license === '') {
					_this.$func.showFailToast('请上传营业执照');
					return false;
				}
				
				/* 联系人 */
				if (_this.contacter === '') {
					_this.$func.showFailToast('请填写联系人');
					return false;
				}
				
				/* 联系人手机号 */ 
				let phoneValidater = validater.phoneNumber(_this.phone, (result, errorTip = '') => {
					if (!result) {
						return false;
					} else {
						return true;
					}
				})
				if (!phoneValidater) {
					_this.$func.showFailToast('联系人手机号错误');
					return false;
				}
				
				/* 固定电话 */
				if (_this.contact_tel) {
					let telphoneValidater = validater.telephoneNumber(_this.contact_tel, (result, errorTip = '') => {
						if (!result) {
							return false;
						} else {
							return true;
						}
					})
					if (!telphoneValidater) {
						_this.$func.showFailToast('联系方式固定电话错误');
						return false;
					}
				}
				
				/* 企业地址 */
				if(_this.pickedAddressArr.length != 3) {
					_this.$func.showFailToast('企业地址错误');
					return false;
				}
				
				/* 详细地址 */
				if(_this.detail_address === '') {
					_this.$func.showFailToast('请输入详细地址');
					return false;
				}
				return true;
			},
			// 获取所有集团列表
			getGroupList() {
				let _this = this;
				let data = {
					current_page: -1,
					type: 'GROUP',
					joint_mode: 'SUPER',
					token: this.userToken,
				};
				return _this.$api.publicApi.userList(data)
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
	.wrapper {
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
