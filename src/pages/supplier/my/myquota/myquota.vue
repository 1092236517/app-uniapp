<template>
	<view class="account-wrapper">
		<view class="title-view">
			<text class="line"></text>
			<text class="title">{{title}}</text>
		</view>
		<block v-for="(item, index) in accountList" :key="index">
			<view class="listItem">
				<view class="itemtitle">{{item.created_at}}</view>
				<view class="itemtime">{{item.quota}}元</view>
			</view>
		</block>
		<template v-if="currentPage >= totalPage">
		    <zn-no-more></zn-no-more>
		</template>
		<zn-drawer :visible.sync="visible">
			<view class="searchbox">
				<view class="searchitem">
					<view class="searchtitle">类型分配</view>
					<view class="searchcont">
						<view
							class="nav-item"
							v-for="(item, index) in navList"
							:key="index"
							:class="{active: index === activeIndex}"
							@click="toggleNav(item,index)">
							{{ item.label }}
						</view>
					</view>
				</view>
				<view class="searchitem">
				<view class="searchtitle">创建时间</view>
					<view class="searchcont">
						<view class="input-item">
							<picker mode="date" :value="start_date" :start="startDate" :end="endDate" @change="bindstartDateChange">
							    <view class="uni-input">{{start_date}}</view>
							</picker>
						</view>
						<view class="line-item">—</view>
						<view class="input-item">
							<picker mode="date" :value="end_date" :start="startDate" :end="endDate" @change="bindendDateChange">
							    <view class="uni-input">{{end_date}}</view>
							</picker>
						</view>
					</view>
				</view>
				<view class="searchitem">
					<view class="searchtitle">金额（元）</view>
					<view class="searchcont">
						<view class="input-item"><input placeholder="0" v-model="start_price" /></view>
						<view class="line-item">—</view>
						<view class="input-item"><input placeholder="999999999" v-model="end_price" /></view>
					</view>
				</view>
				<view class="btnitem">
					<button type="primary" @click="reset">重置</button>
					<button type="primary" @click="search">确定</button>
				</view>
			</view>
		</zn-drawer>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import znDrawer from '../../../../components/zn-drawer.vue'
	import znNoMore from '../../../../components/zn-no-more.vue'
	export default{
		name:"my-myquota-supplier",
		components: {
			znDrawer,
			znNoMore
		},
		data(){
			const currentDate = this.getDate({
			    format: true
			})
			return{
				token:"",
				user_base_id:"",
				title:"全部",
				pre_title:"全部",
				loading: false,
				accountList: [],
				currentPage: 1,
				perPage: 10,
				total: '',
				visible: false,
				navList: [
					{
						label: '全部',
						id:0
					},
					{
						label: '收入',
						id:1
					},
					{
						label: '支出',
						id:2
					}
				],
				activeIndex:0,
				log_type:'',
				issearch:false,
				currentDate:currentDate,
				start_date:currentDate,
				end_date:currentDate,
				start_price:'',
				end_price:''
			}
		},
		computed: {
			totalPage() { //总页数
				return Math.ceil(this.total / this.perPage)
			},
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onNavigationBarButtonTap(e) { //监听原生标题栏按钮点击事件
			this.visible = !this.visible;
		},
		created(){
			this.token = uni.getStorageSync("user_token");
			this.user_base_id = uni.getStorageSync("user_info").member_auth.user_base_id;
			this.getAccountList('','');
		},
		onReachBottom() {
			this.loadMore();
		},
		methods:{
			bindstartDateChange: function(e) {
				this.start_date = e.target.value
			},
			bindendDateChange: function(e) {
				this.end_date = e.target.value
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			toggleNav(item,index) { //导航栏切换
				this.activeIndex = index;
				this.log_type = item.id;
				this.pre_title = item.label;
			},
			getAccountList(start_date,end_date){
				const params = {
					token: this.token,
					user_base_id:this.user_base_id,
					per_page: this.perPage,
					current_page: this.currentPage,
				}
				if(this.log_type){
					params.log_type = this.log_type;
				}
				if(start_date){
					params.start_date = this.start_date;
				}
				if(end_date){
					params.end_date = this.end_date;
				}
				if(this.start_price){
					params.start_price = this.start_price;
				}
				if(this.end_price){
					params.end_price = this.end_price;
				}
				uni.showLoading({
					title: '加载中'
				});
				this.$api.groupMyApi.accountList(params)
					.then(res => {
						const result = res.data;
						uni.hideLoading();
						if(result.msg_code === 100000){
							// const demandArr = result.response.demands;
							const dataArr = result.response.data
							dataArr.map(item=>{
								item.create_time = dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss');
								this.accountList.push(item);
							});
							this.total = result.response.total;
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
				//this.getAccountList();
				if(this.issearch){
					this.getAccountList(this.start_date,this.end_date);
				}else{
					this.getAccountList()
				}
			},
			reset(){
				this.title = "全部";
				this.activeIndex = 0;
				this.log_type = "";
				this.start_date = this.currentDate;
				this.end_date = this.currentDate;
				this.start_price = "";
				this.end_price = "";
				this.issearch = false;
				this.getAccountList('','');
				this.visible = false;
			},
			search(){
				let res = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
				if(!(res.test(this.start_price)&&res.test(this.end_price)&&(this.start_price<this.end_price))&&this.start_price&&this.end_price){
					uni.showToast({
						title: "请输入正确的价格",
						icon: 'none'
					})
					return false;
				};
				this.title = this.pre_title;
				this.currentPage = 1;
				this.accountList = [];
				this.issearch = true;
				this.getAccountList(this.start_date,this.end_date);
				this.visible = false;
			}
		}
	}
</script>

<style lang="scss">
	.account-wrapper{
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
		.listItem{
			background: #fff;
			padding: 10upx 30upx;
			border-bottom: 1upx solid rgba(230,230,230,1);
			display: flex;
			padding: 32upx 30upx;
			line-height: 50upx;
			cursor: pointer;
			.itemtitle{
				font-size:28upx;
				font-weight:500;
				color:rgba(153,153,153,1);
				flex-grow: 1;
			}
			.itemtime{
				font-size:28upx;
				font-weight:500;
				color:rgba(51,51,51,1);
			}
		}
		.searchbox{
			width: 540upx;
			height: 100%;
			padding: 32upx;
			box-sizing: border-box;
			.searchitem{
				padding: 20upx 0;
				.searchtitle{
					font-size:28upx;
					font-weight:500;
					color:rgba(51,51,51,1);
					line-height:50upx;
				}
				.searchcont{
					display: flex;
					justify-content: center;
					font-size: 24upx;
					padding: 20upx 0;
					background: #fff;
					font-weight:500;
					.nav-item {
						width:210upx;
						height:68upx;
						line-height: 68upx;
						color: $uni-color-primary;
						border: 1px solid $uni-color-primary;
						box-sizing: border-box;
						text-align: center;
						border-radius:4upx;
						margin: 0 10upx;
					}
					.active {
						background: $uni-color-primary;
						color: #fff;
					}
					.input-item{
						width:210upx;
						height:68upx;
						background:rgba(238,238,238,1);
						border-radius:4upx;
						font-size:24upx;
						font-weight:500;
						color:rgba(153,153,153,1);
						text-align: center;
						line-height:68upx;
						input{
							width:100%;
							height: 100%;
							line-height:68upx;
						}
					}
					.line-item{
						line-height:68upx;
						padding: 0 10upx;
					}
				}
			}
			.btnitem{
				position: fixed;
				bottom: 60upx;
				display: flex;
				button{
					width:180upx;
					height:68upx;
					background:rgba(5,118,219,1);
					border-radius:0px 4upx 4upx 0px;
					font-size:28upx;
					font-weight:500;
					color:rgba(255,255,255,1);
					line-height:68upx;
				}
				:first-child{
					width:180upx;
					height:68upx;
					background:rgba(62,164,255,1);
					border-radius:4upx 0px 0px 4upx;
				}
			}
		}
		
	}
	
</style>
