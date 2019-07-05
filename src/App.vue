<script>
    import { baseURL } from 'common/utils/request.js'
    
    const CHECK_APP_UPDATE_URL = `${baseURL}/api/mobile/version/detail`;
	export default {
		onLaunch: function () {
			// 获取系统信息
			if (!uni.getStorageSync('systemInfo')) {
				const systemInfo = uni.getSystemInfoSync();
				uni.setStorageSync('systemInfo', systemInfo)
				console.log(systemInfo)
			}
			// 锁定屏幕方向
            //#ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary'); //锁定
            //#endif
            
            //升级检测
            // #ifdef APP-PLUS
            plus.runtime.getProperty(plus.runtime.appid, info => {  
                const appInnerVersion = info.version;
                this.update(CHECK_APP_UPDATE_URL, appInnerVersion) 
            }); 
            // #endif
		},
		onShow: function () {
		},
		onHide: function () {
		},
		onError: function(err) {
			console.log(JSON.stringify(err))
		},
        methods: {
            update(url, version) { //升级
                uni.request({
                	url,
                    data: {
                        version,
                        appid: plus.runtime.appid,
                        imei: plus.device.imei,
                        type: 'JIANGJIAN'
                    },
                    success(res) {
                        const result = res.data;
                        if(result.msg_code === 100000) {
                            const isUpdate = result.response.status;
                            const isForceUpdate = result.response.is_force_update === 1 ? true : false;
                            const updateUrl = result.response.url;
                            if(isUpdate) {
                                uni.showModal({
                                	title: '更新提示',
                                    content: '有新版本，请下载更新',
                                    showCancel: !isForceUpdate,
                                    confirmText: '去更新',
                                    success(res) {
                                        if(res.confirm) {
                                            plus.runtime.openURL(updateUrl);
                                        }
                                    }
                                })
                            }
                        }else {
                            console.log('请求失败')
                        }
                    }
                })
            }
        }
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import url("./common/scss/base.scss");
</style>
