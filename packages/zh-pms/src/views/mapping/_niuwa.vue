// 类目映射
<template>
  <basic-container>
    <div class="category-mapping h-100 d-flex flex-column">
      <div class="flex-grow-1 overflow-hidden">
        <div class="d-flex h-100 cm-box">
          <Left ref="left"
                v-model="nwCheckedId"
                :title="leftTitle"
                :tree-request="request.queryNWcategories"
                @nodeClick="nwNodeClick"
          />
          <Right ref="right"
                 v-model="pmsCheckedId"
                 :title="rightTitle"
                 :props="{label:'name',labelEn:'nameEn',isLeaf:data=>!!data.isLeaf}"
                 :tree-request="request.getChildren"
                 :search-request="request.queryCategory"
                 :loading.sync="pmsLoading"
                 :checked.sync="pmsCheckedPathId"
          />
        </div>
      </div>
      <div class="text-end mb-2">
        <el-button size="mini" type="primary" :loading="submitting" :disabled="submitBtnDisabled" @click="save">创建映射关系</el-button>
        <el-button v-show="nwCheckedId" size="mini" :disabled="pmsLoading" @click="next">下一个</el-button>
        <el-button v-show="cancelBtnVisble" size="mini" @click="cancel">取消选择</el-button>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { getChildren, queryNWcategories, saveCategoryMapping, queryCategory } from '@/api/categoryManagement'
import Left from './components/left.vue'
import Right from './components/right.vue'
import mixin from './components/mixin'

export default {
  name: 'PmsMappingNiuwa',
  components: { Left, Right },
  mixins: [mixin],
  data() {
    return {
      pmsLoading: false,
      submitting: false,
      cachePrevSaved: '',
      f: null,
      pmsCheckedId: '',
      nwCheckedId: '',
      pmsCheckedPathId: [],
      leftTitle: '牛蛙类目',
      rightTitle: 'PMS类目'
    }
  },
  computed: {
    request() {
      return { getChildren, queryCategory, queryNWcategories }
    },
    submitBtnDisabled() {
      return !this.nwCheckedId || !this.pmsCheckedId
    },
    cancelBtnVisble() {
      return this.nwCheckedId || this.pmsCheckedId
    }
  },
  methods: {
    nwNodeClick(data) {
      if (this.pmsLoading) return this.$message.warning('请等待右侧' + this.rightTitle + '加载完成再点击')
      const categoryPathIdList = data.categoryPathIdList
      if (data.isMapped && Array.isArray(categoryPathIdList)) {
        this.$refs.right.autoLocation(categoryPathIdList)
      }
    },
    // 自动定位左侧的 下一个类目
    next() {
      this.$refs.left.next(data => {
        this.$refs.right.autoLocation(data.categoryPathIdList)
      })
    },
    save() {
      if (this.submitting) return
      const { nwCheckedId, pmsCheckedId } = this
      const cacheId = nwCheckedId + '-' + pmsCheckedId

      if (!nwCheckedId) return this.$message.error('请选择一个' + this.leftTitle)
      if (!pmsCheckedId) return this.$message.error('请选择一个' + this.rightTitle)
      if (this.cachePrevSaved === cacheId) return this.$message.error('已映射，请重新选择')

      const nwNodeItem = this.$refs.left.mx_getNode(nwCheckedId)
      if (nwNodeItem.data.isMapped) {
        this.$confirm('已映射，是否重新映射？', '操作确认')
          .then(() => {
            this.cachePrevSaved = cacheId
            this.submit(nwCheckedId, pmsCheckedId)
          }).catch(() => {})
      } else {
        this.cachePrevSaved = cacheId
        this.submit(nwCheckedId, pmsCheckedId)
      }
    },
    // 提交数据
    submit(nwCheckedId, pmsCheckedId) {
      this.submitting = true
      saveCategoryMapping(nwCheckedId, pmsCheckedId)
        .then(res => {
          if (res.success) {
            const nwNodeItem = this.$refs.left.mx_getNode(nwCheckedId)
            nwNodeItem.data.isMapped = true
            nwNodeItem.data.categoryPathIdList = this.pmsCheckedPathId
          }
          this.$message.success(res.msg)
        })
        .finally(() => {
          this.submitting = false
        })
    },
    cancel() {
      this.nwCheckedId = ''
      this.pmsCheckedId = ''
    }
  }
}
</script>

<style src="./common.scss" lang="scss"></style>
