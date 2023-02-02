<template>
	<view class="area_check">
		<cu-custom class="top-bar" isBack="true">
			<block #content>入豫记录</block>
			<!-- <block #right>
				<view @click="search"><image class="search" src="/static/asset/search.png" alt="" /></view>
			</block> -->
		</cu-custom>

		<view class="contain">
			<view class="contain-top">
				<!-- 增强选择器  身份证号码 -->
				<view class="idSearch">
					<text class="idText">身份证号码</text>
					<uni-section title="身份证号" type="line" padding>
						<uni-easyinput disabled class="idInp" v-model="dataInfo.idInfo"></uni-easyinput>
					</uni-section>
				</view>
				<!-- 级联选择器   地址-->
				<!-- <view class="container">
					<uni-section title="本地数据" type="line" padding style="height: calc(100vh - 100px);">
						<uni-data-picker placeholder="请选择所在县" popup-title="请选择所在地区" :localdata="dataTree"
							v-model="dataInfo.address" @change="onchange" @nodeclick="onnodeclick" @popupopened="onpopupopened"
							@popupclosed="onpopupclosed">
						</uni-data-picker>
					</uni-section>
				</view> -->
				<!-- 下拉框 -->
				<view class="stausInfo">
					<text class="stausHealth">健康码状态</text>
					<uni-section class="section-health" title="健康码状态" type="line" padding>
						<uni-easyinput disabled class="idInp" v-model="dataInfo.healthStatus"></uni-easyinput>
					</uni-section>
				</view>
				<!-- 派发状态 -->
				<!-- 	<view class="stausInfo">
					<text calss="stausHealth">派发状态</text>
					<uni-section class="stausOption" title="本地数据" type="line">
						<uni-data-select v-model="dataInfo.distributedStatus" class="stausOption" placeholder="请输入派发状态"
							:localdata="distribute" @change="change">
						</uni-data-select>
					</uni-section>
				</view> -->
				<!-- 管控方式 -->
				<!-- <view class="stausInfo">
					<text calss="stausHealth">管控方式</text>
					<uni-section class="stausOption" title="本地数据" type="line">
						<uni-data-select v-model="dataInfo.controlStatus" class="stausOption" placeholder="请输入管控方式"
							:localdata="control" @change="change">
						</uni-data-select>
					</uni-section>
				</view> -->
				<!-- 日期选择器  -->
				<!-- <uni-section :title="'日期范围用法：' + '[' + range + ']'" type="line"></uni-section>
				<view class="example-body">
					<uni-datetime-picker
           disabled
           v-model="dataInfo.range" type="daterange" @maskClick="maskClick"
           rangeSeparator="至"
           />
				</view> -->
				<!-- 按钮 -->
				<!-- 	<view class="btnInfo">
					<button class="mini-btn  searchBtn" type="primary" size="mini" @click="searchBtn">查询</button>
					<button class="mini-btn reset " type="default" size="mini" @click="resetBtn">重置</button>
				</view> -->
			</view>

			<!-- 表格组件 -->
			<t-table :showMore='showMore' :columns="columns" :loading ="table_loading" :tableData="tableData"></t-table>
		</view>

	</view>
</template>

<script>
	import tTable from "../../../components/common/table.vue"
	import {
		getEnterPersonList
	} from "../../../api/enterPerson.js"
	export default {
		components: {
			tTable
		},
		data() {
			return {
				id: "",
				page: 1,
				pageSize: 10,
				pageTotal: 40,
				isRequest: false,
				table_loading: true,
				dataInfo: {
					// 身份证号
					idInfo: "",
					//健康码状态
					healthStatus: "",
					// 时间选择信息因为有起始位置和结束位置所以是个数组
					range: ["2021-03-8", "2021-4-20"]

				},
				showMore: false,
				//按钮显示隐藏
				hiddenShow: true,
				//健康码状态
				health: [{
						value: 0,
						text: "绿码"
					},
					{
						value: 1,
						text: "黄码"
					},
					{
						value: 2,
						text: "红码"
					},
				],

				type: 'bottom',
				columns: [{
						name: 'name',
						value: '姓名',
						width: 60
					},
					{
						name: 'id_card_num',
						value: '身份证号',
						width: 80
					},
					{
						name: 'phone',
						value: '手机号码'
					},
					{
						name: 'depart_detail_address',
						value: '出发地',
						width: 160
					},
					{
						name: 'dest_detail_address',
						value: '目的地',
						width: 160
					}

				],
				tableData: [],
				isShow: false,
				section_type: ''
			}
		},
		onLoad(options) {
			const Result = JSON.parse(options.item);
			// console.log('入豫人员页面',Result.certificate_num,Result.code_color,options.value);
			if (options.value == 1) {
				this.id = Result.id;
				this.dataInfo.idInfo = Result.certificate_num;
				this.dataInfo.healthStatus = Result.code_color;
				this.section_type = options.value;
			}
		},
		onHide: function() {
			uni.hideLoading()
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.page = 1;
			this.pageSize = 10;
			this.pageTotal = 40;
			this.isRequest = false;
			this.tableData = [];
			this.getEnterPersonData(() => {
				uni.stopPullDownRefresh()
			});
			// console.log('我被下拉了');
		},
		// 上拉加载 
		onReachBottom() {
			if (this.page * this.pageSize >= this.pageTotal) {
				return uni.showToast({
					title: "没有更多"
				})
			};
			if (!this.isRequest) {
				this.page++;
				this.getEnterPersonData()
			}
			// console.log('我被触底了');
		},
		mounted() {
			this.getEnterPersonData()
		},
		methods: {
			search() {
				uni.pageScrollTo({
					scrollTop: 0,
				})
			},
			getEnterPersonData(cb) {
				uni.showLoading({
					title: '加载中'
				});
				this.isRequest = true;
				getEnterPersonList({
					page: this.page,
					pageSize: this.pageSize,
					id: this.id,
					section_type: parseInt(this.section_type),
					// 'id_card_num': this.id
				}).then((res) => {
					uni.hideLoading();
					this.table_loading = false;
					// const {data} = res.data
					this.tableData = [...this.tableData, ...res.data.ReturnInfo]
					// console.log(res.data);
					this.isRequest = false;
					cb && cb();
					
					// console.log('请求入豫人员', res.data.ReturnInfo);
				})
			},
			// 重置按钮方法
			resetBtn() {
				this.dataInfo = {
					idInfo: "",
					healthStatus: "",
					range: []
				};
			},

		}
	}
</script>

<style lang="scss" scoped>
	.area_check {
		width: 100%;

		.search {
			width: 40rpx;
			height: 40rpx;
		}

		.contain {
			.idSearch {
				display: flex;
				justify-content: flex-start;
				width: 750px;

				.idText {
					margin: 20rpx;
					// font-size: 10rpx
					align-items: center;
				}

				.idInp {
					margin: 0 20rpx 0 0rpx;
					width: 550rpx;
				}
			}

			.container {
				margin: 20rpx,
			}

			.stausInfo {
				display: flex;
				// justify-content: ;
				margin: 30rpx 20rpx;
				width: 640rpx;
				align-items: center;

				.uni-stat__select {
					padding: 0rpx,
				}

				.section-health {
					margin-left: 10px;
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
					color: #606266
				}
			}
		}
	}

	// 更改一下输入框的文本颜色
	::v-deep .uni-easyinput__content.is-disabled {
		color: #000;
	}

	// 更改一下字体颜色
	::v-deep .uni-date-x {
		color: #000;
		// font-weight: bold;
	}

	// 更改一下整体的透明度一定要观察设置了变淡肯定有问题是不是继承了谁
	::v-deep .uni-date-editor--x__disabled {
		opacity: 1;
	}

	//更改了颜色配置
	::v-deep .uniui-calendar[data-v-a2e81f6e]:before {
		content: "\e6a0";
		color: #000;
	}

	.contain-top {
		margin-bottom: 40rpx;
	}
</style>
