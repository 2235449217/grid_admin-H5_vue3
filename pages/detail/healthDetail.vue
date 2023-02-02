<template>
	<view class="health">
		<cu-custom @search="search()" class="top-bar" isBack="true">
			<block #content>健康码管理</block>
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
							style="width: 470rpx;"></uni-easyinput>
					</uni-section>
				</view>
				<!-- 级联选择器   地址-->
				<view class="container box " style="margin:0 0 0px 39px;">
					<text calss="stausHealth">行政区划</text>
					<uni-section title="本地数据" type="line" padding style="height: calc(100vh - 100px)">
						<grid-cascade-selection class="right" placeholder="请选择行政区划" popup-title="请选择行政区划"
							v-model="dataInfo.dept_id" @change="onchange" @popupopened="onpopupopened"
							@popupclosed="onpopupclosed" style="width: 470rpx;"></grid-cascade-selection>
					</uni-section>
				</view>
				
				<!-- 健康码状态 -->
				<view class="stausInfo box">
					<text calss="stausHealth text">健康码状态</text>
					<uni-section class="stausOption right" title="本地数据" type="line">
						<uni-data-select v-model="dataInfo.healthStatus" placeholder="请输入健康码状态" :localdata="health"
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
				<!-- 管控方式 -->
				<view class="stausInfo box">
					<text calss="stausHealth text" style="margin-left: 28rpx">管控方式</text>
					<uni-section class="stausOption right" title="本地数据" type="line">
						<uni-data-select v-model="dataInfo.controlStatus" class="stausOption" placeholder="请输入管控方式"
							:localdata="control" @change="change">
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
			<t-table class="table" :columns="columns" :tableData="tableData" :loading="table_loading"
				:moreArray="moreArray" :pageValue="pageValue" :isPageShow="isShow"></t-table>
		</view>
	</view>
</template>

<script>
	import tTable from "../../components/common/table.vue";
	import {
		getHealthList
	} from "../../api/healthCode.js";
	import {
		digitalNum
	} from "./js/digitalNum.js";
	import {
		lists
	} from "@/api/lists";
	import {
		getControlList,
	} from "@/api/control.js";


	export default {
		components: {
			tTable,
		},
		data() {
			return {
				isShow: false,
				msg: "",
				dataInfo: {
					id_card: "", // 身份证号
					dept_id: "", // 详细地址
					healthStatus: "", //健康码状态
					distributedStatus: "", //派发状态
					controlStatus: "", //管控状态
					range: "", // 时间范围
				},
				table_loading: true,
				// 详细地址
				// dataTree: [],
				//健康码状态
				health: [{
						value: 1,
						text: "绿码",
					},
					{
						value: 2,
						text: "黄码",
					},
					{
						value: 3,
						text: "红码",
					},
					// {
					// 	value: 4,
					// 	text: "灰码",
					// },
				],
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
				//管控状态
				control: [
					// {
					// 	value: 1,
					// 	text: "集中隔离",
					// },
					// {
					// 	value: 2,
					// 	text: "居家隔离",
					// },
					// {
					// 	value: 3,
					// 	text: "居家健康检测",
					// },
					// {
					// 	value: 4,
					// 	text: "失控状态",
					// },
					// {
					// 	value: 5,
					// 	text: "解除管控",
					// },
				],
				//更多选项
				moreArray: [{
						name: "查看",
						url: "healthCheck",
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
						name: "入豫记录",
						url: "intoDetail",
					},
					{
						name: "扫码记录",
						url: "scanRecord",
					},
					{
						name: "删除",
					},
				],
				type: "bottom",
				columns: [
					{
						name: "name",
						value: "姓名",
						width: 60
					},
					{
						name: "certificate_num",
						value: "身份证号",
						// width: 90
					},
					{
						name: "phone",
						value: "手机号码",
						width: 90
					},
					// {
					// 	name: "dept_name",
					// 	value: "行政区划名称"
					// },
					// {
					// 	name: "code_color",
					// 	value: "健康码状态",
					// 	width: 40,
					// 	type: 'tag'
					// },
					// {
					// 	name: "give_code_reason",
					// 	value: "赋码原因",
					// 	width: 160
					// },
					// {
					// 	name: "give_code_time",
					// 	value: "赋码时间",
					// 	width: 140
					// },
					// {
					// 	name: "control_mode",
					// 	value: "管控方式",
					// 	width: 60
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
					// 	width: 60
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
				pageValue: null, //代表管理页面value
				isRequest: true, //是否请求数据
				map: {
					//组件中的映射属性
					text: "deptName",
					value: "ID",
				},
				data: {
					page: 1,
					pageSize: 30,
				},
			};
		},
		onLoad(option) {
			this.pageValue = option.value;
		},
		onShow() {
			//派发成功后重新刷新页面数据
			uni.$on("healthDeliver", (data) => {
				this.tableData = [];
				this.getInfo(data.msg);
			});
			//转派成功后重新刷新页面数据
			uni.$on("healthTransfer", (data) => {
				this.tableData = [];
				this.getInfo(data.msg);
			});
			//转派处理成功后重新刷新页面数据
			uni.$on("healthFixed", (data) => {
				this.tableData = [];
				this.getInfo(data.msg);
			});
			//删除成功后重新刷新页面数据
			uni.$on("healthDel", (data) => {
				this.tableData = [];
				this.getInfo(data.msg);
			});
			//管控方式修改成功后重新刷新页面数据
			uni.$on("healthControl", (data) => {
				this.tableData = [];
				this.getInfo(data.msg);
			});
			//监听表格中更多选项
			uni.$on("moreClick", (data) => {
				this.isShow = false;
			});
		},
		mounted() {
			this.getControlListInfo()
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
			if (this.isRequest) {
				this.getInfo();
			}
		},
		//页面隐藏
		onHide: function() {
			uni.hideLoading()
		},
		//页面卸载
		onUnload() {
			uni.hideLoading()
		},
		methods: {
			//右上角搜索图标
			search() {
				this.isShow = !this.isShow;
				this.dataInfo = {
					id_card: "", // 身份证号
					dept_id: "", // 详细地址
					healthStatus: "", //健康码状态
					distributedStatus: "", ////派发状态
					controlStatus: "", //管控状态
					range: "", // 时间范围
				};
			},

			// 获取全部部门列表地址
			// getInfoList() {
			// 	let data = {
			// 		page: 1,
			// 		pageSize: 10,
			// 	};
			// 	lists(data).then((res) => {
			// 		// console.log("全部部门列表", res.data);
			// 		this.dataTree = res.data.list.children;
			// 	});
			// },
			
			//管控方式列表
			getControlListInfo() {
				getControlList({
					section_type: 1
				}).then(res => {
					// console.log("管控方式列表",res)
					for (let item of res.data) {
						this.control.push({
							value: item.value,
							text: item.label,
						})
					}
				})
			},

			//获取默认健康码管理列表
			getInfo(msg,cb) {
				uni.showLoading({
					title: msg ? msg : '加载中',
				});
				this.isRequest = false;
				let data = {
					page: this.data.page,
					pageSize: this.data.pageSize,
					id_card: this.dataInfo.id_card,
					code_color: this.dataInfo.healthStatus,
					control_mode: this.dataInfo.controlStatus,
					dept_id: this.dataInfo.dept_id,
					dispatch_status: this.dataInfo.distributedStatus,
					time_frame: this.dataInfo.range,
				};
				getHealthList(data).then((res) => {
					console.log(1111111,res.data)
					this.isRequest = true;
					//判断查询时没有数据时处理，return不再进行接口操作
					if(!res.data.HealthCode) {
						uni.hideLoading();
						this.table_loading = false;
						return
					}
					for (let item of res.data.HealthCode) {
						if (item.give_code_time.indexOf("T") > -1) {
							//修改日期格式
							item.give_code_time = item.give_code_time.split("T")[0] + " " + item.give_code_time
								.split("T")[1].split("+")[0];
						}

						//转派状态
						if (
							item.transfer_status != 1 &&
							item.transfer_status != 2 &&
							item.transfer_status != 3 &&
							item.transfer_status != 4
						) {
							item.transfer_status = "-";
						}
						//派发状态
						if (item.dispatch_status != 1 && item.dispatch_status != 2) {
							item.dispatch_status = "-";
						}
						//管控方式
						if (
							item.control_mode != 1 &&
							item.control_mode != 2 &&
							item.control_mode != 3 &&
							item.control_mode != 4 &&
							item.control_mode != 5 &&
							item.control_mode != 6 &&
							item.control_mode != 7 &&
							item.control_mode != 8
						) {
							item.control_mode = "-";
						}
					}

					digitalNum(res.data.HealthCode);
					this.tableData = [...this.tableData, ...res.data.HealthCode];
					setTimeout(() => {
						uni.hideLoading();
					},1000)
					this.table_loading = false;
					//下拉刷新功能关闭
					cb && cb()
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
					id_card: "", // 身份证号
					dept_id: "", // 详细地址
					healthStatus: "", //健康码状态
					distributedStatus: "", ////派发状态
					controlStatus: "", //管控状态
					range: "", // 时间范围
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
	.health {
		width: 100%;
		
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
		.search {
			width: 40rpx;
			height: 40rpx;
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
