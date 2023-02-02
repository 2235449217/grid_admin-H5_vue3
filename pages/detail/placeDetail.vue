<template>
	<view class="place">
		<cu-custom @search="search()" class="top-bar" isBack="true">
			<block #content>场所码管理</block>
			<block #right>
				<view @click="search">
					<image class="search" src="/static/asset/search.png" alt="" />
				</view>
			</block>
		</cu-custom>

		<view class="contain">
			<view class="term" v-show="isShow" :style="{ marginTop: (dingding?-CustomBar:StatusBar?StatusBar:'-5') + 'px' }">

				<!-- 级联选择器   地址-->
				<view class="container box ">
					<text calss="stausHealth"  style="margin-left: 28rpx">行政区划</text>
					<uni-section title="本地数据" type="line" padding style="height: calc(100vh - 100px)">
						<grid-cascade-selection class="right" placeholder="请选择行政区划" popup-title="请选择行政区划"
							v-model="dataInfo.dept_id" @change="onchange" @popupopened="onpopupopened"
							@popupclosed="onpopupclosed" style="width: 470rpx;"></grid-cascade-selection>
					</uni-section>
				</view>


				<!-- 场所类型下拉框 -->
				<view class="stausInfo box">
					<text calss="stausHealth text" style="margin-left: 28rpx">场所类型</text>
					<uni-section class="stausOption right" title="本地数据" type="line">
						<!-- 	<uni-data-select v-model="dataInfo.placeStatus" class="stausOption" placeholder="请输入场所类型"
							:localdata="distribute" @change="change">
						</uni-data-select> -->
						<uni-data-select v-model="dataInfo.placeStatus" placeholder="请输入场所类型" :localdata="placeType"
							@change="change">
						</uni-data-select>
					</uni-section>
				</view>
				<!-- 派发状态 -->
				<view class="stausInfo box">
					<text calss="stausHealth text" style="margin-left: 28rpx">派发状态</text>
					<uni-section class="stausOption right" title="本地数据" type="line">
						<uni-data-select v-model="dataInfo.distributedStatus" class="stausOption" placeholder="请输入派发状态"
							:localdata="distribute" @change="change">
						</uni-data-select>
					</uni-section>
				</view>

				<!-- 日期选择器  -->
				<view class="example-body stausInfo box">
					<view class="text" style="margin-left: 28rpx">日期范围</view>
					<view class="right" style="width: 421rpx">
						<uni-datetime-picker v-model="dataInfo.range" type="daterange" @maskClick="maskClick" />
					</view>
				</view>
				<!-- 按钮 -->
				<view class="btnInfo">
					<button class="mini-btn searchBtn" type="primary" size="mini" @more="moreBtn" @click="searchBtn">
						查询
					</button>
					<button class="mini-btn reset" type="default" size="mini" @click="resetBtn">
						重置
					</button>
				</view>
			</view>

			<!-- 表格组件 -->
			<t-table class="table" :columns="columns" :loading="table_loading" :tableData="tableData"
				:moreArray="moreArray" :pageValue="pageValue" :isPageShow="isShow"></t-table>
		</view>
	</view>
</template>

<script>
	import tTable from "../../components/common/table.vue";
	import {
		getPlaceList,
		getPlaceType
	} from "../../api/sceneCode.js";
	import {
		digitalNum
	} from "./js/digitalNum.js";
	import {
		lists
	} from "@/api/lists";

	export default {
		components: {
			tTable,
		},
		data() {
			return {
				isShow: false,
				dataInfo: {
					dept_id: "", // 详细地址
					placeStatus: "", //场所类型状态
					distributedStatus: "", //派发状态
					range: "",
				},
				table_loading: true,
				// 详细地址
				// dataTree: [],
				//场所类型
				placeType: [],
				//派发状态
				distribute: [{
						value: 1,
						text: "未派发",
					},
					{
						value: 2,
						text: "已派发",
					},
				],

				moreArray: [{
						name: "查看",
						url: "placeCheck",
					},
					{
						name: "派发",
						url: "",
						show: false,
					},
					{
						name: "扫码记录",
						url: "scanRecord",
					},
					{
						name: "启用",
					},
				],

				columns: [
					// {
					// 	name: "scene_code",
					// 	value: "场所码编号",
					// 	width: 120,
					// },
					{
						name: "scene_name",
						value: "场所码名称",
						width: 80
					},
					{
						name: "site_manager",
						value: "申请人姓名",
						width: 60,
					},
					// {
					// 	name: "manager_phone",
					// 	value: "手机号码"
					// },
					// {
					// 	name: "scene_type",
					// 	value: "场所类型"
					// },
					// {
					// 	name: "dept_name",
					// 	value: "行政区划名称",
					// },
					{
						name: "dispatch_status",
						value: "派发状态",
						width: 50,
					},
					// {
					// 	name: "dispatch_time",
					// 	value: "派发时间",
					// 	width: 140,
					// 	type: "time",
					// },
					// {
					// 	name: "enabling_status",
					// 	value: "场所码状态",
					// 	width: 40,
					// },
					{
						name: "operation",
						value: "操作",
						width: 40,
						type: 'more',
					},
				],

				tableData: [],
				pageValue: null,
				data: {
					page: 1,
					pageSize: 30,
				},
				map: {
					//组件中的映射属性
					text: "deptName",
					value: "ID",
				},
				msg: "",
			};
		},
		onLoad(option) {
			this.pageValue = option.value;
		},
		onShow() {
			//派发成功后重新刷新页面数据
			uni.$on("placeDeliver", (data) => {
				this.tableData = [];
				this.getInfo(data.msg);
			});
			//启用停用成功后重新刷新页面数据
			uni.$on("updataEnabling", (data) => {
				this.tableData = [];
				this.getInfo(data.msg);
			});
			//监听表格中更多选项
			uni.$on("moreClick", (data) => {
				this.isShow = false;
			});
			if(!this.tableData) {
				this.placeType = []
			}
		},
		mounted() {
			this.getInfo();
		},
		//下拉刷新
		onPullDownRefresh() {
			this.tableData = [];
			this.getInfo(null,() => {
				uni.stopPullDownRefresh();
			});
		},
		//上拉加载(触底函数)
		onReachBottom() {
			this.data.page++;
			this.getInfo();
		},
		//页面隐藏
		onHide: function() {
			uni.hideLoading();
		},
		//页面卸载
		onUnload() {
			uni.hideLoading();
		},
		methods: {
			//搜索图标
			search() {
				this.isShow = !this.isShow;
				this.dataInfo = {
					dept_id: "",
					placeStatus: "",
					distributedStatus: "",
				};
			},

			//获取默认场所码管理列表
			getInfo(msg,cb) {
				uni.showLoading({
					title: msg ? msg : "加载中",
				});
				let data = {
					page: this.data.page,
					pageSize: this.data.pageSize,
					dept_id: this.dataInfo.dept_id,
					scene_type: this.dataInfo.placeStatus,
					dispatch_status: this.dataInfo.distributedStatus,
					time_frame: this.dataInfo.range,
				};
				//获取所有场所类型
				this.placeType = []
				getPlaceType().then((r) => {
					for (let i = 0; i < 73; i++) {
						this.placeType.push({
							value: "",
							text: "",
						});
					}
					for (let [i, item] of r.data.entries()) {
						this.placeType[i].value = r.data[i].code;
						this.placeType[i].text = r.data[i].name;
					}
					//获取页面列表数据
					getPlaceList(data).then((res) => {
						//判断请求的接口中是否有数据，没数据的话及时进行处理
						if(!res.data.SceneCode) {
							uni.hideLoading();
							this.table_loading = false;
							return
						}
						for (let i of res.data.SceneCode) {
							for (let [index, j] of r.data.entries()) {
								if (i.scene_type + "" == r.data[index].code) {
									i.scene_type = r.data[index].name;
								}
							}
							//日期格式
							if (i.dispatch_time.indexOf("T") > -1) {
								//修改日期格式
								i.dispatch_time =
									i.dispatch_time.split("T")[0] +
									" " +
									i.dispatch_time.split("T")[1].split("Z")[0];
							}
							//派发状态
							if (i.dispatch_status != 1 && i.dispatch_status != 2) {
								i.dispatch_status = "-";
							}
							//是否启用
							if (i.enabling_status != 1 && i.enabling_status != 2) {
								i.enabling_status = "-";
							}
						}
						digitalNum(res.data.SceneCode);
						this.tableData = [...this.tableData, ...res.data.SceneCode];
						
						uni.hideLoading();
						this.table_loading = false;
						//下拉刷新功能关闭
						cb && cb(); 
					});
				});
			},

			//查询操作
			searchBtn() {
				this.isShow = false;
				this.tableData = [];
				this.getInfo();
			},

			// 重置按钮方法
			resetBtn() {
				this.dataInfo = {
					dept_id: "",
					placeStatus: "",
					distributedStatus: "",
				};
				this.tableData = [];
				this.getInfo();
				this.isShow = false;
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
		},
	};
</script>

<style lang="scss" scoped>
	.place {
		width: 100%;


		// margin: .5rem 1.875rem
		.search {
			width: 40rpx;
			height: 40rpx;
		}
		::v-deep .uni-input-placeholder {
			font-size: 24rpx;
			color: #bbb;
		}
		::v-deep .uni-date-x {
			background-color: #fff;
		}

		.contain {
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
					// margin: 40rpx 60rpx;
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
							width: 400rpx;
						}

						.uni-stat__select {
							padding: 0;
						}
					}
				}
			}

			.btnInfo {
				display: flex;
				justify-content: space-between;
				margin: 40rpx;

				.searchBtn {
					// background-color: #409eff;
					// color: #ffffff;
				}

				.reset {
					// color: #606266;
				}
			}
		}
	}
</style>
