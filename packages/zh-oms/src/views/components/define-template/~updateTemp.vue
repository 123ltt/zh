<template>
  <div class="py-2 pb-2 tmp-wrap">
    <el-form ref="formRef" v-loading="loading" :model="form" :rules="rules" size="mini" label-width="70px" class="form-col" @submit.native.prevent>
      <el-row type="flex" class="align-items-stretch">
        <el-col :span="20" class="pb-3 pe-2 attrs-wrap">
          <el-form-item label="模板名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <template v-for="(attrs, i) in attrList">
            <el-form-item :key="i" :label="labels[i]" class="mb-0">
              <el-checkbox-group v-model="form.order">
                <el-row>
                  <el-col v-for="item in attrs" :key="item.id" :xs="12" :sm="8" :md="6" :lg="4" :xl="3" style="height:28px;">
                    <el-checkbox :disabled="['1','2'].includes(item.id)" style="minWidth:130px;marginRight:12px;" :label="item.id">
                      {{ item.proName.split('(')[0] }}
                      <span class="text-danger">{{ (item.proName.match(/\(.*\)/)||[])[0] }}</span>
                    </el-checkbox>
                  </el-col>
                </el-row>
              </el-checkbox-group>
            </el-form-item>
            <div :key="i+'line'" class="border-bottom my-1" />
          </template>
          <el-form-item label="系统根据你选择的配置确认导出数据最小粒度为：" class="mb-2" label-width="280px">
            <span>{{ proDimName }}</span>
          </el-form-item>
          <div class="border-bottom mb-2" />
          <div class="text-end">
            <el-button size="mini" @click="close()">取消</el-button>
            <el-button type="primary" size="mini" @click="addTemp">保存</el-button>
          </div>
        </el-col>
        <el-col :span="4" class="ms-2 drag-wrap bg">
          <div class="line p-2 ps-3">导出排序</div>
          <div class="p-2">
            <draggable v-model="attrsSort"
                       handle=".draggable"
                       filter=".undraggable"
                       :move="checkMove"
                       @end="moveEnd"
            >
              <div v-for="(item,i) in attrsSort" :key="i+item.id" :class="['1','2'].includes(item.id) ? 'undraggable' : 'draggable'" class="p-1">
                <el-tag effect="plain" :closable="i>1" class="w-100 ps-1 d-flex align-items-center justify-content-between" size="small" @close="handleClose(item)">
                  <i v-if="i>1" class="el-icon-sort me-1">{{ item.proName }}</i>
                  <span v-else class="me-1">{{ item.proName }}</span>
                </el-tag>
              </div>
            </draggable>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getAttrs, addTemp, updateTemp, getTempDetail } from '@/api/defineTemp.js'
import draggable from 'vuedraggable'

export default {
  name: 'AddTemp',
  components: { draggable },
  props: {
    id: String
  },
  data() {
    return {
      form: {
        name: '',
        order: ['1', '2']// 平台单号、OMS单号必选
      },
      list: [],
      attrList: [],
      labels: ['订单属性', '买家信息', '金额相关', '包裹维度', 'SKU维度'],
      attrsSort: [],
      proDim: 0,
      loading: false,
      rules: {
        name: [{ required: true, message: '请输入模板名称' }]
      }
    }
  },
  computed: {
    proDimName() {
      return ['订单维度', '包裹维度', 'SKU维度'][this.proDim]
    }
  },
  watch: {
    'form.order'(val) {
      this.getAttrsSort(val)
    }
  },
  mounted() {
    const id = this.id
    id && getTempDetail(id).then(({ data: { proIds, name, proList } }) => {
      const sortIds = proIds.split(',')

      this.attrsSort = proList.sort((a, b) => {
        return sortIds.findIndex(id => id === a.id) - sortIds.findIndex(id => id === b.id)
      })
      this.form.name = name
      this.form.order = sortIds
    })
    this.$emit('title', id ? '修改模板' : '新增模板')
    getAttrs().then(res => {
      this.list = res.data
      this.attrList = res.data.reduce((pre, cur) => {
        pre[cur.proType] ??= []
        pre[cur.proType].push(cur)
        return pre
      }, [])
      this.getAttrsSort(this.form.order)
    })
  },
  methods: {
    handleClose(tag) {
      this.form.order = this.form.order.filter(item => item !== tag.id)
    },
    addTemp() {
      this.$refs.formRef.validate(bool => {
        if (!bool) return
        const params = { ifDefault: 0 }
        params.name = this.form.name
        params.proIds = this.attrsSort.reduce((pre, cur) => {
          pre.push(cur.id)
          return pre
        }, []).join()
        params.proDim = this.proDim
        params.id = this.id
        const apiFn = this.id ? updateTemp : addTemp
        apiFn(params).then(res => {
          this.$message.success(res.msg)
          this.close(true)
        })
      })
    },
    getAttrsSort(val) {
      const list = this.list.filter(item => val.includes(item.id))
      const orginSort = this.attrsSort.filter(item => val.includes(item.id))

      // proDim 维度优先级： 0订单 < 1包裹 < 2SKU
      let dim = '0'
      let skuDim
      const changeArr = list.reduce((pre, cur) => {
        const bool = hasItem(orginSort, cur.id)
        if (!bool) pre.push(cur)
        if (cur.proDim === '2') skuDim = '2'
        if (cur.proDim === '1') dim = '1'
        return pre
      }, [])
      this.proDim = skuDim || dim
      this.attrsSort = orginSort.concat(changeArr)

      function hasItem(arr, id) {
        return arr.findIndex(item => item.id === id) > -1
      }
    },
    checkMove(e) {
      e.dragged.classList.add('checked-style')
      if (e.draggedContext.futureIndex === 0 || e.draggedContext.futureIndex === 1) return false
      // false表示阻止拖拽
      return true
    },
    moveEnd(e) {
      e.item.classList.remove('checked-style')
    },
    close(bool) {
      this.$emit('close', bool)
    }
  }
}
</script>

<style scoped lang="scss">
.tmp-wrap{
  height: 100%;
  box-sizing:border-box;
  overflow: hidden;
  .attrs-wrap{
    height: 100vh;
    overflow: auto;
  }
  .bg{
    background-color: rgba(236, 245, 255, .2);
  }
  ::v-deep .el-divider--horizontal{
    margin: 8px !important;
    background-color: rgb(121, 187, 255);
  }
  .drag-wrap{
    position: relative;
    height: 100vh;
    overflow: auto;
    cursor: default;
    .line{
      height: 16px;
      padding-left: 4px;
      position: sticky;
      top: 0;
      z-index: 9;
      background-color: #409eff;
      color: #fff;
    }
    .checked-style{
      background-color: rgb(121, 187, 255);
    }
    .draggable{
      cursor: move;
    }
  }
}
</style>
