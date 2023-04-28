<template>
  <g-table ref="table" :headers="headers" row-key="id" :fixed-height="false" :fetch="fetch" @submit.native.prevent="search">
    <template slot="header">
      <el-form ref="form" :model="form" size="mini" label-width="100px" class="form-col no-message">
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="店铺" prop="platShopId">
              <!-- <el-select v-model="form.platSite" filterable placeholder="请选择站点" style="margin-right: 2%;width: 34%" @change="changeSite">
                  <el-option v-for="item in siteList" :key="item.hiddenValue" :label="item.displayName" :value="item.hiddenValue" />
                </el-select> -->
              <el-select v-model="form.platShopId" filterable placeholder="请选择店铺" class="w-100">
                <el-option v-for="item in storeList" :key="item.hiddenValue" :label="item.displayName" :value="item.hiddenValue" @change="val => form.platShopId = val" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="状态" prop="status">
              <!-- <el-radio-group v-model="form.status" @change="search">
                  <el-radio-button label="1">启用</el-radio-button>
                  <el-radio-button label="0">禁用</el-radio-button>
                </el-radio-group> -->
              <el-button-group v-model="form.status">
                <el-button v-for="(item,index) in statusList" :key="index" :type="item.isActive?'primary':''" :value="item.value" @click="toggleType(item, statusList)">{{ item.label }}</el-button>
              </el-button-group>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="标签名称" prop="typeName">
              <el-input v-model="form.typeName" placeholder="" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="标签内容名称" prop="tagName">
              <el-input v-model="form.tagName" placeholder="" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" size="mini" native-type="submit">搜索</el-button>
              <el-button size="mini" @click="resetForm('form')">清空</el-button>
              <el-button type="primary" size="mini" @click="editItem()">添加</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <el-table-column slot="index" label="序号" type="index" width="50" />
    <el-table-column slot="status" label="状态">
      <template v-slot="{ row }">
        <div>{{ row.status ? '启用' : '禁用' }}</div>
      </template>
    </el-table-column>
    <el-table-column slot="tagContent" label="内容">
      <template v-slot="{ row }">
        <div v-html="row.tagContent" />
      </template>
    </el-table-column>
    <el-table-column slot="handler" label="操作" width="150px">
      <template v-slot="{ row }">
        <el-button type="text" size="mini" @click="editItem(row)">编辑</el-button>
        <el-button type="text" size="mini" @click="deleteItem(row)">删除</el-button>
        <el-switch v-model="row.status" :active-value="1" :inactive-value="0" class="ms-3" @change="updateStatus(row)" />
      </template>
    </el-table-column>
  </g-table>
</template>

<script>
import { getTagContentList, removeTagContent, editTagContentStatus } from '@/api/ebay/tag.js'
import { optionsSiteCode } from '@/api/amazon/amazon.js'
import { storeOptionsWithPlatformCode } from '@/api/sams'
import tagContentModal from './components/tagContentModal.vue'

export default {
  name: 'LmsEbayTemplateTagManageTagList',
  data() {
    return {
      siteList: [],
      storeList: [],
      headers: [
        { slot: true, slotName: 'index' },
        { label: '店铺名', prop: 'platShop' },
        { label: '标签内容名称', prop: 'tagName' },
        { label: '标签名称', prop: 'typeName' },
        { slot: true, slotName: 'status' },
        { slot: true, slotName: 'tagContent' },
        { slot: true, slotName: 'handler' }
      ],
      form: {
        descs: 'id'
      },
      statusList: [
        { label: '启用', value: 1, isActive: false },
        { label: '禁用', value: 0, isActive: false }
      ]
    }
  },
  created() {
    this.getSiteList()
    this.changeSite()
  },
  mounted() {
    this.$refs.table.load(1, this.form)
  },
  methods: {
    toggleType(list, arr) {
      arr.forEach(item => {
        if (item.value === list.value && !list.isActive) {
          item.isActive = true
        } else {
          item.isActive = false
        }
      })
      list.isActive ? this.form.status = list.value : delete this.form.status
      this.search()
    },
    // 查询当前平台的站点code
    getSiteList() {
      optionsSiteCode({ platformCode: 'EB' }).then(res => {
        this.siteList = res.data
      })
    },
    // 选择站点对应店铺列表
    changeSite(value) {
      // this.storeList = []
      // this.$set(this.form, 'platShopId', '')
      storeOptionsWithPlatformCode({
        platformCode: 'EB'
        // siteId: value
      }).then(res => {
        this.storeList = res.data
      })
    },
    fetch({ current, size }, params) {
      return getTagContentList({ current, size, ...params }).then(res => {
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
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.form = {
        descs: 'id'
      }
      this.statusList.forEach(item => {
        item.isActive = false
      })
      this.search()
    },
    editItem(row) {
      const title = row ? '编辑' : '添加'
      this.$modal({
        title: title,
        component: tagContentModal,
        width: '800px',
        data: {
          row: row,
          siteList: this.siteList,
          storeList: this.storeList
        },
        callback: (refresh) => {
          refresh && this.search()
        }
      })
    },
    deleteItem(row) {
      this.$confirm('确认删除?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeTagContent(row.id).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.search()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    updateStatus(row) {
      const data = {
        ids: row.id,
        status: row.status
      }
      editTagContentStatus(data).then(res => {
        if (res.code === 200) {
          this.$message.success('状态修改成功')
        }
      }).finally(() => {
        this.search()
      })
    }
  }
}
</script>
