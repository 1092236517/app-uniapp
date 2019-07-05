<template>
	<view class="picker-wrapper">
		<view class="picker" @click="show">
			<view v-if="pickerValueConfirmed.length === 0" class="picker-placeholder">
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
					<block v-for="(n, columnIndex) in pickerValueMulArray.length" :key="columnIndex">
						<picker-view-column>
							<!-- #ifdef APP-PLUS -->
							<view class="picker-item" v-for="(item, index) in pickerValueMulArray[n]" :key="index">{{item.label}}</view>
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<view class="picker-item" v-for="(item, index) in pickerValueMulArray[n - 1]" :key="index">{{item.label}} </view>
							<!-- #endif -->
						</picker-view-column>
					</block>
				</picker-view>			
			</view>
	</view>
</template>

<script>
	/**
	 * 初始化pickerValue
	 * @param  {Array} pickerArr 选择器data数组
	 * @return {Array} pickerValue
	 */
	function initPickerValue(pickerArr) {
		const length = pickerArr.length;
		const pickerValue = [];
		for(let i = 0; i < length; i++) {
			pickerValue.push(0)
		}
		return pickerValue
	}
	export default {
		name: 'zn-picker',
		model: {
			prop: 'pickerValueConfirmed',
			event: 'confirmed-value-change'
		},
		props: {
			pickerValueMulArray: {
				type: Array,
				required: true
			},
			placeholder: {
				type: String,
				default: '请选择'
			},
			pickerValueConfirmed: {
				type: Array,
				required: true
			},
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				showPicker: false,
				pickerValue: initPickerValue(this.pickerValueMulArray)
			}
		},
		computed: {
			pickerSelectedLabel() { //获取当前选中项的label
				const length = this.pickerValueConfirmed.length;
				let label = '';
				if(length > 0) {
					this.pickerValueConfirmed.forEach((item, index) => {
						if(!this.pickerValueMulArray[index][item]) {
							return false
						}
						label += this.pickerValueMulArray[index][item]['label'];
						if(index !== length - 1) {
							label += ' / '
						}
					})					
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
				let pickObj = {
					indexArr: event.detail.value,
					itemArr: this.getSelectedPicker(event.detail.value)
				};
				this.pickerValue = event.detail.value;
				this.$emit('picker-item-change', pickObj);
			},
			pickerConfirm() { //确定当前选择
				let pickObj = {
					indexArr: this.pickerValue,
					itemArr: this.getSelectedPicker(this.pickerValue)
				};
				this.showPicker = false;
				this.$emit('confirmed-value-change', this.pickerValue)
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
			 * @return {Array} 已选项数组
			 */
			getSelectedPicker(indexArr) {
				return indexArr.map((item, index) => this.pickerValueMulArray[index][item])
			}
		}
	}
</script>

<style lang="scss" scoped>
	.picker-wrapper {
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
				}
				.picker-confirm-btn {
					color: $uni-color-primary;
				}
			}
			.picker-view {
				width: 100%;
				height: 500upx;
				background: rgba(255, 255, 255, .9);
			}
			.picker-item{
				line-height: 100upx;
				text-align: center;
			}
		}
		.picker-view-show {
			transform: translateY(0);
		}
	}
</style>
