<template>
  <g-table ref="table" :headers="headers" row-key="id" :fixed-height="false" :fetch="fetch" @submit.native.prevent="search">
    <template slot="header">
      <el-form ref="form" :model="form" size="mini" label-width="60px" class="form-col no-message">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="标签类型" prop="typeLevel">
              <!-- <el-radio-group v-model="form.typeLevel" @change="search">
                  <el-radio-button label="1">自定义</el-radio-button>
                  <el-radio-button label="0">系统</el-radio-button>
                </el-radio-group> -->
              <el-button-group v-model="form.typeLevel">
                <el-button v-for="(item,index) in typeLevelList" :key="index" :type="item.isActive?'primary':''" :value="item.value" @click="toggleType(item, typeLevelList, true)">{{ item.label }}</el-button>
              </el-button-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
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
          <el-col :span="6">
            <el-form-item label="名称" prop="typeName">
              <el-input v-model="form.typeName" placeholder="" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
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
    <el-table-column slot="typeLevel" label="标签类型">
      <template v-slot="{ row }">
        <div v-if="row.typeLevel">自定义</div>
        <div v-else>系统</div>
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
import { getTagTypeList, removeTagType, editTagTypeStatus } from '@/api/ebay/tag.js'
import tagModal from './components/tagModal.vue'

export default {
  name: 'LmsEbayTemplateTagManageTagList',
  data() {
    return {
      headers: [
        { slot: true, slotName: 'index' },
        { label: '标签名称', prop: 'typeName' },
        { slot: true, slotName: 'status' },
        { label: '创建人', prop: 'createUser' },
        { label: '创建时间', prop: 'createTime' },
        { label: '最后修改人', prop: 'createUser' },
        { label: '最后修改时间', prop: 'createTime' },
        { slot: true, slotName: 'typeLevel' },
        { slot: true, slotName: 'handler' }
      ],
      form: {
        descs: 'id'
      },
      typeLevelList: [
        { label: '自定义', value: 1, isActive: false },
        { label: '系统', value: 0, isActive: false }
      ],
      statusList: [
        { label: '启用', value: 1, isActive: false },
        { label: '禁用', value: 0, isActive: false }
      ]
    }
  },
  mounted() {
    this.$refs.table.load(1, this.form)
  },
  methods: {
    toggleType(list, arr, isTypeLevel) {
      arr.forEach(item => {
        if (item.value === list.value && !list.isActive) {
          item.isActive = true
        } else {
          item.isActive = false
        }
      })
      if (isTypeLevel) {
        list.isActive ? this.form.typeLevel = list.value : delete this.form.typeLevel
      } else {
        list.isActive ? this.form.status = list.value : delete this.form.status
      }
      this.search()
    },
    fetch({ current, size }, params) {
      return getTagTypeList({ current, size, ...params }).then(res => {
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
      this.typeLevelList.forEach(item => {
        item.isActive = false
      })
      this.statusList.forEach(item => {
        item.isActive = false
      })
      this.search()
    },
    editItem(row) {
      const title = row ? '编辑' : '添加'
      this.$modal({
        title: title,
        component: tagModal,
        width: '500px',
        data: {
          row: row
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
        removeTagType(row.id).then(res => {
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
      editTagTypeStatus(data).then(res => {
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
