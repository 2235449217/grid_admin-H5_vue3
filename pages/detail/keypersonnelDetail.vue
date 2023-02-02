<template>
	<view class="key_personnel">
		<cu-custom @search="search()" class="top-bar" isBack="true">
			<block #content>重点人员管理</block>
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
						<uni-easyinput class="idInp" v-model="dataInfo.idInfo" placeholder="请输入身份证号"
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
			<t-table class="table" :columns="columns" :tableData="tableData" :loading ="table_loading" :moreArray="moreArray"
				:pageValue="pageValue" :isPageShow="isShow"></t-table>
		</view>
	</view>
</template>

<script>
	import tTable from "../../components/common/table.vue";
	import {
		getKeyPerson
	} from "../../api/keypersonnelDetail.js";
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
				page: 1,
				pageSize: 30,
				pageTotal: 0,
				isRequest: false,
				pageValue: null,
				// keyPersonList:[],
				
				scene_name: 0,
				table_loading: true,
				dataInfo: {
					dept_id: '',
					// 身份证号
					idInfo: "",
					// 详细地址
					range: "",
					//健康码状态
					healthStatus: "",
					//派发状态
					distributedStatus: "",
					//管控状态
					controlStatus: "",
				},
				// 详细地址
				// dataTree: [],
				type: "bottom",
				columns: [{
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
					// 	width: 80
					// },
					// {
					// 	name: "is_nucleic_acid",
					// 	value: "核酸是否达标",
					// },
					// {
					// 	name: "nucleic_acid_count",
					// 	value: "本周核酸次数",
					// 	type: 'nums'
					// }, 
					// {
					// 	name: "dept_name",
					// 	value: "行政区划名称",
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
						url: "keypersonnelCheck",
					},
					{
						name: "核酸记录",
						url: "acidRecord",
					},
				],
				map: {
					//组件中的映射属性
					text: "deptName",
					value: "ID",
				},
				// msg: "",
			};
		},
		onShow() {
			//监听表格中更多选项
			uni.$on("moreClick", (data) => {
				this.isShow = false;
			});
		},
		created() {
			this.getPersonList();
		},
		onLoad(option) {
			this.pageValue = option.value;
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
			this.page = 1;
			this.pageSize = 20;
			this.pageTotal = 0;
			this.isRequest = false;
			this.tableData = [];
			this.getPersonList(() => {
				uni.stopPullDownRefresh();
			});
		},
		// 上拉加载
		onReachBottom() {
			if (this.page * this.pageSize >= this.pageTotal) {
				return uni.showToast({
					title: "没有更多",
				});
			}
			if (!this.isRequest) {
				this.page++;
				// console.log('w我是页数', this.page);
				this.getPersonList();
			}
			// console.log('我被触底了');
		},

		methods: {
			search() {
				this.isShow = !this.isShow;
				this.dataInfo = {
					idInfo: "",
					range: "",
					healthStatus: "",
					distributedStatus: "",
					controlStatus: "",
					dept_id: ''
				};
			},
			//查询操作
			searchBtn() {
				this.isShow = false;
				// 点击之后按照条件去查询
				// 通过条件去查询首先清零上一个默认更改过后的数据
				this.page = 1;
				this.pageSize = 20;
				this.pageTotal = 0;
				this.isRequest = false;
				this.tableData = [];
				this.getPersonList();
			},
			//获取m默认数据的接口函数
			getPersonList(cb) {
				uni.showLoading({
					title: '加载中'
				});
				this.isRequest = true;
				getKeyPerson({
					page: this.page,
					pageSize: this.pageSize,
					id_card: this.dataInfo.idInfo,
					time_frame: this.dataInfo.range,
				}).then((res) => {
					this.isRequest = false;
					const {
						KeyPlacePerson,
						countd
					} = res.data;
					this.pageTotal = countd;
					//判断查询时没有数据时处理，return不再进行接口操作
					if(!KeyPlacePerson) {
						uni.hideLoading();
						this.table_loading = false;
						return
					}
					// KeyPlacePerson.forEach((item) => {
					// 	item.is_nucleic_acid = item.is_nucleic_acid == 0 ? "否" : "是";
					// });
					digitalNum(KeyPlacePerson);
					this.tableData = [...this.tableData, ...KeyPlacePerson];
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
					range: "",
					healthStatus: "",
					distributedStatus: "",
					controlStatus: "",
					dept_id: ''
				};
				// 第二步重新调用函数并且清空全部核心数据
				this.page = 1;
				this.pageSize = 20;
				this.pageTotal = 0;
				this.isRequest = false;
				this.tableData = [];
				this.getPersonList();
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
	.key_personnel {
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
