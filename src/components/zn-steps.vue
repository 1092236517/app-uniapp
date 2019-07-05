<template>
	<view>
		<scroll-view class="zn-steps-wrapper" scroll-x="true" @scroll="scroll">
			<view class="steps-list">
				<view
					class="step-item"
					v-for="(step, index) in steps"
					:key="index"
					:class="step.statusClass">
					<view class="icon-div">
						<view class="left-line"></view>
						<view
							v-if="currentStep > index + 1"
							class="iconfont finish-icon">&#xe623;</view>
						<view
							v-else-if="currentStep == index + 1"
							class="current-icon">
							<view class="inner-circle"></view>
						</view>
						<view
							v-else
							class="default-icon"></view>
						<view class="right-line"></view>
					</view>
					<view class="desc">{{ step.desc }}</view>
				</view>
			</view>
		</scroll-view>
	</view>	
</template>

<script>
export default {
    name: 'zn-steps',
    props: {
        currentStep: {
            type: Number,
            default: 1
        },
        steps: Array
    },
    data () {
        return {

        }
    },
    methods: {
		/**
		 * 获取当前步骤状态的class
		 * 因h5+app模板不支持函数，所以状态class需要传入
		 * class的值：'step-is-error'|'step-is-finish'|'step-is-active'|'step-is-wait'
		 */
        getStepStatusClass (index, status) {
            let classObj = {
                'step-is-error': false,
                'step-is-finish': false,
                'step-is-active': false,
                'step-is-wait': false
            }
            if (status === 'REJECT') {
                classObj['step-is-error'] = true
                return classObj
            }
            if (this.currentStep > index + 1) {
                classObj['step-is-finish'] = true
            } else if (this.currentStep === index + 1) {
                classObj['step-is-active'] = true
            } else {
                classObj['step-is-wait'] = true
            }
            return classObj
        },
		scroll() {
			this.$emit('step-scroll')
		}
    }
}
</script>

<style lang="scss">
//步骤线的样式
@mixin line() {
    flex-grow: 1;
    height: 2upx;
    min-width: 120upx;
    background: $step-default-color;	
}
.zn-steps-wrapper {
    .steps-list {
		display: flex;
		flex-wrap: nowrap;
		padding: 5upx 10upx;
		.step-item {
			flex-grow: 1;
			.icon-div {
				display: flex;
				align-items: center;
				.finish-icon {
					width: 40upx;
					height: 40upx;
					font-size: 40upx;
					color: $step-finish-color;
				}
				.default-icon {
					width: 40upx;
					height: 40upx;
					background: $step-default-color;
					border-radius: 50%;
				}
				.current-icon {
                    display: flex;
                    width: 40upx;
                    height: 40upx;
                    margin: 0 auto;
                    border-radius: 50%;
                    background: #9bc8f1;
                    justify-content: center;
                    align-items: center;
                    animation: twinkle 2s ease-in-out infinite;
					.inner-circle {
                        width: 20upx;
                        height: 20upx;
                        border-radius: 50%;
                        background: #157ee7;						
					}
				}
				.left-line {
					@include line();
				}
				.right-line {
					@include line();
				}
			}
            .desc {
                margin-top: 20upx;
                font-size: 24upx;
                color: $step-default-color;
                text-align: center;
			}
            &:first-child {
                .left-line {
					display: none;
				}
                .desc {
					text-align: left;	
				}
			}
            &:last-child {
				.right-line {
					display: none;
				}
				.desc {
					text-align: right;
				}
			}  
            &.step-is-error {
				color: $step-error-color;
				.icon-div {
					.left-line {
						background: $step-finish-color;
					}
				}
				.desc {
					color: $step-error-color
				}
			}
            &.step-is-finish {
				color: #333;
				.icon-div {
					.left-line {
						background: $step-finish-color;
					}
					.right-line {
						background: $step-finish-color;
					}
				}
				.desc {
					color: #333;
				}
			}
            &.step-is-active {
				color: $step-finish-color;
				.icon-div {
					.left-line {
						background: $step-finish-color;
					}
					.right-line {
						background: $step-default-color;
					}
				}
				.desc {
					color: $step-finish-color;
				}
			}
		}
	}
}
@keyframes twinkle {
    0% {
        transform: scale(1);
        opacity: .6;		
	}
    50% {
        transform: scale(1.2);
        opacity: 1;		
	}
    100% {
        transform: scale(1);
        opacity: .6;
	}	
}
</style>
