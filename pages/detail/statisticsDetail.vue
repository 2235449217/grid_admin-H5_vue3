<template>
	<view class="statistics">
		<cu-custom @search="search()" class="top-bar" isBack="true">
			<block #content>数据统计</block>
			<block #right>
				<view @click="search">
					<image class="search" src="/static/asset/search.png" alt="" />
				</view>
			</block>
		</cu-custom>

		<!-- 右上角搜索 -->
		<view class="term" v-show="isShow" :style="{ marginTop: (dingding?-CustomBar:StatusBar?StatusBar:'-5') + 'px' }">
			<!-- 增强选择器  场所名称 -->
			<view class="idSearch box">
				<text class="text" style="margin-left: 28rpx">场所名称</text>
				<uni-section class="right" title="场所名称" type="line" padding>
					<uni-easyinput style="width: 470rpx" v-model="dataInfo.placeName" class="idInp"
						placeholder="请输入场所名称"></uni-easyinput>
				</uni-section>
			</view>
			<!-- 行政区划 -->
			<view class="container box">
				<text class="text" style="margin-left: 28rpx">行政区划</text>
				<uni-section title="本地数据" type="line" padding style="height: calc(100vh - 100px)">
					<grid-cascade-selection class="right" placeholder="请选择行政区划" popup-title="请选择行政区划"
						v-model="dataInfo.dept_id" @change="onchange" @popupopened="onpopupopened"
						@popupclosed="onpopupclosed" style="width: 470rpx;"></grid-cascade-selection>
				</uni-section>
			</view>
			<!-- 日期选择器  -->
			<view class="example-body s box">
				<view class="text" style="margin-left: 28rpx">日期范围</view>
				<view class="right" style="width: 440rpx">
					<uni-datetime-picker class="frame_time" v-model="dataInfo.range" type="daterange"
						@maskClick="maskClick" />
				</view>
			</view>
			<!-- 按钮 -->
			<view class="btnInfo">
				<button class="mini-btn searchBtn" type="primary" size="mini" @click="searchBtn">
					查询
				</button>
				<button class="mini-btn reset" type="default" size="mini" @click="resetBtn">
					重置
				</button>
			</view>
		</view>

		<!-- 统计 -->
		<view class="vital">
			<!-- 健康码统计 -->
			<view class="health_vital box">
				<view class="contain">
					<view class="title">
						<image src="" mode=""></image>
						<text class="tit">健康码统计</text>
					</view>
					<vital-table :vitalData="healthData"></vital-table>
				</view>
			</view>
			<!-- 风险人员统计 -->
			<view class="danager_vital box">
				<view class="contain">
					<view class="title">
						<image src="" mode=""></image>
						<text class="tit">风险人员统计</text>
					</view>
					<vital-table :vitalData="danageData"></vital-table>
				</view>
			</view>
			<!-- 管控措施 -->
			<view class="control_vital box">
				<view class="contain">
					<view class="title">
						<image src="" mode=""></image>
						<text class="tit">管理措施</text>
					</view>
					<vital-table :vitalData="controlData"></vital-table>
				</view>
			</view>
			<!-- 返新人员统计 -->
			<view class="rejuvenate_vital box">
				<view class="contain">
					<view class="title">
						<image src="" mode=""></image>
						<text class="tit">返新人员</text>
					</view>
					<vital-table :vitalData="rejuvenateData"></vital-table>
				</view>
			</view>
			<!-- 场所码统计 -->
			<view class="place_vital box">
				<view class="contain">
					<view class="title">
						<image src="" mode=""></image>
						<text class="tit">场所码</text>
					</view>
					<vital-table :vitalData="placeData"></vital-table>
					<!-- 扫码记录 -->
					<view class="place_record">
						<view class="title">
							<image src="" mode=""></image>
							<text class="tit">场所码扫码记录</text>
						</view>
						<view class="table">
							<view class="tit_table">
								<text class="name">场所名称</text>
								<text class="type">场所类型</text>
								<text class="nums">扫码次数</text>
							</view>
							<view class="info_table">
								<!-- <text class="none" v-if="recordData.length==0">加载中...</text> -->
								<view class="item" v-for="(item, index) in recordData" :key="index">
									<text class="name">{{ item.scene_name }}</text>
									<text class="type" style="color: #8f97a4">{{
		            item.scene_type
		          }}</text>
									<text class="nums" style="color: #02b66a">{{
		            item.scan_count
		          }}</text>
								</view>
							</view>
							<!-- 加载中... -->
							<view class="loading" v-show="isLoading">
								<text>加载中...</text>
							</view>
							<!-- 到底了... -->
							<view class="loading" v-show="isBottom">
								<text>没有更多数据了哦</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import RedDot from "../../mixins/tabbar-badge.js";
	import vitalTable from "../../components/home/vitalTable.vue";
	import {
		getHomeInfo,
		getSceneInfo
	} from "../../api/home.js";
	import {
		getPlaceType
	} from "../../api/sceneCode.js";
	import {
		lists
	} from "@/api/lists";
	export default {
		// mixins: [RedDot],
		components: {
			vitalTable,
		},
		data() {
			return {
				isShow: false,
				data: {
					dept_id: null,
					page: 1,
					pageSize: 20,
				},
				isLoading: false,
				isBottom: false,
				map: {
					//组件中的映射属性
					text: "deptName",
					value: "ID",
				},
				dataInfo: {
					range: "",
					placeName: "",
					dept_id: "",
				},
				healthData: [{
						name: "红黄码",
						nums: "-",
						color: "#FF5B5B",
					},
					{
						name: "超期",
						nums: "-",
						color: "#FF5B5B",
					},
					{
						name: "未派发",
						nums: "-",
						color: "#FFD749",
					},
					{
						name: "已派发",
						nums: "-",
						color: "#02B66A",
					},
					{
						name: "解码比率",
						nums: "-",
						color: "#02B66A",
					},
				],
				danageData: [{
						name: "风险人员",
						nums: "-",
						color: "#FF5B5B",
					},
					{
						name: "赋码人员",
						nums: "-",
						color: "#FF5B5B",
					},
					{
						name: "未派发",
						nums: "-",
						color: "#FFD749",
					},
					{
						name: "已派发",
						nums: "-",
						color: "#02B66A",
					},
					{
						name: "派发比率",
						nums: "-",
						color: "#02B66A",
					},
				],
				controlData: [{
						name: "集中隔离",
						nums: "-",
						color: "#FF5B5B",
					},
					{
						name: "居家隔离",
						nums: "-",
						color: "#FF5B5B",
					},
					{
						name: "居家检测",
						nums: "-",
						color: "#FFD749",
					},
					{
						name: "失控人员",
						nums: "-",
						color: "#FF5B5B",
					},
					{
						name: "解除比率",
						nums: "-",
						color: "#02B66A",
					},
				],
				rejuvenateData: [{
						name: "返新人员",
						nums: "-",
						color: "#FFD749",
					},
					{
						name: "未派发",
						nums: "-",
						color: "#FFD749",
					},
					{
						name: "已派发",
						nums: "-",
						color: "#02B66A",
					},
					{
						name: "派发比率",
						nums: "-",
						color: "#02B66A",
					},
				],
				placeData: [{
						name: "场所码",
						nums: "-",
						color: "#FFD749",
					},
					{
						name: "已扫码",
						nums: "-",
						color: "#02B66A",
					},
					{
						name: "已派发",
						nums: "-",
						color: "#02B66A",
					},
					{
						name: "派发比率",
						nums: "-",
						color: "#02B66A",
					},
				],
				recordData: [],
			}
		},
		created() {
			this.isBottom = false;
			if (uni.getStorageSync("user_id")) {
				this.dataInfo.dept_id = uni.getStorageSync("user_id");
				this.getInfo();
				this.getSceneInfo();
			} else {
				this.isLoading = false;
				this.isBottom = false;
			}
		},
		//上拉加载
		onReachBottom() {
			if (uni.getStorageSync("user_id")) {
				this.data.page++;
				this.getSceneInfo();
				this.isLoading = true;
			} else {
				this.isLoading = false;
				this.isBottom = false;
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			uni.hideLoading()
			this.recordData = [];
			this.reArray();
			this.getInfo(() => {
				uni.stopPullDownRefresh();
			});
			this.getSceneInfo();
		},
		onHide: function() {
			uni.hideLoading()
		},
		methods: {
			//五个数组重新刷新
			reArray() {
				for (let item of this.healthData) {
					item.nums = '-'
				}
				for (let item of this.danageData) {
					item.nums = '-'
				}
				for (let item of this.controlData) {
					item.nums = '-'
				}
				for (let item of this.rejuvenateData) {
					item.nums = '-'
				}
				for (let item of this.placeData) {
					item.nums = '-'
				}
			},
			//搜索图标
			search() {
				this.isShow = !this.isShow;
			},
			//查询按钮
			searchBtn() {
				this.recordData = [];
				this.reArray();
				this.getInfo();
				this.getSceneInfo();
				this.isShow = false;
				// console.log(111,this.dataInfo.range,this.dataInfo.placeName, this.dataInfo.dept_id)
				if (this.dataInfo.range != "" || this.dataInfo.placeName != "") {
					uni
						.createSelectorQuery()
						.select(".vital")
						.boundingClientRect((res) => {
							// console.log(res);
							const scrollH = res.top;
							uni.pageScrollTo({
								duration: 100, // 过渡时间
								scrollTop: scrollH, // 滚动的实际距离
							});
						})
						.exec();
				}
				this.dataInfo.placeName = "";
				this.dataInfo.range = "";
				this.dataInfo.dept_id = "";
			},
			//重置按钮
			resetBtn() {
				this.isShow = false;
				this.isBottom = false;
				this.dataInfo.range = "";
				this.dataInfo.placeName = "";
				this.dataInfo.dept_id = "";
				this.recordData = [];
				this.reArray();
				this.getInfo();
				this.getSceneInfo();
				uni.hideLoading();
			},
			//获取首页信息
			getInfo(cb) {
				uni.showLoading({
					title: '加载中'
				});
				// 时间格式化转换
				if (this.dataInfo.range != "") {
					this.dataInfo.range = this.dataInfo.range.map((item) => {
						return item + "T00:00:00.000Z";
					});
				}
				let data = {
					dept_id: this.dataInfo.dept_id,
					time_frame: this.dataInfo.range,
				};
				//首页展示信息
				getHomeInfo(data).then((res) => {
					for (let [index, item] of this.healthData.entries()) {
						if (item.name?.indexOf("比率") > -1) {
							item.nums = res.data.health_code[index] + "%";
						} else {
							item.nums = res.data.health_code[index];
						}
					}
					for (let [index, item] of this.danageData.entries()) {
						if (item.name?.indexOf("比率") > -1) {
							item.nums = res.data.risk_personnel[index] + "%";
						} else {
							item.nums = res.data.risk_personnel[index];
						}
					}
					for (let [index, item] of this.controlData.entries()) {
						if (item.name?.indexOf("比率") > -1) {
							item.nums = res.data.control_measure[index] + "%";
						} else {
							item.nums = res.data.control_measure[index];
						}
					}
					for (let [index, item] of this.rejuvenateData.entries()) {
						if (item.name?.indexOf("比率") > -1) {
							item.nums = res.data.back_personnel[index] + "%";
						} else {
							item.nums = res.data.back_personnel[index];
						}
					}
					for (let [index, item] of this.placeData.entries()) {
						if (item.name?.indexOf("比率") > -1) {
							item.nums = res.data.scene_code[index] + "%";
						} else {
							item.nums = res.data.scene_code[index];
						}
					}
					uni.hideLoading();
					cb && cb();
				}).catch((err) => {
					uni.hideLoading();
				});
			},
			//场所码扫码记录信息
			getSceneInfo() {
				let data = {
					dept_id: uni.getStorageSync("user_id"),
					page: this.data.page,
					pageSize: this.data.pageSize,
					scene_name: this.dataInfo.placeName,
				};
				getPlaceType().then((r) => {
					// console.log("场所类型",r)
					getSceneInfo(data).then((res) => {
						// console.log("场所记录",res)
						for (let i of res.data.SceneCodeData) {
							for (let [index, j] of r.data.entries()) {
								if (i.scene_type + "" == r.data[index].code) {
									i.scene_type = r.data[index].name;
								}
							}
						}
						this.recordData = [...this.recordData, ...res.data.SceneCodeData];
						//判断数据是否加载完
						if (this.data.page * this.data.pageSize > res.data.count) {
							this.isLoading = false;
							this.isBottom = true;
						}
					});
				});
			},
			//级联组件方法
			onpopupopened() {
				// console.log("点击输入框时触发")
			},
			onnodeclick(e) {
				// console.log("点击每一个节点时触发")
				// this.msg = e.ID;
			},
			onpopupclosed() {
				// console.log("点击关闭时触发")
				// this.dataInfo.dept_id = this.msg;
			},
		}
	}
</script>

<style lang="scss">
	.statistics {
		width: 100%;
		padding: 20rpx 0rpx 0rpx 0rpx;
		// background-color: rgba(249, 249, 249, 1);
		background-color: #F5F8FA;

		.search {
			width: 40rpx;
			height: 40rpx;
		}

		::v-deep .uni-easyinput__content-input {
			padding-left: 10rpx !important;
		}

		::v-deep .uni-input-placeholder {
			font-size: 24rpx;
			color: #bbb;
		}
		::v-deep .uni-date-x {
			background-color: #fff;
			height: 76rpx;
		}
		::v-deep .uni-easyinput__content.is-input-border {
			height: 80rpx;
		}

		.term {
			position: fixed;
			top: 88rpx;
			left: 0rpx;
			// background-color: rgba(249, 249, 249, 1);
			background-color: #fff;
			z-index: 100;
			width: 100%;
			box-shadow: 0rpx -30rpx 16rpx 30rpx #c3c6ce;

			.box {
				width: 100%;
				/* margin: 40rpx 60rpx; */
				margin: 0.5rem 0.875rem;
				margin-left: 50rpx;

				.uni-select {
					wwidth: 470px;
				}

				.text {
					display: inline-block;
				}

				.right {
					display: inline-block;
					margin-left: 40rpx;

					.uni-easyinput {
						width: 400rpx;
					}

					.uni-select__input {
						width: 470rpx;
					}

					.uni-stat__select {
						padding: 0;
					}

				}
			}

			.btnInfo {
				width: 500rpx;
				margin: 0 auto;
				display: flex;
				justify-content: space-between;
				margin-top: 30rpx;
				margin-bottom: 40rpx;
			}
		}

		.vital {
			width: 100%;
			// background-color: #f9f9f9;
			background-color: #F5F8FA;

			.box {
				margin: 32rpx;

				.contain {
					.title {
						width: 100%;
						height: 60rpx;
						margin-bottom: 10rpx;

						image {
							width: 10rpx;
							height: 40rpx;
							vertical-align: middle;
							background-color: #3f86ff;
						}

						.tit {
							margin-left: 10rpx;
							font-size: 30rpx;
							color: #000;
							font-weight: bold;
						}
					}
				}
			}

			.place_vital {
				.contain {
					.place_record {
						margin-top: 20rpx;
						line-height: 63rpx;

						.table {
							border-bottom: 0;
							border-radius: 8rpx;
							overflow: hidden;

							.tit_table {
								height: 60rpx;
								background-color: #dae8ff;
								padding-left: 20rpx;
								font-size: 24rpx;
								color: #8f97a4;

								text {
									display: inline-block;
									width: 190rpx;
								}

								.name {
									width: 280rpx;
								}

								.type {
									text-align: center;
								}

								.nums {
									text-align: center;
								}
							}

							.info_table {
								margin-bottom: 40rpx;

								.item {
									height: 60rpx;
									background-color: #ffffff;
									padding-left: 20rpx;
									font-size: 28rpx;

									text {
										display: inline-block;
										width: 190rpx;
										white-space: nowrap;
										overflow: hidden;
										text-overflow: ellipsis;
										font-size: 28rpx;
									}

									.name {
										width: 280rpx;
									}

									.type {
										text-align: center;
									}

									.nums {
										text-align: center;
									}
								}

								.none {
									display: block;
									text-align: center;
									height: 60rpx;
									line-height: 60rpx;
									background-color: #fff;
									color: #8f97a4;
									font-size: 24rpx;
								}
							}

							.loading {
								width: 100%;

								text {
									display: block;
									height: 40rpx;
									line-height: 40rpx;
									text-align: center;
									color: #b4b4b4;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
