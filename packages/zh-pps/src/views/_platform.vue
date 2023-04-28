<template>
  <!-- 采购需求/备货采购需求-->
  <basic-container>
    <g-table ref="table" :headers="headers" :fetch="fetch" row-key="id">
      <!-- 头部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="9">
              <el-form-item prop="platformCode" label="平台名称:">
                <el-select v-model="submit.platformCode" clearable placeholder="请选择" filterable style="width:80%" @change="platformChange">
                  <el-option v-for="item in platformList" :key="item.id" :label="item.platformName" :value="item.platformCode" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="siteId" label="经营站点:">
                <el-select v-model="submit.storeSiteIdArr" multiple clearable placeholder="请选择" filterable style="width:80%">
                  <el-option v-for="item in storeSiteList" :key="item.id" :label="item.siteCode" :value="item.siteId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="destWarehouseId" label="平台店铺级别:">
                <el-select v-model="submit.storeLevelIdArr" multiple clearable placeholder="请选择" filterable style="width:80%">
                  <el-option v-for="item in storeLevelList" :key="item.id" :label="item.storeLevelName" :value="item.storeLevelId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="storeCode" label="店铺编码:">
                <el-input v-model="submit.storeCodeList" clearable placeholder="多个查询用英文逗号隔开" style="width:80%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="btnBox">
                <el-button class="btn" type="primary" size="mini" icon="el-icon-search" @click="initialization()">查询</el-button>
                <el-button class="btn" icon="el-icon-delete" size="mini" @click="reset()">重置</el-button>
                <el-button type="primary" class="btn" icon="el-icon-plus" size="mini" @click="addBtn()">新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 状态 -->
      <el-table-column slot="storeCode" label="店铺编码" width="140">
        <template slot-scope="scope">
          <g-text-ellipsis :lines="2">{{ scope.row.storeCode }}</g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column
        slot="status"
        label="启用状态"
        align="center"
        min-width="120"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-text="开"
            :active-value="1"
            :inactive-value="2"
            inactive-text="关"
            @change="switchStatus(scope.row, 'enable')"
          />
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="150">
        <template v-slot="scope">
          <el-button type="text" @click="detailBtn(scope.row)">详情</el-button>
          <el-button type="text" @click="addBtn(scope.row)">编辑</el-button>
          <el-button type="text" @click="removeBtn(scope.row,'remove')">删除</el-button>
        </template>
      </el-table-column>
    </g-table>

    <!-- 提示信息 -->
    <el-dialog
      :visible.sync="isShow"
      :append-to-body="true"
      title="提示"
      width="20%"
      center
    >
      <p style="text-align: center;">确定要{{ title }}该条记录吗？</p>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancel()">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>
  </basic-container>

</template>

<script>
import { getList, updateStatus, remove } from '@/api/platform/platform-cost.js'
import { getMyDictBiz, listPlatForm, getStoreInfoByPlatformCode } from '@/api/commonApi.js'
import platformCostAdd from './components/platformCost/platformCostAdd.vue'
import platformCostDetail from './components/platformCost/platformCostDetail.vue'
import { debounce } from '@/util/util'

export default {
  name: 'Platform',
  data() {
    return {
      // 字典
      costTypeList: [],
      costCurrencyList: [],
      loading: false,
      // 搜索参数
      submit: {
        platformCode: '',
        storeSiteIdList: '',
        storeLevelIdList: '',
        storeCodeList: '',
        storeSiteIdArr: [],
        storeLevelIdArr: []
      },
      statusList: [],
      platformList: [],
      storeSiteList: [],
      storeLevelList: [],
      searchData: {},
      // 表格数据
      headers: [
        {
          label: '平台名称',
          prop: 'platformName',
          minWidth: '130px',
          align: 'center'
        },
        {
          label: '经营站点',
          prop: 'storeSiteName',
          minWidth: '130px',
          align: 'center'
        },
        {
          label: '平台店铺级别',
          prop: 'platformLevelName',
          minWidth: '180px',
          align: 'center'
        },
        { slot: true, slotName: 'storeCode' },
        // {
        //   label: '店铺编码',
        //   prop: 'storeCode',
        //   minWidth: '250px',
        //   align: 'center'
        // },
        {
          slot: true,
          slotName: 'status'
        },
        {
          label: '创建人',
          prop: 'createUserName',
          width: '90px',
          align: 'center'
        },
        {
          label: '创建时间',
          prop: 'createTime',
          width: '130px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'handler'
        }],
      //   提示弹框的状态
      isShow: false,
      title: '',
      enable: {},
      remove: {},
      information: '',
      // 新增，修改
      isOpen: false,
      isAdd: false,
      addData: {
        name: '',
        beginScore: '',
        endScore: '',
        description: ''
      },
      openData: '',
      //   详情
      detailData: '',
      isDetail: false
    }
  },
  created() {
  },
  mounted() {
    this.getData()
    this.initialization()
  },
  methods: {
    //   获取信息
    getData() {
      getMyDictBiz('pps_comon_cost_type').then(res => {
        const data = res.data
        this.costTypeList = data
      })
      getMyDictBiz('pps_account_currency').then(res => {
        const data = res.data
        this.costCurrencyList = data
      })
      listPlatForm().then(res => {
        if (res.code === 200) {
          const data = res.data
          this.platformList = data
        } else {
          this.$message.error('状态获取失败')
        }
      })
    },
    platformChange(val) {
      // 重置当前平台带出的数据
      this.storeSiteList = []
      this.storeLevelList = []
      this.storeCodeList = []
      this.platformList.forEach(item => {
        if (item.platformCode === val) {
          if (item.sites) {
            this.storeSiteList = item.sites
          } else {
            this.$message.error('当前平台无站点！')
          }
        }
      })
      getStoreInfoByPlatformCode(val).then(res => {
        if (res.code === 200) {
          const data = res.data
          data.forEach(item => {
            if (item.storeLevelId === -1) {
            } else {
              this.storeLevelList.push(item)
              this.storeCodeList.push(item)
            }
          })
          // 去重
          this.storeLevelList = this.unique(this.storeLevelList)
        } else {
          this.$message.error('平台店铺等级获取失败！')
        }
      })
    },
    unique(arr) {
      const res = new Map()
      return arr.filter((arr) => !res.has(arr.storeLevelId) && res.set(arr.storeLevelId, 1))
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
      // 初始化查询条件的数组为str逗号隔开
      this.submit.storeSiteIdList = this.convertArr2Str(this.submit.storeSiteIdArr)
      this.submit.storeLevelIdList = this.convertArr2Str(this.submit.storeLevelIdArr)
      this.$refs.table.load(1, this.submit)
    },
    convertArr2Str(arr) {
      let str = ''
      arr.forEach((item, index) => {
        if (index === 0) {
          str = item
        } else {
          str = str + ',' + item
        }
      })
      return str
    },
    //   重置
    reset() {
      // 搜索参数
      this.submit = {
        platformCode: '',
        storeSiteIdList: '',
        storeLevelIdList: '',
        storeCodeList: '',
        storeSiteIdArr: [],
        storeLevelIdArr: []
      }
      this.storeSiteList = []
      this.initialization()
    },
    // 新增
    addBtn(val) {
      if (val) {
        this.isAdd = false
      } else {
        this.isAdd = true
      }
      this.$newTab({
        path: '/pps/platformCost/add',
        title: (this.isAdd ? '新增平台成本' : '编辑平台成本'),
        component: platformCostAdd,
        data: {
          costTypeList: this.costTypeList,
          costCurrencyList: this.costCurrencyList,
          platformList: this.platformList,
          editData: this.isAdd ? {} : val,
          isAdd: this.isAdd
        },
        callback: (bool) => {
          if (bool) {
            this.isAdd ? this.reset() : this.initialization()
          }
        }
      })
    },
    // 验证
    validation(val) {
      if (val.beginScore === '' || val.endScore === '' || val.name === '') {
        this.$message.error('请填写必填项！')
        return false
      } else if (parseInt(val.beginScore) >= parseInt(val.endScore)) {
        this.$message.error('起始分值不能大于或等于截止分值')
        return false
      } else {
        return true
      }
    },
    // 关闭
    close() {
      this.isShow = false
    },
    // 信息确认
    confirm(title, obj, fn) {
      this.$confirm(`确定要${title}该条记录吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fn(obj).then(() => {
          this.initialization()
          this.$message.success('操作成功!')
        })
      })
    },
    // 切换状态
    cancel() {
      if (this.information === 'enable') {
        this.enable.status === 1 ? this.enable.status = 2 : this.enable.status = 1
      }
      this.isShow = false
    },
    // 切换状态
    switchStatus: debounce(function(row) {
      updateStatus(row.id, row.status).then(res => {
        const { code, msg } = res
        code === 200 && this.$message.success(msg)
      })
    }, 500),
    // 删除
    removeBtn(val) {
      this.confirm('删除', val.id, remove)
    },
    // 详情
    detailBtn(val) {
      this.$newTab({
        path: '/pps/platformCost/detail',
        title: '平台成本详情',
        component: platformCostDetail,
        data: {
          detailData: val
        },
        callback: (bool) => {

        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-dialog--center .el-dialog__body {
    padding: 0;
  }

  ::v-deep input::-webkit-outer-spin-button,
  ::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::v-deep input[type="number"] {
    -moz-appearance: textfield;
  }

  .searchBox {
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }

  .btnBox {
    ::v-deep .el-form-item__content {
      margin-left: 20px !important;
    }

    .btn {
      width: 30%;
    }
  }

  .block {
    text-align: right;
    margin: 10px 10px 0 0;
  }

  .tableData {
    // margin-top: 10px;
    padding: 0 10px;

    .addBox {
      width: 100%;
      height: 30px;
      margin-bottom: 10px;
      text-align: right;
      box-sizing: border-box;
      padding-right: 20px;
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

        ::v-deep .el-form-item__content {
          width: 60%;

          ::v-deep .el-input-group__prepend {
            width: 25%;
            padding: 0;
            text-align: center;
          }
        }

        .biaozhi {
          color: red;
          font-size: 12px;
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
