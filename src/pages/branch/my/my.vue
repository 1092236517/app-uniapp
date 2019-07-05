<template>
	<view class="my-wrapper">
        <view class="head-box">
            <view class="head">
                <image class="headimg" src="../../../static/images/group/my/head.png"></image>
                <view class="headname">{{title}}</view>
            </view>
        </view>
        <view class="tabList">
            <view class="tabitem" @click="quota" v-if="myBillAuthObj.page.show">
                <text class="iconfont icon-peie logoicon">&#xe627;</text>
                <text class="desc">配额分配</text>
                <text class="iconfont icon-gengduo narricon">&#xe620;</text>
            </view>
        </view>
        <view class="foot-box">
            <button class="button" @click="loginout">退出登录</button>
        </view>
	</view>
</template>

<script>
	export default {
		name:"my-branch",
		data(){
			return{
				title:"",
                myAuthObj: {
                    page: {
                        chName: '显示',
                        show: false
                    }
                },
                myBillAuthObj: {
                    page: {
                        chName: '显示',
                        show: false
                    }
                }
			}
		},
        created() {
        	this.getAuth();
        },
		mounted(){
			this.title = uni.getStorageSync('user_info').member_auth.auth_name;
		},
		methods:{
			quota(){
				uni.navigateTo({
					url: '/pages/branch/my/myquota/myquota'
				})
			},
			loginout(){
				uni.removeStorageSync('user_info');
				uni.removeStorageSync('user_token');
				uni.removeStorageSync('user_powers');
				this.$store.commit('signOut');
				uni.reLaunch({
					url: '/pages/login'
				});
			},
            getAuth() { //获取权限
                const myPermissionObj = this.$store.getters.permissionList.MyZhuNiu;
                const myBillPermissionObj = this.$store.getters.permissionList.MyBill;
                this.$func.getAuth(myPermissionObj, this.myAuthObj);
                this.$func.getAuth(myBillPermissionObj, this.myBillAuthObj);
            }
		}
	}
</script>

<style lang="scss" scoped>
	.my-wrapper{
		.head-box{
			background:url('../../../static/images/group/my/headBg.png') no-repeat center;
			background-size: cover;
			height: 300upx;
			width: 100%;
			display: inline-block;
			.head{
				margin-top: 40upx;
				width:100%;
				text-align: center;
				.headimg{
					height: 140upx;
					width: 140upx;
				}
				.headname{
					font-weight: 400;
					color:rgba(255,255,255,1);
					margin-top: 20upx;
				}
			}
		}
		.tabList{
			margin-top: 20upx;
			.tabitem{
				display: flex;
				height: 88upx;
				width: 100%;
				background-color: #fff;
				line-height: 88upx;
				color: #333;
				font-size: 32upx;
				font-weight: 500;
				border-bottom: 1px solid #eee;
				cursor: pointer;
				padding: 0 30upx;
				box-sizing: border-box;
				.logoicon{
					color: $uni-color-primary;
					margin-right: 30upx;
					height: 32upx;
					width: 36upx;
				}
				.desc{
					flex-grow: 1;
				}
				.narricon{
					height: 27upx;
					width: 15upx;
					color: #999;
					margin-right: 30upx;
				}
			}
		}
		.foot-box{
			width: 100%;
			padding: 0 20upx;
			position: fixed;
			/* #ifdef APP-PLUS */
			bottom: 20upx;
			/* #endif */
			/* #ifdef H5 */
			bottom: 120upx;
			/* #endif */
			box-sizing: border-box;
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
