<template>
    <view class="mpvue-picker">
		<view class="picker" @click="show">
			<view v-if="pickerValue.length === 0" class="picker-placeholder">
				<text>{{placeholder}}</text>
			</view>
			<view v-else>
				<text>{{pickerValueSelectedLabel}}</text>
			</view>
			<text class="iconfont picker-icon">&#xe620;</text>
		</view>
        <view :class="{'pickerMask':showPicker}" @click="maskClick" catchtouchmove="true"></view>
        <view class="mpvue-picker-content " :class="{'mpvue-picker-view-show':showPicker}">
            <view class="mpvue-picker__hd" catchtouchmove="true">
                <view class="mpvue-picker__action" @click="pickerCancel">取消</view>
                <view class="mpvue-picker__action" :style="{color:themeColor}" @click="pickerConfirm">确定</view>
            </view>
            <picker-view indicator-style="height: 40px;" class="mpvue-picker-view" :value="pickerValueIndex" @change="pickerChange" v-if="pickerValueList.length > 0">
                <block>
                    <picker-view-column>
                        <view class="picker-item" v-for="(item,index) in pickerValueList" :key="index">{{item.label}}</view>
                    </picker-view-column>
                </block>
            </picker-view>
        </view>
    </view>
</template>

<script>
    export default {
		name: 'zn-signle-picker',
		model: {
			prop: 'pickerValue',
			event: 'confirmedValueChange'
		},
        data() {
            return {
				/* 被选中的index */
				pickerValueIndex: [],
				
				/* 被选中的picker的label值 */
				pickerValueSelectedLabel: '',
				
				/* 选择值发生改变 */
				isPickerValueChange: true,
				
				/* 滚动后的值 */
				pickerValueChange: [],
				
				/* 是否显示控件 */
				showPicker: false,
            };
        },
		watch: {
			pickerValue(newValue, oldValue) {
				this.initPicker()
			}
		},
        props: {
            /* picker 可选数值 */
            pickerValueList: {
                type: Array,
                default(){
					return []
				}
            },
            /* 默认选中值 回传 */
            pickerValue: {
                type: Array,
                default() {
					return []
				}
            },
			/* 提示 */
			placeholder: {
				type: String,
				defult: ''
			},
            /* 主题色 */
            themeColor: {
				type: String,
				default: '#0066CC'
			}
        },
		created() {
			this.initPicker();
		},
        methods: {
            initPicker() {
				if (this.pickerValue.length > 0) {
					this.pickerValueIndex = [this._getIndex(this.pickerValue[0])];
					let pickObj = {
					    index: this.pickerValueIndex,
					    value: this._getPickerLabelAndValue(this.pickerValueIndex).value,
					    label: this._getPickerLabelAndValue(this.pickerValueIndex).label
					};
					this.pickerValueSelectedLabel = pickObj.label;
					this.pickerValueChange = this.pickerValueIndex;
				} else {
					this.pickerValueChange = [0];
				}
            },
            show() {
				this.showPicker = true;
            },
            maskClick() {
                this.pickerCancel();
            },
            pickerCancel() {
                this.showPicker = false;
            },
            pickerConfirm(e) {
                this.showPicker = false;
                this.pickerValueIndex = this.pickerValueChange;
                let pickerObj = {
                    index: this.pickerValueIndex,
                    value: this._getPickerLabelAndValue(this.pickerValueIndex).value,
                    label: this._getPickerLabelAndValue(this.pickerValueIndex).label
                };
				this.pickerValueSelectedLabel = pickerObj.label;
                this.$emit('confirmedValueChange', pickerObj.value);
            },
            pickerChange(e) {
                this.pickerValueChange = e.mp.detail.value;
                let pickObj = {
                    index: this.pickerValueChange,
                    value: this._getPickerLabelAndValue(this.pickerValueChange).value,
                    label: this._getPickerLabelAndValue(this.pickerValueChange).label
                };
                this.$emit('onChange', pickObj);
            },
            // 获取 pxikerLabel
            _getPickerLabelAndValue(index) {
                let pickerLable;
                let pickerGetValue = [];
                // selector
				pickerLable = this.pickerValueList[index].label;
				pickerGetValue.push(this.pickerValueList[index].value);
                return {
                    label: pickerLable,
                    value: pickerGetValue
                };
            },
			// 获取列表当前项的index
			_getIndex(value) {
				return this.pickerValueList.findIndex(item => item.value === value)
			}
        }
    };
</script>

<style>
	.picker {
		display: flex;
		justify-content: space-between;
		height: 54upx;
		line-height: 58upx;
	}
	.picker-placeholder {
		color: grey;
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

    .mpvue-picker-content {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        transition: all 0.3s ease;
        transform: translateY(100%);
        z-index: 3000;
    }

    .mpvue-picker-view-show {
        transform: translateY(0);
    }

    .mpvue-picker__hd {
        display: flex;
        padding: 9px 15px;
        background-color: #fff;
        position: relative;
        text-align: center;
        font-size: 17px;
    }

    .mpvue-picker__hd:after {
        content: ' ';
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 1px;
        border-bottom: 1px solid #e5e5e5;
        color: #e5e5e5;
        transform-origin: 0 100%;
        transform: scaleY(0.5);
    }

    .mpvue-picker__action {
        display: block;
        flex: 1;
        color: #1aad19;
    }

    .mpvue-picker__action:first-child {
        text-align: left;
        color: #888;
    }

    .mpvue-picker__action:last-child {
        text-align: right;
    }

    .picker-item {
        text-align: center;
        line-height: 40px;
        font-size: 16px;
    }

    .mpvue-picker-view {
        position: relative;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 238px;
        background-color: rgba(255, 255, 255, 1);
    }
</style>
