<template>
  <basic-container class="ebay-car-temp">
    <el-form ref="form" v-loading="loading" :model="form" size="mini" class="form-col" label-width="76px" :rules="rules">
      <el-form-item label="模板名称" prop="name">
        <div v-if="row">{{ form.name }}</div>
        <el-input v-else v-model="form.name" placeholder="请输入模板名称" class="w-50" />
      </el-form-item>
      <el-form-item label="刊登站点" prop="siteCode">
        <div v-if="row">{{ form.siteCode }}</div>
        <el-select v-else v-model="form.siteCode" class="w-50" filterable @change="changeSite">
          <el-option v-for="(item, index) in siteOption" :key="index" :value="item.displayName" :label="item.displayName" />
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="24">
          <el-row>
            <el-col v-for="(tList,tIndex) in tempHeadTitle" :key="tIndex" :span="3" class="ms-1">
              <div>{{ tList.propertyDisplayName }}</div>
            </el-col>
          </el-row>
          <el-row class="mt-2">
            <el-col v-for="(value, i) in platformLevels" :key="i" :span="3" class="ms-1">
              <el-select
                v-model="platformCategoryId[i]"
                size="mini"
                multiple
                clearable
                collapse-tags
                filterable
                placeholder="请选择"
                popper-class="publish-category-select"
                @visible-change="visibleChange($event, i)"
                @remove-tag="visibleChange(false, i)"
                @clear="visibleChange(false, i)"
              >
                <el-option v-for="(item, index) in value" :key="index" :value="item" :label="item" :title="item" />
              </el-select>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="mb-3 mt-3">
        <el-col :span="12">
          <el-button v-if="tempHeadTitle.length"
                     :loading="btnLoading"
                     size="mini"
                     type="primary"
                     :disabled="!(platformCategoryId[tempHeadTitle.length - 1] && platformCategoryId[tempHeadTitle.length - 1].length)"
                     @click="append"
          >生成车型库模板</el-button>
        </el-col>
        <el-col :span="12" class="text-end">
          <el-button v-if="tableData.length" size="mini" type="danger" :disabled="!checked.length" @click="handleBatchDel">批量删除</el-button>
        </el-col>
      </el-row>
      <el-table v-if="tempHeadTitle.length"
                :data="tableData"
                border
                row-key="index"
                stripe
                highlight-current-row
                class="form-table g-table v-table mb-4"
                max-height="400px"
                @selection-change="handleSelectionChange"
      >
        <el-table-column v-if="tableData.length" type="selection" width="50" />
        <el-table-column v-for="(item, index) in tableHead" :key="index" :label="item.label" :property="item.property" min-width="50">
          <template v-if="column.property !== 'id'" slot-scope="{row, column}">
            {{ row[column.property] }}
          </template>
        </el-table-column>
        <el-table-column v-if="tableData.length" label="操作" width="70">
          <template slot-scope="{$index}">
            <el-button type="text" @click="handleDel($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-end">
        <el-button size="mini" @click="$parent.$emit('close')">取消</el-button>
        <el-button type="primary" size="mini" @click="submitDialog('form')">保存</el-button>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import { getSiteDefaultNames, getValuesBulkOptions, generateTableData, saveCarTemplate, updateCarTemplate, getCarTempDetail } from '@/api/ebay/template.js'
import { deepClone } from '@/util/util'
export default {
  name: 'EditModel',
  props: {
    row: Object,
    siteOption: Array
  },
  data() {
    return {
      tableHead: [],
      tableData: [],
      cacheData: [],
      tempHeadTitle: [],
      rules: {
        name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        siteCode: [{ required: true, message: '请选择站点', trigger: 'change' }]
      },
      form: {
      },
      platformLevels: [],
      platformCategoryId: [],
      filterConditions: [],
      headers: [
        {
          type: 'selection'
        },
        {
          label: '刊登站点',
          prop: 'siteCode'
        },
        {
          slot: true,
          slotName: 'handler'
        }
      ],
      checked: [],
      lastSecondData: [],
      loading: false,
      idsCache: [],
      editEmptyData: false,
      btnLoading: false
    }
  },
  created() {
    if (this.row) { // 编辑
      this.form = Object.assign(deepClone(this.row))
      this.getCarTempDetail() // 获取模板详情
    }
  },
  methods: {
    // 获取模板详情
    getCarTempDetail() {
      this.loading = true
      getCarTempDetail({ id: this.row.id }).then(res => {
        const data = res.data.details
        if (!data.length) {
          this.editEmptyData = true
          this.changeSite()
          this.loading = false
          return
        }
        const arr = data.map(item => JSON.parse(item.compatibilityJson))
        this.cacheData = deepClone(arr)
        this.getSiteDefaultNames(this.form.siteCode) // 筛选名
      })
    },
    changeSite() {
      this.tempHeadTitle = []
      this.platformLevels = []
      this.platformCategoryId = []
      this.idsCache = []
      this.tableData = []
      this.getSiteDefaultNames(this.form.siteCode)
    },
    getSiteDefaultNames(site) {
      getSiteDefaultNames({ site: site }).then(res => {
        this.tempHeadTitle = res.data
        if (this.tempHeadTitle.length) {
          this.getFirst()
        }
      })
    },
    getFirst() {
      const propertyName = this.tempHeadTitle[0].propertyName
      this.loading = true
      getValuesBulkOptions({ site: this.form.siteCode, propertyName: propertyName }).then(res => {
        const data = res.data[0].values
        if (!data) {
          this.loading = false
          return false
        }
        const arr = data.map(item => item[propertyName]).sort()
        this.platformLevels.unshift(arr)
        if (!this.row || this.form.siteCode !== this.row.siteCode || this.editEmptyData) {
          this.loading = false
          return
        }
        // 编辑时初始化值
        this.platformCategoryId.push(this.cacheData.map(item => item[propertyName]))
        const requestArr = []
        this.tempHeadTitle.forEach((item, index) => {
          this.platformCategoryId[index] = [...new Set(this.cacheData.map(e => e[item.propertyName]))]
          requestArr.push(this.getList(index))
        })
        this.idsCache = [...this.platformCategoryId]
        const combineArr = []
        Promise.all(requestArr).then(res => {
          res.forEach((item, index) => {
            // 保存倒数第二步的返回值，和最后一级的选中数组
            if (index === this.tempHeadTitle.length - 2) {
              this.lastSecondData = item
            }
            item && item.forEach(e => {
              combineArr[index] = e.values.map(v => v[this.tempHeadTitle[index + 1].propertyName]).sort()
            })
          })
          const data = [...new Set(combineArr)]
          this.platformLevels = [this.platformLevels[0], ...data]
          // 渲染表头
          this.tableHeadRender(this.cacheData)
          this.tableData = this.cacheData
          this.tableData.forEach((item, index) => {
            item.id = index
          })
        }).finally(() => {
          this.loading = false
        })
      })
    },
    getList(index) {
      const titleName = this.tempHeadTitle[index].propertyName
      const findItem = this.filterConditions.find(item => item.name === titleName)
      if (findItem) {
        findItem.values = this.platformCategoryId[index]
      } else {
        this.filterConditions.push({
          name: titleName,
          values: this.platformCategoryId[index]
        })
      }
      if (!this.tempHeadTitle[index + 1]) return // 最后一级选中不再请求接口
      const propertyName = this.tempHeadTitle[index + 1].propertyName // 获取下一级属性名
      const params = {
        site: this.form.siteCode,
        propertyName: propertyName,
        filterConditions: this.filterConditions // 筛选条件：前面已选数据
      }
      return getValuesBulkOptions(params).then(res => res.data)
    },
    // 下拉框展开收起事件
    visibleChange(val, i) {
      if (val) return
      const index = i
      // 当前选中值没有发生改变
      if (this.idsCache[index] && this.idsCache[index].join() === this.platformCategoryId[index].join()) return
      // 改变父级，删除子级参数
      const conditionsLastIndex = this.filterConditions.length - 1
      if (conditionsLastIndex > index) {
        this.deleteChild(index, this.filterConditions)
      }
      // 清空当前级,置空子级
      if (!this.platformCategoryId[index].length) {
        this.deleteChild(index + 1, this.platformLevels)
        this.deleteChild(index + 1, this.platformCategoryId)
        this.idsCache = [...this.platformCategoryId]
        this.deleteChild(index + 1, this.filterConditions)
        return
      }
      const titleName = this.tempHeadTitle[index].propertyName
      const findItem = this.filterConditions.find(item => item.name === titleName)
      if (findItem) {
        findItem.values = this.platformCategoryId[index]
      } else {
        this.filterConditions.push({
          name: titleName,
          values: this.platformCategoryId[index]
        })
      }
      if (!this.tempHeadTitle[index + 1]) return // 最后一级选中不再请求接口
      const propertyName = this.tempHeadTitle[index + 1].propertyName // 获取下一级属性名
      const params = {
        site: this.form.siteCode,
        propertyName: propertyName,
        filterConditions: this.filterConditions // 筛选条件：前面已选数据
      }
      this.loading = true
      getValuesBulkOptions(params).then(res => {
        if (!res.data.length) {
          return
        }
        // 保存倒数第二步的返回值，和最后一级的选中数组
        if (index === this.tempHeadTitle.length - 2) {
          this.lastSecondData = res.data
        }
        let combineArr = []
        res.data.forEach(item => {
          combineArr = item.values.map(e => e[propertyName])
        })
        const data = [...new Set(combineArr)].sort()
        if (data.length) {
          // 赋值
          this.platformIndex = this.tempHeadTitle[index + 1].displaySequence // 层级
          this.$set(this.platformLevels, this.platformIndex - 1, data)
          this.deleteChild(this.platformIndex - 1, this.platformCategoryId)
          this.deleteChild(this.platformIndex, this.platformLevels)
          this.deleteChild(this.platformIndex - 1, this.filterConditions)
          this.idsCache = [...this.platformCategoryId]
        } else {
          this.deleteChild(this.platformIndex, this.platformLevels)
          this.deleteChild(this.platformIndex, this.platformCategoryId)
          this.deleteChild(this.platformIndex - 1, this.filterConditions)
          this.idsCache = [...this.platformCategoryId]
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 父下拉框改变，删除子下拉框
    deleteChild(index, arr) {
      arr.splice(index, arr.length - index)
    },
    // 生成表格
    append() {
      this.btnLoading = true
      this.tableData = []
      this.tableHead = []
      const lastValue = this.platformCategoryId[this.platformCategoryId.length - 1]
      const lastPropertyName = this.tempHeadTitle[this.tempHeadTitle.length - 1].propertyName
      const values = []
      lastValue.forEach(item => {
        values.push({ [lastPropertyName]: item })
      })
      this.lastSecondData.forEach(item => {
        item.values = values
        item.site = this.form.siteCode
      })
      generateTableData(this.lastSecondData).then(res => {
        this.tableData = res.data
        this.tableData.forEach((item, index) => {
          item.id = index
        })
        this.tableHeadRender(this.tableData)
      }).finally(() => {
        this.btnLoading = false
      })
    },
    tableHeadRender(arr) {
      Object.keys(arr[0]).forEach(item => {
        if (item !== 'id') {
          this.tableHead.push({
            label: this.tempHeadTitle.find(v => v.propertyName === item).propertyDisplayName,
            property: item
          })
        }
      })
    },
    handleSelectionChange(checkedList) {
      this.checked = checkedList.map(item => item.id)
    },
    handleBatchDel() {
      this.handleDel(this.checked)
    },
    handleDel(index) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (Array.isArray(index)) {
          this.tableData = this.tableData.filter(item => !index.includes(item.id))
        } else {
          this.tableData.splice(index, 1)
        }
      }).catch(() => {})
    },
    submitDialog(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const details = []
          this.tableData.forEach(item => {
            delete item.id
            const obj = {}
            obj.compatibilityJson = JSON.stringify(item)
            details.push(obj)
          })
          // console.log('details: ', details)
          const params = {
            ...this.form,
            details: details
          }
          const request = this.row ? updateCarTemplate : saveCarTemplate
          request(params).then(res => {
            this.$message.success(res.msg)
            this.$parent.$emit('close', true)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.ebay-car-temp {
  .publish-category-select {
    width: 2%!important;
    .el-select-dropdown__item  {
      line-height: 22px;
      span {
        padding: 0 10px!important;
      }
    }
    .el-select-dropdown__wrap {
      max-height: 210px;
    }
  }
  .el-col-3 {
    width: 14%;
  }
  .el-select__input {
    margin-left: 2px;
  }
  .el-tag {
    max-width: 80px;
  }
  .v-table {
    td {
      padding: 8px 0;
    }
  }
}
</style>
