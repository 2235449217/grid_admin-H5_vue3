<template>
	<cu-custom class="top-bar">
		<block #content>通知</block>
	</cu-custom>
	<!-- 通知的盒子内容 -->
	<view class="notice-box">
		<view class="notice-container">
			<view v-if="!isShowNotice" class="isShow-unLogin">
				<text class="isshow-title">未登录，无法查看</text>
			</view>
			<!-- 第二条 -->
			<block v-else v-for=" item in messageList" :key="item.id">
				<view class="notice-container-list" @click="handleDetails(item)">
					<!-- 左边的盒子 -->
					<view class="notice-item-left">
						<image class="notice-icon"
							:src="item.notice_type == 3 ? '../../static/asset/fengxian.png' : '../../static/asset/fasong.png' "
							mode=""></image>
					</view>
					<!-- 中间的盒子 -->
					<view class="notice-item-middle">
						<view class="item-up-title"
							:style=" item.is_read_status == 1 ? 'color: rgba(26, 26, 26, 1)' : 'color:rgba(173, 173 , 173, 1)' ">
							{{item.notice_type == 1 ? '派发' : item.notice_type == 2 ? "转派" : "预警"}}通知
						</view>
						<view class="item-down-title"
							:style="item.is_read_status == 1  ? 'color: rgba(26, 26, 26, 1)' : 'color:rgba(173, 173 , 173, 1)' ">
							{{item.notice_back}}
						</view>
					</view>
					<!-- 右边的图标 -->
					<view class="notice-item-right">
						<image src="../../static/asset/arrow.png"></image>
					</view>
				</view>
			</block>
			<view class="bottom-title" v-show="isShowTitle">
				<text>没有更多</text>
			</view>
			<view class="bottom-title" v-show="!messageList.length" style="margin-top: 60rpx;">
				<text>暂无通知</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getMessageList,
		confirmMessage,
		totalUnRead
	} from "../../api/message.js"
	import RedDot from '../../mixins/tabbar-badge.js'
	import {
		getToken
	} from "../../utils/auth.js"
	export default {
		name: "notice",
		// 使用混入配置项配置代码融合
		mixins: [RedDot],
		data() {
			return {
				// 定义一个展示信息
				// 判断什么时候到底显示
				isShowTitle: false,
				// 判断一下有没有登录有没有token值
				isShowNotice: false,
				// 是否已读 1是未读，2是已读关键是刷新
				"is_read_status": 1,
				// "notice_type":0,
				// 定义所需要的上拉加载的分页
				page: 1,
				pageSize: 20,
				pageTotal: 0,
				isRequest: false, //这个是为了防止抖动
				messageList: [], //装数据的盒子啊
			};
		},
		// 周期函数
		onShow() {
			if (getToken()) {
				this.isShowNotice = true;
				if (getApp().globalData.unRead) {
					this.isShowNotice = true;
					this.page = 1;
					this.pageSize = 20;
					this.pageTotal = 0;
					this.isRequest = false;
					this.messageList = [];
					this.getMessageData();
					// 调用请求信息数据的函数
					// this.getMessageData();
				}
			};
		},
		onHide: function() {
			uni.hideLoading()
		},
		mounted() {
			if (getToken()) {
				this.isShowNotice = true;
				this.page = this.page;
				this.pageSize = 20;
				this.pageTotal = 0;
				this.isRequest = false;
				this.messageList = [];
				this.getMessageData();
				// 调用请求信息数据的函数
				// this.getMessageData();
			}
		},
		// 方法配置
		methods: {

			// 数据请求函数
			getMessageData(cb) {
				uni.showLoading({
					title: '加载中'
				});
				// 一旦进入这个函数就代表是把门打开这样你就不就不能自己
				this.isRequest = true
				// 请求接口函数然后得到数据
				// 提前封装好数据
				// console.log('页码数',this.page);
				const pageObj = {
					page: this.page,
					pageSize: this.pageSize
				}
				getMessageList(pageObj).then((res) => {
					uni.hideLoading()
					this.pageTotal = res.data.notice_count;
					// 去判断这个值来进行到底展示什么？
					this.messageList = [...this.messageList, ...res.data.Notice];
					// debugger
					// 请求成功说明本次请求已经完成可以关闭阀门让下一位开始
					this.isRequest = false;
					// 如果是刷新调用的请求一定要手动结束
					cb && cb();
					// 关闭提示无论什么情况
					// 输出一下对象是否出现
					// console.log('这是通知的数据',this.messageList[0].notice_back);
				}).catch((error) => {
					// 不论你有没有请求成功，反正这次请求你们是结束了
					this.isRequest = false;
					// console.log('请求数据失败',error);
					uni.hideLoading()
				})
			},
			// 点击跳转然后首先是给后台一下
			handleDetails: function(item) {
				const NoticeObj = {
					id: item.id,
					is_read_status: '2'
				}
				confirmMessage(NoticeObj).then((res) => {
					// console.log('点击确定====',this.is_read_status);
					this.messageList.find((list) => {
						return item.id == list.id
					}).is_read_status = 2
				});
				// console.log('!!!',this);

				// getMessageList(page);
				// 跳转对应的某一条的路径
				if (item.section_type == 1) {
					uni.navigateTo({
						url: "/pages/detail/healthDetail"
					})
				} else if (item.section_type == 2) {
					uni.navigateTo({
						url: "/pages/detail/placeDetail"
					})
				} else if (item.section_type == 3) {
					uni.navigateTo({
						url: "/pages/detail/enterpersonnelDetail"
					})
				} else if (item.section_type == 4) {
					uni.navigateTo({
						url: "/pages/detail/keyplaceDetail"
					})
				} else if (item.section_type == 5) {
					uni.navigateTo({
						url: "/pages/detail/riskpersonnelDetail"
					})
				} else if (item.section_type == 6) {
					uni.navigateTo({
						url: "/pages/detail/riskwarnDetail"
					})
				} else if (item.section_type == 7) {
					uni.navigateTo({
						url: "/pages/detail/areacheckDetail"
					})
				}
			},
		},
		// 上拉触底函数
		onReachBottom() {
			// 一旦触底就去请求函数
			// 先判断是不是到底部了，如果是那么我们就提示到底了
			if (this.page * this.pageSize >= this.pageTotal) {
				this.isShowTitle = true
			}
			// 使用节流 如果此时false才可以去请求否则阀门就关上了； 
			if (!this.isRequest) {
				// 一旦触发就是让页码自增1
				this.page = this.page + 1;
				this.getMessageData();
			}
			// console.log('第' + this.page + '页');
		},
		// 下拉刷新函数
		onPullDownRefresh() {
			// console.log('我下了刷新了');
			// 就两步，第一步，核心数据重新赋值，第二步重新去请求
			// 通知类型1是转派的图标，2是风险的图标
			// 定义所需要的上拉加载的分页
			this.page = 1;
			this.pageSize = 20;
			this.pageTotal = 0;
			this.isRequest = false; //这个是为了防止抖动
			this.messageList = []; //装数据的盒子啊
			this.getMessageData(() => {
				// 手动关闭自动刷新
				uni.stopPullDownRefresh()
			});
		}

	}
</script>
<!-- 1是派发，2是转派，3是风险 W-->
<style lang="scss">
	.notice-box {
		width: 100%;
		// background-color: #F9F9F9;
		display: flex;
		justify-content: center;
		background-color: #F5F8FA !important;

		.notice-container {
			margin: 0 auto;
			width: 706rpx;

			.bottom-title {
				width: 100%;
				height: 60rpx;
				display: flex;
				justify-content: center;

				text {
					color: #c0c0c0;
					font-size: 32rpx;
				}
			}

			.isShow-unLogin {
				width: 100%;
				height: 800rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				.isshow-title {
					font-size: 34rpx;
					// border: 1px solid red;

				}
			}

			.notice-container-list {
				position: relative;
				// border: 1px solid red;
				width: 100%;
				// background-color: #FFFFFF;
				padding: 20rpx 0;
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				background: rgba(255, 255, 255, 1);
				border: 0.5px solid rgba(245, 245, 245, 1);

				.notice-item-left {
					// width: 8%;
					width: 32rpx;
					height: 32rpx;
					margin-left: 26rpx;
					margin-right: 33rpx;

					.notice-icon {
						display: inline-block;
						position: absolute;
						top: 28rpx;
						left: 22rpx;
						width: 48rpx;
						height: 48rpx;
					}
				}

				.notice-item-middle {
					width: 70%;
					display: felx;
					flex-direction: column;

					.item-up-title {

						margin-bottom: 10rpx;
						color: rgba(0, 0, 0, 1);
						font-size: 36rpx;
					}

					.item-down-title {
						font-size: 28rpx;
						// 两行以上则省略
						// overflow: hidden;
						// text-overflow: ellipsis;
						white-space: wrap;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
				}

				.notice-item-right {
					width: 32rpx;
					// height: 16px;
					// border: 1.33px solid rgba(51, 51, 51, 1);
					margin-left: 70rpx;

					image {
						width: 32rpx;
						height: 32rpx;
					}
				}
				
			}
		}
	}

	// .notice-box{
	//   background-color: #F9F9F9;
	//   // height: 667px;
	//   .notice-container{
	//     margin: 0 auto;
	//     width: 353px;
	//     border: 1px solid skyblue;
	//     .notice-container-list{
	//       width: 100%;
	//       height: 100%;
	//       background-color: #FFFFFF;
	//       // border: 1px solid red;
	//       display: flex;
	//       justify-content: space-between;
	//       background: rgba(255, 255, 255, 1);
	//       border: 0.5px solid rgba(245, 245, 245, 1);
	//       border-radius: 4px;
	//       // margin-bottom: 10rpx;
	//       .notice-item-left{
	//         width: 9%;
	//         height: 100%;
	//         position: relative;
	//         image{
	//           position: absolute;
	//           width: 40rpx;
	//           height: 40rpx;
	//           right: 0;
	//           top: 20rpx;
	//         }
	//         // background-color: aqua;
	//       }
	//       .notice-item-middle{
	//         width: 253px;

	//         .item-up-title{
	//           width: 100%;
	//           // height: 40px;
	//           padding-top: 15rpx;
	//           color: rgba(0, 0, 0, 1);
	//           font-size: 32rpx;
	//         }
	//         .item-down-title{
	//           margin-top: 15rpx;
	//          font-size: 28rpx;
	//          color: rgba(26, 26, 26, 1);
	// white-space: wrap;
	// display: -webkit-box;
	// -webkit-box-orient: vertical;
	// -webkit-line-clamp: 2;
	// overflow: hidden;             
	//         }
	//       }
	//       .notice-item-right{
	//         height: 100%;
	//         display: flex;
	//         justify-content: center;
	//         align-items: center;
	//         image{
	//           width: 40rpx;
	//           height: 40rpx;
	//         }isShowNotice
	//       }
	//     }
	//   }
	// }
</style>
