<template>
  <!-- 商品管理/商品信息-->
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <!-- 顶部搜索 -->
      <template slot="header">
        <el-form label-width="100px" size="mini">
          <el-row :gutter="10" class="searchBox">
            <el-col :span="9">
              <el-form-item prop="supplierId" label="供应商名称">
                <g-select v-model="submit.supplierId" style="width:80%;" :items="supplierList" key-field="supplierId" label-field="supplierName" value-field="supplierId" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="goodsName" label="商品名称">
                <el-input
                  v-model="submit.goodsName"
                  style="width:80%;"
                  clearable
                  placeholder="请输入"
                />
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="status" label="状态">
                <el-select
                  ref="input"
                  v-model="submit.status"
                  style="width:80%;"
                  clearable
                  placeholder="请选择"
                  filterable
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.dictKey"
                    :label="item.dictValue"
                    :value="item.dictKey"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="goodsCode" label="商品编码">
                <el-input
                  v-model="submit.goodsCode"
                  style="width:80%;"
                  clearable
                  placeholder="请输入"
                />
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
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="addBtn()"
                >新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- 编码跳转详情 -->
      <el-table-column slot="supplierName" label="供应商名称" min-width="130" align="center">
        <template v-slot="{row}">
          <g-link v-if="row.status != 0" @click="detailBtn(row)">
            <g-text-ellipsis :lines="2">{{ row.supplierName }}</g-text-ellipsis>
          </g-link>
          <span v-else>
            <g-text-ellipsis :lines="2">{{ row.supplierName }}</g-text-ellipsis>
          </span>
        </template>
      </el-table-column>

      <!-- 商品图片 -->
      <el-table-column
        slot="mainPictureUrl"
        label="商品图片"
        align="center"
      >
        <template slot-scope="scope">
          <g-thumb :url="scope.row.mainPictureUrl" />
        </template>
      </el-table-column>

      <!--是否带包装  -->
      <el-table-column
        slot="isDefault"
        label="是否带包装"
        align="center"
        min-width="90"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.isPackaged == 1">是</span>
          <span v-if="scope.row.isPackaged == 2">否</span>
        </template>
      </el-table-column>

      <!-- 状态 -->
      <el-table-column slot="status" label="状态" min-width="80" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">草稿</span>
          <span v-if="scope.row.status == 1">启用</span>
          <span v-if="scope.row.status == 2">停用</span>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column slot="handler" label="操作" fixed="right" align="center" min-width="150">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 0"
            type="text"
            @click="enableBtn(scope.row)"
          >启用</el-button>
          <el-button
            v-if="scope.row.status == 0"
            type="text"
            @click="addBtn(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="scope.row.status == 0"
            type="text"
            @click="removeBtn(scope.row)"
          >删除</el-button>
          <el-button
            v-if="scope.row.status == 1"
            type="text"
            @click="addBtn(scope.row,'adjust')"
          >调整</el-button>
          <el-button
            v-if="scope.row.status == 1"
            type="text"
            @click="disableBtn(scope.row)"
          >停用</el-button>
          <el-button
            v-if="scope.row.status != 0"
            type="text"
            @click="detailBtn(scope.row)"
          >详情</el-button>
        </template>
      </el-table-column>

    </g-table>

  </basic-container>
</template>

<script>
import { getList, updateStatus, remove } from '@/api/goodsManagement/goodsInfo.js'
import { supplier, getMyDictBiz } from '@/api/commonApi/common.js'
import goodsInfoAdd from './components/goodsInfoAdd.vue'
import goodsInfoDetails from './components/goodsInfoDetails.vue'
export default {
  name: 'SupplierGoodsManagementGoodsInfo',
  data() {
    return {
      loading: false,
      // 搜索参数
      submit: {
        supplierId: '',
        goodsCode: '',
        goodsName: '',
        status: ''
      },
      supplierList: [],
      searchData: {},
      statusList: [],
      //   表格
      // 表格数据
      headers: [
        {
          slot: true,
          slotName: 'supplierName'
        },
        {
          label: '商品类目',
          prop: 'category',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '商品品牌',
          prop: 'goodsBrand',
          minWidth: '90px',
          align: 'center'
        },
        {
          label: '商品名称',
          prop: 'goodsName',
          minWidth: '130px',
          showOverflowTooltip: true,
          align: 'center'
        },
        {
          slot: true,
          slotName: 'mainPictureUrl'
        },
        {
          label: '商品编码',
          prop: 'goodsCode',
          minWidth: '90px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'isDefault'
        },
        {
          slot: true,
          slotName: 'status'
        },
        {
          label: '操作人',
          prop: 'updateUserName',
          minWidth: '110px',
          align: 'center'
        },
        {
          label: '操作时间',
          prop: 'updateTime',
          width: '90px',
          align: 'center'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      //   提示弹框的状态
      isShow: false,
      title: '',
      enable: {},
      information: '',
      //   新增，修改
      isAdd: false,
      addData: {
        supplierId: '',
        goodsName: '',
        goodsUrl: '',
        goodsHeight: '',
        goodsWidth: '',
        isPackaged: '1',
        goodsLength: '',
        categoryId: '',
        status: 0,
        goodsCode: '',
        goodsBrandId: '',
        goodsWeight: '',
        goodsPlace: '',
        supplierFileDTOList: []
      },
      openData: '',
      //   详情
      detailData: '',
      addStatue: ''
    }
  },
  mounted() {
    this.getData()
    this.initialization()
  },
  methods: {
    //   获取数据
    getData() {
      supplier().then(res => {
        this.supplierList = res.data
      })
      getMyDictBiz('pss_product_info_status').then(res => {
        this.statusList = res.data
        this.statusList.unshift({ dictKey: '', dictValue: '全部' })
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
    //   重置
    reset() {
      this.submit.supplierId = ''
      this.submit.goodsCode = ''
      this.submit.goodsName = ''
      this.submit.status = ''
      this.searchData = {}
      this.initialization()
    },
    search() {
      this.searchData = JSON.parse(JSON.stringify(this.submit))
      this.initialization()
    },
    // 新增
    addBtn(val1, val2) {
      if (val1) {
        this.isAdd = false
        this.addStatue = val2
        this.openData = JSON.parse(JSON.stringify(val1))
        this.openData.categoryId = this.openData.categoryPathIds
      } else {
        this.isAdd = true
        this.openData = JSON.parse(JSON.stringify(this.addData))
      }
      this.$newTab({
        path: '/pss/goodsInfo/' + (this.isAdd ? 'add' : 'edit'),
        title: (this.isAdd ? '新增' : '编辑'),
        component: goodsInfoAdd,
        data: {
          isAdd: this.isAdd,
          define: this.define,
          close: this.close,
          addStatue: this.addStatue,
          openData: this.openData
        },
        clearCache: true,
        callback: (flag) => {
          if (flag) {
            this.isAdd ? this.reset() : this.initialization()
          }
        }
      })
    },
    // 关闭
    close() {
      this.openData = ''
      this.isMain = true
      this.isDetail = false
    },
    // 信息确认
    confirm(title, fn, obj1, obj2) {
      this.$confirm(`确定要${title}该条记录吗？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fn(obj1, obj2).then(() => {
          this.initialization()
          this.$message.success('操作成功!')
        })
      })
    },
    // 启用
    enableBtn(val1) {
      this.enable = JSON.parse(JSON.stringify(val1))
      this.enable.status = 1
      this.confirm('启用', updateStatus, this.enable.id, this.enable.status)
    },
    // 停用
    disableBtn(val1) {
      this.enable = JSON.parse(JSON.stringify(val1))
      this.enable.status = 2
      this.confirm('停用', updateStatus, this.enable.id, this.enable.status)
    },
    // 删除
    removeBtn(val1) {
      this.confirm('删除', remove, val1.id)
    },
    // 详情
    detailBtn(val) {
      this.detailData = val
      this.$newTab({
        path: '/pss/goodsInfo/Detail',
        title: '商品信息详情',
        component: goodsInfoDetails,
        data: {
          close: this.close,
          detailData: this.detailData
        },
        clearCache: true,
        callback: () => {}
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog--center .el-dialog__body{
    padding: 0;
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
</style>
