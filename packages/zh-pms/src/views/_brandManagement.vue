<template>
  <basic-container>
    <g-table ref="table" :headers="headers" row-key="id" :fetch="fetch">
      <template slot="header">
        <el-form ref="formRef" :model="form" size="mini" label-width="56px" class="form-col no-message" @submit.native.prevent="search">
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="维护人" prop="defendName">
                <VOrganization ref="organizationRef" v-model="form.defendName" style="width:100%;" input-placeholder="请选择维护人" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="品牌名" prop="brandName">
                <el-input v-model="form.brandName" placeholder="请输入名称进行模糊查询" type="text" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态" prop="status">
                <el-select v-model="form.status" clearable placeholder="请选择状态" style="width:100%;">
                  <el-option v-for="item in brandStatusOptions" :key="item.value" :value="+item.value" :label="item.label" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="0">
                <el-button type="primary" native-type="submit">搜索</el-button>
                <el-button @click="reset">重置</el-button>
                <el-button type="primary" @click="addBtn">新增</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="brandDescriptionSlot" label="品牌描述">
        <template #default="{row}">
          <g-text-ellipsis>
            {{ row.brandDescription }}
          </g-text-ellipsis>
        </template>
      </el-table-column>
      <el-table-column slot="handler" label="操作" width="100px">
        <template #default="{row}">
          <el-button size="mini" type="text" @click="modifyBtn(row)">修改</el-button>
          <el-button v-if="row.status === 2" size="mini" type="text" @click="delBtn(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { queryBrand, delBrand } from '@/api/brandManagement'
import BrandModal from './modal/brandModal.vue'
import VOrganization from '@/components/organization/index.vue'
import { getDict } from '@/api/common/dict'

export default {
  name: 'PmsBrandManagement',
  components: { VOrganization },
  props: {},
  data() {
    return {
      brandStatusOptions: [],
      form: {
        defendName: '',
        brandName: '',
        status: ''
      },
      loading: false,
      defaultColumnConfig: {
        align: 'center'
      },
      tableData: [],
      headers: [
        {
          label: '品牌编号',
          prop: 'brandNumber'
        },
        {
          label: '品牌名称',
          prop: 'brandName'
        },
        {
          slot: true,
          slotName: 'brandDescriptionSlot'
        },
        {
          label: '维护人',
          prop: 'defendName',
          width: 120
        },
        {
          label: '状态',
          prop: 'status',
          width: 90,
          formatter: (row, column, cellValue, index) => this.findName(this.brandStatusOptions, cellValue)
        },
        {
          label: '录入系统时间',
          prop: 'createTime',
          width: 160
        },
        {
          label: '品牌创建时间',
          prop: 'enterTime',
          width: 160
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ]
    }
  },
  created() {
    // 字典-配置类型
    getDict('brand-status', 'pms').then(res => {
      this.brandStatusOptions = res
    })
  },
  mounted() {
    this.$refs.table.load(1, this.form)
  },
  methods: {
    fetch({ current, size }, params) {
      const { defendName: names, brandName, status } = params
      return queryBrand({ current, size, deverId: names.id, brandName, status }).then(res => {
        return {
          records: res.data.records, // 列表数据
          total: res.data.total, // 总记录数
          size: res.data.size // 每页最大记录数
        }
      })
    },
    search() {
      // 传入搜索条件的参数，并重置到第一页进行搜索
      this.$refs.table.load(1, this.form)
    },
    findName(arr, index) {
      if (!arr.length) return index
      for (let i = 0; i < arr.length; i++) {
        if (+arr[i].value === index) {
          return arr[i].label
        }
      }
    },
    addBtn() {
      this.$modal({
        title: '新增品牌信息',
        component: BrandModal,
        data: { brandStatusOptions: this.brandStatusOptions, queryBrand: this.search }
      })
    },
    modifyBtn(row) {
      this.$modal({
        title: '修改品牌信息',
        component: BrandModal,
        data: { brandStatusOptions: this.brandStatusOptions, row, queryBrand: this.search }
      })
    },
    delBtn(ids) {
      this.$confirm('确认要删除该品牌？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await delBrand(ids)
        if (res.code === 200) {
          this.$message.success('品牌删除成功')
          this.search()
        }
      }).catch(() => { })
    },
    reset() {
      this.$refs.organizationRef.inputText = ''
      this.$refs.formRef.resetFields()
    }
  }
}
</script>
