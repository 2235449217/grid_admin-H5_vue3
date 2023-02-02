<template>
	<view class="home">
		<cu-custom class="top-bar">
			<block #content>首页</block>
		</cu-custom>
		<!-- 轮播图 -->
		<view>
			<view class="uni-margin-wrap">
				<swiper class="swiper" circular :autoplay="autoplay" :interval="interval" :duration="duration">
					<swiper-item v-for="item in swipers">
						<view class="swiper-item img ">
							<image class="imgs" :src=item alt="" />
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>

		<!-- 管理模块 -->
		<view class="manage">
			<view class="content">
				<view class="item" v-for="(item, index) in manageListOne" :key="index" @click="itemClick(item)">
					<view class="bgc" :style="item.background">
						<view class="text-area">
							<image :src="item.url" mode=""></image>
							<span>{{ item.name }}</span>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 下方图片 -->
		<view class="img_bottom">
			<image class="imgs" src="/static/icon/lastest/Slice.png" alt="" mode="aspectFill"/>
		</view>


	</view>
</template>

<script>
	import RedDot from "../../mixins/tabbar-badge.js";

	export default {
		mixins: [RedDot],
		data() {
			return {
				background: ['color1', 'color2', 'color3'],
				// indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				swipers: [
					"/static/icon/lastest/swiper1.png",
					"/static/icon/lastest/swiper2.png",
					"/static/icon/lastest/swiper3.png"
				],
				manageListOne: [{
						name: "健康码",
						page: "health",
						value: 1,
						url: "../../static/icon/lastest/health.png",
						background: "background:linear-gradient(141deg, #04B247 0%, #03A543 100%)"
					},
					{
						name: "场所码管理",
						page: "place",
						value: 2,
						url: "../../static/icon/lastest/place.png",
						background: "background: linear-gradient(138deg, #4287FD 0%, #4487F9 100%);"
					},
					// {
					// 	name: "重点场所管理",
					// 	page: "keyplace",
					// 	value: 5,
					// 	url: "../../static/icon/lastest/key_place.png",
					// },
					// {
					// 	name: "重点人员管理",
					// 	page: "keypersonnel",
					// 	value: 4,
					// 	url: "../../static/icon/none/key_person.png",
					// },
					{
						name: "入新人员管理",
						page: "enterpersonnel",
						value: 7,
						url: "../../static/icon/lastest/enter.png",
						background: "background: linear-gradient(133deg, #4388FE 0%, #4488FA 100%);"
					},
					{
						name: "区域协查",
						page: "areacheck",
						value: 9,
						url: "../../static/icon/lastest/area.png",
						background: "background: linear-gradient(138deg, #4388FD 0%, #4589FB 100%);"
					},
					// {
					// 	name: "风险人员",
					// 	page: "riskpersonnel",
					// 	value: 6,
					// 	url: "../../static/icon/none/risk_person.png",
					// },
					// {
					// 	name: "风险预警",
					// 	page: "riskwarn",
					// 	value: 8,
					// 	url: "../../static/icon/none/risk_warn.png",
					// },
					{
						name: "核酸信息",
						page: "nuclein",
						value: 3,
						url: "../../static/icon/lastest/nuclein.png",
						background: "background: linear-gradient(137deg, #FF9205 0%, #FF8E03 100%);"
					},
					{
						name: "数据统计",
						page: "statistics",
						value: 10,
						url: "../../static/icon/lastest/statistics.png",
						background: "background: linear-gradient(138deg, #4388FD 0%, #4589FB 100%);"
					},
				],
				manageListTwo: [],
			};
		},

		methods: {
			// 管理模块点击某个进行页面跳转 （需把数组中的page字段添加）
			itemClick(item) {
				// console.log(item)
				if (uni.getStorageSync("userToken")) {
					uni.navigateTo({
						url: "/pages/detail/" + item.page + "Detail?value=" + item.value,
					});
				} else {
					uni.navigateTo({
						url: "/pages/login/login",
					});
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.home {
		width: 100%;
		// background-color: rgba(249, 249, 249, 1);
		background-color: #F5F8FA;

		.uni-margin-wrap {
			width: 100%;

			.swiper {
				width: 100%;

				.swiper-item {
					// display: block;
					width: 100%;
					height: 300rpx;

					// line-height: 300rpx;
					// text-align: center;
					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}





		.swiper-list {
			margin-top: 40rpx;
			margin-bottom: 0;
		}

		.uni-common-mt {
			margin-top: 60rpx;
			position: relative;
		}

		.info {
			position: absolute;
			right: 20rpx;
		}

		.uni-padding-wrap {
			width: 550rpx;
			padding: 0 100rpx;
		}

		.img_bottom {
			// height: 250rpx;
			// line-height: 250rpx;
			text-align: center;
			vertical-align: middle;
			margin-top: 40rpx;

			.imgs {
				width: 267px;
				height: 161px;
			}

		}

		.manage {
			margin: 20rpx 52rpx;

			.content {
				display: flex;
				flex-wrap: wrap;
				justify-content: flex-start;
				border-radius: 8rpx;
				overflow: hidden;

				.item {
					width: 300rpx;
					height: 140rpx;
					margin: 10rpx 11rpx;

					.bgc {
						width: 100%;
						height: 100%;
						// background: linear-gradient(141deg, #04B247 0%, #03A543 100%);
						border-radius: 6px 6px 6px 6px;
						opacity: 1;

						.text-area {
							line-height: 140rpx;
							text-align: center;
							font-size: 28rpx;
							color: #fff;

							image {
								width: 48rpx;
								height: 48rpx;
								vertical-align: middle;
							}

							span {
								margin-left: 26rpx;
							}
						}
					}
				}
			}
		}
	}
</style>
