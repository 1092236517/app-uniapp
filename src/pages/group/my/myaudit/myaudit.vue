<template>
	<view class="audit-wrapper">
		<block v-for="(item, index) in branchList" :key="index">
			<view class="listItem" @click="auditdetail(item.id)">
				<view class="itemleft">
					<view class="itemtitle">{{item.member_auth.auth_name}}</view>
					<view class="itemtime">提交日期：{{item.create_time}}</view>
				</view>
				<text class="iconfont icon-gengduo">&#xe620;</text>
			</view>
		</block>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	export default{
		name:"my-myaudit-group",
		data(){
			return{
				token:"",
				loading: false,
				branchList: [],
				currentPage: 1,
				perPage: 10,
				total: ''
			}
		},
		computed: {
			totalPage() { //总页数
				return Math.ceil(this.total / this.perPage)
			}
		},
		created(){
			this.token = uni.getStorageSync("user_token");
			this.getBranchList();
		},
		onReachBottom() {
			this.loadMore();
		},
		methods:{
			getBranchList(){
				const params = {
					token: this.token,
					per_page: this.perPage,
					current_page: this.currentPage,
				}
				uni.showLoading({
					title: '加载中'
				});
				this.$api.groupMyApi.branchList(params)
					.then(res => {
						const result = res.data;
						uni.hideLoading();
						if(result.msg_code === 100000){
							// const demandArr = result.response.demands;
							this.branchList = result.response.data.map(item=>{
								item.create_time = dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss');
								
								return item;
							});
							this.total = result.response.totalNum;
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
			loadMore() { //加载更多
				if(this.loading) {
					return false
				}
				if(this.currentPage >= this.total) {
					return false
				}
				this.currentPage += 1;
				this.getBranchList()
			},
			auditdetail(id){
				uni.navigateTo({
					url: '/pages/group/my/auditdetail/auditdetail?id='+id,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.audit-wrapper{
		padding-bottom: 20upx;
		.listItem{
			background: #fff;
			padding: 10upx 30upx;
			border-bottom: 1upx solid #eee;
			display: flex;
			padding: 20upx 30upx;
			line-height: 96upx;
			cursor: pointer;
			.itemleft{
				flex-grow: 1;
				.itemtitle{
					font-size:32upx;
					font-weight:500;
					color:rgba(51,51,51,1);
					line-height:60upx;
					height: 60upx;
				}
				.itemtime{
					font-size:24upx;
					font-weight:500;
					color:rgba(153,153,153,1);
					line-height:36upx;
				}
			}
		}
	}
	
</style>
