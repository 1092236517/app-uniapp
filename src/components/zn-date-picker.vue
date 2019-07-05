<template>
	<view class="zn-date-picker-wrapper">
		<view class="picker" @click="show">
			<view v-if="!pickerValueConfirmed" class="picker-placeholder">
				<text>{{ placeholder }}</text>
			</view>
			<view v-else>
				<text>{{ pickerSelectedLabel }}</text>
			</view>
			<text class="iconfont picker-icon" v-if="!disabled">&#xe620;</text>
		</view>
		<view 
			:class="{'pickerMask': showPicker}"
			@click="maskClick"
			catchtouchmove="stopPageScroll"></view>
			<view class="picker-content" :class="{'picker-view-show': showPicker}">
				<view class="picker-header">
					<view class="picker-btn" @click="pickerCancel">取消</view>
					<view class="picker-btn picker-confirm-btn" @click="pickerConfirm">确定</view>
				</view>
				<!-- 多列选择 -->
				<picker-view
					indicator-style="height: 40px;"
					class="picker-view"
					indicator-class="picker-selected"
					:value="pickerValue"
					@change="pickerChange">
					<picker-view-column>
						<view class="picker-item" v-for="(item, index) in years" :key="index">{{ item }}年</view>
					</picker-view-column>
					<picker-view-column>
						<view class="picker-item" v-for="(item, index) in months" :key="index">{{ item }}月</view>
					</picker-view-column>
					<picker-view-column>
						<view class="picker-item" v-for="(item, index) in days" :key="index">{{ item }}日</view>
					</picker-view-column>
				</picker-view>			
			</view>
	</view>
</template>

<script>
	export default {
		name: 'zn-date-picker',
		model: {
			prop: 'pickerValueConfirmed',
			event: 'confirmed-value-change'
		},
		props: {
			placeholder: {
				type: String,
				default: '请选择日期'
			},
			pickerValueConfirmed: [Date, String],
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			const date = new Date();
			const years = [];
			const year = date.getFullYear();
			const months = [];
			const month = date.getMonth() + 1;
			const day = date.getDate();
			for(let i = year -5; i <= year + 5; i++ ) {
				years.push(i)
			}
			for(let i = 1; i <= 12; i++) {
				months.push(i)
			}
			const yearIndex = years.indexOf(year);
			return {
				year,
				years,
				month,
				months,
				day,
				showPicker: false,
				pickerValue: [yearIndex, month - 1, day - 1]
			}
		},
		computed: {
			days() {
				const MONTH_WITH_31_DAYS = [1, 3, 5, 7, 8, 10, 12];
				const days = [];
				let maxDay = 30;
				if(this.month === 2){
					maxDay = new Date(this.year, 2, 0).getDate();
				}
				if(MONTH_WITH_31_DAYS.includes(this.month)) {
					maxDay = 31;
				}
				for(let i = 1; i <= maxDay; i++) {
					days.push(i)
				}
				return days
			},
			pickerSelectedLabel() { //获取当前选中项的label
				let label = '';
				let date = this.pickerValueConfirmed;
				let year;
				let month;
				let day;
				if(date) {
					if(typeof date === 'string') {
						date = new Date(date);
					}
					year = date.getFullYear();
					month = date.getMonth() + 1;
					day = date.getDate();
					label = `${year}/${month}/${day} 00:00:00`;
				}
				return label
			}
		},
		methods: {
			show() { //显示
				if(this.disabled) {
					return false
				}
				this.showPicker = true;
			},
			cancel() { //隐藏
				this.showPicker = false;
			},
			maskClick() { //点击遮罩
				this.cancel();
			},
			pickerChange(event) { //滚动选择
				const selectedArr = event.detail.value;
				let pickObj = {
					indexArr: selectedArr,
					date: this.getSelectedPicker(selectedArr)
				};
				this.year = this.years[selectedArr[0]];
				this.month = this.months[selectedArr[1]];
				this.day = this.days[selectedArr[2]];
				this.pickerValue = selectedArr;
				this.$emit('picker-item-change', pickObj);
			},
			pickerConfirm() { //确定当前选择
				let pickObj = {
					indexArr: this.pickerValue,
					date: this.getSelectedPicker(this.pickerValue)
				};
				this.showPicker = false;
				this.$emit('confirmed-value-change', this.getSelectedPicker(this.pickerValue))
				this.$emit('picker-confirm', pickObj);				
			},
			pickerCancel() {
				this.cancel();
			},
			//防止滚动穿透
			stopPageScroll() {
				return
			},
			/**
			 * 获取已选项
			 * @param  {Array} indexArr 已选项索引值组成的数组
			 * @return {Date} 已选项的Date对象
			 */
			getSelectedPicker(indexArr) {
				const year = this.years[indexArr[0]];
				const month = indexArr[1];
				const day = indexArr[2] + 1;
				return new Date(year, month, day)
			}
		}
	}
</script>

<style lang="scss">
	.zn-date-picker-wrapper {
		.picker {
			display: flex;
			justify-content: space-between;
			width: 100%;
			height: 54upx;
			line-height: 54upx;
			color: #333;
			.picker-placeholder {
				color: $uni-text-color-placeholder;
			}
		}
		.pickerMask {
			position: fixed;
			z-index: 1000;
			top: 0;
			right: 0;
			left: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.6);
		}
		.picker-content {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			transition: all 0.3s ease;
			transform: translateY(100%);
			z-index: 3000;
			.picker-header {
				display: flex;
				justify-content: space-between;
				background: #fff;
				padding: 20upx 30upx;
				.picker-btn {
					font-size: 32upx;
					color: #999;
				}
				.picker-confirm-btn {
					color: $uni-color-primary;
				}
			}
			.picker-view {
				width: 100%;
				height: 360upx;
				background: rgba(255, 255, 255, .9);
			}
			.picker-item{
				line-height: 100upx;
				text-align: center;
			}
			.picker-selected {
				color: $uni-color-primary;
			}
		}
		.picker-view-show {
			transform: translateY(0);
		}
	}
</style>
