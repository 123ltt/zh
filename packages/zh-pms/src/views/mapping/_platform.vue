<template>
  <basic-container>
    <div class="category-mapping h-100 d-flex flex-column">
      <div class="mx-2">
        <b class="me-1">平台</b>
        <g-select v-model="rightForm.platCode"
                  :items="platforms"
                  key-field="platCode"
                  value-field="platCode"
                  label-field="platName"
                  :disabled="isLoading"
                  @change="onChange(0)"
        />
        <template v-if="rightForm.platCode&&sites.length>0">
          <b class="ms-3 me-1">站点</b>
          <g-select v-model="rightForm.siteCode"
                    :items="sites"
                    key-field="siteCode"
                    value-field="siteCode"
                    label-field="siteName"
                    :disabled="isLoading"
                    @change="onChange(1)"
          />
        </template>
      </div>
      <template v-if="show">
        <div class="flex-grow-1 overflow-hidden">
          <div class="d-flex h-100 cm-box">
            <Left ref="left"
                  :key="leftKey"
                  v-model="leftCheckedId"
                  lazy
                  :props="{label:'name',labelEn:'nameEn',isLeaf:data=>!!data.isLeaf}"
                  :tree-request="request.getPmsTree"
                  :search-request="request.searchPmsTree"
                  :show-form-status="false"
                  :params="rightForm"
                  :loading.sync="leftLoading"
                  @nodeClick="leftNodeClick"
            >
              <el-form-item slot="title">
                <b>PMS</b>
              </el-form-item>
            </Left>
            <Right ref="right"
                   v-model="rightCheckedId"
                   v-loading="platformLoading"
                   lazy
                   :props="rightProps"
                   :loading.sync="rightLoading"
                   :tree-request="request.getPlatformCategory"
                   :search-request="request.searchPlatformCategory"
                   row-key="categoryId"
                   :parent-key="rightForm.platCode==='AM'?'id':'categoryId'"
                   :is-trigger="true"
                   @nodeClick="rightNodeClick"
            >
              <el-form-item slot="title">
                <b>{{ platformSiteName }}</b>
              </el-form-item>
            </Right>
          </div>
        </div>
        <div class="text-end mb-2">
          <el-button size="mini" type="primary" :loading="submitting" :disabled="submitBtnDisabled" @click="save">创建映射关系</el-button>
          <el-button v-show="leftCheckedId" size="mini" :disabled="rightLoading||leftLoading" @click="next">下一个</el-button>
          <el-button v-show="cancelBtnVisble" size="mini" @click="cancel">取消选择</el-button>
        </div>
      </template>
    </div>
  </basic-container>
</template>

<script>
import { getPmsTree, searchPmsTree, getPlatformCategory, searchPlatformCategory, saveMapping } from '@/api/mapping'
import { getPlatformTree } from '@/api/info'
import Left from './components/left.vue'
import Right from './components/right.vue'

export default {
  name: 'PmsMappingPlatform',
  components: { Left, Right },
  data() {
    return {
      submitting: false,
      leftLoading: false,
      rightLoading: false,
      platformLoading: true,
      leftCheckedId: '',
      rightCheckedId: '',
      platforms: [],
      rightForm: {
        platCode: '',
        siteCode: ''
      },
      // 缓存点击右侧节点传递过来的数据
      cacheReciveRightData: null,
      leftKey: '' // 避免切换到没有站点的平台，左侧的树不更新
    }
  },
  computed: {
    request() {
      return { getPmsTree, searchPmsTree, getPlatformCategory, searchPlatformCategory }
    },
    submitBtnDisabled() {
      return !this.leftCheckedId || !this.rightCheckedId
    },
    cancelBtnVisble() {
      return this.leftCheckedId || this.rightCheckedId
    },
    sites() {
      const d = this.platforms.find(el => el.platCode === this.rightForm.platCode)
      return d ? d.lstSite : []
    },
    show() {
      if (this.rightForm.platCode) {
        if (this.sites.length === 0) return true
        return !!this.rightForm.siteCode
      }
      return false
    },
    rightProps() {
      return {
        label: 'categoryNameZh',
        labelEn: 'categoryName',
        isLeaf: 'isLeaf',
        children: 'children',
        fields: ['categoryName', 'categoryId'] // rightNodeClick方法得到的对象的keys即为fields
      }
    },
    platformSiteName() {
      const p = this.platforms.find(item => item.platCode === this.rightForm.platCode) || {}
      const s = this.sites.find(item => item.siteCode === this.rightForm.siteCode) || {}
      return [p.platName || '', s.siteName || ''].join(' ')
    },
    isLoading() {
      return this.leftLoading || this.rightLoading
    }
  },
  created() {
    this.getPlatformData()
  },
  methods: {
    leftNodeClick(data) {
      if (this.platformLoading) return this.$message.warning('请等待右侧' + this.rightTitle + '加载完成再点击')
      const mappedPathIds = data.mappedPathIds
      if (data.isMapped && Array.isArray(mappedPathIds)) {
        this.$refs.right.autoLocation(mappedPathIds)
      } else {
        this.$refs.right._resetChecked()
      }
    },
    rightNodeClick(data) {
      this.cacheReciveRightData = data
    },
    getPlatformData() {
      getPlatformTree().then(res => {
        this.platforms = res.data
      }).finally(() => {
        this.platformLoading = false
      })
    },
    // type 0平台，1站点
    onChange(type) {
      if (type === 0) {
        this.rightForm.siteCode = ''
      }
      const { platCode, siteCode } = this.rightForm

      this.leftKey = platCode + siteCode

      this.$nextTick(() => {
        if (type === 1 || this.show) {
          this.$refs.right.triggerLoad(platCode + siteCode, { platform: platCode, site: siteCode })
        }
      })
    },
    next() {
      this.$refs.left.next(data => {
        this.$refs.right.autoLocation(data.mappedPathIds)
      })
    },
    save() {
      if (!this.cacheReciveRightData) return
      const { categoryName, categoryId } = this.cacheReciveRightData
      saveMapping({
        categoryId: this.leftCheckedId,
        pcCode: this.rightCheckedId,
        platformCode: this.rightForm.platCode,
        siteCode: this.rightForm.siteCode || '',
        pcCategoryIdPath: categoryId.join(','),
        pcName: categoryName[categoryName.length - 1],
        pcCategoryNamePath: categoryName.join(' / ')
      }).then(() => {
        const leftNode = this.$refs.left.mx_getNode(this.leftCheckedId)
        leftNode.data.isMapped = true
        leftNode.data.mappedPathIds = categoryId
        this.$message.success('映射成功')
      })
    },
    cancel() {
      this.leftCheckedId = ''
      this.rightCheckedId = ''
    }
  }
}
</script>

<style src="./common.scss" lang="scss"></style>
