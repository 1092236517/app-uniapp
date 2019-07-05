<template>
	<view class="zn-count-down-wrapper" :class="{show: visible}">
		<view class="content">
			<text class="iconfont icon">&#xe602;</text>
			<text class="desc">距离报价截止还剩：</text>
			<text class="desc">{{ days }}天</text>
			<text class="desc">{{ hours }}时</text>
			<text class="desc">{{ minutes }}分</text>
			<text class="desc">{{ seconds }}秒</text>
		</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	
	export default {
		name: 'zn-count-down',
		props: {
			deadline: {
				type: [Date, String],
				required: true
			}
		},
		data() {
			return {
				visible: false,
				timer: null,
				timeDiff: 0,
				days: 0,
				hours: 0,
				minutes: 0,
				seconds: 0
			}
		},
		created() {
			this.countDown();
		},
		beforeDestroy() {
			clearTimeout(this.timer)
		},
		watch: {
			deadline() {
				this.countDown();
			}
		},
		methods: {
			countDown() { //倒计时
				this.getTimeDiff();
				if(this.timeDiff <= 0) {
					this.visible = false;
					clearTimeout(this.timer);
					this.$emit('timeOut', true);
					return false
				}
				this.visible = true;
				this.timer = setTimeout(this.countDown, 1000)
			},
			getTimeDiff() { //获取时间差
				if(!dayjs(this.deadline).isValid()) { //是否为有效时间
					console.warn('请传入有效时间')
					return false
				}
				const currentTime = dayjs().valueOf();
				const endTime = dayjs(this.deadline).valueOf();
				const timeDiff = endTime - currentTime;
				this.timeDiff = timeDiff;
				if(timeDiff <= 0) {
					return false
				}
				const days = parseInt(timeDiff / 1000 / 60 / 60 / 24, 10);
				const hours = parseInt(timeDiff / 1000 / 60 / 60 % 24, 10);
				const minutes = parseInt(timeDiff / 1000 / 60 % 60, 10);
				const seconds = parseInt(timeDiff / 1000 % 60 , 10);
				this.days = days;
				this.hours = hours < 10 ? '0' + hours : hours;
				this.minutes = minutes < 10 ? '0' + minutes : minutes;
				this.seconds = seconds < 10 ? '0' + seconds : seconds;
			}
		}
	}
</script>

<style lang="scss">
	.zn-count-down-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		background: #FFFAE8;
		color: #EE1E1E;
		font-size: 24upx;
		height: 0;
		overflow: hidden;
		transition: all .5s ease;
		.content {
			.icon {
				font-size: 28upx;
				color: #EE1E1E;
				margin-right: 10upx;
			}
			.desc {
				margin-right: 10upx;
			}
		}
	}
	.show {
		height: 60upx;
	}
</style>
