<template>
	<view class="risk_warn">
		<cu-custom @search="search()" class="top-bar" isBack="true">
			<block #content>风险预警</block>
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
				:moreArray="moreArray" :isPageShow="isShow"></t-table>
		</view>
	</view>
</template>

<script>
	import {
		riskWarning
	} from "@/api/riskwarnDetail";
	import tTable from "../../components/common/table.vue";
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
				dataInfo: {
					// 身份证号
					id_card: "",
					// 时间范围
					range: "",
				},
				table_loading: true,
				// 详细地址
				// dataTree: [],

				type: "bottom",
				columns: [
					{
						name: "name",
						value: "姓名",
						width: 60
					},
					{
						name: "id_card",
						value: "身份证号",
						// width: 90
					},
					{
						name: "phone",
						value: "手机号码",
						width: 90
					},
					// {
					// 	name: "scene_name",
					// 	value: "扫码场所名称",
					// },
					// {
					// 	name: "code_color",
					// 	value: "健康码状态",
					// 	width: 40,
					// 	type: 'tag'
					// },
					// {
					// 	name: "is_nucleic_acid",
					// 	value: "是否有核酸记录",
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
						url: "riskwarnCheck",
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
				// isRequest: true,
			};
		},
		onShow() {
			//监听表格中更多选项
			uni.$on("moreClick", (data) => {
				this.isShow = false;
			});
		},
		created() {
			this.getInfo();
		},
		//页面隐藏
		onHide: function() {
			uni.hideLoading()
		},
		//页面卸载
		onUnload() {
			uni.hideLoading()
		},
		//下拉刷新
		onPullDownRefresh() {
			this.tableData = [];
			this.getInfo(() => {
				uni.stopPullDownRefresh();
			});
		},
		//上拉加载(触底函数)
		onReachBottom() {
			this.data.page++;
			this.getInfo();
		},
		methods: {
			//搜索小图标
			search() {
				this.isShow = !this.isShow;
				this.dataInfo = {
					idInfo: "",
					address: "",
					healthStatus: "",
					distributedStatus: "",
					controlStatus: "",
					range: "",
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
				};
				// 数据刷新
				this.tableData = [];
				this.getInfo();
				this.isShow = false;
			},

			// 风险预警接口调用
			getInfo(cb) {
				uni.showLoading({
					title: '加载中'
				});
				const dataId = {
					id_card: this.dataInfo.id_card,
					time_frame: this.dataInfo.range,
					page: this.data.page,
					pageSize: this.data.pageSize,
				};
				riskWarning(dataId).then((res) => {
					//判断请求的接口中是否有数据，没数据的话及时进行处理
					if(!res.data.RiskWarning) {
						uni.hideLoading();
						this.table_loading = false;
						return
					}
					for (let item of res.data.RiskWarning) {
						//是否核酸
						if (item.is_nucleic_acid != 1 && item.is_nucleic_acid != 2) {
							item.is_nucleic_acid = "-";
						}
					}
					digitalNum(res.data.RiskWarning);
					this.tableData = [...this.tableData, ...res.data.RiskWarning];
					uni.hideLoading();
					this.table_loading = false;
					cb && cb()
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.risk_warn {
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
