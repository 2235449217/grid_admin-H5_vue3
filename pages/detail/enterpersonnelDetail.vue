<template>
	<view class="enter_personnel">
		<cu-custom @search="search()" class="top-bar" isBack="true">
			<block #content>入新人员管理</block>
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
					<text class="idText text" style="margin-left: 56rpx">身份证</text>
					<uni-section class="right" title="身份证号" type="line" padding>
						<uni-easyinput class="idInp" v-model="dataInfo.id_card" placeholder="请输入身份证号"
							style="width: 470rpx"></uni-easyinput>
					</uni-section>
				</view>
				
				<!-- 级联选择器   地址-->
				<view class="container box ">
					<text calss="stausHealth"  style="margin-left: 28rpx">行政区划</text>
					<uni-section title="本地数据" type="line" padding style="height: calc(100vh - 100px)">
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

				<!-- 日期选择器  -->
				<view class="example-body stausInfo box">
					<view class="text" style="margin-left: 28rpx">日期范围</view>
					<view class="right" style="width: 421rpx">
						<uni-datetime-picker v-model="dataInfo.range" type="daterange" @maskClick="maskClick" />
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

			<!-- 表格组件 -->
			<t-table :columns="columns" :tableData="tableData" :loading="table_loading" :moreArray="moreArray"
				:pageValue="pageValue" :isPageShow="isShow"></t-table>
		</view>
	</view>
</template>

<script>
	import tTable from "../../components/common/table.vue";
	import {
		backPersonnel
	} from "@/api/enterpersonnelDetail.js";
	import {
		digitalNum
	} from "./js/digitalNum.js";
	export default {
		components: {
			tTable,
		},
		data() {
			return {
				dataInfo: {
					// 身份证号
					id_card: "",
					// 时间范围
					range: "",
					dept_id: '',
					distributedStatus: ''
				},
				table_loading: true,
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

				columns: [
					{
						name: "name",
						value: "姓名",
						width: 60,
					},
					{
						name: "id_card_num",
						value: "身份证号",
						// width: 90,
					},
					{
						name: "phone",
						value: "手机号码",
						width: 90
					},
					// {
					// 	name: "depart_detail_address",
					// 	value: "出发地",
					// },
					// {
					// 	name: "dest_detail_address",
					// 	value: "目的地",
					// },
					// {
					// 	name: "travel_type",
					// 	value: "返回方式",
					// 	width: 60
					// },
					// {
					// 	name: "record_time",
					// 	value: "返乡时间",
					// 	width: 80,
					// },
					// {
					// 	name: "depart_detail_address",
					// 	value: "行政区划名称"
					// },
					// {
					// 	name: "control_mode",
					// 	value: "管控方式",
					// 	width: 60
					// },
					// {
					// 	name: "create_time",
					// 	value: "数据创建时间",
					// 	width: 140,
					// },
					// {
					// 	name: "dispatch_status",
					// 	value: "派发状态",
					// 	width: 60,
					// },
					// {
					// 	name: "dispatch_time",
					// 	value: "派发时间",
					// 	width: 140,
					// 	type: 'time'
					// },
					// {
					// 	name: "transfer_status",
					// 	value: "转派状态",
					// 	width: 60,
					// },
					// {
					// 	name: "transfer_time",
					// 	value: "转派时间",
					// 	width: 140,
					// 	type: 'time'
					// },
					// {
					// 	name: "transfer_reason",
					// 	value: "转派拒绝原因",
					// 	width: 80
					// },
					// {
					// 	name: "",
					// 	value: "备注",
					// 	width: 60
					// },
					{
						name: "operation",
						value: "操作",
						width: 40,
						type: 'more',
					},
				],
				tableData: [],

				isShow: false,
				moreArray: [{
						name: "查看",
						url: "enterpersonnelCheck",
					},
					{
						name: "转派",
						url: "",
					},
					{
						name: "派发",
						url: "",
					},
					{
						name: "管控方式",
						url: "",
					},
					{
						name: "核酸记录",
						url: "acidRecord",
					},
					{
						name: "删除",
					},
				],
				pageValue: "",
				data: {
					page: 1,
					pageSize: 30,
				},
				map: {
					//组件中的映射属性
					text: "deptName",
					value: "ID",
				},
				// msg: "",
			};
		},
		// 删除后刷新
		onShow() {
			//派发成功后重新刷新页面数据
			uni.$on("enterpersonnelDeliver", (data) => {
				this.tableData = [];
				this.getInfo(data.msg);
			});
			//转派成功后重新刷新页面数据
			uni.$on("backPersonTransfer", (data) => {
				this.tableData = [];
				this.getInfo(data.msg);
			});
			//删除成功后重新刷新页面数据
			uni.$on("backPersonnelDel", (data) => {
				this.tableData = [];
				this.getInfo(data.msg);
			});
			//转派成功后重新刷新页面数据
			uni.$on("backPerFixed", (data) => {
				this.tableData = [];
				this.getInfo(data.msg);
			});
			//管控方式修改成功后重新刷新页面数据
			uni.$on("enterControl", (data) => {
				this.tableData = [];
				this.getInfo(data.msg);
			});
			//监听表格中更多选项
			uni.$on("moreClick", (data) => {
				this.isShow = false;
			});
		},
		//页面隐藏
		onHide: function() {
			uni.hideLoading()
		},
		//页面卸载
		onUnload() {
			uni.hideLoading()
		},
		onLoad(option) {
			this.pageValue = option.value;
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
		methods: {
			//右上角搜索图标
			search() {
				this.isShow = !this.isShow;
				this.dataInfo = {
					idInfo: "",
					address: "",
					healthStatus: "",
					distributedStatus: "",
					controlStatus: "",
					range: "",
					dept_id: '',
				};
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
					idInfo: "",
					address: "",
					healthStatus: "",
					distributedStatus: "",
					controlStatus: "",
					range: "",
					dept_id: '',
				};
				// 数据刷新
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
			//
			getInfo(msg,cb) {
				uni.showLoading({
					title: msg ? msg : "加载中",
				});
				// 时间格式化转换
				if (this.dataInfo.range != "") {
					this.dataInfo.range = this.dataInfo.range.map((item) => {
						return item + "T00:00:00.000Z";
					});
				}
				const dataId = {
					id_card_num: this.dataInfo.id_card,
					time_frame: this.dataInfo.range,
					dispatch_status: this.dataInfo.distributedStatus,  //--=====----
					dept_id: this.dataInfo.dept_id,  //--=====----
					page: this.data.page,
					pageSize: this.data.pageSize,
				};
				backPersonnel(dataId).then((res) => {
					//判断查询时没有数据时处理，return不再进行接口操作
					if(!res.data.BackPersonnel) {
						uni.hideLoading();
						this.table_loading = false;
						return
					}
					for (let item of res.data.BackPersonnel) {
						if (item.record_time.indexOf("T") > -1) {
							//修改日期格式
							item.record_time = item.record_time.split("T")[0];
						}
						if (item.create_time.indexOf("T") > -1) {
							//修改日期格式
							item.create_time = item.create_time.split("T")[0] + item.create_time.split("T")[1]
								.split("+")[0];
						}
						//返回方式
						if (item.travel_type != 1 && item.travel_type != 2 && item.travel_type != 31 && item
							.travel_type != 4) {
							item.travel_type = "-";
						}
						//管控方式
						if (
							item.control_mode != 1 &&
							item.control_mode != 2 &&
							item.control_mode != 3 &&
							item.control_mode != 4 &&
							item.control_mode != 5 &&
							item.control_mode != 6 &&
							item.control_mode != 7 
						) {
							item.control_mode = "-";
						}
					}
					digitalNum(res.data.BackPersonnel);
					this.tableData = [...this.tableData, ...res.data.BackPersonnel];
					uni.hideLoading();
					this.table_loading = false;
					cb && cb()
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.enter_personnel {
		width: 100%;

		// margin: .5rem 1.875rem
		.search {
			width: 40rpx;
			height: 40rpx;
		}
		
		::v-deep .uni-easyinput__content-input {
			padding-left: 10rpx!important;
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
