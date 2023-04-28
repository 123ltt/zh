<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="模板名称" label-width="70px" prop="name">
        <el-input v-model="form.name" size="mini" placeholder="请输入模板名称" />
      </el-form-item>
      <el-row v-if="0">
        <el-table :data="tempHeadTitle">
          <el-table-column label="COUNTRY" prop="country" />
          <el-table-column label="MAKE" prop="make" />
          <el-table-column label="MODEL" prop="model" />
          <el-table-column label="YEAR" prop="year" />
          <el-table-column label="TRIM" prop="trim" />
          <el-table-column label="ENGINE" prop="engine" />
          <el-table-column label="操作" prop="" />
        </el-table>
      </el-row>
      <el-row>
        <el-col v-for="(tList,tIndex) in tempHeadTitle" :key="tIndex" :span="3">
          <el-form-item :label="tList.label" />
        </el-col>
      </el-row>
      <div v-for="(item,index) in form.categoryIdList" :key="index" class="category-box">
        <el-row>
          <el-col v-for="(value, i) in item.platformLevels" :key="i" :span="3">
            <el-form-item prop="platformLevels">
              <el-tooltip class="item" effect="dark" :content="showSelect(value,item.platformCategoryId[i])" placement="top">
                <el-select
                  v-model="item.platformCategoryId[i]"
                  size="mini"
                  filterable
                  :placeholder="item.platformRanks[i] + '级类目'"
                  popper-class="publish-category-select"
                  style="width: 100%;"
                  :style="i < 10 ? 'padding-right: 6px' : 'padding-right: 0'"
                  @focus="setMinWidth"
                  @change="getPlatformCategory(item, i,index)"
                >
                  <el-option v-for="list in value" :key="list.attributeValueId" :value="list.attributeValueId" :label="list.zhName" :title="list.enName" />
                </el-select>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <div style="height:40px;line-height:40px">
            <el-button icon="el-icon-plus" size="mini" @click="append(index)" />
            <el-button icon="el-icon-minus" size="mini" @click="remove(index)" />
          </div>
        </el-row>
      </div>
      <div style="padding-bottom: 20px;text-align: right">
        <el-button size="medium" @click="$parent.$emit('close')">取 消</el-button>
        <el-button type="primary" :disabled="disabledSave" size="medium" @click="handleSave('form')">确 定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { carAttrChild, carAttrTempDetail, carAttrTempSave } from '@/api/aliExpress/temp.js'
export default {
  name: 'EditModel',
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      firstData: [],
      disabledSave: !this.id,
      countryOption: [],
      tempHeadTitle: [{
        label: 'COUNTRY',
        value: 'country'
      }, {
        label: 'MAKE',
        value: 'make'
      }, {
        label: 'MODEL',
        value: 'model'
      }, {
        label: 'YEAR',
        value: 'year'
      }, {
        label: 'TRIM',
        value: 'trim'
      }, {
        label: 'ENGINE',
        value: 'engine'
      }, {
        label: '操作',
        value: ''
      }],
      line: 0,
      form: {
        name: '',
        categoryIdList: [{
          platformId: 0,
          platformLevels: [[]],
          platformCategoryId: [],
          attributeValId: [],
          platformRanks: ['一'],
          platformIndex: 0
        }],
        categoryIdListTemp: [], // 备份
        templateDetails: []
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
      ],
      rules: {
        name: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    // this.id && this.getCarAttrTempDetail()
    !this.id && this.getFirst()
    this.id && this.editCircle()
  },
  methods: {
    showSelect(value, id) {
      if (value.length && id) return value.find(its => its.attributeValueId === id).enName
    },
    handleSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            name: this.form.name,
            id: this.id
          }
          params.templateDetails = []
          this.form.categoryIdList.forEach((item, cIndex) => { // 行
            const obj = {}
            item.platformLevels.forEach((list, index) => { // 每一列
              list.forEach((acc, aIndex) => {
                item.platformCategoryId.forEach(att => {
                  if (acc.attributeValueId === att) {
                    switch (index) {
                      case 0:
                        obj.country = list[aIndex].enName
                        obj.countryValueId = list[aIndex].attributeValueId
                        obj.countryAttributeId = list[aIndex].attributeId
                        break
                      case 1:
                        obj.make = list[aIndex].enName
                        obj.makeAttributeId = list[aIndex].attributeId
                        obj.makeValueId = list[aIndex].attributeValueId
                        break
                      case 2:
                        obj.model = list[aIndex].enName
                        obj.modelAttributeId = list[aIndex].attributeId
                        obj.modelValueId = list[aIndex].attributeValueId
                        break
                      case 3:
                        obj.year = list[aIndex].enName
                        obj.yearAttributeId = list[aIndex].attributeId
                        obj.yearValueId = list[aIndex].attributeValueId
                        break
                      case 4:
                        obj.trim = list[aIndex].enName
                        obj.trimAttributeId = list[aIndex].attributeId
                        obj.trimValueId = list[aIndex].attributeValueId
                        break
                      case 5:
                        obj.engine = list[aIndex].enName
                        obj.engineAttributeId = list[aIndex].attributeId
                        obj.engineValueId = list[aIndex].attributeValueId
                        break
                    }
                  }
                })
              })
              params.templateDetails[cIndex] = obj
            })
          })
          carAttrTempSave({ ...params }, this.id).then(res => {
            this.$message.success(res.msg)
            this.$parent.$emit('close', true)
          })
        }
      })
    },
    setPlatLevel(platformLevels, id) {
      let currentLevel
      platformLevels.forEach(item => {
        item.forEach(e => {
          if (e.attributeValueId === id) {
            currentLevel = e.level + 1
          }
        })
      })
      return currentLevel
    },
    getFirst() {
      const params = {
        attributeId: 0,
        attributeValId: 0
      }
      carAttrChild(params).then(res => {
        this.firstData = res.data
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
    getPlatformCategory(item, index, Findex) {
      if (!item) { // 第一级
        this.form.categoryIdList[this.line].platformLevels = []
        const data = this.firstData
        data.forEach(item => {
          item.level = 1
        })
        this.form.categoryIdList[this.line].platformLevels.push(data)
        this.form.categoryIdList[this.line].platformRanks = ['一']
        this.form.categoryIdList[this.line].platformCategoryId = []
        return
      }
      const list = item.platformLevels[index]
      const id = item.platformCategoryId[index]
      const currentItem = list.find(item => item.attributeValueId === id)
      const params = {
        attributeId: currentItem.attributeId,
        attributeValId: currentItem.attributeValueId
      }
      carAttrChild(params).then(res => {
        if (res.data.length) {
          if (!this.id) this.disabledSave = true
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
          if (!this.id) {
            this.$set(item.platformLevels, this.platformIndex - 1, res.data)
            this.$set(item.platformCategoryId, this.platformIndex - 1, '')
            this.deleteChild(this.platformIndex, item.platformLevels)
          } else {
            this.form.categoryIdList[Findex].platformLevels.splice(index + 1, this.form.categoryIdList[Findex].platformLevels.length - index - 1)
            this.form.categoryIdList[Findex].platformLevels.push(res.data)
            this.form.categoryIdList[Findex].platformCategoryId.splice(index + 1, this.form.categoryIdList[Findex].platformCategoryId.length - index - 1)
            // this.form.categoryIdList[Findex].platformCategoryId.push(params.attributeValId)
          }
        } else {
          if (!this.id) {
            item.platformLevels.forEach(list => {
              list.forEach(e => {
                if (e.attributeValueId === id) {
                  this.platformIndex = e.level
                }
              })
            })
            this.disabledSave = !item.platformLevels.length - 1 === 5
            this.deleteChild(this.platformIndex, item.platformLevels)
            this.deleteChild(this.platformIndex, item.platformCategoryId)
          }
        }
      })
    },
    async editCircle() {
      await this.getFirst()
      const res = await carAttrTempDetail({ id: this.id })
      this.form.name = res.data.name
      const templateIds = res.data.templateDetails.map(item => {
        return `${item.countryValueId}-${item.makeValueId}-${item.modelValueId}-${item.yearValueId}-${item.trimValueId}-${item.engineValueId}`
      })
      res.data.templateDetails.map(item => {
        item = [
          { attributeId: item.countryAttributeId, attributeValId: item.countryValueId },
          { attributeId: item.makeAttributeId, attributeValId: item.makeValueId },
          { attributeId: item.modelAttributeId, attributeValId: item.modelValueId },
          { attributeId: item.yearAttributeId, attributeValId: item.yearValueId },
          { attributeId: item.trimAttributeId, attributeValId: item.trimValueId },
          { attributeId: item.engineAttributeId, attributeValId: item.engineValueId }
        ]
        return item
      }).forEach((item, j) => {
        if (j > 0) {
          this.form.categoryIdList.push({
            platformId: 0,
            platformLevels: [this.firstData],
            platformCategoryId: [],
            attributeValId: [],
            platformRanks: ['一'],
            platformIndex: 0
          })
        }
        const i = 0
        const templateId = templateIds[j].split('-').map(its => Number(its))
        this.getApi(item, i, j, templateId)
      })
    },
    getApi(item, i, j, templateId) {
      Promise.all(item.map(its => carAttrChild(its))).then(res => {
        for (let x = i; x < res.length; x++) {
          if (res[x].data.length) {
            this.form.categoryIdList[j].platformLevels.push(res[x].data)
            this.form.categoryIdList[j].platformRanks.push(['二', '三', '四', '五', '六'][x])
            this.form.categoryIdList[j].platformCategoryId = templateId
          }
        }
      })
      // while (item.length > 0) {
      //   carAttrChild(item.splice(0, 1)[0]).then(res => {
      //     if (res.data?.length) {
      //       this.form.categoryIdList[j].platformLevels.push(res.data)
      //       this.form.categoryIdList[j].platformRanks.push(['二', '三', '四', '五', '六'][i++])
      //       this.form.categoryIdList[j].platformCategoryId = templateId
      //       this.form.categoryIdList[j].platformLevels.forEach((its, x) => {
      //         if (!its.length) this.form.categoryIdList[j].platformLevels.splice(x, 1)
      //       })
      //       this.getApi(item, i, j)
      //     }
      //   })
      // }
    },
    setMinWidth(val) {
      const arr = Array.from(document.getElementsByClassName('publish-category-select'))
      arr.forEach(item => {
        item.style.minWidth = val.srcElement.clientWidth + 3 + 'px'
      })
    },
    // 父下拉框改变，删除子下拉框
    deleteChild(index, arr) {
      arr.splice(index, arr.length - index)
    },
    // 添加
    append(index) {
      // this.line++
      this.line = (this.form.categoryIdList.length - 1) + 1
      this.form.categoryIdList.push({
        platformLevels: [],
        platformCategoryId: [],
        platformRanks: [],
        platformId: index + 1,
        platformIndex: index + 1
      })
      this.getPlatformCategory()
    },
    remove(index) {
      this.form.categoryIdList.splice(index, 1)
      this.line--
    }

    // getcarAttrChild(attributeId, attributeValId) {
    //   carAttrChild({ attributeId: attributeId, attributeValId: attributeValId }).then(res => {
    //     console.log('res', res)
    //     this.countryOption = res.data
    //   })
    // },
    // getCarAttrTempDetail() {
    // carAttrTempDetail({ id: this.id }).then(res => {
    // const data = res.data
    // data.categoryIdList = data.templateDetails
    // this.form = data
    // this.tempHeadTitle = data.categoryIdList
    // this.tempHeadTitle = deepClone(data.categoryIdList.map(item => {
    //   item = this.tempHeadTitle.map(its => {
    //     for (const key in item) {
    //       for (const k in its) {
    //         if (its[k].toLowerCase() === key) {
    //           this.$set(its, key, item[key])
    //         }
    //       }
    //     }
    //     return its
    //   })
    //   return item
    // }))
    // this.tempHeadTitle = this.tempHeadTitle.map(item => {
    //   item = Object.assign({}, ...item)
    //   return item
    // })
    // })
    // }
  }
}
</script>

<style>

</style>
