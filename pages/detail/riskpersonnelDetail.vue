<template>
	<view class="risk_personnel">
		<cu-custom @search="search()" class="top-bar" isBack="true">
			<block #content>风险人员</block>
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
					<text calss="stausHealth"  style="margin-left: 28rpx;">行政区划</text>
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
			<t-table class="table" :columns="columns" :loading="table_loading" :tableData="tableData"
				:moreArray="moreArray" :pageValue="pageValue" :isPageShow="isShow"></t-table>
		</view>
	</view>
</template>

<script>
	import tTable from "../../components/common/table.vue"
	import {
		getRiskPerson
	} from "../../api/riskpersonnelDetail.js"
	import {
		digitalNum
	} from "./js/digitalNum.js"
	export default {
		components: {
			tTable
		},
		data() {
			return {
				isShow: false,
				page: 1,
				pageSize: 30,
				pageTotal: 40,
				isRequest: false,
				pageValue: null,
				table_loading: true,
				dataInfo: {
					// 身份证号
					idInfo: "",
					// 详细地址
					address: "",
					//健康码状态
					healthStatus: "",
					//派发状态
					distributedStatus: "",
					//管控状态
					controlStatus: "",
					range: '',
					dept_id: ''
				},
				// 详细地址
				// dataTree: [],
				//健康码状态
				health: [{
						value: 1,
						text: "绿码"
					},
					{
						value: 2,
						text: "黄码"
					},
					{
						value: 3,
						text: "红码"
					},
					// {
					// 	value: 4,
					// 	text: "灰码"
					// }
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
				columns: [{
						name: 'name',
						value: '姓名',
						width: 60
					},
					{
						name: 'id_card_num',
						value: '身份证号',
						// width: 90
					},
					{
						name: 'phone',
						value: '手机号码',
						width: 90
					},
					// {
					// 	name: 'origin_place',
					// 	value: '出发地'
					// },
					// {
					// 	name: 'destination_place',
					// 	value: '目的地'
					// },
					// {
					// 	name: 'departure_time',
					// 	value: '出发时间'
					// },
					// {
					// 	name: "dept_name",
					// 	value: "行政区划名称",
					// },
					// {
					// 	name: 'is_risk_area',
					// 	value: '是否为中高风险地区'
					// },
					// {
					// 	name: 'code_color',
					// 	value: '健康码状态',
					// 	width: 40,
					// 	type: 'tag'
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
					{
						name: "operation",
						value: "操作",
						width: 40,
						type: 'more',
					},
				],
				tableData: [],

				moreArray: [{
						name: '查看',
						url: 'riskpersonnelCheck'
					},
					{
						name: '转派',
						url: '',
					},
					{
						name: '派发',
						url: '',
					},
					{
						name: '核酸记录',
						url: 'acidRecord'
					},
					{
						name: '删除',
					}
				],
				pageValue: null,
				map: {
					//组件中的映射属性
					text: "deptName",
					value: "ID",
				},
				msg: "",
			}
		},
		onLoad(option) {
			this.pageValue = option.value
		},
		created() {
			this.getRiskPersonList()
		},
		onShow() {
			//派发成功后重新刷新页面数据
			uni.$on('riskplaceDeliver', data => {
				this.tableData = [];
				this.getRiskPersonList(data.msg)
			})
			//转派成功后重新刷新页面数据
			uni.$on('riskPersonTransfer', data => {
				this.tableData = [];
				this.getRiskPersonList(data.msg)
			})
			//删除成功后重新刷新页面数据
			uni.$on('riskPersonnelDel', data => {
				this.tableData = [];
				this.getRiskPersonList(data.msg)
			})
			//转派成功后重新刷新页面数据
			uni.$on('riskPerFixed', data => {
				this.tableData = [];
				this.getRiskPersonList(data.msg)
			})
			//监听表格中更多选项
			uni.$on('moreClick', data => {
				this.isShow = false
			})
		},
		//页面隐藏
		onHide: function() {
			uni.hideLoading()
		},
		//页面卸载
		onUnload() {
			uni.hideLoading()
		},
		// 下拉刷新
		onPullDownRefresh() {
			// 第一初始化所有需要的
			this.page = 1;
			this.pageSize = 30;
			this.pageTotal = 40;
			this.isRequest = false;
			this.tableData = [];
			// 第二步重新请求
			this.getRiskPersonList(null,() =>{
				uni.stopPullDownRefresh();
			})
		},
		// 上拉加载
		onReachBottom() {
			if (!this.isRequest) {
				this.page++;
				this.getRiskPersonList()
			}

		},
		methods: {
			search() {
				this.isShow = !this.isShow
				this.dataInfo = {
					idInfo: "",
					address: "",
					healthStatus: "",
					distributedStatus: "",
					controlStatus: "",
					range: '',
					dept_id: ''
				};
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
			//查询操作
			searchBtn() {
				this.isShow = false;
				// 通过条件去查询首先清零上一个默认更改过后的数据
				this.isRequest = false;
				this.tableData = [];
				this.getRiskPersonList()
			},
			// 请求风险人员函数
			getRiskPersonList(msg,cb) {
				// 提示
				uni.showLoading({
					title: msg ? msg : '加载中'
				});
				this.isRequest = true;
				getRiskPerson({
					page: this.page,
					pageSize: this.pageSize,
					id_card: this.dataInfo.idInfo,
					code_color: this.dataInfo.healthStatus,
					time_frame: this.dataInfo.range,
					dept_id: this.dataInfo.dept_id,  //--==-----
					dispatch_status: this.dataInfo.distributedStatus, //--==-----
				}).then((res) => {
					//判断请求的接口中是否有数据，没数据的话及时进行处理
					if(!res.data.RiskList) {
						uni.hideLoading();
						this.table_loading = false;
						return
					}
					
					for (let item of res.data.RiskList) {
						if (item.departure_time.indexOf("T") > -1) {
							//修改日期格式
							item.departure_time =
								item.departure_time.split("T")[0]
						}
						//健康码状态
						if (item.code_color != 1 && item.code_color != 2 && item.code_color != 3 && item
							.code_color != 4) {
							item.code_color = "未知"
						}
						//转派状态
						if (item.transfer_status != 1 && item.transfer_status != 2) {
							item.transfer_status = "-"
						}
						//派发状态
						if (item.dispatch_status != 1 && item.dispatch_status != 2) {
							item.dispatch_status = "-"
						}
						//管控方式
						if (item.control_mode != 1 && item.control_mode != 2 && item.control_mode != 3 && item
							.control_mode != 4 && item.control_mode != 5) {
							item.control_mode = "-"
						}
					}
					// 请求成功开始拼接
					digitalNum(res.data.RiskList);
					this.tableData = [...this.tableData, ...res.data.RiskList];
					this.isRequest = false;
					uni.hideLoading();
					this.table_loading = false;
					cb && cb()
				})
			},
			// 重置按钮方法
			resetBtn() {
				this.isShow = false;
				this.dataInfo = {
					idInfo: "",
					address: "",
					healthStatus: "",
					distributedStatus: "",
					controlStatus: "",
					range: '',
					dept_id: ''
				};
				this.page = 1;
				this.pageSize = 10;
				this.pageTotal = 40;
				this.isRequest = false;
				this.tableData = [];
				this.getRiskPersonList()
			},
		}
	}
</script>

<style lang="scss" scoped>
	.risk_personnel {
		width: 100%;

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
