<template>
    <view class="zn-input-wrapper">
        <view class="zn-input-prepend">
            <slot name="prepend"><text class="iconfont input-icon">&#xe61d;</text></slot>
        </view>
        <view class="zn-input-view">
            <input
                class="zn-input"
                :type="type"
                :value="value"
                v-bind="$attrs"
                @confirm="handler">
        </view>
        <view class="zn-input-append">
            <slot name="append"></slot>
        </view>
    </view>
</template>

<script>
export default {
    name: 'zn-input',
    inheritAttrs: false,
    props: {
        icon: String,
        type: {
            type: String,
            default: 'text'
        },
        value: {
            type: [String, Number]
        }
    },
    computed: {
        inputListeners () {
            const vm = this
            return Object.assign({},
                vm.$listeners,
                {
                    input(event) {
                        vm.$emit('input', event.target.value)
                    }
                })
        }
    },
	methods: {
		handler(event) {
			this.$emit('confirm', event.target.value);
		}
	}
}
</script>

<style lang="scss">
.zn-input-wrapper {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    width: 100%;
    box-sizing: border-box;
	.zn-input-prepend {
	    font-size: 40upx;
	    color: #cecece;
		vertical-align: middle;
		.input-icon {
			color: #999;
		}
	}
    .zn-input-view {
		flex-grow: 1;
		.zn-input {
            height: 40upx;
            width: 100%;
            line-height: 40upx;
            font-size: 18upx;
            color: #333;
            box-sizing: border-box;
            vertical-align: middle;		
		}
	}
    .zn-input-append {
        font-size: 14upx;
        vertical-align: middle;
        white-space: nowrap;		
	}
}
</style>
