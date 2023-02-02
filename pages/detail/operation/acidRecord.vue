<template>
	<view class="area_check">
		<cu-custom class="top-bar" isBack="true">
			<block #content>核酸记录</block>
			<!-- 	<block #right>
				<view @click="search"><image class="search" src="/static/asset/search.png" alt="" /></view>
			</block> -->
		</cu-custom>
		<view class="contain">
			<view class="contain-top">
				<!-- 增强选择器  身份证号码 -->
				<!-- 	<view class="idSearch">
					<text class="idText">身份证号</text>
					<uni-section  title="身份证号" type="line" padding>
						<uni-easyinput  
				    class="idInp" v-model="dataInfo.idInfo"  disabled ></uni-easyinput>
					</uni-section>
			
				</view> -->
				<!-- 	日期选择器 
					<uni-section :title="'日期范围用法：' + '[' + range + ']'" type="line"></uni-section>
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
		getNucleicAcid
	} from '../../../api/acidRecord.js'
	export default {
		components: {
			tTable
		},
		data() {
			return {
				section_type: 0,
				page: 1,
				pageSize: 10,
				pageTotal: 0,
				isRequest: false,
				dataInfo: {
					// 身份证号
					idInfo: "",
					//健康码状态
					healthStatus: "绿码",
					// 时间选择信息因为有起始位置和结束位置所以是个数组
					range: ["2021-03-8", "2021-4-20"]

				},
				showMore: false,
				//按钮显示隐藏
				hiddenShow: true,
				table_loading: true,
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
				// 这个是个人的核酸记录
				columns: [{
						name: 'patient_name',
						value: '姓名',
						width: 40
					},
					{
						name: 'certificate_num',
						value: '身份证号',
						width: 80
					},
					{
						name: "mobile",
						value: "手机号码"
					},
					{
						name: 'upload_time',
						value: '核酸报告时间',
						width: 140
					},
					{
						name: 'census_Address',
						value: '核酸检测机构',
						width: 150
					},
					{
						name: 'state',
						value: '核酸检测结果'
					},
				],
				tableData: [],

				isShow: false,
			}
		},
		// 提前接收所有其他页面给我传的值，必须按照这个值来查找，并且一定要考虑一下当拿到这个值如何进行区分到底是默认的列表还是专属的列表，并且千万记得是两套。。。资源的集合
		onLoad(options) {
			// 任何一个进行跳转我们想带着一个对象过来。就必须执行三步  json中必须是json字符串不然就不可能转换成功，因为url太短。使用json字符串变长
			// 第一步在你传的时候，必须先用const a= json.stringfy(对象) 或者你直接字符串拼接，，（json.stringfy(对象)）
			// 第二步就是接必须用json.parse(options.item) 因为你传的变量名是什么，就取什么。。这才是值
			// console.log('从外面传进来的数据',JSON.parse(options.item));
			const Result = JSON.parse(options.item);
			// console.log('从外面传进来的数据', options.value);
			if (options.value == 1) {
				this.section_type = options.value;
				this.id = Result.id;
				this.dataInfo.idInfo = Result.certificate_num;
				// console.log('从第一个管理进来的条件', this.id);
			} else if (options.value == 4) {
				this.section_type = options.value;
				this.id = Result.id;
				this.dataInfo.idInfo = Result.id_card;
				// console.log('从第4个管理进来的条件', this.id);
			} else if (options.value == 6) {
				this.section_type = options.value;
				this.id = Result.id;
				this.dataInfo.idInfo = Result.id_card_num;
				// console.log('从第6个管理进来的条件', this.id);
			} else if (options.value == 7) {
				this.section_type = options.value;
				this.id = Result.id;
				this.dataInfo.idInfo = Result.id_card_num;
				// console.log('从第7个管理进来的条件', this.id);
			} else {
				// console.log('没有匹配到');
			}
			// this.dataInfo.idInfo = options.certificate_num;
			//  const info = JSON.parse(options.item);

			//  this.dataInfo.idInfo = info.certificate_num
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.page = 1;
			this.pageSize = 10;
			this.pageTotal = 0;
			this.isRequest = false;
			this.tableData = [];
			this.getDefaultNucleicList(() => {
				uni.stopPullDownRefresh()
			});
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
				this.getDefaultNucleicList();
			}
			// console.log('我被触底了');
		},
		// 页面一挂载就请求数据
		mounted() {
			// 这个是当点击的时候我们进行查询
			this.getDefaultNucleicList();
		},
		onHide: function() {
			uni.hideLoading()
		},
		methods: {
			search() {
				uni.pageScrollTo({
					scrollTop: 0,
				})
			},
			// 默认请求列表的请求函数
			getDefaultNucleicList(cb) {
				uni.showLoading({
					title: '加载中'
				});
				this.isRequest = true;
				getNucleicAcid({
					page: this.page,
					pageSize: this.pageSize,
					'id': this.id,
					"section_type": parseInt(this.section_type)
				}).then((res) => {
					uni.hideLoading();
					this.table_loading = false;
					// 请求成功开始拼接
					// digitalNum(res.data);
					for (let item of res.data.AcidRecordInfo) {
						if (item.upload_time.indexOf("T") > -1) {
							//修改日期格式
							item.upload_time =
								item.upload_time.split("T")[0]+" "+item.upload_time.split("T")[1].split("+")[0]
						}
					};
					this.tableData = [...this.tableData, ...res.data.AcidRecordInfo]
					// console.log(res.data);
					this.pageTotal = res.data.Count;
					this.isRequest = false;
					cb && cb();
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
				margin-bottom: 15px;
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
