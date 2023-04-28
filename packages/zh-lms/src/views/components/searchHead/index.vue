<template>
  <formGroup ref="formRef" :form-attrs="formAttrs" :model="searchData" label-width="84px" class="form-col no-message">
    <template v-for="(item,index) in formAttrs">
      <el-form-item v-if="item.slot " :key="index" :slot="item.slot" :label="item.label" :label-width="item.type==='searchType'?'0':'80px'">
        <!-- 父子 筛选 -->
        <SearchType v-if="item.type==='searchType'" ref="searchType" :search-data="searchData" :prop="item.prop" label-width="0" :search-type-list="item" :search-sort-option="searchSortOption" @changeSearchType="changeSearchType" />
        <!-- <DatePicker v-if="item.type === 'dateTime'" :ref="item.prop" :search-data="searchData" :date-time-start="item.dateTimeStart" :date-time-end="item.dateTimeEnd" /> -->
        <!-- 店铺 -->
        <SelectStore v-if="item.type==='selectStore'" ref="selectStore" :search-data="searchData" :store-list="storeList" :prop="item.prop" :platform-code="platformCode" />
        <!-- 创建人 -->
        <SelectUser v-if="item.type==='selectUser'" ref="selectUser" :search-data="searchData" :prop="item.prop" />
        <!-- listing类型 -->
        <ListingType v-if="item.type==='listingType'" :ref="item.prop" :prop="item.prop" :search-data="searchData" :list="item" @toggleListingType="toggleListingType" />
        <DateTimePicker v-if="item.type==='dateTime'" :ref="item.prop" :search-data="searchData" :date-time-start="item.dateTimeStart" :date-time-end="item.dateTimeEnd" :value-format="valueFormat" />
        <VRender v-else :v-nodes="$slots[item.slot]" :v-if="index" />
      </el-form-item>
    </template>
  </formGroup>
</template>

<script>
import formGroup from '../../components/form-group/index.vue'
import SelectUser from './selectUser.vue'
import ListingType from './listingType.vue'
import SearchType from './type.vue'
import DateTimePicker from './dateTimePicker.vue'
import SelectStore from './selectStore.vue'

const VRender = {
  props: ['vNodes'],
  render() {
    return this.vNodes
  }
}

export default {
  name: 'Index',
  components: {
    SearchType,
    SelectUser,
    ListingType,
    DateTimePicker,
    SelectStore,
    formGroup,
    VRender
  },
  props: {
    formAttrs: Array,
    searchData: Object,
    searchSortOption: Array, // 父子
    storeList: Array, // 店铺列表
    platformCode: String, // 平台简码
    valueFormat: String
    // listingTypeOption: Array
    // searchTypeOption: Array
  },
  methods: {
    // 重置
    resetSearch() {
      this.$refs.formRef.ref.resetFields()
      this.$refs.searchType && this.$refs.searchType[0] && this.$refs.searchType[0].resetForm()
      this.$refs.listingType && this.$refs.listingType[0] && this.$refs.listingType[0].resetForm()
      this.$refs.selectUser && this.$refs.selectUser[0] && this.$refs.selectUser[0].resetForm()
      this.$refs.dateTime && this.$refs.dateTime[0] && this.$refs.dateTime[0].resetForm()
      this.$refs.selectStor && this.$refs.selectStore[0] && this.$refs.selectStor[0].resetForm()
      this.$refs.upOnlineDateTimeateTime && this.$refs.upOnlineDateTimeateTime[0] && this.$refs.upOnlineDateTimeateTime[0].resetForm()
    },
    // 切换类型
    changeSearchType(val) {
      this.$emit('changeSearchType', val)
    },
    // 切换类型
    toggleListingType() {
      this.$emit('toggleListingType')
    }
  }

}
</script>

<style>

</style>
