<template>
	<view class="nuclein">
		<cu-custom @search="search()" class="top-bar" isBack="true">
			<block #content>核酸信息管理</block>
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
					<text class="idText text" style="margin-left: 56rpx;">身份证</text>
					<uni-section class="right" title="身份证号" type="line" padding>
						<uni-easyinput class="idInp" v-model="dataInfo.idInfo" placeholder="请输入身份证号"
							style="width: 470rpx;"></uni-easyinput>
					</uni-section>
				</view>
				<!-- 日期选择器  -->
				<!-- 
				<view class="example-body stausInfo box">
					<view class="text" style="margin-left: 28rpx;">日期范围</view>
					<view class="right" style="width: 421rpx;">
						<uni-datetime-picker v-model="dataInfo.range" type="daterange" @maskClick="maskClick" />
					</view>
				</view> -->
				<!-- 按钮 -->
				<view class="btnInfo">
					<button class="mini-btn  searchBtn" type="primary" size="mini" @click="searchBtn">查询</button>
					<button class="mini-btn reset " type="default" size="mini" @click="resetBtn">重置</button>
				</view>
			</view>

			<!-- 表格组件 -->
			<t-table :columns="columns" :tableData="tableData" :moreArray="moreArray" :showMore="false"></t-table>
		</view>

	</view>
</template>

<script>
	import tTable from "../../components/common/table.vue"
	import {
		getnucleicInfo
	} from "../../api/home.js"
	export default {
		components: {
			tTable
		},
		data() {
			return {
				isShow: false,
				dataInfo: {
					idInfo: "", // 身份证号
				},
				// 详细地址
				// dataTree: [],

				type: 'bottom',
				columns: [{
						name: 'patient_name',
						value: '姓名',
						width: 60
					},
					{
						name: 'certificate_num',
						value: '身份证号',
						// width: 90
					},
					{
						name: 'mobile',
						value: '手机号码',
						width: 90
					},
					// {
					// 	name: 'upload_time',
					// 	value: '核酸报告时间',
					// 	width: 140
					// },
					// {
					// 	name: 'census_Address',
					// 	value: '核酸检测机构',
					// 	width: 150
					// },
					// {
					// 	name: 'state',
					// 	value: '核酸检测结果',
					// },	
					// {
					// 	name: 'operation',
					// 	value: '',
					// 	width: 25
					// }
				],
				tableData: [],
				//更多选项
				moreArray: [{
					name: "查看",
					url: "nucleinCheck",
				}, ]

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
			//右上角搜索小图标
			search() {
				this.isShow = !this.isShow
				this.dataInfo.idInfo = ''
			},

			//查询操作
			searchBtn() {
				this.isShow = false;
				if (this.dataInfo.id_card == '') {
					uni.showToast({
						title: '身份证号不能为空',
						icon: 'none'
					})
				} else {
					this.tableData = []
					this.getInfo()
				}
			},
			
			//获取页面数据
			getInfo() {
				let data = {
					certificate_num: this.dataInfo.idInfo,
					page: 1,
					pageSize: 10,
				}
				getnucleicInfo(data).then(res => {
					// console.log("核酸管理页面", res)
					if (res.data.AcidRecord.length == 0) {
						uni.showToast({
							title: '暂无核酸信息',
							icon: 'none'
						})
					}
					for (let item of res.data.AcidRecord) {
						if (item.upload_time.indexOf("T") > -1) {
							//修改日期格式
							item.upload_time = item.upload_time.split("T")[0] + " " + item.upload_time
								.split("T")[1].split("+")[0];
						}
					}
					this.tableData = res.data.AcidRecord
				})
			},

			// 重置按钮方法
			resetBtn() {
				this.dataInfo = {
					idInfo: "",
				};
				this.tableData = [],
					this.isShow = false;
			},
		}
	}
</script>

<style lang="scss" scoped>
	.nuclein {
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
					color: #606266
				}
			}
		}
	}
</style>
