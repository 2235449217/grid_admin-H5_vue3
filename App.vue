<script>
	import {
		getCurrentInstance
	} from 'vue'
	import {
		getToken
	} from "@/utils/auth.js";
	import {
		update
	} from "@/utils/update.js";
	import * as dd from 'dingtalk-jsapi';
	export default {
		onLaunch: function() {
			// #ifdef APP-PLUS
			update({
				title: '检测到有新版本！',
				content: '请升级app到最新版本！',
				canceltext: '暂不升级',
				oktext: '立即升级'
			});
			// #endif
			const {
				appContext
			} = getCurrentInstance()
			if (dd.env.platform !== "notInDingTalk") {
				appContext.config.globalProperties.dingding = true
			}else {
				appContext.config.globalProperties.dingding = false
			}
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					appContext.config.globalProperties.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						appContext.config.globalProperties.CustomBar = e.statusBarHeight + 50;
					} else {
						appContext.config.globalProperties.CustomBar = e.statusBarHeight + 45;
					};
					// #endif
					// #ifdef MP-WEIXIN
					appContext.config.globalProperties.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					appContext.config.globalProperties.Custom = custom;
					appContext.config.globalProperties.CustomBar = custom.bottom + custom.top - e
						.statusBarHeight;
					// #endif        
					// #ifdef MP-ALIPAY
					appContext.config.globalProperties.StatusBar = e.statusBarHeight;
					appContext.config.globalProperties.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif

				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "@/static/iconfont.css";

	/*每个页面公共css */
	body {
		/* background-color: rgba(249, 249, 249, 1); */
		background-color: #F5F8FA;
	}
</style>
