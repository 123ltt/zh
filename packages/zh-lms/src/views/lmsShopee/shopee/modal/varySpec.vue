<template>
  <div>
    <el-row :gutter="20">
      <el-col v-for="(list,index) in tierVariation" :key="index" :span="12" class="close-box">
        <i v-if="index===1&&!isOnline" class="el-icon-circle-close close fs-3" @click="removeRule" />
        <el-divider content-position="left">{{ tabName[index] }}</el-divider>
        <el-table :data="list.options" border size="mini" max-height="300">
          <el-table-column
            align="right"
          >
            <template slot="header" slot-scope="scope">
              <g-list-group-item label="名称">
                <el-input v-model="list.name" :data-id="scope" size="mini" placeholder="规则名称" />
              </g-list-group-item>
            </template>
            <template slot-scope="scope">
              <g-list-group-item label="选项">
                <el-row type="flex">
                  <el-input v-model="scope.row.value" size="mini" placeholder="选项" @change="valChange" />
                  <i class="el-icon-minus fs-2 " @click="remove(scope.$index,index)" />
                </el-row>
              </g-list-group-item>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="w-100 mt-2" :disabled="isOnline" size="mini" type="primary" @click="add(index)">增加选项</el-button>
      </el-col>
      <el-col v-if="tierVariation.length===1" :span="12">
        <el-divider content-position="left">规格二</el-divider>
        <el-button type="primary" size="mini" :disabled="isOnline" @click="addRule">新增规则二</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-divider content-position="left">{{ tierVariation[0].name }}图片</el-divider>
      <div class="d-flex flex-wrap">
        <div v-for="(item,index) in tierVariation[0].options" :key="index" class="upload-box mx-1 mb-1" @click="openPic(index)">
          <g-thumb v-if="item.imageUrl" :width="166" :height="178" :url="item.imageUrl" />
          <div v-else style="height:178px;">
            <i class="el-icon-plus avatar-uploader-icon fs-1" />
          </div>
          <span>{{ item.value }}</span>
        </div>
      </div>
      <el-row type="flex" justify="end">
        <el-button size="mini">取消</el-button>
        <el-button size="mini" type="primary" @click="submit">确定</el-button>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import picModal from './picModal.vue'
export default {
  components: {
    // setPicture
  },
  props: {
    baseProductInfo: Object,
    imageInfo: Array,
    isOnline: Boolean
  },
  data() {
    return {
      tabName: ['规格一', '规格二'],
      tierVariation: this.baseProductInfo.tierVariation || [
        { name: '', options: [{ value: '', imageUrl: '' }] }
      ]
    }
  },
  watch: {
    'baseProductInfo.tierVariation'() {
      this.tierVariation = this.baseProductInfo.tierVariation
      this.tierVariation[0].options.forEach(item => {
        item.imageUrl = ''
      })
    }
  },
  methods: {
    remove(index, listIndex) {
      this.tierVariation[listIndex].options.splice(index, index + 1)
    },
    add(index) {
      if (this.tierVariation[index].options.length >= 20) {
        this.$message.warning('每个规格最多添加20条选项')
        return
      }
      this.tierVariation[index].options.push({ value: '', imageUrl: '' })
    },
    addRule() {
      this.tierVariation.push({ name: '', options: [{ value: '', imageUrl: '' }] })
    },
    removeRule() {
      this.tierVariation.splice(1, 1)
    },
    valChange() {
      if (this.isOnline) {
        this.baseProductInfo.updateField.push(5)
      }
    },
    openPic(index) {
      const imgs = []
      const imageUrl = this.tierVariation[0].options[index].imageUrl
      if (imageUrl) {
        imgs.push({ imageUrl })
      }
      if (this.imageInfo) {
        imgs.push(...this.imageInfo)
      }
      this.$modal({
        component: picModal,
        title: '图片集',
        data: { imgs },
        callback: (val) => {
          val && (this.tierVariation[0].options[index].imageUrl = val)
        }
      })
    },
    submit() {
      const check = this.tierVariation[0].options.some(item => item?.imageUrl?.length)
      if (check) {
        this.$message.warning('有选项未选图片')
        return
      }
      this.baseProductInfo.tierVariation = this.tierVariation
      const options = this.tierVariation[1]?.options
      const type = options?.filter(item => item.value !== '').length || 0
      this.$parent.$emit('close', this.tierVariation, type)
    }
  }
}
</script>

<style lang="scss" scoped>
.close-box{
  position: relative;
}
.close{
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
}
.upload-box{
    width: 166px;
    height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    // overflow: hidden;
  }
  .el-icon-plus{
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
  }
</style>
