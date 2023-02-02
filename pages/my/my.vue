<template>
	<!-- 这个是我的页面 -->
	<view>
		<cu-custom class="top-bar">
			<block #content>我的</block>
		</cu-custom>
		<view>
			<!-- 整体 -->
			<view class="my-wrapper">
				<!-- 最上面的装头像的 -->
				<view class="wrapper-container">
					<!-- 第一部分-->
					<view class="login-header">
						<view class="user-image" @click="handleChangeImage">
							<!-- 用来装头像的 -->
							<!-- <image :src="headerImg" mode=""></image> -->
							<image src="../../static/headImg.png" mode=""></image>
						</view>
						<view class="header-userName">
							<text>{{userName}}</text>
						</view>
					</view>
					<!-- 展示信息区 -->
					<view class="user-info">
						<view class="depart-box">
							<view class="depart-right">
								<image src="../../static/asset/bumen.png" mode=""></image>
								<text>部门：</text>
							</view>
							<view class="depart-view">
								<view class="depart-view-box">
									{{deptName}}
								</view>
							</view>
						</view>
						<!-- 角色展示区 -->
						<view class="depart-box">
							<view class="depart-right">
								<image src="../../static/asset/yonghujiaose-.png" mode=""></image>
								<text>角色：</text>
							</view>
							<view class="depart-view">
								<view class="depart-view-box">
									{{nickName}}
								</view>
							</view>
						</view>

					</view>
					<!-- 修改密码按钮 -->
					<view class="change-pwd-btn">
						<button type="primary" class="btn1" @click="handleChangePwd">修改密码</button>
					</view>
					<!-- 退出按钮 -->
					<view class="exit-login-btn">
						<button type="primary" class="btn2" @click="handleExit">退出登录</button>
					</view>
				</view>
			</view>
		</view>
	</view>
	<!-- 这个是修改密码的页面 -->

</template>

<script>
	import {
		getUserInfo,
		changePassWord
	} from "../../api/auth.js";
	import {
		removeUserToken,
		getToken
	} from "../../utils/auth.js"
	import RedDot from '../../mixins/tabbar-badge.js'
	export default {
		name: "my",
		mixins: [RedDot],
		data() {
			return {
				headerImg: '',
				nickName: '',
				userName: '',
				deptName: ''
			};
		},
		onShow() {
			var _this = this
			uni.$on('loginSuccess', function(data) {
				// console.log("data", data)
				_this.getInfo()
			})
			if (getToken()) {
				// 调用接口
				_this.getInfo()
			} else {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			}
		},
		created() {
			if (getToken()) {
				// 调用接口
				this.getInfo()
			} else {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			}
		},
		methods: {
			//获取用户信息
			getInfo() {
				getUserInfo().then((res) => {
					// console.log('用户信息', res);
					this.headerImg = res.data.userInfo.headerImg;
					this.nickName = res.data.userInfo.authorities[0].authorityName;
					this.userName = res.data.userInfo.userName
					this.deptName = res.data.userInfo.dept.deptName
				})
			},
			// 点击修改头像
			handleChangeImage() {},
			// 退出登录
			async handleExit() {
				await removeUserToken()
				await uni.reLaunch({
					url: '/pages/login/login'
				})
			},
			// 修改密码
			handleChangePwd() {
				// 第一步拿到对应的用户名，前提是你要先登录现有token对不对
				// console.log('token值', getToken());
				const My_Token = getToken();
				if (!My_Token) {
					uni.showToast({
						title: "请你先登录"
					})
				} else {
					uni.navigateTo({
						url: `/pages/changepwd/changepwd?userName=${this.userName}`
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	::v-deep .cu-bar {
		// background-color: #F5F8FA !important;
	}

	.my-wrapper {
		width: 100%;
		// height: 812px;
		background: #F5F8FA;
		display: flex;
		justify-content: center;

		.wrapper-container {
			// margin: 0 auto;
			width: 668rpx;

			// border: 1px solid red;
			.login-header {
				// border: 1px solid red;
				height: 400rpx;
				width: 400rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				border-bottom: 2rpx solid rgba(214, 214, 214, 1);
				margin-left: 140rpx;

				.user-image {
					width: 200rpx;
					height: 200rpx;
					// background: rgba(173, 173, 173, 1);
					border-radius: 100rpx;
					overflow: hidden;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.header-userName {
					position: absolute;
					top: 78%;
					font-size: 38rpx;

				}
			}

			.user-info {
				width: 100%;
				padding: 0 20%;

				.depart-box {
					height: 90rpx;
					display: flex;
					justify-content: flex-start;

					.depart-right {
						width: 50%;
						display: flex;
						justify-content: flex-end;
						align-items: center;
						font-size: 28rpx;

						image {
							display: block;
							margin-top: 2rpx;
							margin-right: 12rpx;
							width: 40rpx;
							height: 40rpx;
						}
					}

					.depart-view {
						width: 40%;
						height: 90rpx;
						border-radius: 4rpx;
						position: relative;
						margin-left: 20rpx;

						.depart-view-box {
							// width: 98px;
							height: 40rpx;
							font-size: 28rpx;
							position: absolute;
							top: 50%;
							transform: translateY(-50%);
						}
					}
				}
			}

			.change-pwd-btn {
				// width: 335px;
				width: 100%;
				height: 80rpx;
				margin-bottom: 30rpx;
			}

			.exit-login-btn {
				width: 100%;
				height: 80rpx;

			}
		}

		.btn1 {
			font-size: 28rpx;
			background: rgba(89, 126, 247, 1);
			// background-color: #8d97a5;
			background-blend-mode: normal;
			border-radius: 4rpx;
			mix-blend-mode: normal;
			margin-top: 200rpx;
			width: 534rpx;
			height: 70rpx;
		}

		.btn2 {
			font-size: 28rpx;
			background: rgba(89, 126, 247, 1);
			background-color: #8d97a5;
			background-blend-mode: normal;
			border-radius: 4rpx;
			// margin-top: 60rpx;
			mix-blend-mode: normal;
			width: 534rpx;
			height: 70rpx;
		}
	}
</style>
