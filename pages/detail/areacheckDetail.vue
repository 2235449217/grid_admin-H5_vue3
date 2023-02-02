<template>
	<view class="area_check">
		<cu-custom @search="search()" class="top-bar" isBack="true">
			<block #content>区域协查</block>
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
					<text class="idText text" style="margin-left: 84rpx">姓名</text>
					<uni-section class="right" title="姓名" type="line" padding>
						<uni-easyinput class="idInp" v-model="searchCriteria.name" placeholder="请输入姓名"
							style="width: 470rpx">
						</uni-easyinput>
					</uni-section>
				</view>
				<!-- 增强选择器  手机号 -->
				<view class="idSearch box">
					<text class="idText text" style="margin-left: 56rpx">手机号</text>
					<uni-section class="right" title="手机号" type="line" padding>
						<uni-easyinput class="idInp" v-model="searchCriteria.phone" placeholder="请输入手机号"
							style="width: 470rpx"></uni-easyinput>
					</uni-section>
				</view>
				<!-- 增强选择器 批次号 -->
				<view class="idSearch box">
					<text class="idText text" style="margin-left: 56rpx">批次号</text>
					<uni-section class="right" title="批次号" type="line" padding>
						<uni-easyinput class="idInp" v-model="searchCriteria.batch_num" placeholder="请输入批次号"
							style="width: 470rpx">
						</uni-easyinput>
					</uni-section>
				</view>
				<!-- 增强选择器  身份证号码 -->
				<view class="idSearch box">
					<text class="idText" style="margin-left: 28rpx">证件号码</text>
					<uni-section class="right" title="身份证号" type="line" padding>
						<uni-easyinput class="idInp" v-model="searchCriteria.id_card_num" placeholder="请输入证件号码"
							style="width: 470rpx">
						</uni-easyinput>
					</uni-section>
				</view>
				
				<!-- 级联选择器   地址-->
				<view class="container box ">
					<text calss="stausHealth"  style="margin-left: 28rpx">行政区划</text>
					<uni-section title="本地数据" type="line" padding style="height: calc(100vh - 100px)">
						<grid-cascade-selection class="right" placeholder="请选择行政区划" popup-title="请选择行政区划"
							v-model="searchCriteria.dept_id" @change="onchange" @popupopened="onpopupopened"
							@popupclosed="onpopupclosed" style="width: 470rpx;"></grid-cascade-selection>
					</uni-section>
				</view>
				
				<!-- 派发状态 -->
				<view class="stausInfo box">
					<text calss="stausHealth text" style="margin-left: 28rpx">派发状态</text>
					<uni-section class="stausOption right" title="本地数据" type="line">
						<uni-data-select v-model="searchCriteria.distributedStatus" class="stausOption" placeholder="请输入派发状态"
							:localdata="distribute" @change="change">
						</uni-data-select>
					</uni-section>
				</view>

				<!-- 下拉框风险等级 -->
				<view class="stausInfo box">
					<text calss="stausHealth text" style="margin-left: 28rpx">风险等级</text>
					<uni-section class="stausOption right" title="本地数据" type="line">
						<uni-data-select v-model="searchCriteria.risk_level" class="stausOption" placeholder="请输入风险等级"
							:localdata="risk_level" @change="change">
						</uni-data-select>
					</uni-section>
				</view>
				<!-- 下拉框是否已核查 -->
				<view class="stausInfo box">
					<text calss="stausHealth text" style="margin-left: 28rpx">是否核查</text>
					<uni-section class="stausOption right" title="本地数据" type="line">
						<uni-data-select v-model="searchCriteria.is_verification" class="stausOption"
							placeholder="请输入是否已核查" :localdata="is_verification" @change="change">
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
			<t-table :columns="columns" :tableData="tableData" :loading="table_loading" :moreArray="moreArray"
				:pageValue="pageValue" :isPageShow="isShow"></t-table>
		</view>
	</view>
</template>

<script>
	import tTable from "../../components/common/table.vue";
	import {
		getVerification
	} from "@/api/areacheckDetail.js";
	import {
		digitalNum
	} from "./js/digitalNum.js";
	export default {
		components: {
			tTable,
		},
		data() {
			return {
				isShow: false,
				searchCriteria: {
					// 姓名
					name: "",
					// 手机号
					phone: "",
					// 批次号
					batch_num: "",
					// 证件号码
					id_card_num: "",
					// 风险等级
					risk_level: "",
					// 是否是已核查
					is_verification: "",
					// 页数
					page: 1,
					// 页码大小
					pageSize: 10,
					dept_id: '',
					distributedStatus: ""
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
				//风险等级
				risk_level: [{
						value: "一般",
						text: "一般",
					},
					{
						value: "急",
						text: "急",
					},
					{
						value: "紧急",
						text: "紧急",
					},
					{
						value: "特急",
						text: "特急",
					},
				],
				//是否是已核查
				is_verification: [{
						value: 1,
						text: "已核查",
					},
					{
						value: 2,
						text: "未核查",
					},
				],
				type: "bottom",
				columns: [{
						name: "name",
						value: "姓名",
						width: 60,
					},
					// {
					// 	name: "batch_num",
					// 	value: "批次",
					// 	width: 120
					// },
					{
						name: "id_card_num",
						value: "身份证号",
						// width: 90,
					},
					{
						name: "phone",
						value: "手机号码",
						width: 90,
					},
					// {
					// 	name: "is_verification",
					// 	value: "核查状态",
					// 	width: 60,
					// },
					// {
					// 	name: "dept_name",
					// 	value: "行政区划名称",
					// },
					// {
					// 	name: "event_name",
					// 	value: "事件名称",
					// 	width: 100
					// },
					// {
					// 	name: "risk_level",
					// 	value: "风险等级",
					// 	width: 40
					// },
					// {
					// 	name: "source_type",
					// 	value: "来源类型",
					// 	width: 120
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
					{
						name: "operation",
						value: "操作",
						width: 40,
						type: 'more',
					},
				],
				tableData: [],

				pageValue: null,
				moreArray: [{
						name: "查看",
						url: "areacheckCheck",
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
						name: "核酸记录",
						url: "acidRecord",
					},
				],
				data: {
					page: 1,
					pageSize: 30,
				},
				isRequest: true,
				map: {
					//组件中的映射属性
					text: "deptName",
					value: "ID",
				},
				msg: "",
			};
		},
		// 只要进入页面
		onShow() {
			//派发成功后重新刷新页面数据
			uni.$on("areaDeliver", (data) => {
				this.tableData = [];
				this.getInfo(data.msg);
			});
			//转派成功后重新刷新页面数据
			uni.$on("areaTransfer", (data) => {
				this.tableData = [];
				this.getInfo(data.msg);
			});
			//转派成功后重新刷新页面数据
			uni.$on("areaFixed", (data) => {
				this.tableData = [];
				this.getInfo(data.msg);
			});
			//监听表格中更多选项
			uni.$on("moreClick", (data) => {
				this.isShow = false;
			});
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
				this.searchCriteria = {
					// 姓名
					name: "",
					// 手机号
					phone: "",
					// 批次号
					batch_num: "",
					// 证件号码
					id_card_num: "",
					// 风险等级
					risk_level: "",
					// 是否是已核查
					is_verification: "",
					dept_id: '',
					distributedStatus: ''
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
				// this.searchCriteria.dept_id = this.msg;
			},

			//查询操作
			searchBtn() {
				this.isShow = false;
				this.tableData = [];
				this.getInfo();
			},

			// 重置按钮方法
			resetBtn() {
				this.searchCriteria = {
					// 姓名
					name: "",
					// 手机号
					phone: "",
					// 批次号
					batch_num: "",
					// 证件号码
					id_card_num: "",
					// 风险等级
					risk_level: "",
					// 是否是已核查
					is_verification: "",
					dept_id: '',
					distributedStatus: ''
				};
				this.tableData = [];
				this.getInfo();
				this.isShow = false;
			},
			// 区域协查接口
			getInfo(msg,cb) {
				uni.showLoading({
					title: msg ? msg : '加载中',
				});
				this.isRequest = false;
				const datas = {
					// 姓名
					name: this.searchCriteria.name,
					// 手机号
					phone: this.searchCriteria.phone,
					// 批次号
					batch_num: this.searchCriteria.batch_num,
					// 证件号码
					id_card_num: this.searchCriteria.id_card_num,
					// 风险等级
					risk_level: this.searchCriteria.risk_level,
					// 是否是已核查
					is_verification: this.searchCriteria.is_verification,
					dept_id: this.searchCriteria.dept_id,  //--==-----
					dispatch_status: this.searchCriteria.distributedStatus, //--==-----
					// 页数
					page: this.data.page,
					// 页码大小
					pageSize: this.data.pageSize,
				};
				getVerification(datas).then((res) => {
					this.isRequest = true;
					//判断查询时没有数据时处理，return不再进行接口操作
					if(!res.data.GrAreaVerificationList) {
						uni.hideLoading();
						this.table_loading = false;
						return
					}
					digitalNum(res.data.GrAreaVerificationList);
					// for (let item of res.data.GrAreaVerificationList) {
					// 	if(item.transfer_status == '转派中') {
					// 		item.transfer_status = '转派成功'
					// 	}
					// }
					this.tableData = [
						...this.tableData,
						...res.data.GrAreaVerificationList,
					];
					uni.hideLoading();
					this.table_loading = false;
					cb && cb()
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.area_check {
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
