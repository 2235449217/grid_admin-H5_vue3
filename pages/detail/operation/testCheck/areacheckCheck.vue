<template>
  <view class="contain">
    <cu-custom class="top-bar" isBack="true">
      <block #content>查看详情</block>
    </cu-custom>
    <h3>待核查人员来源信息</h3>
    <!-- v-for循环信息 -->
    <view>
      <view class="info" v-for="(value, key, index) in infomation">
        <text class="infoKey">{{ findValue(key).value }}</text>
        <!-- input -->
        <template v-if="findValue(key).type == 'input'">
          <uni-section
            title="禁用"
            subTitle="使用 disabled 属性禁用输入框"
            type="line"
            padding
          >
            <uni-easyinput
              class="infoValue"
              disabled
              :value="
                findValue(key).map
                  ? findValue(key).map[infomation[key]]
                  : infomation[key]
              "
            >
            </uni-easyinput>
          </uni-section>
        </template>

        <!-- 多文本 -->
        <template v-if="findValue(key).type == 'textarea'">
          <uni-section
            title="多行文本"
            subTitle="指定属性 type=textarea 使用多行文本框"
            type="line"
            padding
          >
            <uni-easyinput
              class="infoValue"
              disabled
              type="textarea"
              v-model="infomation[key]"
            >
            </uni-easyinput>
          </uni-section>
        </template>
        <!-- 地区选择 -->
        <template v-if="findValue(key).type == 'picker'">
          <uni-section title="本地数据" type="line" padding>
            <uni-data-picker
              v-model="infomation[key]"
              disabled
              class="infoValue"
              placeholder="请选择所在县"
              popup-title="请选择所在地区"
            >
            </uni-data-picker>
          </uni-section>
        </template>
        <!-- 时间选择器 -->
        <template v-if="findValue(key).type == 'time'">
          <uni-section title="本地数据" type="line" padding>
            <view class="example-body">
              <uni-datetime-picker
                disabled
                class="infoValue"
                type="datetime"
                v-model="infomation[key]"
                @change="changeLog"
              />
            </view>
          </uni-section>
        </template>
        <!-- 日期范围 -->
        <template v-if="findValue(key).type == 'daterange'">
          <uni-section title="本地数据" type="line" padding>
            <view class="example-body">
              <view class="example-body">
                <uni-datetime-picker
                  start="2020-20-10"
                  end="2022-10-10"
                  class="infoValue"
                  v-model="daterange"
                  disabled
                  type="daterange"
                  @maskClick="maskClick"
                />
              </view>
            </view>
          </uni-section>
        </template>
      </view>
    </view>
    <h3>核查信息</h3>
    <view>
      <view class="info" v-for="(value, key, index) in infomations">
        <text class="infoKey">{{ findValue(key).value }}</text>
        <!-- input -->
        <template v-if="findValue(key).type == 'input'">
          <uni-section
            title="禁用"
            subTitle="使用 disabled 属性禁用输入框"
            type="line"
            padding
          >
            <uni-easyinput
              class="infoValue"
              disabled
              :value="
                findValue(key).map
                  ? findValue(key).map[infomations[key]]
                  : infomations[key]
              "
            >
            </uni-easyinput>
          </uni-section>
        </template>

        <!-- 多文本 -->
        <template v-if="findValue(key).type == 'textarea'">
          <uni-section
            title="多行文本"
            subTitle="指定属性 type=textarea 使用多行文本框"
            type="line"
            padding
          >
            <uni-easyinput
              class="infoValue"
              disabled
              type="textarea"
              v-model="infomations[key]"
            >
            </uni-easyinput>
          </uni-section>
        </template>
        <!-- 地区选择 -->
        <template v-if="findValue(key).type == 'picker'">
          <uni-section title="本地数据" type="line" padding>
            <uni-data-picker
              v-model="infomations[key]"
              disabled
              class="infoValue"
              placeholder="请选择所在县"
              popup-title="请选择所在地区"
            >
            </uni-data-picker>
          </uni-section>
        </template>
        <!-- 数据选择 -->
        <template v-if="findValue(key).type == 'checkBox'">
          <uni-section title="单选" type="line">
            <view class="uni-px-5 uni-pb-5">
              <!-- <view class="text">单选选中：{{JSON.stringify(radio1)}}</view> -->
              <uni-data-checkbox
                v-model="infomations[key]"
                :localdata="sex"
              ></uni-data-checkbox>
            </view>
          </uni-section>
        </template>

        <!-- 时间选择器 -->
        <template v-if="findValue(key).type == 'time'">
          <uni-section title="本地数据" type="line" padding>
            <view class="example-body">
              <uni-datetime-picker
                disabled
                class="infoValue"
                type="datetime"
                v-model="infomations[key]"
                @change="changeLog"
              />
            </view>
          </uni-section>
        </template>
        <!-- 日期范围 -->
        <template v-if="findValue(key).type == 'daterange'">
          <uni-section title="本地数据" type="line" padding>
            <view class="example-body">
              <view class="example-body">
                <uni-datetime-picker
                  start="2020-20-10"
                  end="2022-10-10"
                  class="infoValue"
                  v-model="daterange"
                  disabled
                  type="daterange"
                  @maskClick="maskClick"
                />
              </view>
            </view>
          </uni-section>
        </template>
      </view>
    </view>
    <!-- 是属实本地 -->
    <uni-section title="单选" type="line">
      <view class="aaa uni-px-5 uni-pb-5">
        <!-- <view class="text">是否属实本地{{JSON.stringify(radio1)}}</view> -->
        <view class="text">是否属实本地</view>
        <uni-data-checkbox
          disabled
          calss="bbb"
          v-model="infomationsOne.is_local"
          @click="aaa"
          :localdata="infomationsOne.locality"
          :checked="checked"
        >
        </uni-data-checkbox>
      </view>
    </uni-section>
    <!-- 是属实本地 -->
    <view v-show="infomationsOne.is_local !== 2">
      <!-- 是否核酸 -->
      <uni-section title="单选" type="line">
        <view class="aaa uni-px-5 uni-pb-5">
          <!-- <view class="text">是否属实本地{{JSON.stringify(radio1)}}</view> -->
          <view class="text">是否当地核酸检测</view>
          <uni-data-checkbox
            disabled
            v-model="infomationsOne.is_nucleic"
            :localdata="infomationsOne.acid"
          >
          </uni-data-checkbox>
        </view>
      </uni-section>
      <!-- 是否纳入本地管控 -->
      <uni-section title="单选" type="line">
        <view class="aaa uni-px-5 uni-pb-5">
          <!-- <view class="text">是否属实本地{{JSON.stringify(radio1)}}</view> -->
          <view class="text">是否纳入本地管控</view>
          <uni-data-checkbox
            disabled
            v-model="infomationsOne.included_local"
            :localdata="infomationsOne.control"
          >
          </uni-data-checkbox>
        </view>
      </uni-section>
      <!-- 本地管控方式 -->
      <uni-section title="单选" type="line">
        <view class="aaa uni-px-5 uni-pb-5">
          <!-- <view class="text">是否属实本地{{JSON.stringify(radio1)}}</view> -->
          <view class="text">本地管控方式</view>
          <uni-data-checkbox
            disabled
            v-model="infomationsOne.is_control"
            :localdata="infomationsOne.controlWay"
          >
          </uni-data-checkbox>
        </view>
      </uni-section>

      <view class="characters">其他核查过程信息</view>
      <view class="textarea">
        <uni-section
          title="多行文本"
          subTitle="指定属性 type=textarea 使用多行文本框"
          type="line"
          padding
        >
          <uni-easyinput
            class="infoValue"
            disabled
            type="textarea"
            v-model="infomationsOne.other_verification_information"
          >
          </uni-easyinput>
        </uni-section>
      </view>
      <!-- 转派区划 -->
      <uni-section
        v-show="infomationsOne.is_control == 1"
        title="单选"
        type="line"
      >
        <view class="aaa uni-px-5 uni-pb-5">
          <!-- <view class="text">是否属实本地{{JSON.stringify(radio1)}}</view> -->
          <view class="text textheight">隔离地点</view>
          <uni-section
            title="禁用"
            subTitle="使用 disabled 属性禁用输入框"
            type="line"
            padding
          >
            <uni-easyinput
              class="infoValue inputBox"
              disabled
              v-model="infomationsOne.concentrated_see_address"
            >
            </uni-easyinput>
          </uni-section>
        </view>
      </uni-section>
      <uni-section
        v-show="infomationsOne.is_control == 2"
        title="单选"
        type="line"
      >
        <view class="aaa uni-px-5 uni-pb-5">
          <!-- <view class="text">是否属实本地{{JSON.stringify(radio1)}}</view> -->
          <view class="text textheight">隔离时间</view>
          <uni-section
            title="禁用"
            subTitle="使用 disabled 属性禁用输入框"
            type="line"
            padding
          >
            <uni-easyinput
              class="infoValue inputBox"
              disabled
              v-model="infomationsOne.concentrated_time"
            >
            </uni-easyinput>
          </uni-section>
        </view>
      </uni-section>
    </view>
    <!-- 不属实本地 -->
    <view v-show="infomationsOne.is_local === 2">
      <!-- 非本地操作 -->
      <uni-section title="单选" type="line">
        <view class="aaa uni-px-5 uni-pb-5">
          <!-- <view class="text">是否属实本地{{JSON.stringify(radio1)}}</view> -->
          <view class="text">非本地操作</view>
          <uni-data-checkbox
            disabled
            calss="bbb"
            v-model="infomationsTwo.native"
            :localdata="infomationsTwo.nativeWay"
          >
          </uni-data-checkbox>
        </view>
      </uni-section>
      <!-- 转派区划 -->
      <uni-section v-show="infomationsTwo.native == 1" title="单选" type="line">
        <view class="aaa uni-px-5 uni-pb-5">
          <!-- <view class="text">是否属实本地{{JSON.stringify(radio1)}}</view> -->
          <view class="text textheight">转派区划</view>
          <uni-section
            title="禁用"
            subTitle="使用 disabled 属性禁用输入框"
            type="line"
            padding
          >
            <uni-easyinput
              class="infoValue inputBox"
              disabled
              v-model="infomationsTwo.TransferOutAddress"
            >
            </uni-easyinput>
          </uni-section>
        </view>
      </uni-section>
      <!-- 转派原因 -->
      <view v-show="infomationsTwo.native == 1">
        <view class="characters">转派原因</view>
        <view class="textarea">
          <uni-section
            title="多行文本"
            subTitle="指定属性 type=textarea 使用多行文本框"
            type="line"
            padding
          >
            <uni-easyinput
              class="infoValue"
              disabled
              type="textarea"
              v-model="infomationsTwo.transfer_reason"
            >
            </uni-easyinput>
          </uni-section>
        </view>
      </view>
      <!-- 选择退回原因 -->
      <view v-show="infomationsTwo.native == 2">
        <view class="characters">选择退回原因</view>
        <view class="textarea">
          <uni-section
            title="多行文本"
            subTitle="指定属性 type=textarea 使用多行文本框"
            type="line"
            padding
          >
            <uni-easyinput
              class="infoValue"
              disabled
              type="textarea"
              v-model="infomationsTwo.back_reason"
            >
            </uni-easyinput>
          </uni-section>
        </view>
      </view>

      <!-- 选择转出外省区划 -->
      <view v-show="infomationsTwo.native == 2">
        <view class="characters">选择转出外省区划</view>
        <view class="textarea">
          <uni-section
            title="多行文本"
            subTitle="指定属性 type=textarea 使用多行文本框"
            type="line"
            padding
          >
            <uni-easyinput
              class="infoValue"
              disabled
              type="input"
              v-model="infomationsTwo.TransferInnerAddress"
            >
            </uni-easyinput>
          </uni-section>
        </view>
      </view>
      <!-- 退回过程其他信息 -->
      <view v-show="infomationsTwo.native == 2">
        <view class="characters">退回过程其他信息</view>
        <view class="textarea">
          <uni-section
            title="多行文本"
            subTitle="指定属性 type=textarea 使用多行文本框"
            type="line"
            padding
          >
            <uni-easyinput
              class="infoValue"
              disabled
              type="textarea"
              v-model="infomationsTwo.back_other_information"
            >
            </uni-easyinput>
          </uni-section>
        </view>
      </view>
    </view>
    <view></view>
  </view>
</template>

<script>
import info from "../js/data.js";
import { getVerificationDetail } from "@/api/areacheckDetail";

export default {
  data() {
    return {
      // 是否属实本地
      isShow: true,
      checked: true,
      infomationsOne: {
        // 是否属于本地
        is_local: 0,
        locality: [
          {
            text: "是",
            value: 1,
          },
          {
            text: "否",
            value: 2,
          },
        ],
        // 是否当地核酸检测
        is_nucleic: 1,
        acid: [
          {
            text: "是(阴性)",
            value: 1,
          },
          {
            text: "是(确诊)",
            value: 2,
          },
          {
            text: "是(无症状感染)",
            value: 3,
          },
          {
            text: "否",
            value: 4,
          },
        ],
        // 是否纳入本地控制
        included_local: 0,
        control: [
          {
            text: "是",
            value: 1,
          },
          {
            text: "否",
            value: 2,
          },
        ],
        // 本地管控方式
        is_control: 2,
        controlWay: [
          {
            text: "集中隔离",
            value: 1,
          },
          {
            text: "居家隔离",
            value: 2,
          },
          {
            text: "居家健康检测",
            value: 3,
          },
          {
            text: "过期人员无需监控",
            value: 4,
          },
          {
            text: "低风险地区无需管控",
            value: 5,
          },
        ],
        // 其他核查过程信息
        other_verification_information: "4111545",
        // 隔离地点
        concentrated_see_address: "",
        // 隔离时间
        concentrated_time: "",
      },
      infomationsTwo: {
        native: 1,
        nativeWay: [
          {
            text: "新乡市内转派",
            value: 1,
          },
          {
            text: "非新乡市",
            value: 2,
          },
        ],
        // 区划
        TransferOutAddress: "新乡市",
        // 转派原因
        transfer_reason: "史蒂夫懂法守法",
        // 选择退回的原因
        back_reason: "史蒂夫懂法守法",
        //转出外省区划
        TransferInnerAddress: "",
        // 退回其他信息
        back_other_information: "",
      },
      datalist: info,
      infomation: {
        // 姓名
        name: "",
        // 身份证号
        id_card_num: "",
        // 手机号
        phone: "",
        // 省份
        live_province: "河南省",
        // 市
        live_city: "新乡市",
        // 区
        live_area: "红旗区",
        // 来源日期
        source_date: 1655342752719,
        // 来源类型
        source_type: "重点区域",
        // 事件名称
        event_name: "动态疫情",
        // 批次号
        batch_num: 6165165161,
        // 健康码
        health_code: 3,
        // 地址
        address: "",
        // 备注
        comment: "364565456",
        // names: "四皇巴基",
        //
      },
      // 核查信息中的内容
      infomations: {
        // 姓名
        name: "四皇巴基",
        // 身份证号
        id_card_num: 132257200010105824,
        // 手机号
        phone: 13233805955,
        // 是否属实本地
        // locality: 0
        // 人员出发地
        depart_detail_address: "",
      },
      data: {
        id: "",
      },
      controlStatus: {
        center: false, //集中隔离
        home: false, //居家隔离
      }, //管控方式

      // 退回原因
      back_reason_status: [
        {
          text: 0,
          value: "",
        },
        {
          text: 1,
          value: "经核查此人不在本省内",
        },
        {
          text: 2,
          value: "经核查此人并未来河南",
        },
        {
          text: 3,
          value: "拒接电话，拒绝配合疫情核查工作",
        },
        {
          text: 4,
          value: "联系不上，多次拨打无人接听",
        },
        {
          text: 5,
          value: "联系不上，电话处于停机、关机、空号状态",
        },
        {
          text: 6,
          value: "其他原因",
        },
      ],
    };
  },
  // 接受传来的数据
  onLoad(options) {
    const Result = JSON.parse(options.item);
    // console.log(111, Result);
    this.data.id = Result.id;
    // 名字
    this.infomation.name = Result.name;
    // // 身份证号
    this.infomation.id_card_num = Result.id_card_num;
    // // 手机号
    this.infomation.phone = Result.phone;
    // 省份
    this.infomation.live_province = Result.live_province;
    // 城市
    this.infomation.live_city = Result.live_city;
    // 区
    this.infomation.live_area = Result.live_area;
    // 来源日期
    this.infomation.source_date = Result.source_date;
    // 来源类型
    this.infomation.source_type = Result.source_type;
    // 事件名称
    this.infomation.event_name = Result.event_name;
    // 批次号
    this.infomation.batch_num = Result.batch_num;
    // 健康码
    this.infomation.health_code = Result.health_code;
    // 地址
    this.infomation.address = Result.address;
    // 备注
    this.infomation.comment = Result.comment;

    // 姓名
    this.infomations.name = Result.name;
    // 证件号
    this.infomations.id_card_num = Result.id_card_num;
    // // 手机号
    this.infomations.phone = Result.phone;
    // 人员出发地
    this.infomations.depart_detail_address = Result.depart_detail_address;

    // 是属于本地
    this.infomationsOne.is_local = Result.is_local ? Result.is_local : 1;
    // 是的情况下
    // 是否当地核酸检测 is_nucleic
    this.infomationsOne.is_nucleic = Result.is_nucleic;
    // 是否纳入本地管控 included_local
    this.infomationsOne.included_local = Result.included_local;
    // 本地管控方式 is_control
    this.infomationsOne.is_control = Result.is_control;

    // 其他核查信息 ---是 情况下
    this.infomationsOne.other_verification_information =
      Result.other_verification_information;
    // 隔离地点 集中隔离 concentrated_see_address
    this.infomationsOne.concentrated_see_address =
      Result.concentrated_see_address;
    // 隔离时间  居家隔离 concentrated_time
    this.infomationsOne.concentrated_time =
      Result.concentrated_see_begin + "--" + Result.concentrated_see_over;

    // 不属于本地
    //  不属于本地  新乡市内转派
    // 转派区划
    this.infomationsTwo.TransferOutAddress =
      Result.transfer_address +
      Result.transfer_inner_address +
      Result.transfer_city_address;
    //  转派原因
    this.infomationsTwo.transfer_reason = Result.transfer_reason;

    // 不属于本地  非新乡市
    //  选择退回的原因
    // this.infomationsTwo.back_reason = digitalNum(Result.back_reason)
    //  转出外省区划
    this.infomationsTwo.TransferInnerAddress =
      Result.transfer_address +
      Result.transfer_inner_address +
      Result.transfer_city_address;
    //  退回其他信息
    this.infomationsTwo.back_other_information = Result.back_other_information;
  },
  mounted() {
    this.getInfo();
  },
  computed: {
    status: function () {
      return this.healthStatus.find((item) => {
        return item.value == this.info.healthStatus;
      }).text;
    },
  },
  watch() {},
  methods: {
    findValue(key) {
      // console.log(key)
      return this.datalist.find((item) => {
        return item.key == key;
      });
    },
    findMap(key, value) {
      // console.log(key)
      const mapList = this.datalist.find((item) => {
        return item.key == key;
      }).map;
      return mapList[value];
    },
    aaa() {
      // console.log(111);
      this.isShow = true;
    },
    getInfo() {
      getVerificationDetail(this.data).then((res) => {
        console.log("详情", res);
        this.infomation.name = res.data.name;
        this.infomationsOne.is_control = res.data.is_control;
        this.infomationsOne.is_local = res.data.is_local;

        // 选择退回原因
        for (let item of this.back_reason_status) {
          if (item.text == res.data.back_reason) {
            this.infomationsTwo.back_reason = item.value;
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.contain {
  .info {
    display: flex;
    justify-content: space-between;
    text-align: center;
    margin: 10rpx 0rpx;

    .infoKey {
      margin: 20rpx;

      align-items: center;
      height: 40rpx;
      lline-height: 40rpx;
    }

    .infoValue {
      margin: 0 20rpx 0 0rpx;
      width: 550rpx;
    }
  }
}

.textheight {
  margin: 0 20rpx;
}

.reason {
  width: 660rpx;
  margin: 20rpx;
}

.aaa {
  display: flex;
  justify-content: space-between;
  margin: 10rpx 20rpx;

  .text {
    margin: 3rpx 35rpx 0rpx 0;
  }
}

.inputBox {
  width: 550rpx;
}

h3 {
  margin: 10px;
}

.characters {
  margin: 10px;
}

.textheight {
  height: 40px;
  line-height: 30px;
}

.textarea {
  margin: 10px;
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
</style>
