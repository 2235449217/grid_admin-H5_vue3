<template>
  <view class="area_check">
    <cu-custom class="top-bar" isBack="true">
      <block #content>扫码记录</block>
      <!-- 	<block #right>
				<view @click="search"><image class="search" src="/static/asset/search.png" alt="" /></view>
			</block> -->
    </cu-custom>
    <view class="contain">
      <view class="container-top">
        <!-- 增强选择器  身份证号码 -->
        <!-- <view class="idSearch">
					<text class="idText">{{isShowText ? '身份证号' : '场所代码'}}</text>
					<uni-section v-if="isIdView" title="身份证号" type="line" padding>
						<uni-easyinput class="idInp" v-model="idInfo" disabled></uni-easyinput>
					</uni-section>
					<uni-section v-if="isSceneID" title="场所代码" type="line" padding>
						<uni-easyinput class="idInp" v-model="sceneId" disabled></uni-easyinput>
					</uni-section>
				</view> -->
        <!-- 日期选择器  -->
        <!-- 	<uni-section :title="'日期范围用法：' + '[' + range + ']'" type="line"></uni-section>
				<view class="example-body">
					<uni-datetime-picker
           disabled  v-model="dataInfo.range" type="daterange" 
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
      <t-table
        :showMore="showMore"
        :columns="columns"
        :loading="table_loading"
        :tableData="tableData"
      ></t-table>
    </view>
  </view>
</template>

<script>
import tTable from "../../../components/common/table.vue";
import { getScanCodeList, getMyselfRecord } from "../../../api/scanRecord.js";
export default {
  components: {
    tTable,
  },
  data() {
    return {
      // 来自哪一个模块请求的
      section_type: 0,
      // 是否展示场所代码id
      isSceneID: false,
      // 是否展示id信息
      isIdView: false,
      // 到底调用什么接口
      value: "",
      // 到底展示哪一个信息
      isShowText: false,
      table_loading: true,
      page: 1,
      pageSize: 20,
      pageTotal: 40,
      isRequest: false,
      showMore: false,
      //身份证号
      idInfo: "",
      // 搜索用的人的id
      id: "",
      // 搜索用的场所id
      sceneId: "",
      scene_name: "",
      dataInfo: {
        // 时间选择信息因为有起始位置和结束位置所以是个数组
        range: ["2021-03-8", "2021-4-20"],
      },
      //按钮显示隐藏
      hiddenShow: true,
      type: "bottom",
      // // 这个是人的扫码记录信息
      columnsPerson: [
        {
          name: "scene_name",
          value: "单位名称"
        },
        {
          name: "scene_code",
          value: "场所代码",
          width: 80,
        },
        {
          name: "id_card",
          value: "证件号码",
          width: 140,
        },
        {
          name: "phone",
          value: "手机号码"
        },
        {
          name: "scan_time",
          value: "扫码时间",
          width: 140,
        },
        {
          name: "code_color",
          value: "健康码状态",
          width: 40,
          type: "tag",
        },
      ],
      // 这个是场所定义的信息
      columnsScene: [
        {
          name: "scan_person",
          value: "负责人",
          width: 60,
        },
        {
          name: "id_card",
          value: "证件号码",
          width: 80,
        },
        {
          name: "phone",
          value: "手机号码"
        },
        {
          name: "scene_name",
          value: "场所名称",
        },
        {
          name: "scan_time",
          value: "扫码时间",
          width: 140,
        },
        {
          name: "code_color",
          value: "健康码状态",
          width: 40,
          type: "tag",
        },
        {
          name: "abnormal_cause",
          value: "异常原因",
        },
        {
          name: "sign_city",
          value: "赋码城市",
        },
      ],
      tableData: [],
      columns: [],
      tableData: [],
      isShow: false,
    };
  },
  onLoad(options) {
    // 接收数据  通过传过来的数据你来进行
    const Result = JSON.parse(options.item);
    if (options.value == 1) {
      this.section_type = options.value;
      this.value = options.value;
      this.isSceneID = false;
      this.isIdView = true;
      this.isShowText = true;
      this.id = Result.id;
      this.idInfo = Result.certificate_num;
      this.columns = [...this.columnsPerson];
    } else if (options.value == 2) {
      this.section_type = options.value;
      this.isSceneID = true;
      this.isIdView = false;
      this.isShowText = false;
      this.value = options.value;
      this.sceneId = Result.id;
      this.scene_name = Result.scene_name;
      this.columns = [...this.columnsScene];
    }
    // if(options.value == 1){
    //   this.scene_name = Result.name;
    // }else if(options.value == 2){
    //   this.scene_name = Result.value;
    // }
    // console.log(options.value);
    // console.log("@@@@", Result.placeName);
  },
  onHide: function() {
  	uni.hideLoading()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.page = 1;
    this.pageSize = 20;
    this.pageTotal = 40;
    this.isRequest = false;
    this.tableData = [];
    this.getScanCodeData(() => {
      uni.stopPullDownRefresh();
    }, 1000);
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
      this.getScanCodeData();
    }
    // console.log("我被触底了");
  },
  mounted() {
    this.getScanCodeData();
  },
  methods: {
    search() {
      uni.pageScrollTo({
        scrollTop: 0,
      });
    },
    // 请求数据接口
    getScanCodeData(cb) {
      uni.showLoading({
        title: "加载中",
      });
      if (this.value == 1) {
        this.isRequest = true;
        getMyselfRecord({
          page: this.page,
          pageSize: this.pageSize,
          id: this.id,
          section_type: parseInt(this.section_type),
        }).then((res) => {
          // console.log("请求的扫码个人信息", res);
          uni.hideLoading();
          this.table_loading = false;
          res.data.ScanRecord.forEach((item) => {
            // 1234 绿黄红灰
            item.code_color =
              item.code_color == 1
                ? "绿码"
                : item.code_color == 2
                ? "黄码"
                : item.code_color == 3
                ? "红码"
                : "灰码";
          });
          // 请求日期
          // digitalNum(res.data);
          for (let item of res.data.ScanRecord) {
            if (item.scan_time.indexOf("T") > -1) {
              //修改日期格式
              item.scan_time =
                item.scan_time.split("T")[0] +
                " " +
                item.scan_time.split("T")[1].split("+")[0];
            }
          }

          this.tableData = [...this.tableData, ...res.data.ScanRecord];
          // console.log(res.data);
          this.isRequest = false;
          cb && cb();
        });
      } else if (this.value == 2) {
        // 场所码的调用
        this.isRequest = true;
        getScanCodeList({
          page: this.page,
          pageSize: this.pageSize,
          scene_name: this.scene_name,
        }).then((res) => {
          uni.hideLoading();
          this.table_loading = false;
          res.data.ScanCode.forEach((item) => {
            // 1234 绿黄红灰
            item.code_color =
              item.code_color == 1
                ? "绿码"
                : item.code_color == 2
                ? "黄码"
                : item.code_color == 3
                ? "红码"
                : "灰码";
          });
          for (let item of res.data.ScanCode) {
            if (item.scan_time.indexOf("T") > -1) {
              //修改日期格式
              item.scan_time =
                item.scan_time.split("T")[0] +
                " " +
                item.scan_time.split("T")[1].split("+")[0];
            }
          }

          this.tableData = [...this.tableData, ...res.data.ScanCode];
          // console.log(res.data);
          this.isRequest = false;
          cb && cb();
          // console.log('请求扫码人员',res.data.ScanCode);
        });
      }
    },
    // 重置按钮方法
    resetBtn() {
      this.dataInfo = {
        idInfo: "",
        range: [],
      };
    },
  },
};
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
        margin: 28rpx;
        // font-size: 10rpx
        align-items: center;
      }

      .idInp {
        margin: 0 20rpx 0 0rpx;
        // width: 5;
      }
    }

    .container {
      margin: 20rpx;
    }

    .stausInfo {
      display: flex;
      justify-content: space-between;
      margin: 30rpx 20rpx;
      width: 640rpx;
      align-items: center;

      .uni-stat__select {
        padding: 0rpx;
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

.container-top {
  margin-bottom: 40rpx;
}
</style>
