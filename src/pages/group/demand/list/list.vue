<template>
	<view class="list-wrapper">
        <template v-if="demandListAuthObj.page.show">
        	<view class="header">
        		<view class="search-view">
        			<input
        				type="text"
        				v-model.trim="searchValue"
        				@confirm="search"
        				placeholder="请输入项目名称/产品名称" />
        			<text class="iconfont search-icon">&#xe62f;</text>
        		</view>
        		<view class="select-view">
        			<picker
        				:range="selectRange"
        				:value="selectIndex"
        				range-key="label"
        				@change="selectChange">
        				<view>{{ selectRange[selectIndex].label }}</view>
        			</picker>
        			<text class="iconfont select-icon">&#xe63e;</text>
        		</view>
        	</view>
        	<view class="content">
        		<block v-for="(item, index) in demandList" :key="index">
        			<view class="item-wrapper">
        				<view class="item-header">
        					<view class="title-view">
        						<text class="line" :style="{background: item.statusColor}"></text>
        						<text class="title">项目名称：{{ item.programName }}</text>
        					</view>
        					<view>
        						<zn-label :labelText="item.statusText" :color="item.statusColor"></zn-label>
        					</view>
        				</view>
        				<view class="item-content">
        					<view class="content">
        						<view class="desc">
        							项目编码：{{ item.programCode }}
        						</view>
        						<view class="desc">
        							产品名称：{{ item.productName }}
        						</view>
        						<view class="desc">
        							产品规格：{{ item.productSpec }}
        						</view>
        						<view class="desc">
        							拟采数量：{{ item.purchaseCount }}
        						</view>
        						<view class="desc">
        							发布时间：{{ item.startTime }}
        						</view>
        						<view class="desc">
        							报价截止：{{ item.endTime }}
        						</view>
        					</view>
        					<view class="operation-wrapper">
        						<view @click="viewDetail(item.id)" v-if="demandListAuthObj.viewDetailBtn.show">查看订单详情</view>
        						<view class="approve-view" v-if="item.checkBtn">
        							<view class="btn" @click="approve(item.id, item.checkBtn.id)" v-if="demandListAuthObj.approveBtn.show">同意</view>
        							<view class="btn" @click="reject(item.id, item.checkBtn.id)" v-if="demandListAuthObj.rejectBtn.show">驳回</view>
        						</view>
        					</view>
        				</view>	
        			</view>
        		</block>
        		<template v-if="currentPage >= totalPage">
        			<zn-no-more></zn-no-more>
        		</template>
        	</view>
        </template>
        <template v-else>
        	<view class="no-permission">请联系管理员配置权限</view>
        </template>
	</view>
</template>

<script>
	import znLabel from '../../../../components/zn-label.vue'
	import znNoMore from '../../../../components/zn-no-more.vue'
	
	const DEMAND_COLOR_WAIT_FOR_CHECK = '#0066CC';
	const DEMAND_COLOR_REJECT = '#EB6877';
	const DEMAND_COLOR_WAIT_FOR_QUOTE = '#F39800';
	const DEMAND_COLOR_QUOTING = '#EC6941';
	const DEMAND_COLOR_ABORTION = '#E4007F';
	const DEMAND_COLOR_SUCCESS = '#32B16C';
	const DEMAND_COLOR_FULFILL = '#00A0E9';
	const DEMAND_COLOR_CLOSING = '#E60012';
	const DEMAND_COLOR_FINISHED = '#AAAAAA';
	const DEMAND_COLOR_STOP_BID = '#920783';
	const DEMAND_COLOR_BRANCH_REJECT = '#EB6877';
	const DEMAND_COLOR_WAIT_FOR_BRANCH_CHECK = '#0066CC';

	export default {
		name: 'demand-list-group',
		components: {
			znLabel,
			znNoMore
		},
		data() {
			return {
				loading: false,
				token: this.$store.state.token,
				searchValue: '',
				selectIndex: 1,
				selectRange: [
					{
						label: '全部',
						value: ''
					},
					{
						label: '待操作',
						value: 'WAIT_OPERATE'
					},
					{
						label: '待审核',
						value: 'CUSTOM_EXAMINE_WAIT'
					},
					{
						label: '拒绝',
						value: 'REJECT'
					},
					{
						label: '待报价',
						value: 'PENDING'
					},
					{
						label: '报价中',
						value: 'QUOTING'
					},
					{
						label: '已截标',
						value: 'DEADLINE'
					},
					{
						label: '已流标',
						value: 'ABORT'
					},
                    {
                        label: '发单成功',
                        value: 'FINISH'
                    }
				],
				demandList: [],
				currentPage: 1,
				perPage: 10,
				total: '',
                demandListAuthObj: {
                    page: {
                        chName: '显示',
                        show: false
                    },
                    viewDetailBtn: {
                        chName: '查看详情',
                        show: false
                    },
                    approveBtn: {
                        chName: '通过',
                        show: false
                    },
                    rejectBtn: {
                        chName: '驳回',
                        show: false
                    }
                }
			}
		},
		computed: {
			selectStatus() {
				return this.selectRange[this.selectIndex]['value']
			},
			totalPage() { //总页数
				return Math.ceil(this.total / this.perPage)
			}
		},
		created() {
            this.getAuth();
		},
// 		onReachBottom() {
// 			this.loadMore();
// 		},
		methods: {
			selectChange(event) { //选择器改变
				this.selectIndex = event.detail.value;
				this.init();
			},
			getDemandList() { //获取联采需求列表
				const params = {
					token: this.token,
					per_page: this.perPage,
					current_page: this.currentPage,
					status: this.selectStatus,
					project_name: this.searchValue,
					type: 'GROUP'
				}
				uni.showLoading({
					title: '加载中'
				})
				this.$api.groupDemandApi.demandList(params)
					.then(res => {
						const result = res.data;
						uni.hideLoading();
						if(result.msg_code === 100000){
							const demandArr = result.response.demands;
							this.total = result.response.totalNum;
							demandArr.forEach((item, index) => {
								let element = {
									id: item.id,
									programName: item.project_name,
									programCode: item.project_code,
									supplierName: item.supplier_company_name,
									productName: item.category.name,
									purchaseCount: item.purchase_num,
									startTime: item.created_at,
									endTime: item.deadline,
									checkBtn: null
								}
								const spec = JSON.parse(item.category_spec);
								const { color, text } = this.getStatusInfo(item.current_status);
								element.productSpec = spec.category_spec_min + '-' + spec.category_spec_max;
								element.statusColor = color;
								element.statusText = text;
								if(item.current_status === 'CUSTOM_EXAMINE_WAIT' && this.showFlowsAuditBtn(item.records).length > 0) { //流程控制决定显示或隐藏按钮
                                    element.checkBtn = this.showFlowsAuditBtn(item.records)[0];
								}
								this.demandList.push(element);
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
			getStatusInfo(status) { //获取状态颜色和文案
				let color;
				let text;
				switch (status) {
					case 'CUSTOM_EXAMINE_WAIT':
						color = DEMAND_COLOR_WAIT_FOR_CHECK;
						text = '待审核';
						break;
					case 'REJECT': 
						color = DEMAND_COLOR_REJECT;
						text = '拒绝';
						break;
					case 'PENDING': 
						color = DEMAND_COLOR_WAIT_FOR_QUOTE;
						text = '待报价';
						break;
					case 'QUOTING': 
						color = DEMAND_COLOR_QUOTING;
						text = '报价中';
						break;
					case 'DEADLINE': 
						color = DEMAND_COLOR_STOP_BID;
						text = '已截标';
						break;
					case 'ABORT': 
						color = DEMAND_COLOR_ABORTION;
						text = '已流标';
						break;
					case 'PRE_FINISH':
						color = DEMAND_COLOR_WAIT_FOR_BRANCH_CHECK;
						text = '待确认';
						break;
					case 'PRE_FINISH_REJECT':
						color = DEMAND_COLOR_BRANCH_REJECT;
						text = '已拒绝';
						break;
					case 'FINISH':
						color = DEMAND_COLOR_SUCCESS;
						text = '发单成功';
						break;
					default:
						color = '#0066cc';
						text = ''
				}
				return {
					color,
					text
				}
			},
            init() { //初始化
                this.currentPage = 1; //重置当前页
                this.demandList = []; //清空当前列表
                this.getDemandList();
            },
			loadMore() { //加载更多
				if(this.loading) {
					return false
				}
				if(this.currentPage >= this.totalPage) {
					return false
				}
				this.currentPage += 1;
				this.getDemandList()
			},
			search() { //搜索
                this.init();
			},
			approve(demandId, recordId) { //同意
				uni.navigateTo({
					url: `/pages/group/demand/approve/approve?demandId=${demandId}&recordId=${recordId}`
				})
			},
			reject(demandId, recordId) { //驳回
				uni.navigateTo({
					url: `/pages/group/demand/reject/reject?demandId=${demandId}&recordId=${recordId}`
				})
			},
			viewDetail(demandId) { //查看详情
				uni.navigateTo({
					url: `/pages/group/demand/detail/detail?demandId=${demandId}`
				})
			},
            getAuth() { //获取权限
                const demandListPermissionObj = this.$store.getters.permissionList.MobileJointPurchaseOrderList;
                this.$func.getAuth(demandListPermissionObj, this.demandListAuthObj)
            },
            rolesIntersection(userRoles, flowRoles){ //用户角色与流程审核角色的交集
                const arr = [];
                flowRoles.forEach((flowItem, flowIndex) => {
                    userRoles.forEach((userItem, userIndex) => {
                        if(userItem === flowItem.examine_id){
                            arr.push(flowItem);
                        }
                    })
                })
                return arr
            },
            showFlowsAuditBtn(records){ //流程审核按钮显示
                const currentUserRoles = this.$store.state.currentUserRoles;
                let rolesIntersection = [];
                if(records.length > 0 && currentUserRoles && currentUserRoles.length > 0){
                    rolesIntersection = this.rolesIntersection(currentUserRoles, records);
                }
                return rolesIntersection
            }
		}
	}
</script>

<style lang="scss" scoped>
	.list-wrapper {
		padding-bottom: 20upx;
		.header {
			display: flex;
			flex-wrap: nowrap;
			padding: 20upx 30upx;
			background: #fff;
			border-bottom: 1px solid #eee;
			.search-view {
				position: relative;
				flex-grow: 1;
				padding-right: 40upx;
				border-right: 1px solid #ddd;
				font-size: 24upx;
				input {
					background: #eee;
					padding-left: 56upx;
				}
				.input-placeholder {
					font-size: 24upx;
				}
				.search-icon {
					position: absolute;
					top: 12upx;
					left: 20upx;
					display: inline-block;
					font-size: 30upx;
					color: #999;
				}
			}
			.select-view {
				position: relative;
				width: 170upx;
				padding-right: 20upx;
				font-size: 28upx;
				line-height: 56upx;
				color: $uni-color-primary;
				text-align: center;
				.select-icon {
					position: absolute;
					top: 0;
					right: 0;
					font-size: 30upx;
					color: $uni-color-primary;
				}
			}
		}
		.content {
			.item-wrapper {
				background: #fff;
				padding: 10upx 30upx;
				margin-bottom: 20upx;
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
					}
				}
				.item-content {
					display: flex;
					flex-wrap: nowrap;
					padding-top: 30upx;
					.content {
						flex-grow: 1;
						line-height: 56upx;
						font-size: 28upx;
						color: #999;
						overflow: hidden;
						.desc {
							text-overflow: ellipsis;
							white-space: nowrap;
							overflow: hidden;
						}
					}
					.operation-wrapper {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						align-items: center;
						width: 180upx;
						font-size: 24upx;
						color: $uni-color-primary;
						.btn {
							width: 160upx;
							height: 48upx;
							line-height: 48upx;
							text-align: center;
							border: 1upx solid $uni-color-primary;
							border-radius: 4upx;
							margin-top: 20upx;
						}
					}
				}
			}
		}
	}
</style>
