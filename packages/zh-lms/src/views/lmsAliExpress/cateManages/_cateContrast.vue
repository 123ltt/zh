<template>
  <basic-container class="smt-publish-cate-contrast">
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
          <el-option v-for="item in value" :key="item.categoryId" :value="item.categoryId" :label="item.cnName" :title="item.cnName" />
        </el-select>
      </span>
    </el-card>
    <div style="text-align: right; margin: 10px 0">
      <el-button size="mini" @click="resetForm">重置</el-button>
      <el-button v-if="$auth('cateContrast_save')" type="primary" size="mini" @click="submitCategory">保存</el-button>
    </div>
  </basic-container>
</template>

<script>
import { getLevelCategory, saveCategoryContrast, checkProductCategory } from '@/api/aliExpress/category'
import { getChildren } from '@/api/pms'
import { deepClone } from '@/util/util'

export default {
  name: 'LmsAliExpressCateManageCateContrast',
  data() {
    return {
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
    this.getProductCategory()
    this.getPlatformCategory()
  },
  methods: {
    initPlatform(data) {
      this.platformLevels = []
      data.forEach(item => {
        item.level = 1
      })
      this.platformLevels.push(data)
      this.platformRanks = ['一']
      this.platformCategoryId = []
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
    getPlatformChild(id) {
      return getLevelCategory({ categoryId: id }).then(res => res.data)
    },
    getPlatformCategory(id) {
      getLevelCategory({ categoryId: id }).then(res => {
        if (id) { // 获取子级
          if (res.data.length) {
            this.platformIndex = res.data[0].level
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
        } else {
          this.platformDataFirst = res.data
          this.initPlatform(res.data)
        }
      })
    },
    // 类目对照
    checkCategory() {
      const productId = this.productCategoryId[this.productCategoryId.length - 1]
      if (!productId) return
      const params = {
        productCategoryId: productId
      }
      checkProductCategory(params).then(res => {
        const data = this.handleEmpty(res.data).reverse()
        const ids = deepClone(data)
        this.deleteChild(1, this.platformLevels)
        this.platformCategoryId = []
        if (data && data.length) { // 有对照平台类目
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
            const platformCategoryId = ids.map(item => item.categoryId)
            this.platformCategoryId = platformCategoryId
          })
        } else { // 无对照平台类目，重置
          this.platformLevels.splice(1, this.platformLevels.length - 1)
          this.platformCategoryId = []
        }
      })
    },
    setMinWidth(val) {
      const arr = Array.from(document.getElementsByClassName('publish-category-select'))
      arr.forEach(item => {
        item.style.minWidth = val.srcElement.clientWidth + 3 + 'px'
      })
    },
    handleEmpty(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i]) {
          arr.splice(i, 1)
          i--
        }
      }
      return arr
    },
    isContrast(productId) {
      return checkProductCategory({ productCategoryId: productId }).then(res => res.data)
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
      const isCheck = this.handleEmpty(result)
      if (isCheck && isCheck.length) {
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
      const params = {
        categoryId: platformId, // 平台类目id
        productCategoryId: productId // 产品类目id
      }
      saveCategoryContrast(params).then(res => {
        this.$message.success('保存成功！')
      })
    },
    resetForm() {
      // 重置产品类目
      this.deleteChild(1, this.productLevels)
      this.productCategoryId = []
      this.productRanks = ['一']
      // 重置平台类目
      this.deleteChild(1, this.platformLevels)
      this.platformCategoryId = []
      this.platformRanks = ['一']
    }
  }
}
</script>

<style lang="scss">
.smt-publish-cate-contrast {
  .box-card {
    width: 100%;
    height: calc(50% - 46px);
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
