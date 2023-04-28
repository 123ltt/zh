<template>
  <basic-container style="min-width: 0">
    <el-form ref="formRef" :model="form" size="mini" label-width="80px">
      <el-form-item label="站点" prop="site">
        <el-select v-model="form.site" clearable placeholder="请选择" style="width:160px;" @change="changeSite">
          <el-option v-for="item in findform.siteOptions" :key="item.displayName" :value="item.displayName" :label="item.displayName" />
        </el-select>
      </el-form-item>
      <el-form-item label="平台类目" prop="platformLevels">
        <span v-for="(value, i) in platformLevels" :key="i" class="category-box">
          <el-select
            v-model="platformCategoryId[i]"
            size="mini"
            filterable
            :placeholder="platformRanks[i] + '级类目'"
            popper-class="publish-category-select"
            style="width: 100%;"
            @focus="setMinWidth"
            @change="getPlatformCategory"
          >
            <el-option v-for="item in value" :key="item.id" :value="item.id" :label="item.browseNodeName" :title="item.browseNodeName" />
          </el-select>
        </span>
      </el-form-item>
      <el-form-item prop="autoApply">
        <el-checkbox v-model="form.autoApply">自动应用到所有子类目</el-checkbox>
      </el-form-item>
      <div style="padding-top: 20px; text-align: right">
        <el-button size="medium" @click="$parent.$emit('close')">取 消</el-button>
        <el-button size="medium" type="primary" @click="handlerSeve('formRef')">确 定</el-button>
      </div>
    </el-form>
  </basic-container>
</template>

<script>
import { optionsSiteCode } from '@/api/amazon/amazon'
import { getLevelCategory } from '@/api/amazon/category'
import { saveRelationCategory } from '@/api/amazon/templateList'
export default {
  name: 'Category',
  props: {
    row: {
      type: Object
    }
  },
  data() {
    return {
      platformLevels: [],
      platformCategoryId: [],
      platformRanks: [],
      platformIndex: 0,
      findform: {
        siteOptions: []
      },
      form: {
        site: '',
        category: '',
        autoApply: false,
        categoryIdList: [{
          platformLevels: [],
          platformCategoryId: [],
          platformRanks: [],
          platformIndex: 0
        }],
        categoryIdListTemp: [] // 备份
      },
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
      ]

    }
  },
  created() {
  },
  mounted() {
    this.getOptionsSiteCode()
    this.getPlatformCategory()
  },
  methods: {
    getOptionsSiteCode() {
      optionsSiteCode({ platformCode: 'AM' }).then(res => {
        this.findform.siteOptions = res.data
      })
    },
    changeSite(val) {
      this.platformCategoryId = []
      // this.form.categoryIdList = [{
      //   platformCategoryId: []
      // }]
      this.getPlatformCategory()
    },
    getPlatformCategory(id) {
      const params = {
        amazonSite: this.form.site,
        id: id
      }
      getLevelCategory(params).then(res => {
        if (id) { // 获取子级
          if (res.data.length) {
            // 设置层级
            let currentLevel
            this.platformLevels.forEach(item => {
              item.forEach(e => {
                if (e.id === id) {
                  currentLevel = e.level + 1
                }
              })
            })
            res.data.forEach(item => {
              item.level = currentLevel
            })
            // 赋值
            this.platformIndex = currentLevel
            const placeholder = this.numArr.find(item => this.platformIndex === item.number).character
            this.$set(this.platformRanks, this.platformIndex - 1, placeholder)
            this.$set(this.platformLevels, this.platformIndex - 1, res.data)
            this.$set(this.platformCategoryId, this.platformIndex - 1, '')
            this.deleteChild(this.platformIndex, this.platformLevels)
          } else {
            this.platformLevels.forEach(item => {
              item.forEach(e => {
                if (e.id === id) {
                  this.platformIndex = e.level
                  this.deleteChild(this.platformIndex, this.platformLevels)
                }
              })
            })
            this.deleteChild(this.platformIndex, this.platformCategoryId)
          }
        } else { // 第一级
          this.platformLevels = []
          this.platformRanks = []

          const data = res.data
          data.forEach(item => {
            item.level = 1
          })
          this.platformRanks.push('一')
          this.platformLevels.push(data)
          // this.form.categoryIdList.forEach(item => {
          //   item.platformRanks.push('一')
          //   item.platformLevels.push(data)
          // })
          console.log('🚀 ~ file: category.vue ~ line 167 ~ getLevelCategory ~ this.form', this.form)
          this.form.categoryIdListTemp = JSON.parse(JSON.stringify(data))
        }
      })
    },
    setMinWidth(val) {
      const arr = Array.from(document.getElementsByClassName('publish-category-select'))
      arr.forEach(item => {
        item.style.minWidth = val.srcElement.clientWidth + 3 + 'px'
      })
    },
    // 父下拉框改变，删除子下拉框
    deleteChild(index, arr) {
      for (let i = index; i < arr.length; i++) {
        delete arr[i]
      }
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i]) {
          arr.splice(i)
        }
      }
    },
    handlerSeve(formName) {
      let categoryId = ''
      const list = this.platformCategoryId.filter(item => {
        return item && item.trim()
      })
      categoryId = list.length === 1 ? list[0] : list[list.length - 1]
      saveRelationCategory({ templateName: this.row.name, categoryIdList: categoryId, autoApply: this.form.autoApply }).then(res => {
        this.$message.success(res.msg)
        this.$parent.$emit('close', true)
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.category-box{
  margin-bottom:6px;
  display:inline-block;
  width:160px;
  margin-right:6px
}
.publish-category-select {
  width: 2%!important;
  .el-select-dropdown__item  {
    line-height: 22px;
    span {
      padding: 0 10px!important;
    }
  }
}
.el-form-item--mini.el-form-item{
  margin-bottom: 10px;
}
</style>>
