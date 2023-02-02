// 这个就是让所有的页面都要有这个未读信息
// 首先引入一个接口是什么时候调用什么时候移除
import {
	totalUnRead
} from '../api/message.js'
import { getToken } from '../utils/auth.js'
// 暴露出去让所有人都能看到
let timer =null;
export default {
	// 页面加载的时候开始判断，有没有未读的消息
	globalData: {
		unRead: false
	},
	onShow() {
		// 页面显示的时候就开始加载
		if(getToken()) {
			totalUnRead().then((res) => {
				if (res.data.flag_notice) {
					getApp().globalData.unRead = true;
					this.setRedDot();
				} else {
					getApp().globalData.unRead = false;
					this.removeRedDot();
				}
			});
			timer = setInterval(() => {
				totalUnRead().then((res) => {
					if (res.data.flag_notice) {
						getApp().globalData.unRead = true;
						this.setRedDot();
					} else {
						getApp().globalData.unRead = false;
						this.removeRedDot();
					}
				});
			},5000)
		}
	},
	onHide() {
		clearInterval(timer);
	},
	onUnload() {
		clearInterval(timer);
	},
	methods: {
		setRedDot() {
			uni.showTabBarRedDot({
				index: 1
			})
		},
		removeRedDot() {
			uni.hideTabBarRedDot({
				index: 1
			})
		},
		getInfo() {
			
		}
	}
}
