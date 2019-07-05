<template>
	<view class="zn-timeline-wrapper">
        <template v-if="timelineArr.length > 0">
        	<block
        		v-for="(item, index) in timelineArr"
        		:key="index">
        		<view class="timeline-item">
        			<view class="timeline-view">
        				<view class="circle" :class="{'circle-active': item.isActive}"></view>
        				<view class="line"></view>
        			</view>
        			<view class="content" :class="{'content-active': item.isActive}">
        				<view>
        					<text>需求提交人：</text>
        					<text>{{ item.demandReleaser }}</text>
        				</view>
        				<view>
        					<text>提交时间：</text>
        					<text>{{ item.releaseTime }}</text>
        				</view>
        				<view>
        					<text>审批人：</text>
        					<text>{{ item.approver }}</text>
        				</view>
        				<view>
        					<text>审批时间：</text>
        					<text>{{ item.approveTime }}</text>
        				</view>
        				<view>
        					<text>历时：</text>
        					<text>{{ item.duration }}</text>
        				</view>
        				<view>
        					<text>审核状态：</text>
        					<text>{{ item.statusText }}</text>
        				</view>
        				<view>
        					<text>备注：</text>
        					<text>{{ item.remark }}</text>
        				</view>
        				<view>
        					<text>日志：</text>
        					<text>{{ item.log }}</text>
        				</view>
        			</view>
        		</view>		
        	</block>
        </template>
        <template v-else>
        	<view class="no-result">暂无操作日志</view>
        </template>
	</view>
</template>

<script>
	export default {
		name: 'zn-timeline',
		props: {
			timelineArr: {
				type: Array,
				required: true
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.zn-timeline-wrapper {
		padding: 40upx 0;
		.timeline-item {
			display: flex;
			.timeline-view {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 40upx;
				.circle {
					width: 20upx;
					height: 20upx;
					border-radius: 50%;
					background: #CECECE;
				}
				.circle-active {
					background: $uni-color-primary;
				}
				.line {
					flex-grow: 1;
					width: 2upx;
					background: #CECECE;
				}
			}
			.content {
				font-size: 24upx;
				color: #999;
				line-height: 36upx;
				padding-left: 20upx;
				padding-bottom: 40upx;
			}
			.content-active {
				color: #333;
			}
		}
        .no-result {
            text-align: center;
            font-size: 28upx;
            color: #aaa;
        }
	}
</style>
