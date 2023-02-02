<template>
		<cu-custom class="top-bar">
			<block #content>登录</block>
		</cu-custom>
	<view>
		<!-- 整体 -->
		<view class="my-wrapper" :style="{ height: 'calc(100vh - '+CustomBar+'px)'}">
			<!-- 最上面的装头像的 -->
			<view class="wrapper-container">
				<!-- 第一部分-->
				<view class="login-header">
					<view class="user-image">
						<!-- 用来装头像的 -->
						<image src="../../static/finLogo.png" mode=""></image>
					</view>
				</view>
				<!-- 第二部分 -->
				<view class="login-section-container">
					<view class="login-section-up">
						<text class="title">你好 ~</text>
					</view>
					<view class="login-section-down">
						<text class="title">欢迎登录网格化管理系统</text>
					</view>
				</view>
				<!-- 第三部分 -->
				<view class="login-footer">
					<view class="login-footer-upbox">
						<!-- 用户信息 -->
						<view class="info-block" :class="id==1?'input-focus':''">
							<view class="title">
								用户名:
							</view>
							<input class="info-input" @focus='id=1' @blur='id=0' v-model="username" type="text"
								placeholder="请输入用户名" />
						</view>
						<!-- 输入密码 -->
						<view class="info-block" :class="id==2?'input-focus':''">
							<view class="title">
								密码:
							</view>
							<input class="info-input" @focus='id=2' @blur='id=0' v-model="password" type="password"
								placeholder="请输入密码" />
						</view>
						<!-- 验证码部分 -->
						<view class="info-block code-input" :class="id==3?'input-focus':''">
							<view class="">
								<view class="title">
									验证码:
								</view>
								<input class="info-input" @focus='id=3' @blur='id=0' v-model="captcha" type="number"
									placeholder="请输入验证码" />
							</view>
							<image class="code-img" :src="captchaUrl" mode="scaleToFill" @click="setCaptcha" />
						</view>
					</view>
					<!-- 是否记住密码 -->
					<view class="rember-input">
						<checkbox-group class="block" @change="CheckboxChange">
							<view class="">
								<checkbox class='checkbox-width blue padding-right-sm'
									:class="checkbox[0].checked?'checked':''" :checked="checkbox[0].checked?true:false"
									value="check" style="transform:scale(0.8)"></checkbox>
								<text class="radio-span">记住密码</text>
							</view>
						</checkbox-group>
					</view>
					<view class="login-footer-btn">
						<button type="primary" class="btn" @click="handlerSubmit">
							登录
						</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		getLogin,
		getCaptcha
	} from "../../api/auth.js";
	import {
		setToken,
		isRemeberMe,
		getToken
	} from "../../utils/auth.js";
	import {
		encrypt
	} from '@/utils/rsaEncrypt.js';
	export default {
		name: "login",
		// mixins: [RedDot],
		data() {
			return {
				captchaUrl: "",
				captcha: "", //这个是收集用户输入的验证码
				captchaId: "",
				username: "",
				password: "",
				checkbox: [{
					value: 'check',
					checked: false
				}],
				id: 0
			};
		},
		created() {
			if (getToken()) {
				uni.hideLoading()
				uni.switchTab({
					url: '/pages/home/home'
				});
			}
			this.setCaptcha()
			const userName = uni.getStorageSync('userName');
			const Pwd = uni.getStorageSync('Pwd');
			const remember = isRemeberMe();
			if (isRemeberMe()) {
				this.username = userName;
				this.password = Pwd;
				this.checkbox[0].checked = remember;
			} else {
				this.username = "";
				this.password = "";
			}
		},
		onShow() {
			// if(uni.getStorageSync('')){
			//   this.username = uni.getStorageSync('userName');
			//   this.password = uni.getStorageSync('Pwd');
			//   this.checkbox[0].checked = true;
			// }else{
			//   this.username = "";
			//   this.password = "";
			//   this.checkbox[0].checked = false
			// }
			const userName = uni.getStorageSync('userName');
			const Pwd = uni.getStorageSync('Pwd');
			const remember = isRemeberMe();
			if (userName && Pwd) {
				this.username = userName;
				this.password = Pwd;
				this.checkbox[0].checked = remember;
				// 清空一下rember
				// if (uni.getStorageSync('rememberMe')) {
				// 	uni.removeStorageSync('rememberMe');
				// 	// this.checkbox[0].checked = false;
				// }

			} else {
				this.username = "";
				this.password = "";
			}
		},
		onHide: function() {
			uni.hideLoading()
		},
		onUnload: function() {
			uni.hideLoading()
		},
		methods: {
			setCaptcha() {
				getCaptcha()
					.then((res) => {
						this.captchaUrl = res.data.picPath;
						this.captchaId = res.data.captchaId;
					})
					.catch((err) => {});
			},
			CheckboxChange(e) {
				var items = this.checkbox,
					values = e.detail.value;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					items[i].checked = false;
					for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
						if (items[i].value == values[j]) {
							items[i].checked = true;
							break
						}
					}
				}
			},
			// 点击是都保存密码
			handleCheck() {
				this.checkbox[0].checked = !this.checkbox[0].checked;
			},
			// 点击提交，收集信息（登录）
			handlerSubmit() {
				uni.showLoading({
					title: '登录中...'
				})
				// 首先是一旦点击可能会出现的逻辑
				// 第一你要封装好人家要的一个用户名，密码，验证码？传递给人家这个对象然后根据需求我们是不是要保存一下密码？
				const userInfo = {
					captcha: this.captcha,
					captchaId: this.captchaId,
					username: this.username,
					password: encrypt(this.password)
				};
				// 封装好数据对象然后调用login方法把数据传给后台
				if (this.username != '' && this.password != '' && this.captcha != '') {
					getLogin(userInfo).then((res) => {
						uni.hideLoading()
						// console.log("登录",res)
						// uni.setStorageSync("user_id", res.data.user.deptId);
						if (this.checkbox[0].checked) {
							setToken(res.data.token, true, res.data.user.deptId, this.username, this.password);
						} else {
							setToken(res.data.token, false, res.data.user.deptId)
						}
						setTimeout(() => {
							uni.showToast({
								title: "登录成功",
							});
							uni.switchTab({
								url: '/pages/home/home'
							});
							uni.$emit('loginSuccess', {
								msg: '登陆成功'
							})
						}, 500)
					}).catch((err)=>{
						this.setCaptcha()
					})
				} else {
					if (this.username == '') {
						uni.showToast({
							title: '用户名为空',
							icon: "none"
						})
					} else if (!this.password) {
						uni.showToast({
							title: '密码为空',
							icon: "none"
						})
					} else {
						uni.showToast({
							title: '验证码为空',
							icon: "none"
						})
					}
				}
			},
		},
	}
</script>
<style lang="scss" scoped>
	.cu-form-group {
		background: none !important;
	}

	::v-deep uni-checkbox::before {
		right: 14px;
	}
	::v-deep uni-page {
		background: #fff !important;
	}

	.my-wrapper {
		width: 100%;
		// height: 812px;
		background: #fff;

		.wrapper-container {
			// border: 1px solid red;
			margin: 0 32rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			width: 91%;

			// border: 1px solid red;
			.login-header {
				margin-top: 78rpx;
				width: 76rpx;
				height: 76rpx;
				display: flex;
				justify-content: flex-start;
				align-items: center;

				.user-image {
					width: 76rpx;
					height: 76rpx;

					image {
						width: 100%;
						height: 100%;
					}

					// background: rgba(173, 173, 173, 1);
					// border-radius: 100rpx;
				}
			}

			.login-section-container {
				width: 100%;
				mix-blend-mode: normal;
				font-weight: 400;
				color: rgba(0, 0, 0, 1);
				letter-spacing: 3.26rpx;
				font-size: 40rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				margin-bottom: 32rpx;
				margin-top: 62rpx;

				.login-section-up {
					width: 100%;
					display: flex;
					align-items: center;

					.title {
						font-size: 64rpx;
					}
				}

				.login-section-down {
					// width: 488rpx;
					width: 100%;

					// margin-bottom: 6rpx;
					// border: 1px solid blue;
					.title {
						color: #8F97A4;
						font-size: 28rpx;
					}
				}
			}

			.login-footer {
				width: 100%;
				margin-top: 102rpx;

				.login-footer-upbox {
					width: 100%;
					margin-bottom: 8rpx;

					.info-block {
						height: 112rpx;
						border-bottom: 2rpx #D2D1D1 solid;
						transition: height 0.01s;


						.title {
							padding-top: 40rpx;
							color: #D2D1D1;
							font-size: 28rpx;
							line-height: 32rpx;
						}

						.info-input {
							color: #000;
							line-height: 28rpx;
							font-size: 24rpx;
							margin-bottom: 6rpx;
						}


						&.code-input {
							display: flex;
							flex-flow: row nowrap;
							justify-content: space-between;
							align-items: center;

							.code-img {
								width: 174rpx;
								height: 80rpx;
								border-radius: 8rpx;
							}
						}

						&.input-focus {
							border-bottom: 2rpx #3F86FF solid;
							height: 130rpx;
							transition: height 0.5s;

							.title {
								margin-bottom: 16rpx;
							}
						}
					}
				}

				.rember-input {
					width: 250rpx;
					// height: rpx;
					margin-bottom: 8rpx;
					// padding-top: 20rpx;
					// border: 1px solid green;

					.radio {
						display: flex;
						justify-content: flex-start;
						align-items: center;

						text {
							// border: 1px solid yellow;
						}

						radio {
							margin-right: 10rpx;
						}

						.radio-span {
							font-size: 33rpx;
						}
					}
				}

				.login-footer-btn {
					// width: 100%;
					// height: 100rpx;
					// border: 1px solid blue;
					display: flex;
					justify-content: center;
					align-items: center;
					margin: 40rpx 108rpx 0;

					.btn {
						width: 100%;
						font-size: 32rpx;
						background: rgba(89, 126, 247, 1);
						background-blend-mode: normal;
						border-radius: 4rpx;
						mix-blend-mode: normal;
					}
				}
			}
		}
	}
</style>
