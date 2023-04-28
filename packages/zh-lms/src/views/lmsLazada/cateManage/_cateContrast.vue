/* eslint-disable vue/no-template-shadow */
<template>
  <basic-container class="publish-cate-contrast">
    <el-form ref="dialogForm" size="mini">
      <el-form-item label="站点" prop="site">
        <el-select v-model="site" clearable filterable placeholder="请选择站点" style="width:20%;" @change="getSite">
          <el-option v-for="(item,i) in sites" :key="i" :value="item.displayName" :label="item.displayName" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-card class="box-card" shadow="never">
      <span style="padding-right: 6px">产品类目</span>
      <span v-for="(value, i) in productLevels" :key="i">
        <el-select
          v-model="productCategoryId[i]"
          size="mini"
          filterable
          :placeholder="productRanks[i] + '级类目'"
          popper-class="publish-category-select"
          style="width: 9%;"
          :style="i < 10 ? 'padding-right: 6px' : 'padding-right: 0'"
          @focus="setMinWidth"
          @change="getProductCategory"
        >
          <el-option v-for="item in value" :key="item.id" :value="item.id" :label="item.name" :title="item.name" />
        </el-select>
      </span>
    </el-card>
    <div class="cate-arrow">
      <i class="el-icon-d-arrow-left" />
    </div>
    <el-card class="box-card" shadow="never">
      <span style="padding-right: 6px">平台类目</span>
      <span v-for="(value, i) in platformLevels" :key="i">
        <el-select
          v-model="platformCategoryId[i]"
          size="mini"
          filterable
          :placeholder="platformRanks[i] + '级类目'"
          popper-class="publish-category-select"
          style="width: 9%;"
          :style="i < 10 ? 'padding-right: 6px' : 'padding-right: 0'"
          @focus="setMinWidth"
          @change="getPlatformCategory"
        >
          <el-option v-for="item in value" :key="item.categoryId" :value="item.categoryId" :label="item.name" :title="item.name" />
        </el-select>
      </span>
    </el-card>
    <div style="text-align: right; margin: 10px 0">
      <el-button size="mini" @click="resetForm">重置</el-button>
      <el-button type="primary" size="mini" @click="submitCategory">保存</el-button>
    </div>
  </basic-container>
</template>

<script>
// import { getLevelCategory, saveCategoryContrast, checkCategory } from '@/api/lmsEbay/category'
import { getLevelCategory, saveCategoryContrast, checkCategory } from '@/api/lazada/cateComparison'
import { optionsSiteCode } from '@/api/amazon/amazon'
import { getChildren } from '@/api/pms'
import { deepClone } from '@/util/util'

export default {
  name: 'LmsAmazonCateManageCateContrast',
  data() {
    return {
      site: '',
      sites: [],
      productLevels: [],
      productCategoryId: [],
      productRanks: [],
      index: 0,
      platformLevels: [],
      platformCategoryId: [],
      platformRanks: [],
      platformIndex: 0,
      numArr: [
        {
          number: 1,
          character: '一'
        }, {
          number: 2,
          character: '二'
        }, {
          number: 3,
          character: '三'
        }, {
          number: 4,
          character: '四'
        }, {
          number: 5,
          character: '五'
        }, {
          number: 6,
          character: '六'
        }, {
          number: 7,
          character: '七'
        }, {
          number: 8,
          character: '八'
        }, {
          number: 9,
          character: '九'
        }, {
          number: 10,
          character: '十'
        }
      ],
      platformDataFirst: []
    }
  },
  created() {
    this.listAllSite()
    this.getProductCategory()
  },
  methods: {
    // 查询所有的站点code
    listAllSite() {
      optionsSiteCode({ platformCode: 'LZ' }).then(res => {
        this.sites = res.data.filter(item => item.displayName === 'MY')
      })
    },
    initPlatform(data) {
      this.platformLevels = []
      data.forEach(item => {
        item.level = 1
      })
      this.platformLevels.push(data)
      this.platformRanks = ['一']
      this.platformCategoryId = []
    },
    getSite() {
      const params = {
        siteCode: this.site
      }
      getLevelCategory(params.siteCode).then(res => {
        this.platformDataFirst = res.data
        this.initPlatform(res.data)
        this.checkCategory()
      })
    },
    // 父下拉框改变，删除子下拉框
    deleteChild(index, arr) {
      arr.splice(index, arr.length - index)
    },
    getProductCategory(id) {
      // 产品类目change,重置平台类目
      this.initPlatform(this.platformDataFirst)
      // 获取产品类目子级
      getChildren(id).then((res) => {
        if (id) {
          if (res.data.length) {
            this.index = res.data[0].level
            const placeholder = this.numArr.find(item => this.index === item.number).character || ''
            this.$set(this.productRanks, this.index - 1, placeholder)
            // 下一级赋值，并初始化value为空
            this.$set(this.productLevels, this.index - 1, res.data)
            this.$set(this.productCategoryId, this.index - 1, '')
            this.deleteChild(this.index, this.productLevels)
          } else {
            // 下一级为空，清空页面下一级
            // 通过id查找当前item，删除从level到结束的所有元素
            this.productLevels.forEach(item => {
              item.forEach(e => {
                if (e.id === id) {
                  this.index = e.level
                  this.deleteChild(this.index, this.productLevels)
                }
              })
            })
            // 删除categoryId数组中已删列表的value
            this.deleteChild(this.index, this.productCategoryId)
            // 产品类目带出平台类目
            this.checkCategory()
          }
        } else {
          // 设置placeholder
          this.productRanks.push('一')
          this.productLevels.push(res.data)
        }
      })
    },
    // 类目对照
    checkCategory() {
      const productId = this.productCategoryId[this.productCategoryId.length - 1]
      if (!productId) return
      // const params = {
      //   site: this.site,
      //   categoryId: productId
      // }
      checkCategory({ site: this.site, productCateId: productId }).then(res => {
        const data = res.data.reverse()
        const ids = deepClone(data)
        this.deleteChild(1, this.platformLevels)
        this.platformCategoryId = []
        if (data.length) { // 有对照平台类目
          const requestArr = []
          if (this.platformLevels[0] && this.platformLevels[0].length) { // 平台类目有数据
            // 设置子级列表及所有的选中值
            for (let i = 0; i < data.length; i++) {
              requestArr.push(this.getPlatformChild(data[i].categoryId))
            }
          }
          Promise.all(requestArr).then((result) => {
            const platformLevels = this.platformLevels.concat(result)
            this.platformLevels = platformLevels.slice(0, platformLevels.length - 1)
            // 设置层级
            this.platformLevels.forEach((item, index) => {
              item.forEach(e => {
                if (!e.level) {
                  e.level = index + 1
                }
              })
            })
            const platformCategoryId = ids.map(item => item?.categoryId)
            this.platformCategoryId = platformCategoryId
          })
        } else { // 无对照平台类目，重置
          this.platformLevels.splice(1, this.platformLevels.length - 1)
          this.platformCategoryId = []
        }
      })
    },
    getPlatformChild(id) {
      // const params = {
      //   site: this.site,
      //   platCategoryId: id
      // }
      const params = {
        siteCode: this.site,
        id
      }
      return getLevelCategory(params.siteCode, params.id).then(res => res.data)
    },
    setPlatLevel(id) {
      let currentLevel
      this.platformLevels.forEach(item => {
        item.forEach(e => {
          if (e.categoryId === id) {
            currentLevel = e.level + 1
          }
        })
      })
      return currentLevel
    },
    getPlatformCategory(id) {
      // const params = {
      //   site: this.site,
      //   platCategoryId: id
      // }
      const params = {
        siteCode: this.site,
        id
      }
      getLevelCategory(params.siteCode, params.id).then(res => {
        if (id) { // 获取子级
          if (res.data.length) {
            // 设置层级
            res.data.forEach(item => {
              item.level = this.setPlatLevel(id)
            })
            this.platformIndex = this.setPlatLevel(id)
            const itemPlace = this.numArr.find(item => this.platformIndex === item.number)
            if (itemPlace) {
              const placeholder = itemPlace.character
              this.$set(this.platformRanks, this.platformIndex - 1, placeholder)
            }
            this.$set(this.platformLevels, this.platformIndex - 1, res.data)
            this.$set(this.platformCategoryId, this.platformIndex - 1, '')
            this.deleteChild(this.platformIndex, this.platformLevels)
          } else {
            this.platformLevels.forEach(item => {
              item.forEach(e => {
                if (e.categoryId === id) {
                  this.platformIndex = e.level
                }
              })
            })
            this.deleteChild(this.platformIndex, this.platformLevels)
            this.deleteChild(this.platformIndex, this.platformCategoryId)
          }
        }
      })
    },
    setMinWidth(val) {
      const arr = Array.from(document.getElementsByClassName('publish-category-select'))
      arr.forEach(item => {
        item.style.minWidth = val.srcElement.clientWidth + 3 + 'px'
      })
    },
    isContrast(productId) {
      return checkCategory({ site: this.site, productCateId: productId }).then(res => res.data)
    },
    async submitCategory() {
      if (!this.productCategoryId.length) {
        this.$message.warning('请选择产品类目')
        return
      }
      if (!this.platformCategoryId.length) {
        this.$message.warning('请选择平台类目')
        return
      }
      const platformId = this.platformCategoryId[this.platformCategoryId.length - 1]
      const productId = this.productCategoryId[this.productCategoryId.length - 1]
      if (!productId) {
        this.$message.warning('请选择下一级产品类目')
        return
      }
      if (!platformId) {
        this.$message.warning('请选择下一级平台类目')
        return
      }
      // 校验是否存在类目对照关系
      const result = await this.isContrast(productId)
      if (result && result.length) {
        this.$confirm('该产品类目已绑定平台类目，是否覆盖？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleAjax(platformId, productId)
        }).catch(() => {
        })
      } else {
        this.handleAjax(platformId, productId)
      }
    },
    handleAjax(platformId, productId) {
      const platformKey = this.platformLevels[this.platformLevels.length - 1].find(item => item.categoryId === platformId).id
      // const params = {
      //   site: this.site,
      //   id: platformKey, // 平台类目主键
      //   categoryId: productId // 产品类目id
      // }
      const params = {
        id: platformKey,
        productCateId: productId
      }
      saveCategoryContrast(params).then(res => {
        this.$message.success('保存成功！')
      })
    },
    resetForm() {
      this.site = ''
      // 重置产品类目
      this.deleteChild(1, this.productLevels)
      this.productCategoryId = []
      this.productRanks = ['一']
      // 重置平台类目
      this.platformLevels = [[]]
      this.platformCategoryId = []
      this.platformRanks = ['一']
    }
  }
}
</script>

<style lang="scss">
.publish-cate-contrast {
  .box-card {
    width: 100%;
    height: calc(50% - 70px);
  }
  .cate-arrow {
    width: 100%;
    text-align: center;
    padding: 10px 0;
    .el-icon-d-arrow-left {
      font-size: 20px;
      transform: rotate(-90deg);
      font-weight: bold;
    }
  }
  .el-input__inner {
    padding: 0 10px!important;
  }
}
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
</style>
