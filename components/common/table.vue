<template>
	<view class="uni-container">
		<!-- 表格内容 -->
		<view class="table">
			<uni-table ref="table" :loading="loading" sortable type="" emptyText="暂无更多数据">
				<uni-tr>
					<!-- <uni-th align="center" style="width: 40rpx;color: #8F97A4;">序号</uni-th> -->
					<uni-th align="center" v-for="(items, index) in columns" :key="index"
						:width="items.width+''=='undefined'?width+'px':items.width+'px'">
						<view class="th_text">{{ items.value }}</view>
					</uni-th>
				</uni-tr>
				<uni-tr class="row" v-for="(item, index) in tableData" :key="index">
					<!-- <uni-td align="center">{{ index+1 }}</uni-td> -->
					<uni-td align="center" class="row_len" 
					:class="[item.code_color=='红码'?'red':item.code_color=='黄码'?'yellow':item.code_color=='绿码'?'green':'',
					item.risk_level=='特急'?'darkred':item.risk_level=='紧急'?'red':item.risk_level=='急'?'yellow':item.risk_level=='一般'?'yellow':'',
					item.is_risk_area=='是'?'red':item.is_risk_area=='否'?'green':'',item.enabling_status=='启用'?'green':item.enabling_status=='停用'?'red':'',
					item.is_nucleic_acid=='已达标'?'green':item.is_nucleic_acid=='未达标'?'red':'']" 
					v-for="(col, i) in columns" :key="i" >
						<!-- 码色 -->
						<!-- <view class="td_text" v-if="columns[i].type=='tag'" style="margin: 0 auto;"
							:style="{width:columns[i].width+''=='undefined'?width+'px':columns[i].width+'px'}">
							<uni-tag :circle="true" :text="item[col.name]"
								:type="item[col.name]=='红码'?'error':item[col.name]=='绿码'?'success':item[col.name]=='黄码'?'warning':'default'"
								size="mini" />
						</view> -->
						<!-- 时间 -->
						<!-- <view class="td_text" v-else-if="columns[i].type=='time'" style="margin: 0 auto;"
							:style="{width:columns[i].width+''=='undefined'?width+'px':columns[i].width+'px'}">
							{{ item[col.name]?parseTime(item[col.name]):'-' }}</view> -->
						<view class="td_text" v-if="columns[i].type=='nums'" style="margin: 0 auto;"
							:style="{width:columns[i].width+''=='undefined'?width+'px':columns[i].width+'px'}">
							{{ item[col.name] }}
						</view>
						<!-- 操作栏 -->
						<view class="td_text td_more" v-else-if="columns[i].type=='more'" style="margin: 0 auto;"
							:style="{width:columns[i].width+''=='undefined'?width+'px':columns[i].width+'px'}"
							@click="moreClick(item, 'bottom')">
							更多</view>
						<view class="td_text" v-else style="margin: 0 auto;"
							:style="{width:columns[i].width+''=='undefined'?width+'px':columns[i].width+'px'}" 
							@click="tdClick(item)">
							{{ item[col.name]?item[col.name]:'-' }}
						</view>

					</uni-td>
				</uni-tr>
			</uni-table>
		</view>

		<!-- 右侧固定操作导航栏 -->
		<!-- <view class="more" v-if="showMore">
			<uni-table ref="table" sortable type="" emptyText="">
				<uni-tr>
					<uni-th align="center" :width="50">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in tableData" :key="index">
					<uni-td align="center" style="color: #53B7FF;" @click="moreClick(item, 'bottom')">更多</uni-td>
				</uni-tr>
			</uni-table>
		</view> -->

		<!-- 底部弹窗 -->
		<view class="bottom-modal">
			<uni-popup ref="popup" background-color="#fff" @change="change">
				<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
					<view class="" v-for="(item, index) in moreArray" :key="index">
						<text @click="itemClick(item)">{{ item.name }}</text>
					</view>
				</view>
			</uni-popup>
		</view>

		<!-- 管控方式 -->
		<view class="deliver-modal">
			<uni-popup ref="controlPopup" background-color="#fff" @change="change" :isMaskClick="false">
				<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
					<view class="title">
						<text>管控方式</text>
					</view> 
					<view class="contain">
						<uni-section class="stausOption section" title="本地数据" type="line">
							<uni-data-select v-model="dataInfo.controlStatus" class="stausOption" placeholder="请输入管控方式"
								:localdata="control" @change="controlChange">
							</uni-data-select>
						</uni-section>
					</view>
					<!-- 管控原因 -->
					<view class="control_cause" v-show="isShow">
						<textarea placeholder="1.经核实,此人不在新乡市 &#10;2.其他原因（需要填写具体原因）" v-model="dataInfo.controlReason"></textarea>
					</view>
					<view class="btn">
						<button type="primary" class="btn_commit" @click="commitClick">提交</button>
						<button type="default" @click="closeClick">取消</button>
					</view>
				</view>
			</uni-popup>
		</view>

		<!-- 派发转派选择区域弹窗 -->
		<view class="deliver-modal">
			<uni-popup ref="deliverPopup" background-color="#fff" @change="change" :isMaskClick="false">
				<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
					<view class="title">
						<text>{{ status ? "派发至" : "转派至" }}</text>
					</view>
					<view class="contain">
						<uni-section class="section" title="本地数据" type="line" padding
							style="height: calc(100vh - 100px)">
							<grid-cascade-selection placeholder="请选择行政区划" popup-title="请选择行政区划"
								v-model="dataInfo.dept_id" @change="onchange" @popupopened="onpopupopened"
								@popupclosed="onpopupclosed"></grid-cascade-selection>
						</uni-section>
					</view>
					<!-- 备注 -->
					<!-- <view class="contain" v-show="isDeliver">
						<text class="text">备注</text>
						<uni-section class="section" title="身份证号" type="line" padding>
							<uni-easyinput class="idInp" v-model="dataInfo.idInfo" placeholder=""></uni-easyinput>
						</uni-section>
					</view> -->
					<view class="btn">
						<button type="primary" class="btn_commit" @click="commitClick">提交</button>
						<button type="default" @click="closeClick">取消</button>
					</view>
				</view>
			</uni-popup>
		</view>

		<!-- 转派中弹窗 -->
		<view class="center-modal">
			<uni-popup ref="conPopup" background-color="#fff" @change="change" :isMaskClick="false">
				<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
					<view class="title">
						<text>转派处理</text>
					</view>
					<!-- 两个radio -->
					<view class="condition">
						<label class="radio">
							<radio value="3" style="transform: scale(0.77)" :checked="checkedAgree"
								@click="radioAgreeClick" /><text>同意</text>
						</label>
						<label class="radio">
							<radio value="4" style="transform: scale(0.77)" :checked="checkedReject"
								@click="radioRejectClick" /><text>拒绝</text>
						</label>
					</view>
					<!-- 拒绝原因 -->
					<view class="reject_cause" v-show="isShow">
						<textarea placeholder="拒绝原因:" v-model="dataInfo.rejectReason"></textarea>
					</view>
					<!-- 确定按钮 -->
					<view class="btn">
						<button type="primary" @click="fixedClick">确定</button>
						<button type="default" @click="closeClick">取消</button>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {
		getHealthDispatch,
		getPlaceDispatch,
		getKeyPlaceDispatch,
		getRiskPersonnelDispatch,
		getEnterDispatch,
		getAreaCheckDispatch,
	} from "../../api/dispatch.js";
	import {
		getHealthTransferStatus,
		getHealthTransfer,
		getRiskTransferStatus,
		getRiskTransfer,
		getBackTransferStatus,
		getBackTransfer,
		getAreaTransfer
	} from "../../api/transfer.js";
	import {
		getControlList,
		getControlMode,
		getUpdateSceneStatus
	} from "../../api/control.js";
	import {
		getBackDel,
		getHealthDel,
		getriskDel
	} from "../../api/delete.js";
	import {
		parseTime
	} from "@/utils/utils.js"
	export default {
		props: {
			columns: {
				type: Array,
				default: () => [],
			},
			tableData: {
				type: Array,
				default: () => [],
			},
			moreArray: {
				type: Array,
				default: () => [],
			},
			showMore: {
				type: Boolean,
				default: true,
			},
			pageValue: {
				type: Number,
			},
			isPageShow: {
				type: Boolean,
			},
			loading: {
				type: Boolean
			},
		},
		data() {
			return {
				operationWidth: 80,
				width: 100,
				type: "",
				dataInfo: {
					idInfo: "", // 身份证号
					dept_id: "", // 详细地址
					controlStatus: "", //管控状态
					rejectReason: "", //转派原因
					controlReason: "", //管控原因
				},
				//管控状态
				control: [],

				type: "center", //弹出层位置
				checkedAgree: false, //同意按钮
				checkedReject: false, //拒绝按钮
				isShow: false, //拒绝原因的文本框是否出现
				status: "", //派发转派状态：1:派发; 0:转派
				isDeliver: true, //判断状态是否为派发
				// isPage: true,  //判断状态为派发时，是否显示管控方式
				listItem: null, //管理模块中列表的某一条数据
				map: {
					//组件中的映射属性
					text: "deptName",
					value: "ID",
				},
				controlR: false,  //当管控方式为无法管控时，管控原因必填
			};
		},
		watch: {
			isPageShow(value) {
				if (this.isPageShow) {
					this.$refs.popup.close();
				}
			}
		},
		methods: {
			parseTime,
			//点击一条数据跳转至查看页
			tdClick(item) {
				const carlist = JSON.stringify(item);
				uni.navigateTo({
					url: '/pages/detail/operation/testCheck/' + this.moreArray[0].url + "?value=" + this.pageValue +
						"&item=" + carlist
				})
			},
			// 更多
			moreClick(item, type) {
				//item表示某一行数据
				this.listItem = item;
				//点击更多出现底部弹窗（open方法）
				this.type = type;
				this.$refs.popup.open(type);
				uni.$emit("moreClick", {
					msg: "点击了更多"
				})
				if(this.pageValue == 2) {
					if(item.enabling_status == '启用') {
						this.moreArray[3].name = '停用'
					} else {
						this.moreArray[3].name = '启用'
					}
				}
			},

			onpopupopened(e) {
				// console.log('popupopened');
			},
			onnodeclick(e) {
				// this.msg = e.ID;
			},
			onpopupclosed(e) {
				// this.dataInfo.dept_id = this.msg;
			},
			onchange(e) {
				// console.log('选择完成时触发:', e);
			},
			
			//管控方式选择后触发
			controlChange(e) {
				if(e == 8) {
					this.isShow = true;
					this.controlR = true
				} else {
					this.isShow = false;
					this.controlR = false
				}
			},

			// 点击相应内容页面跳转
			itemClick(item) {
				this.dataInfo.dept_id = "";
				this.dataInfo.controlStatus = "";
				this.checkedAgree = false;
				this.checkedReject = false;
				this.dataInfo.rejectReason = "";
				this.dataInfo.controlReason = "";
				this.isShow = false;
				// this.getInfoList();
				//点击后先关闭底部的弹框
				this.$refs.popup.close();
				if (item.name == "派发") {
					this.status = 1;
					this.$refs.deliverPopup.open("center");
				} else if (item.name == "管控方式") {
					this.status = 2;
					this.$refs.controlPopup.open();
					if (this.pageValue == 1) { //健康码管理页面
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
					} else if (this.pageValue == 7) { //入新人员
						getControlList({
							section_type: 3
						}).then(res => {
							// console.log("管控方式列表",res)
							for (let item of res.data) {
								this.control.push({
									value: item.value,
									text: item.label,
								})
							}
						})
					}
				} else if (item.name == "转派") {
					this.status = 0;
					this.isDeliver = false;
					if (!(this.listItem.transfer_status == "转派中")) {
						this.$refs.deliverPopup.open("center");
					} else {
						this.$refs.conPopup.open("center");
					}
				} else if (item.name == "删除") {
					let id = {
						id: this.listItem.id,
					};
					if (this.pageValue == 1) {
						//健康管理页面
						getHealthDel({
							data: id
						}).then((res) => {
							//删除成功后向全局发射一个事件
							uni.$emit("healthDel", {
								msg: "删除成功"
							});
						});
					} else if (this.pageValue == 6) {
						//风险人员页面
						getriskDel({
							data: id
						}).then((res) => {
							//删除成功后向全局发射一个事件
							uni.$emit("riskPersonnelDel", {
								msg: "删除成功"
							});
						});
					} else if (this.pageValue == 7) {
						//入豫人员页面
						getBackDel({
							data: id
						}).then((res) => {
							//删除成功后向全局发射一个事件
							uni.$emit("backPersonnelDel", {
								msg: "删除成功"
							});
						});
					}
				} else if(item.name == '启用' || item.name == '停用') {
					//处理场所码管理页面启用停用状态
					let enabling_status_nums = 1;
					if(item.name == '启用') {
						enabling_status_nums = 1
					} else {
						enabling_status_nums = 2
					}
					let data = {
						id: this.listItem.id,
						enabling_status: enabling_status_nums
					}
					getUpdateSceneStatus(data).then(res => {
						uni.$emit("updataEnabling", {
							msg: res.data.msg
						})
					})
				} else if (item.name == '查看') {
					const carlist = JSON.stringify(this.listItem);
					uni.navigateTo({
						url: '/pages/detail/operation/testCheck/' + item.url + "?value=" + this.pageValue +
							"&item=" + carlist
					})
				} else {
					const carlist = JSON.stringify(this.listItem);
					uni.navigateTo({
						url: '/pages/detail/operation/' + item.url + "?value=" + this.pageValue + "&item=" +
							carlist
					})
				}
			},

			//派发提交按钮
			commitClick() {
				if (this.status == 1) {
					//为派发状态
					let deliverData = {
						id: this.listItem.id, //必传
						dept_id: this.dataInfo.dept_id, //必传
						// control_mode: this.dataInfo.controlStatus,
						//----备注还未考虑----
					};
					if (this.pageValue == 1) {
						//健康码管理页面
						this.isPage = true;
						if (deliverData.dept_id == "") {
							uni.showToast({
								title: "派发地址不能为空",
								icon: "none",
							});
						} else {
							getHealthDispatch(deliverData).then((res) => {
								this.$refs.deliverPopup.close();
								uni.$emit("healthDeliver", {
									msg: "健康码派发成功"
								});
							});
						}
					} else if (this.pageValue == 2) {
						//场所码管理页面
						if (deliverData.dept_id == "") {
							uni.showToast({
								title: "派发地址不能为空",
								icon: "none",
							});
						} else {
							getPlaceDispatch(deliverData).then((res) => {
								this.$refs.deliverPopup.close();
								//派发成功后向全局发射一个事件
								uni.$emit("placeDeliver", {
									msg: "场所码派发成功"
								});
							});
						}
					} else if (this.pageValue == 5) {
						//重点场所管理页面
						if (deliverData.dept_id == "") {
							uni.showToast({
								title: "派发地址不能为空",
								icon: "none",
							});
						} else {
							getKeyPlaceDispatch(deliverData).then((res) => {
								this.$refs.deliverPopup.close();
								//派发成功后向全局发射一个事件
								uni.$emit("keyplaceDeliver", {
									msg: "重点场所派发成功"
								});
							});
						}
					} else if (this.pageValue == 6) {
						//风险人员管理页面
						this.isPage = true;
						if (deliverData.dept_id == "") {
							uni.showToast({
								title: "派发地址不能为空",
								icon: "none",
							});
						} else {
							getRiskPersonnelDispatch(deliverData).then((res) => {
								this.$refs.deliverPopup.close();
								//派发成功后向全局发射一个事件
								uni.$emit("riskplaceDeliver", {
									msg: "风险人员派发成功"
								});
							});
						}
					} else if (this.pageValue == 7) {
						//入豫人员管理页面
						this.isPage = true;
						if (deliverData.dept_id == "") {
							uni.showToast({
								title: "派发地址不能为空",
								icon: "none",
							});
						} else {
							getEnterDispatch(deliverData).then((res) => {
								this.$refs.deliverPopup.close();
								//派发成功后向全局发射一个事件
								uni.$emit("enterpersonnelDeliver", {
									msg: "入豫人员派发成功"
								});
							});
						}
					} else if (this.pageValue == 9) {
						//区域核查管理页面
						this.isPage = true;
						if (deliverData.dept_id == "") {
							uni.showToast({
								title: "派发地址不能为空",
								icon: "none",
							});
						} else {
							getAreaCheckDispatch(deliverData).then((res) => {
								this.$refs.deliverPopup.close();
								//派发成功后向全局发射一个事件
								uni.$emit("areaDeliver", {
									msg: "派发成功"
								});
							});
						}
					}
				} else if (this.status == 0) {
					//为转派处理
					let transferData = {
						id: this.listItem.id,
						dept_id: this.dataInfo.dept_id,
						original_dept_id: this.listItem.dept_id //原部门id
					};
					if (this.pageValue == 1) {
						//健康码页面转派
						if (transferData.dept_id == "") {
							uni.showToast({
								title: "转派地址不能为空",
								icon: "none",
							});
						} else {
							getHealthTransfer(transferData).then((res) => {
								this.$refs.deliverPopup.close();
								//转派成功后向全局发射一个事件
								uni.$emit("healthTransfer", {
									msg: "健康码转派成功"
								});
							});
						}
					} else if (this.pageValue == 6) {
						//风险人员页面转派
						if (transferData.dept_id == "") {
							uni.showToast({
								title: "转派地址不能为空",
								icon: "none",
							});
						} else {
							getRiskTransfer(transferData).then((res) => {
								this.$refs.deliverPopup.close();
								//转派成功后向全局发射一个事件
								uni.$emit("riskPersonTransfer", {
									msg: "风险人员转派成功"
								});
							});
						}
					} else if (this.pageValue == 7) {
						//入豫人员页面转派
						if (transferData.dept_id == "") {
							uni.showToast({
								title: "转派地址不能为空",
								icon: "none",
							});
						} else {
							getBackTransfer(transferData).then((res) => {
								this.$refs.deliverPopup.close();
								//转派成功后向全局发射一个事件
								uni.$emit("backPersonTransfer", {
									msg: "入豫人员转派成功"
								});
							});
						}
					} else if (this.pageValue == 9) {
						//区域核查页面转派
						if (transferData.dept_id == "") {
							uni.showToast({
								title: "转派地址不能为空",
								icon: "none",
							});
						} else {
							getAreaTransfer(transferData).then((res) => {
								this.$refs.deliverPopup.close();
								//转派成功后向全局发射一个事件
								uni.$emit("areaTransfer", {
									msg: "区域核查转派成功"
								});
							});
						}
					}
				} else if (this.status == 2) {
					//管控方式
					if (this.pageValue == 1) { //健康码页面
						let controlData = {
							section_type: 1,
							id: this.listItem.id,
							code: this.dataInfo.controlStatus,
							control_reasons: this.dataInfo.controlReason,  //无法管控时的管控原因
						};
						if (controlData.code == "") {
							uni.showToast({
								title: "管控方式不能为空",
								icon: "none",
							});
						} else if(this.controlR && controlData.control_reason == "") {
							uni.showToast({
								title: "原因不能为空",
								icon: "none",
							});
						} else {
							getControlMode(controlData).then(res => {
								this.$refs.controlPopup.close();
								uni.$emit("healthControl", {
									msg: "管控方式修改成功"
								});
							})
						}
					} else if (this.pageValue == 7) { //入新人员
						let controlData = {
							section_type: 3,
							id: this.listItem.id,
							code: this.dataInfo.controlStatus,
							control_reasons: this.dataInfo.controlReason,  //无法管控时的管控原因
						};
						if (controlData.code == "") {
							uni.showToast({
								title: "管控方式不能为空",
								icon: "none",
							});
						}else if(this.controlR && controlData.control_reason == "") {
							uni.showToast({
								title: "原因不能为空",
								icon: "none",
							});
						} else {
							getControlMode(controlData).then(res => {
								this.$refs.controlPopup.close();
								uni.$emit("enterControl", {
									msg: "管控方式修改成功"
								});
							})
						}
					}
				}
			},

			// 同意按钮
			radioAgreeClick() {
				if (this.checkedAgree) {
					this.checkedAgree = false;
				} else {
					this.checkedAgree = true;
				}
				if (this.checkedReject) {
					this.checkedReject = false;
					this.isShow = false;
				}
			},
			// 拒绝按钮
			radioRejectClick() {
				if (this.checkedReject) {
					this.isShow = true;
					this.checkedReject = false;
				} else {
					this.checkedReject = true;
					this.isShow = false;
				}
				if (this.checkedAgree) {
					this.checkedAgree = false;
					this.isShow = true;
				}
				if (this.checkedReject) {
					this.isShow = true;
				} else {
					this.isShow = false;
				}
			},

			//取消按钮
			closeClick() {
				this.$refs.conPopup.close();
				this.$refs.deliverPopup.close();
				this.$refs.controlPopup.close()
				this.checkedAgree = false;
				this.checkedReject = false;
				this.isShow = false;
			},

			//转派中确定按钮
			fixedClick() {
				if (
					this.checkedAgree ||
					(this.checkedReject && this.dataInfo.rejectReason != "")
				) {
					this.$refs.conPopup.close();
					let fixedData = {
						id: this.listItem.id,
						transfer_status: this.checkedAgree ? 3 : 4,
						transfer_reason: this.dataInfo.rejectReason,
					};
					if (this.pageValue == 1) {
						//健康码转派
						getHealthTransferStatus(fixedData).then((res) => {
							//转派处理成功后向全局发射一个事件
							uni.$emit("healthFixed", {
								msg: "转派处理成功"
							});
						});
					} else if (this.pageValue == 6) {
						//风险人员页面转派
						getRiskTransferStatus(fixedData).then((res) => {
							//转派处理成功后向全局发射一个事件
							uni.$emit("riskPerFixed", {
								msg: "转派处理成功"
							});
						});
					} else if (this.pageValue == 7) {
						//入豫人员页面转派
						getBackTransferStatus(fixedData).then((res) => {
							//转派处理成功后向全局发射一个事件
							uni.$emit("backPerFixed", {
								msg: "转派处理成功"
							});
						});
					} else if (this.pageValue == 9) {
						//区域核查页面转派
						// getAreaTransferStatus(fixedData).then((res) => {
						// 	//转派处理成功后向全局发射一个事件
						// 	uni.$emit("areaFixed", {
						// 		msg: "转派处理成功"
						// 	});
						// });
					}
				} else if (this.checkedReject && this.dataInfo.rejectReason == "") {
					uni.showToast({
						title: "拒绝原因不能为空",
						icon: "none",
					});
				} else {
					uni.showToast({
						title: "请选择是否同意",
						icon: "none",
					});
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.uni-container {
		position: relative;
		margin: 30rpx;

		.table {}

		.border-none {
			border-radius: 30rpx !important;
		}

		.uni-table-th {
			font-size: 24rpx;
			color: #8F97A4;
			// background-color: #DAE8FF;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			padding: 28rpx 0rpx;
		}

		.uni-table-td {
			font-size: 26rpx;
			color: #333333;
			background-color: #fff !important;
			padding: 20rpx 0rpx;

			.td_text {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.td_more {
				width: 80rpx;
				border: 1rpx solid #5A9DF8;
				border-radius: 8rpx;
				color: #599CF8;
				background-color: #EEF5FE;
			}
		}

		.row {
			.uni-table-td {
				background-color: rgba(249, 249, 249, 1);
			}
		}

		.more {
			position: absolute;
			top: 0;
			right: 0;

			.uni-table-th {
				font-size: 24rpx;
				color: #8F97A4;
				background-color: #DAE8FF;
			}

			.uni-table-td {
				font-size: 26rpx;
				background-color: rgba(249, 249, 249, 1);
			}
		}

		.bottom-modal {
			.popup-content {
				text {
					display: block;
					width: 100%;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					border-bottom: 2rpx solid #f0f0f0;
					font-size: 28rpx;
				}
			}
		}

		.deliver-modal {
			.popup-content {
				width: 600rpx;

				.title {
					width: 100%;
					height: 40rpx;
					line-height: 40rpx;
					text-align: center;
					font-weight: 800;
					margin: 40rpx 0rpx 0rpx 0rpx;
				}

				.contain {
					width: 100%;
					padding: 0 70rpx;
					margin: 40rpx 0rpx;

					.stausOption {
						padding: 0;
						margin-top: 20rpx;
					}

					.text {
						display: block;
						margin-bottom: 20rpx;
					}

					.section {
						width: 100%;
					}
				}

				.control_cause {
					margin: 40rpx 0rpx;
				
					textarea {
						// width: 100%;
						// padding: 0 70rpx;
						// margin: 40rpx 0rpx;
						width: 76%;
						height: 100rpx;
						border: 1rpx solid #cfcfcf;
						margin: 0 auto;
						font-size: 28rpx;
						padding: 0rpx 8rpx;
					}
				}
				
				.btn {
					width: 80%;
					margin: 0 auto;
					margin-bottom: 40rpx;
					display: flex;
					justify-content: space-between;

					button {
						width: 140rpx;
						height: 60rpx;
						line-height: 60rpx;
						font-size: 28rpx;
					}
				}
			}
		}

		.center-modal {
			.popup-content {
				width: 500rpx;

				.title {
					width: 100%;
					height: 40rpx;
					line-height: 40rpx;
					text-align: center;
					margin-top: 40rpx;
					font-weight: 800;
				}

				.condition {
					display: flex;
					justify-content: space-between;

					.radio {
						width: 40%;
						height: 100rpx;
						text-align: center;
						line-height: 100rpx;
						margin-top: 10rpx;
					}

					image {
						width: 50rpx;
						height: 50rpx;
					}
				}

				.reject_cause {
					margin-top: 20rpx;

					textarea {
						width: 80%;
						height: 100rpx;
						border: 1rpx solid #cfcfcf;
						margin: 0 auto;
						font-size: 28rpx;
						padding: 0rpx 8rpx;
					}
				}

				.btn {
					width: 80%;
					margin: 0 auto;
					margin-bottom: 40rpx;
					display: flex;
					justify-content: space-between;
					margin-top: 40rpx;

					button {
						width: 120rpx;
						height: 60rpx;
						line-height: 60rpx;
						font-size: 28rpx;
					}
				}
			}
		}
	}

	.row_len {
		&:first-child::before {
			content: "";
			position: absolute;
			left: 14rpx;
			width: 6rpx;
			height: 40rpx;
			margin-top: 4rpx;
		}
		
	}
	.row_len.red{
		&:first-child::before {
			background: red;
		}
	}
	.row_len.darkred{
		&:first-child::before {
			background: darkred;
		}
	}
	.row_len.yellow{
		&:first-child::before {
			background: yellow;
		}
	}
	.row_len.green{
		&:first-child::before {
			background: green;
		}
	}
</style>
