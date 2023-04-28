<template>
  <basic-container class="containerWrap">
    <el-form ref="formRef" class="search-form form-col form-class" :rules="rules" :model="form" size="mini" label-width="80px">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label=" " label-width="0" prop="order" class="w-100 order-el">
            <DropdownLabel v-model="dropType" width="110px" :list="orderTypeList">
              <el-input v-model="form.order" class="w-100" placeholder="请输入单号" />
            </DropdownLabel>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="销售平台" prop="platformCode">
            <el-select
              v-model="form.platformCode"
              clearable
              filterable
              :disabled="dropType!=='platOrderId'"
              placeholder="请选择销售平台"
              style="width:100%;"
            >
              <el-option
                v-for="item in platformList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div style="display:inline-block;background-color:#fff;">
            <el-form-item label="" label-width="10px">
              <el-button type="primary" @click="search">搜索</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div v-loading="loading" style="min-height: 400px;">
      <div v-for="(pdata, j) in positionData" :key="new Date().getTime()+j" :style="wrapPadding(pdata.packageList)" class="position-wrap flow-wrap w-100">
        <div v-if="pdata" class="details">
          <g-list-group label-width="90px" label-align="center" item-class="py-1">
            <g-list-group-item label="销售">
              <g-text-ellipsis>{{ pdata.mainSellerName }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="客服">
              <g-text-ellipsis>{{ pdata.mainCustomerServiceName }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="店铺">
              <g-text-ellipsis>{{ pdata.account }}</g-text-ellipsis>
            </g-list-group-item>
            <g-list-group-item label="订单总处理时间">
              <g-text-ellipsis>{{ pdata.orderTotalDealTime }}</g-text-ellipsis>
            </g-list-group-item>
          </g-list-group>
        </div>
        <div class="column1 d-flex justify-content-end align-items-end">
          <div>
            <!-- 销售平台 / 手工导入-->
            <Block :item-data="orderType(pdata.orderType)" show-b>
              <g-list-group item-class="text-start py-1">
                <g-list-group-item label="导入时间">
                  <g-text-ellipsis>{{ pdata.firstGrabDate }}</g-text-ellipsis></g-list-group-item>
                <g-list-group-item label="操作人">
                  <g-text-ellipsis>{{ pdata.createUserName }}</g-text-ellipsis>
                </g-list-group-item>
              </g-list-group>
            </Block>
            <!-- 平台订单 -->
            <Block t-line :item-data="platOrder">
              <g-list-group item-class="text-start py-1" label-width="64px">
                <g-list-group-item label="平台单号">
                  <g-text-ellipsis class="linkClass text-primary" @click.native="toList(pdata.platOrderId, pdata.platformCode, pdata.storeCode)">
                    {{ pdata.platOrderId }}
                  </g-text-ellipsis>
                </g-list-group-item>
                <g-list-group-item label="推OMS时间">
                  <g-text-ellipsis>{{ pdata.omCreateTime }}</g-text-ellipsis>
                </g-list-group-item>
              </g-list-group>
            </Block>
          </div>
          <!-- 订单管理 -->
          <Block id="node4" :disabled="!!!pdata.omOrderId" l-line :r-line="pdata.packageList.length >1" show-b show-t :item-data="orderManagement">
            <g-list-group item-class="text-start py-1" label-width="64px">
              <g-list-group-item label="分仓时间">
                <g-text-ellipsis>{{ pdata.splitPackageTime }}</g-text-ellipsis></g-list-group-item>
              <g-list-group-item label="OMS单号">
                <g-text-ellipsis class="linkClass text-primary" @click.native="toList(pdata.omOrderId, 'order')">{{ pdata.omOrderId }}</g-text-ellipsis>
              </g-list-group-item>
              <g-list-group-item label="状态">
                <g-text-ellipsis :style="markRedStyle(pdata.orderStatus)">{{ pdata.orderStatusName }}</g-text-ellipsis>
              </g-list-group-item>
              <g-list-group-item label="停留时间">
                <g-text-ellipsis :style="markRedStyle(pdata.orderStatus)">{{ pdata.orderManagementStayTime }}</g-text-ellipsis>
              </g-list-group-item>
            </g-list-group>
          </Block>
        </div>
        <!-- 包裹 -->
        <div class="column2" :style="column2Style(pdata.packageList, 'marginTop')">
          <div v-for="(item, i) in pdata.packageList" :key="i" class="d-flex">
            <Block :disabled="item.disabled" :lb-line="i!== pdata.packageList.length - 1" :item-data="{...item, icon: 'el-icon-baoguo'}" :lt-line="i!== 0" l-line :to-list="toList" />
            <!-- 包裹状态： 7已推送    9已发货  正常色调，  其他状态灰色调-->
            <Block :disabled="item.disabled||![7, 9].includes(item.packageStatus)" l-line :item-data="{title: item.warehouseName, icon: 'el-icon-home'}">
              <g-list-group item-class="text-start py-1" label-width="70px">
                <g-list-group-item label="发货时间">
                  <g-text-ellipsis>{{ item.deliveryTime }}</g-text-ellipsis></g-list-group-item>
                <g-list-group-item label="WMS单号">
                  <g-text-ellipsis>{{ item.wmsOrderNo }}</g-text-ellipsis>
                </g-list-group-item>
                <g-list-group-item label="WMS状态">
                  <g-text-ellipsis>{{ item.wmsStatusName }}</g-text-ellipsis>
                </g-list-group-item>
                <g-list-group-item label="WMS停留">
                  <g-text-ellipsis>{{ item.warehouseStayTime }}</g-text-ellipsis>
                </g-list-group-item>
              </g-list-group>
            </Block>
          </div>
        </div>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { calcDate } from '@/util/date.js'
import { getPlatformList, getOrderPosition } from '@/api/common.js'
import Block from '../components/block.vue'
import DropdownLabel from '@/views/components/dropdown-label/index.vue'

export default {
  name: 'OmsPlatformOrdersPosition',
  components: { Block, DropdownLabel },
  data() {
    return {
      rules: {
        platformCode: [{ required: true, message: '请选择销售平台' }],
        order: [{ required: true, message: '请输入单号' }]
      },
      positionData: [],
      platOrder: {
        icon: 'el-icon-pingtaidingdan',
        title: '平台订单'
      },
      orderManagement: {
        icon: 'el-icon-dingdanguanli',
        title: '订单管理'
      },
      form: {
        platformCode: '',
        order: ''
      },
      platformList: [],
      dropType: 'platOrderId',
      orderTypeList: [
        { value: 'platOrderId', label: '平台单号' },
        { value: 'omOrderId', label: 'OMS单号' },
        { value: 'packageCode', label: '包裹号' }
      ],
      loading: false
    }
  },
  computed: {
    orderType() {
      return function(orderType) {
        const arr = [
          { title: '销售平台', icon: 'el-icon-pingtai' },
          { title: '手工导入', icon: 'el-icon-download' }
        ]
        return arr[orderType]
      }
    },
    wrapPadding() {
      return function(list) {
        const len = list?.length || 0
        const pt = [0, 0, 20][len] ?? 40
        return { 'padding-top': pt + 'px' }
      }
    },
    column2Style() {
      return function(list) {
        const len = list?.length || 0
        const mt = [0, 190, 110][len] ?? 40
        return { 'margin-top': mt + 'px' }
      }
    }
  },
  watch: {
    dropType(val) {
      if (val === 'platOrderId') {
        this.rules.platformCode = [{ required: true, message: '请选择销售平台' }]
      } else {
        this.rules.platformCode = null
        this.form.platformCode = ''
        this.$refs.formRef.clearValidate('platformCode')
      }
    }
  },
  created() {
    getPlatformList().then(res => {
      this.platformList = res.data.map(item => {
        return { label: item.platformName, value: item.platformCode }
      })
    })
  },
  activated() {
    this.getDate()
  },
  deactivated() {
    this.clearTime()
  },
  methods: {
    toList(id, type, storeCode) {
      const obj = {
        order: { path: 'oms/orderManagement/details', key: 'omOrderId' },
        pack: { path: 'oms/packOrders/details/index', key: 'packageCode' },

        LZ: { path: 'oms/platformOrders/lazada/details', key: 'orderId' },
        AM: { path: 'oms/platformOrders/amazon/details', key: 'platOrderId' },
        SM: { path: 'oms/platformOrders/SMT/details', key: 'platOrderId' },
        EB: { path: 'oms/platformOrders/ebay/details', key: 'platOrderId' },
        WH: { path: 'oms/platformOrders/wish/details', key: 'platOrderId' },
        SP: { path: 'oms/platformOrders/shopee/details', key: 'platOrderId' },
        WM: { path: 'oms/platformOrders/walmart/details', key: 'purchaseOrderId' }
      }[type]

      if (type === 'LZ') obj.path += `/-/${storeCode}`
      this.$newPage({
        path: obj.path,
        data: { [obj.key]: id }
      })
    },
    getDate() {
      if (this.positionData.length === 0) return
      this.positionData = this.positionData.map((item, i) => {
        let hasNullTime = false
        const { lastPkgDeliveryTime, omCreateTime, cancelTime, splitPackageTime, firstGrabDate, packageList } = item

        const hasOrderStayTimeEnd = cancelTime || splitPackageTime
        // 首次获取包裹的停留时间，并判断(包裹的停留时间)是否需要开启定时器
        item.packageList = packageList && packageList.map(item => {
          item.packageStayTime = this.dateDiff(item.pkgCreateTime, item.lastCancelTime || item.lastPushWmsTime)
          item.warehouseStayTime = this.dateDiff(item.lastPushWmsTime, item.deliveryTime)
          if (!item.deliveryTime) hasNullTime = true
          return item
        })

        // 首次获取订单管理停留时间 和 订单总处理时间（lastPkgDeliveryTime不为空）
        item.orderManagementStayTime = this.dateDiff(omCreateTime, cancelTime || splitPackageTime)
        item.orderTotalDealTime = this.dateDiff(firstGrabDate, lastPkgDeliveryTime)
        // 开启定时器
        if (!lastPkgDeliveryTime || hasNullTime || !hasOrderStayTimeEnd) {
          item.timeId = setInterval(() => {
            const newItemData = {}
            // 订单管理停留时间 是否需要定时更新
            if (!hasOrderStayTimeEnd) newItemData.orderManagementStayTime = this.dateDiff(omCreateTime)

            // 订单总处理时间 是否需要定时更新
            if (!lastPkgDeliveryTime) newItemData.orderTotalDealTime = this.dateDiff(firstGrabDate)

            // 包裹的停留时间 是否需要定时更新
            if (hasNullTime) {
              newItemData.packageList = packageList && packageList.map(item => {
                item.packageStayTime = this.dateDiff(item.pkgCreateTime, item.lastCancelTime || item.lastPushWmsTime)
                item.warehouseStayTime = this.dateDiff(item.lastPushWmsTime, item.deliveryTime)
                return item
              })
            }
            this.$set(this.positionData, i, { ...item, ...newItemData })
          }, 1000 * 10)
        }
        return item
      })
    },
    dateDiff(date1, date2) {
      if (!date1) return ''
      const curDate = (date2 ? new Date(date2) : new Date()).getTime()
      const oldDate = new Date(date1).getTime()

      const d = calcDate(oldDate, curDate)
      return `${d.days} 天 ${d.hours} 时 ${d.minutes} 分`
    },
    search() {
      if (this.loading) return
      this.$refs.formRef.validate((bool) => {
        if (!bool) return
        this.loading = true
        this.clearTime()
        this.positionData = []
        const { order, platformCode } = this.form
        const data = {
          platformCode,
          [this.dropType]: order
        }
        getOrderPosition(data).then(res => {
          this.positionData = res.data.map(item => {
            if (item.orderType === 0) item.createUserName = '系统管理员'
            item.hasPackage = !!item.packageList?.length
            if (!item.packageList?.length) {
              item.packageList = [{ disabled: true }]
            }
            return item
          })
          this.getDate()
        }).catch(() => {
          this.positionData = []
        }).finally(() => {
          this.loading = false
        })
      })
    },
    clearTime() {
      this.positionData.forEach(item => {
        if (item.timeId) {
          clearInterval(item.timeId)
          item.timeId = null
        }
      })
    },
    reset() {
      this.$refs.formRef.resetFields()
      this.clearTime()
      this.positionData = []
    },
    markRedStyle(data) {
      return [1, 5, 6].includes(data) ? 'color:red;' : ''
    }
  }
}
</script>
<style lang="scss" scoped>
$color: rgba(133, 241, 169, .9);
.containerWrap{
  height:100%;
  position:relative;
  padding-top:0;
  .form-class{
    position: sticky;
    top: 0;
    left: 0;
    z-index: 99;
    padding-top:7px;
    background: #fff;
    ::v-deep .order-el>.el-form-item__content>.el-form-item__error{
      left: 90px;
    }
  }
  .position-wrap {
     position:relative;
     &:not(:last-child){
      border-bottom: 1px solid #eee;
     }
  }
}
.linkClass{
  cursor: pointer;
  &:hover{
    text-decoration: underline;
  }
}
.details{
  position: absolute;
  top: 0px;
  right: 0;
  z-index: 9;
  // background-color: #fff;
  // box-shadow: 0px 0px 50px var(--color-primary) inset;
  // border-radius: 4px;
  max-width:260px;
  min-width:170px;
}
.flow-wrap{
  display: flex;
  // justify-content: space-between;
  min-height: 400px;
  &>div{
    height: 90%;
  }
  .column1{
    width: 46%;
    min-width: 560px;
    .horizontal2-line{
      opacity: .5;
      position:absolute;
      height: 4px;
      right:0;
      top: calc(50% + 46px);
      transform:translateY(-50%);
      background-color: $color;
    }
  }
  .column2{
    width: 54%;
    min-width: 560px;
  }
}
</style>
