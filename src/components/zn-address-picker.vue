<template>
	<view class="picker-wrapper">
		<view class="picker" @click="show">
			<view v-if="pickerValueConfirmed.length === 0" class="picker-placeholder">
				<text>{{ placeholder }}</text>
			</view>
			<view v-else>
				<text>{{ pickerSelectedLabel }}</text>
			</view>
			<text class="iconfont picker-icon">&#xe620;</text>
		</view>
		<view 
			:class="{'pickerMask': showPicker}"
			@click="maskClick"
			@touchmove.stop.prevent="stopPageScroll"></view>
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
					<block v-for="(n, columnIndex) in addressPickerArray.length" :key="columnIndex">
						<picker-view-column>
							<!-- #ifdef APP-PLUS -->
							<view class="picker-item" v-for="(item, index) in addressPickerArray[n]" :key="index">{{item.label}}</view>
							<!-- #endif -->
							<!-- #ifdef H5 -->
							<view class="picker-item" v-for="(item, index) in addressPickerArray[n - 1]" :key="index">{{item.label}} </view>
							<!-- #endif -->
						</picker-view-column>
					</block>
				</picker-view>			
			</view>
	</view>
</template>

<script>
	export default {
		name: 'zn-address-picker',
		model: {
			prop: 'pickerValueInit',
			event: 'confirmed-value-change'
		},
		props: {
			depth: {
				type: Number,
				default: 3,
				validator(value) {
					return [2, 3].includes(value)
				}
			},
			placeholder: {
				type: String,
				default: '请选择地址'
			},
			pickerValueInit: {
				type: Array,
				required: true
			}
		},
		data() {
			let addressPickerArray = [
				[],
				[],
				[]
			];
			let pickerValue = [0, 0, 0];
			if(this.depth === 2) {
				addressPickerArray = [
					[],
					[]
				];
				pickerValue = [0, 0];
			}
			return {
				showPicker: false,
				initialized: false,
				pickerValue, //当前省市区index数组
				addressPickerArray, //省市区列表
				pickerValueConfirmed: [], //已选项省市区index数组
				addressPickerConfirmedArray: [] //存储已选项的所在列表
			}
		},
		computed: {
			pickerSelectedLabel() { //获取当前选中项的label
				const length = this.pickerValueConfirmed.length;
				let label = '';
				if(length > 0) {
					this.pickerValueConfirmed.forEach((item, index) => {
						label += this.addressPickerConfirmedArray[index][item]['label'];
						if(index !== length - 1) {
							label += ' / '
						}
					})					
				}
				return label
			}
		},
		watch: {
			pickerValueInit() {
				if(!this.initialized) { //初始化
					this.initialized = true;
					this.init();
				}
			}
		},
		created() {
			this.init();
		},
		methods: {
			show() { //显示
				this.showPicker = true;
			},
			cancel() { //隐藏
				this.showPicker = false;
			},
			maskClick() { //点击遮罩
				this.cancel();
			},
			pickerChange(event) { //滚动选择
				const indexArr = event.detail.value;
				let pickObj = {
					indexArr: indexArr
				};
				if(indexArr[0] !== this.pickerValue[0]) { //省份改变
					const provinceId = this.addressPickerArray[0][indexArr[0]]['value'];
					this.getRegionList(provinceId) //更新所选省份的城市列表
						.then(val => {
							const cityList = val.map((item, index) => {
								return {
									label: item.region_name,
									value: item.id
								}
							})
							this.addressPickerArray.splice(1, 1, cityList);
							return val
						})
						.then(val => {
							if(this.depth === 2) {
								this.pickerValue = [indexArr[0], 0];
								pickObj.itemArr = this.getSelectedPicker(this.pickerValue);
								this.$emit('picker-item-change', pickObj);
								return false
							}
							const cityId = val[0]['id'];
							this.getRegionList(cityId) //更新所选省份的区县列表
								.then(val => {
									const regionList = val.map((item, index) => {
										return {
											label: item.region_name,
											value: item.id
										}
									})
									this.addressPickerArray.splice(2, 1, regionList);
									this.pickerValue = [indexArr[0], 0, 0];
									pickObj.itemArr = this.getSelectedPicker(this.pickerValue);
									this.$emit('picker-item-change', pickObj);
								})
						})
					return 
				}
				if(indexArr[1] !== this.pickerValue[1] && this.depth === 3) { //市改变
					const cityId = this.addressPickerArray[1][indexArr[1]]['value']
					this.getRegionList(cityId) //更新所选城市的区县列表
						.then(val => {
							const regionList = val.map((item, index) => {
								return {
									label: item.region_name,
									value: item.id
								}
							})
							this.addressPickerArray.splice(2, 1, regionList);
							this.pickerValue = [indexArr[0], indexArr[1], 0];
							pickObj.itemArr = this.getSelectedPicker(this.pickerValue);
							this.$emit('picker-item-change', pickObj);
						})
					return
				}
				this.pickerValue = [...indexArr];
				pickObj.itemArr = this.getSelectedPicker(indexArr);
				this.$emit('picker-item-change', pickObj);
			},
			pickerConfirm() { //确定当前选择
				let pickObj = {
					indexArr: this.pickerValue,
					itemArr: this.getSelectedPicker(this.pickerValue)
				};
				let idArr = pickObj.itemArr.map(item => item.value);
				this.showPicker = false;
				this.pickerValueConfirmed = [...this.pickerValue];
				this.addressPickerConfirmedArray = [...this.addressPickerArray];
				this.$emit('confirmed-value-change', idArr)
				this.$emit('picker-confirm', pickObj);				
			},
			pickerCancel() {
				this.cancel();
			},
			stopPageScroll() { //防止滚动穿透
				return
			},
			async init() { //初始化地址
				const initLength = this.pickerValueInit.length;
				let defaultIdArr = [110000, 110100, 110101]; //北京 北京市 东城区
				if(this.depth === 2) {
					defaultIdArr = [110000, 110100] //北京 北京市
				}
				if(initLength > 0) {
					defaultIdArr = this.pickerValueInit.slice(0, this.depth);
				}
				//初始化省份
				const provinceArr = await this.getRegionList();
				const provinceList = provinceArr.map((item, index) => {
					return {
						label: item.region_name,
						value: item.id
					}
				});
				const provinceIndex = this.getIndex(provinceList, defaultIdArr[0])
				this.addressPickerArray.splice(0, 1, provinceList);
				this.addressPickerConfirmedArray.splice(0, 1, provinceList);
				this.pickerValue.splice(0, 1, provinceIndex);
				if(initLength > 0) {
					this.$set(this.pickerValueConfirmed, 0, provinceIndex);
				}
				//初始化市/区
				for(let i = 0; i < defaultIdArr.length - 1; i++) {
					const childArr = await this.getRegionList(defaultIdArr[i]);
					const childList = childArr.map((item, index) => {
						return {
							label: item.region_name,
							value: item.id
						}
					});
					this.addressPickerArray.splice(i + 1, 1, childList);
					this.addressPickerConfirmedArray.splice(i + 1, 1, childList);
					this.pickerValue.splice(i + 1, 1, this.getIndex(childList, defaultIdArr[i + 1]));
					if(initLength > 0) {
						this.$set(this.pickerValueConfirmed, i + 1, this.getIndex(childList, defaultIdArr[i + 1]));
					}
				}
			},
			/**
			 * 获取已选项
			 * @param  {Array} indexArr 已选项索引值组成的数组
			 * @return {Array} 已选项数组
			 */
			getSelectedPicker(indexArr) {
				return indexArr.map((item, index) => this.addressPickerArray[index][item])
			},
			/**
			 * 获取省市县的列表
			 * @param  {Number} parentId 父级ID
			 * @return {Promise}          当前父级ID下的子列表
			 */
			getRegionList(parentId){
				let params = {};
				if(parentId){
					params.parent_id = parentId;
				}
				return this.$api.publicApi.regionList(params)
					.then(res => {
						const result = res.data;
						if(result.msg_code === 100000) {
							return result.response
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
			/**
			 * 获取列表当前项的index
			 * @param  {Array}  arr   省/市/区列表
			 * @param  {Number} id 	  当前项的id
			 * @return {Number}       当前项的index
			 */
			getIndex(arr, id) {
				return arr.findIndex(item => parseInt(item.value) === parseInt(id))
			}
		}
	}
</script>

<style lang="scss">
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
