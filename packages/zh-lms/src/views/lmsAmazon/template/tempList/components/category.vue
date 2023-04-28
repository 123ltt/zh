<template>
  <basic-container style="min-width: 0">
    <el-form ref="formRef" :model="form" size="mini" label-width="80px">
      <el-form-item label="站点" prop="site">
        <el-select v-model="form.site" clearable placeholder="请选择" style="width:160px;" @change="changeSite">
          <el-option v-for="item in findform.siteOptions" :key="item.displayName" :value="item.displayName" :label="item.displayName" />
        </el-select>
      </el-form-item>
      <el-form-item label="平台类目" prop="platformLevels">
        <div v-for="(item,index) in form.categoryIdList" :key="index">
          <span v-for="(value, i) in item.platformLevels" :key="i" class="category-box">
            <el-select
              v-model="item.platformCategoryId[i]"
              size="mini"
              filterable
              :placeholder="item.platformRanks[i] + '级类目'"
              popper-class="publish-category-select"
              style="width: 100%;"
              :style="i < 10 ? 'padding-right: 6px' : 'padding-right: 0'"
              @focus="setMinWidth"
              @change="getPlatformCategory(item.platformCategoryId[i], item)"
            >
              <el-option v-for="list in value" :key="list.id" :value="list.id" :label="list.browseNodeName" :title="list.browseNodeName" />
            </el-select>
          </span>
          <el-button v-if="index===0" icon="el-icon-plus" @click="append(item,index)" />
          <el-button v-if="index!==0" icon="el-icon-minus" @click="remove(item,index)" />
        </div>
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
      line: 0,
      findform: {
        siteOptions: []
      },
      form: {
        site: '',
        category: '',
        autoApply: false,
        categoryIdList: [{
          platformId: 0,
          platformLevels: [[]],
          platformCategoryId: [],
          platformRanks: ['一'],
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
  },
  methods: {
    getOptionsSiteCode() {
      optionsSiteCode({ platformCode: 'AM' }).then(res => {
        this.findform.siteOptions = res.data
      })
    },
    // 切换站点
    changeSite(val) {
      getLevelCategory({ amazonSite: this.form.site }).then(res => {
        this.form.categoryIdList.forEach(item => {
          item.platformLevels = []
          res.data.forEach(item => {
            item.level = 1
          })
          item.platformLevels.push(res.data)
          item.platformRanks = ['一']
          item.platformCategoryId = []
        })
      })
    },
    setPlatLevel(platformLevels, id) {
      let currentLevel
      platformLevels.forEach(item => {
        item.forEach(e => {
          if (e.id === id) {
            currentLevel = e.level + 1
          }
        })
      })
      return currentLevel
    },
    getPlatformCategory(id, item) {
      const params = {
        amazonSite: this.form.site,
        id: id
      }
      getLevelCategory(params).then(res => {
        if (id) { // 获取子级
          this.form.autoApply = true
          if (res.data.length) {
            // 设置层级
            res.data.forEach(e => {
              e.level = this.setPlatLevel(item.platformLevels, id)
            })
            // 赋值
            this.platformIndex = this.setPlatLevel(item.platformLevels, id)
            const itemPlace = this.numArr.find(item => this.platformIndex === item.number)
            if (itemPlace) {
              const placeholder = itemPlace.character
              this.$set(item.platformRanks, this.platformIndex - 1, placeholder)
            }
            this.$set(item.platformLevels, this.platformIndex - 1, res.data)
            this.$set(item.platformCategoryId, this.platformIndex - 1, '')
            this.deleteChild(this.platformIndex, item.platformLevels)
          } else {
            item.platformLevels.forEach(list => {
              list.forEach(e => {
                if (e.id === id) {
                  this.platformIndex = e.level
                }
              })
            })
            this.deleteChild(this.platformIndex, item.platformLevels)
            this.deleteChild(this.platformIndex, item.platformCategoryId)
          }
        } else { // 第一级
          // console.log(this.line)
          this.form.categoryIdList[this.line].platformLevels = []
          const data = res.data
          data.forEach(item => {
            item.level = 1
          })
          this.form.categoryIdList[this.line].platformLevels.push(data)
          this.form.categoryIdList[this.line].platformRanks = ['一']
          this.form.categoryIdList[this.line].platformCategoryId = []
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
    // 添加
    append(item, index) {
      this.line++
      this.form.categoryIdList.push({
        platformLevels: [],
        platformCategoryId: [],
        platformRanks: [],
        platformId: index + 1,
        platformIndex: index + 1
      })
      this.getPlatformCategory()
    },
    remove(item, index) {
      this.form.categoryIdList.splice(index, 1)
      this.line--
    },
    handlerSeve(formName) {
      const categoryId = []
      this.form.categoryIdList.forEach(item => {
        const list = item.platformCategoryId.filter(acc => acc && acc.trim())
        if (list.length === 0) {
          categoryId.push(list[0])
        } else {
          categoryId.push(list[list.length - 1])
        }
      })
      const arr = []
      let isBool = true
      categoryId.forEach(item => {
        if (arr.indexOf(item) === -1) {
          arr.push(item)
        } else {
          isBool = false
        }
      })
      if (isBool) {
        saveRelationCategory({
          templateName: this.row.name,
          categoryIdList: categoryId,
          autoApply: this.form.autoApply
        }).then(res => {
          this.$message.success(res.msg)
          this.$parent.$emit('close', true)
        })
      } else {
        return this.$message.error('类目重复选择')
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.category-box{
  margin-bottom:6px;
  display:inline-block;
  width: 160px;
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
