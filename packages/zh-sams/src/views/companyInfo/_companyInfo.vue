<template>
  <!-- <p>店铺列表</p> -->
  <basic-container>
    <!-- 公司信息管理 -->
    <g-table ref="table" :headers="columns" row-key="id" :fetch="fetch" @selection-change="checkedHandler">
      <template slot="header">
        <el-form
          ref="formObjRef"
          :model="formObj"
          label-width="100px"
          class="no-message form-col"
          size="mini"
          @submit.native.prevent="search"
        >
          <el-row :gutter="10">
            <el-col :span="6">
              <el-form-item label="公司名称" prop="name">
                <el-input v-model="formObj.name" size="mini" class="w160" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公司类型" prop="type">
                <el-select v-model="formObj.type" clearable placeholder="请选择" size="mini" class="w160" @change="search">
                  <el-option
                    v-for="(item,index) in findForm.typeOption"
                    :key="index"
                    :label="item.displayName"
                    :value="item.hiddenValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="工商年审日期"
                prop="annualAuditStatus"
              >
                <el-select
                  v-model="formObj.annualAuditStatus"
                  clearable
                  placeholder="请选择"
                  size="mini"
                  class="w160"
                  @change="search"
                >
                  <el-option
                    v-for="(item,index) in findForm.annualAuditStatusOption"
                    :key="index"
                    :label="item.displayName"
                    :value="item.hiddenValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="是否年审"
                prop="audit"
              >
                <el-select
                  v-model="formObj.audit"
                  clearable
                  placeholder="请选择"
                  size="mini"
                  class="w160"
                  @change="search"
                >
                  <el-option
                    v-for="(item,index) in findForm.auditOption"
                    :key="index"
                    :label="item.displayName"
                    :value="item.hiddenValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="属性"
                prop="nature"
              >
                <el-select
                  v-model="formObj.nature"
                  clearable
                  placeholder="请选择"
                  size="mini"
                  class="w160"
                  @change="search"
                >
                  <el-option
                    v-for="(item,index) in findForm.natureOption"
                    :key="index"
                    :label="item.displayName"
                    :value="item.hiddenValue"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="法人"
                prop="legalPerson"
              >
                <el-input v-model="formObj.legalPerson" placeholder="请输入" size="mini" class="w160" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="税务代理公司"
                prop="taxAgencyCompany"
              >
                <el-input v-model="formObj.taxAgencyCompany" placeholder="请输入" size="mini" class="w160" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="mini" native-type="submit">搜 索</el-button>
              <el-button size="mini" @click="handlerReact('formObjRef')">清 空</el-button>
              <g-auth code="company_add">
                <el-button size="mini" type="primary" @click="handlerAdd">添加公司</el-button>
              </g-auth>
              <g-auth code="company_import">
                <el-button :disabled="!checkedIds.length" size="mini" type="primary" @click="handlerImport">导出</el-button>
              </g-auth>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <el-table-column slot="handler" label="操作" width="100">
        <template v-slot="{row}">
          <g-auth code="company_edit">
            <el-button type="text" @click="handlerAdd(row)">编辑</el-button>
          </g-auth>
          <g-auth code="company_details">
            <el-button type="text" @click="handlerDetails(row)">详情</el-button>
          </g-auth>
        </template>
      </el-table-column>
    </g-table>
  </basic-container>
</template>

<script>
import { companyPage, companyExport } from '@/api/companyInfo'
import { dictionary } from '@/api/public'
import CompDetails from './components/compDetails'
import CompEdit from './components/compEdit'
import { dowloadExc } from '@/util/util'
import { mapGetters } from 'vuex'

export default {
  name: 'SamsCompanyInfoCompanyInfo',
  data() {
    return {
      formObj: {
        name: '',
        legalPerson: '',
        nature: '',
        type: '',
        taxAgencyCompany: '',
        annualAuditStatus: '',
        audit: ''
      },
      findForm: {
        typeOption: [], // 公司类型
        annualAuditStatusOption: [], // 工商年审
        auditOption: [], // 是否年审
        natureOption: [] //  属性
      },
      columns: [
        {
          type: 'selection'
        }, {
          label: '公司名称',
          prop: 'name'
        }, {
          label: '属性',
          prop: 'nature',
          width: 70
        }, {
          label: '公司类型',
          prop: 'type',
          width: 70
        }, {
          label: '法人',
          prop: 'legalPerson',
          width: 70
        }, {
          label: '是否年审',
          prop: 'annualAudit',
          formatter: (row, column, cellValue, index) => cellValue === true ? '是' : cellValue == null ? '-' : '否',
          width: 80
        }, {
          label: '税务代理公司',
          prop: 'taxAgencyCompany',
          'show-overflow-tooltip': true // 溢出点点
        }, {
          label: '统一社会信用代码',
          prop: 'unifiedSocialCreditCode',
          'show-overflow-tooltip': true, // 溢出点点
          width: 140
        }, {
          label: '注册时间',
          prop: 'regDate',
          width: 90
        }, {
          label: '工商年审日期',
          prop: 'annualAuditDate',
          width: 100
        }, {
          slotName: 'handler',
          slot: true
        }
      ],
      checkedIds: []
    }
  },
  computed: {
    ...mapGetters(['permission'])
  },
  activated() {
    this.$refs.table.load(1, this.formObj)
    this.dictionary('sams_company_nature')
    this.dictionary('sams_company_type')
    this.dictionary('sams_annual_audit_date')
    this.dictionary('sams_yes_or_not')
  },
  methods: {
    fetch({ current, size }, params) {
      return companyPage({ ...params, current, size }).then(res => {
        const data = res.data
        data.records.forEach(acc => {
          if (acc.regDate && acc.regDate.indexOf('00:00:00') > -1) {
            acc.regDate = acc.regDate.split('00:00:00')[0]
          }
          if (acc.annualAuditDate && acc.annualAuditDate.indexOf('00:00:00') > -1) {
            acc.annualAuditDate = acc.annualAuditDate.split('00:00:00')[0]
          }
        })
        return {
          records: data.records,
          total: data.total,
          size: data.size // 每页最大记录数
        }
      })
    },
    search() {
      this.$refs.table.load(1, this.formObj)
    },
    // 添加
    handlerAdd(row, type) {
      row = row || ''
      type = type || ''
      this.$newTab({
        name: '/comp/details',
        title: row.id ? '修改公司信息' : '新增公司信息',
        component: CompEdit,
        clearCache: true,
        data: {
          compId: row.id,
          findFormProp: this.findForm
        },
        callback: refresh => {
          refresh && this.search()
        }
      })
    },
    // 导出
    handlerImport() {
      const name = '公司信息.xlsx'
      companyExport({ ...this.formObj, ids: this.checkedIds }).then(res => {
        if (res.size) {
          dowloadExc(res, name)
        }
      }).catch(() => {
        this.$message.error('请求异常，导出失败！')
      })
    },
    // 详情
    handlerDetails(row) {
      this.$newTab({
        name: '/comp/details',
        title: '详情',
        component: CompDetails,
        clearCache: true,
        data: {
          compId: row.id
        }
      })
    },
    // 表格多选
    checkedHandler(data) {
      this.checkedIds = data.map(item => item.id)
    },
    // 字典
    dictionary(code) {
      dictionary({ code: code }).then(res => {
        const arr = res.data
        switch (code) {
          case 'sams_company_nature':
            this.findForm.natureOption = arr
            break
          case 'sams_company_type':
            this.findForm.typeOption = arr
            break
          case 'sams_annual_audit_date':
            this.findForm.annualAuditStatusOption = arr
            break
          case 'sams_yes_or_not':
            this.findForm.auditOption = arr
            break
        }
      })
    },
    // 重置
    handlerReact(formName) {
      this.$refs[formName].resetFields()
      this.search()
    }
  }
}
</script>

<style scoped>

.w160 {
  width: 160px;
}
</style>
