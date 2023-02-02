<template>
	<view class="key_place">
		<cu-custom @search="search()" class="top-bar" isBack="true">
			<block #content>重点场所管理</block>
			<block #right>
				<view @click="search">
					<image class="search" src="/static/asset/search.png" alt="" />
				</view>
			</block>
		</cu-custom>

		<view class="contain">
			<view class="term" v-show="isShow" :style="{ marginTop: (dingding?-CustomBar:StatusBar?StatusBar:'-5') + 'px' }">
				<!-- 增强选择器  身份证号码 -->
				<view class="idSearch box">
					<text class="text" style="margin-left: 28rpx;">场所名称</text>
					<uni-section class="right" title="场所名称" type="line" padding>
						<uni-easyinput style="width: 470rpx;" v-model="dataInfo.sceneName" class="idInp"
							placeholder="请输入场所名称"></uni-easyinput>
					</uni-section>
				</view>
				<!--  -->
				<view class="container  box">
					<text class="text" style="margin-left: 28rpx;">行政区划</text>
					<uni-section title="本地数据" type="line" padding style="height: calc(100vh - 100px);">
						<grid-cascade-selection class="right" placeholder="请选择行政区划" popup-title="请选择行政区划"
							v-model="dataInfo.dept_id" @change="onchange" @popupopened="onpopupopened"
							@popupclosed="onpopupclosed" style="width: 470rpx;"></grid-cascade-selection>
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

			<!-- 表格组件 -->
			<t-table class="table" :columns="columns" :loading="table_loading" :tableData="tableData"
				:moreArray="moreArray" :pageValue="pageValue" :isPageShow="isShow"></t-table>
		</view>
	</view>
</template>

<script>
	import tTable from "../../components/common/table.vue";
	import {
		getKeyPlaceList
	} from "../../api/keyplaceDetail.js";
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
				pageValue: null,
				page: 1,
				pageTotal: 0,
				pageSize: 30,
				isRequest: false, //节流阀
				table_loading: true,
				dataInfo: {
					// 场所名称
					sceneName: "",
					// 详细地址
					dept_id: "",
					//健康码状态
					healthStatus: "",
					//派发状态
					distributedStatus: "",
				},
				// 详细地址
				// dataTree: [],
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
				//健康码状态
				health: [{
						value: 0,
						text: "绿码",
					},
					{
						value: 1,
						text: "黄码",
					},
					{
						value: 2,
						text: "红码",
					},
				],
				type: "bottom",
				columns: [{
						name: "scene_name",
						value: "场所名称",
						width: 80
					},
					// {
					// 	name: "scene_id",
					// 	value: "场所编号",
					// 	width: 60
					// },
					{
						name: "site_manager",
						value: "场所负责人",
						width: 60
					},
					{
						name: "manager_phone",
						value: "负责人手机号",
						width: 90
					},
					// {
					// 	name: "dept_name",
					// 	value: "行政区划名称",
					// },
					// {
					// 	name: "dispatch_status",
					// 	value: "派发状态",
					// 	width: 60
					// },
					// {
					// 	name: "dispatch_time",
					// 	value: "派发时间",
					// 	width: 140,
					// 	type: 'time'
					// },
					{
						name: "operation",
						value: "操作",
						width: 40,
						type: 'more',
					},
				],
				tableData: [],
				moreArray: [{
						name: "查看",
						url: "keyplaceCheck",
					},
					{
						name: "派发",
						url: "",
					},
					// {
					//   name: '扫码记录',
					//   url: 'scanRecord'
					// }
				],
				map: {
					//组件中的映射属性
					text: "deptName",
					value: "ID",
				},
				msg: "",
			};
		},
		onShow() {
			//派发成功后重新刷新页面数据
			uni.$on("keyplaceDeliver", (data) => {
				this.tableData = [];
				this.getListData(data.msg);
			});
			//启用停用成功后重新刷新页面数据
			uni.$on("updataEnabling", (data) => {
				this.tableData = [];
				this.getListData(data.msg);
			});
			//监听表格中更多选项
			uni.$on("moreClick", (data) => {
				this.isShow = false;
			});
		},
		created() {
			this.getListData();
		},
		//页面隐藏
		onHide: function() {
			uni.hideLoading()
		},
		//页面卸载
		onUnload() {
			uni.hideLoading()
		},
		onLoad(options) {
			this.pageValue = options.value;
		},
		// 下拉刷新
		onPullDownRefresh() {
			// 第一是清空数据
			this.page = 1;
			this.pageSize = 10;
			this.pageTotal = 0;
			this.isRequest = false;
			this.tableData = [];
			this.getListData();
			// 第二步重新调用并手动传一个回调关闭刷新
			this.getListData(null,() => {
				uni.stopPullDownRefresh();
			});
		},
		// 上拉加载
		onReachBottom() {
			// console.log("我触底了");
			if (!this.isRequest) {
				this.page++;
				this.getListData();
			}
		},
		methods: {
			search() {
				this.isShow = !this.isShow;
				this.dataInfo = {
					idInfo: "",
					dept_id: "",
					healthStatus: "",
					distributedStatus: "",
					controlStatus: "",
				};
			},
			//查询操作
			searchBtn() {
				this.isShow = false;
				// 通过条件去查询首先清零上一个默认更改过后的数据
				this.isRequest = false;
				this.tableData = [];
				this.getListData();
			},
			// 请求数据的函数
			getListData(msg,cb) {
				// console.log("全部部门列表", this.dataTree);
				// console.log("级联数据",this.dataInfo.dept_id);
				uni.showLoading({
					title: msg ? msg : '加载中'
				});
				this.isRequest = true;
				const placeObj = {
					page: this.page,
					pageSize: this.pageSize,
					dept_id: this.dataInfo.dept_id,
					scene_name: this.dataInfo.sceneName,
					dispatch_status: this.dataInfo.distributedStatus,
				};
				// 开始调用接口函数
				getKeyPlaceList(placeObj).then((res) => {
					console.log(res.data)
					//判断请求的接口中是否有数据，没数据的话及时进行处理
					if(!res.data.KeyPlace) {
						uni.hideLoading();
						this.table_loading = false;
						return
					}
					// 这个地方我们必须得到总数来判断。。
					digitalNum(res.data.KeyPlace);
					this.pageTotal = res.data.count;
					this.tableData = [...this.tableData, ...res.data.KeyPlace];
					this.isRequest = false;
					uni.hideLoading();
					this.table_loading = false;
					cb && cb();
				});
			},

			// 重置按钮方法
			resetBtn() {
				this.isShow = false;
				this.dataInfo = {
					idInfo: "",
					dept_id: "",
					healthStatus: "",
					distributedStatus: "",
					controlStatus: "",
				};
				// 通过条件去查询首先清零上一个默认更改过后的数据
				this.page = 1;
				this.pageSize = 20;
				this.pageTotal = 0;
				this.isRequest = false;
				this.tableData = [];
				// console.log("重点场所的名称", this.dataInfo.sceneName);
				this.getListData();
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
	.key_place {
		width: 100%;

		.search {
			width: 40rpx;
			height: 40rpx;
		}
		
		::v-deep .uni-easyinput__content-input {
			padding-left: 10rpx!important;
		}

		.contain {
			.term {
				position: fixed;
				top: 88rpx;
				left: 0rpx;
				background-color: rgba(249, 249, 249, 1);
				background-color: #fff;
				z-index: 100;
				width: 100%;
				box-shadow: 0rpx -30rpx 16rpx 30rpx #c3c6ce;

				.box {
					width: 100%;
					// margin: 40rpx 60rpx;
					margin: 0.5rem 0.875rem;

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
						
						::v-deep .uni-input-placeholder {
							font-size: 24rpx;
							color: #bbb;
						}
					}
				}
			}

			.btnInfo {
				display: flex;
				justify-content: space-between;
				margin: 40rpx;

				.searchBtn {
					background-color: #409eff;
					color: #ffffff;
				}

				.reset {
					color: #606266;
				}
			}
		}
	}
</style>
