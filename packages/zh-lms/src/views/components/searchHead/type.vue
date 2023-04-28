<template>
  <el-row>
    <el-col :span="6" class="mb-0">
      <el-select v-model="searchData.searchType" size="mini" placeholder="请选择" clearable @change="changeSearchType">
        <el-option v-for="(item,index) in searchTypeOption" :key="index" :label="item.label" :value="item.value" />
      </el-select>
    </el-col>
    <el-col :span="searchData.isSearchSort?13:18" class="mb-0">
      <div style="margin-left:10px">
        <template v-if="searchData.searchType ===1">
          <el-input v-model="searchData.searchContentNum" style="height:28px" size="mini" placeholder="支持单个标题模糊搜索" clearable @change="changeSearchTypes" />
        </template>
        <template v-else>
          <el-input v-model="searchData.searchContentNum" resize="none" type="textarea" style="height:28px" size="mini" placeholder="多个按逗号、空格或回车隔开" clearable @change="changeSearchTypes" />
        </template>
      </div>
    </el-col>
    <el-col v-if="searchData.isSearchSort" :span="5">
      <el-radio-group v-model="searchData[prop]" class="" @change="changeSearchTypes">
        <el-radio v-for="(item,index) in searchSortList" :key="index" :label="item.value" class="ms-1 me-0">{{ item.label }}</el-radio>
      </el-radio-group>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'Type',
  props: {
    searchTypeList: Object,
    searchSortOption: Array,
    searchData: {
      type: Object
    },
    prop: { // 父子
      type: String,
      default: 'searchSort'
    }
  },
  data() {
    return {
      searchTypeOption: [
        { label: '标题', value: 1 },
        { label: 'SKU', value: 2 },
        { label: '平台SKU', value: 3 },
        { label: 'ItemID', value: 4 },
        { label: 'ListingID', value: 5 }
      ],
      searchSortList: [{ label: '子', value: 2 }, { label: '父', value: 1 }]
    }
  },
  mounted() {
    if (this.searchTypeList.items) {
      this.searchTypeOption = this.searchTypeList.items()
    }
    if (this.searchSortOption) { // 父子类型
      this.searchSortList = this.searchSortOption
    }
  },
  methods: {
    // 切换类型
    changeSearchType(val) {
      this.$emit('changeSearchType', val)
    },
    changeSearchTypes() {
      let searchContent = []
      if (this.searchData.searchContentNum !== '') {
        if (this.searchData.searchType !== 1 && this.searchData.searchType !== '') { // 多行文本
          searchContent = this.searchData.searchContentNum.split(/,|，|\r|\n|\r\n|\s+/)
        } else {
          searchContent = [this.searchData.searchContentNum]
        }
      }
      this.searchData.searchContent = searchContent || []
    },
    resetForm() {
      this.searchData.searchContent = []
      this.searchData.searchContentNum = ''
      this.searchData.searchType = null
      this.searchData[this.prop] = 1
    }
  }

}
</script>

<style>

</style>
