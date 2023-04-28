<template>
  <!-- 订单管理/退货订单-->
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <!-- 顶部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini" class="searchBox">
          <el-row :gutter="10">
            <el-col :span="9">
              <el-form-item>
                <span slot="label">退货运单号</span>
                <el-input v-model="submit.returnGoodsWaybill" placeholder="请填写" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item>
                <span slot="label">采购编码</span>
                <el-input v-model="submit.purchaseCode" placeholder="请填写" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item>
                <span slot="label">收货人</span>
                <el-input v-model="submit.receiptPeople" placeholder="请填写" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="status" label="状态">
                <el-select
                  ref="input"
                  v-model="submit.status"
                  clearable
                  placeholder="请选择"
                  filterable
                >
                  <el-option
                    v-for="item in goodsStatus"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="btnBox">
                <el-button
                  class="btn"
                  type="primary"
                  icon="el-icon-search"
                  @click="search()"
                >查询</el-button>
                <el-button
                  class="btn"
                  icon="el-icon-delete"
                  @click="reset()"
                >重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="returnGoodsCode" label="退货编码" min-width="120" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.returnGoodsStatus != 1" @click="detailBtn(row)">{{ row.returnGoodsCode }}</g-link>
          <span v-else>{{ row.returnGoodsCode }}</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" min-width="70" align="center">
        <template slot-scope="scope">
          <div v-for="item in goodsStatus" :key="item.dictKey">
            <span v-if="scope.row.status == item.dictKey">{{ item.dictValue }}</span>
          </div>
        </template></el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="130">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 1"
            type="text"
            @click="addBtn(scope.row)"
          >确认收货</el-button>
          <el-button
            v-if="scope.row.status != 1"
            type="text"
            @click="detailBtn(scope.row)"
          >详情</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import { getList, getDictBiz } from '@/api/orderManagement/returnOrder.js'
import addBox from './components/confirmReceipt.vue'
import returnOrderDetails from './components/returnOrderDetails.vue'
export default {
  name: 'SupplierOrderManagementReturnOrder',
  data() {
    return {
      // 搜索参数
      submit: {
        returnGoodsWaybill: '',
        purchaseCode: '',
        status: '',
        receiptPeople: ''
      },
      //   状态
      goodsStatus: [],
      tableMaxHeight: 'auto',
      searchData: {},
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'returnGoodsCode'
        },
        {
          label: '采购编码',
          prop: 'purchaseCode',
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '退货运单号',
          prop: 'returnGoodsWaybill',
          minWidth: '120px',
          align: 'center'
        },
        {
          label: '退货人',
          prop: 'returnGoodsPeople',
          minWidth: '80px',
          align: 'center'
        },
        {
          label: '退货时间',
          prop: 'returnGoodsTime',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '退货数量',
          prop: 'returnGoodsNumber',
          minWidth: '80px',
          align: 'center'
        },

        {
          label: '收货人',
          prop: 'receiptPeople',
          minWidth: '80px',
          align: 'center'
        },
        {
          label: '收货时间',
          prop: 'receiptTime',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '收货数量',
          prop: 'receiptNumber',
          minWidth: '90px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'status'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      isAdd: false,
      title: '',
      enable: {},
      information: '',
      addData: {
        name: '',
        type: '',
        score: '',
        description: ''
      },
      openData: '',
      //   详情
      detailData: '',
      classified: '',
      isDetail: false
    }
  },
  mounted() {
    this.getDictBiz()
    this.initialization()
  },
  methods: {
    getDictBiz() {
      getDictBiz('pss_return_order_status').then(res => {
        const data = res.data
        this.goodsStatus = data
        this.goodsStatus.unshift({ dictKey: '', dictValue: '全部' })
      })
    },
    // 初始化数据
    fetch({ current, size }, params) {
      return getList(current, size, params).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.pageSize // 每页最大记录数
        }
      })
    },
    initialization() {
      this.$refs.table.load(1, this.searchData)
    },
    search() {
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    // 新增
    addBtn(val) {
      this.$newTab({
        path: '/orderManagement/returnOrder',
        title: '确认收货',
        component: addBox,
        data: {
          id: val.id
        },
        callback: bool => {
          if (bool) {
            this.initialization()
          }
        },
        clearCache: true
      })
    },
    // 关闭
    close() {
      this.isAdd = false
      this.isDetail = false
    },
    //   重置
    reset() {
      this.submit.returnGoodsWaybill = ''
      this.submit.purchaseCode = ''
      this.submit.status = ''
      this.submit.receiptPeople = ''
      this.searchData = {}
      this.initialization()
    },

    // 详情
    detailBtn(val) {
      this.$newTab({
        path: '/orderManagement/returnOrderDetails',
        title: '退货订单详情',
        component: returnOrderDetails,
        data: {
          id: val.id
        },
        callback: () => {},
        clearCache: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep input::-webkit-outer-spin-button,
  ::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  ::v-deep input[type="number"]{
    -moz-appearance: textfield;
  }
  .btnBox{
    ::v-deep .el-form-item__content{
      margin-left: 20px!important;
    }
    .btn{
      width: 30%;
    }
  }
  .searchBox{
    ::v-deep .el-form-item{
      margin-bottom: 0;
    }
  }
  .block {
    text-align: right;
    margin: 10px 10px 0 0;
  }
  .tableData {
    margin-top: 15px;
    // padding: 0 10px;
    .addBox {
      width: 100%;
      height: 30px;
      margin-bottom: 10px;
    }
  }
  .openBox {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    translate: all 1s;
    background: rgba($color: #000000, $alpha: 0.5);
    .addBox {
      box-sizing: border-box;
      width: 450px;
      height: auto;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      border-radius: 5px;
      .header {
        box-sizing: border-box;
        padding: 0 20px;
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #cccccc;
        .title {
          font-size: 18px;
        }
        .closeBtn {
          cursor: pointer;
          i {
            size: 16px;
          }
        }
      }
      .main {
        width: 100%;
        padding-top: 20px;
        ::v-deep .el-select{
          width: 100%;
        }
        ::v-deep .el-form-item__content{
          width: 60%;
          ::v-deep .el-input-group__prepend{
            width: 25%;
            padding: 0;
            text-align: center;
          }
        }
      }
      .footer {
        text-align: center;
        //   margin-top: 30px;
        padding-bottom: 20px;
      }
    }
  }
</style>
