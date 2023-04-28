<template>
  <div class="store-list">
    <div class="sl-left d-flex flex-column">
      <div class="text-center p-2 border-bottom">
        <el-input v-model="platformKeyword" class="w-100" placeholder="输入关键词进行过滤平台" />
      </div>
      <div class="h-100 overflow-auto position-relative">
        <ul>
          <li v-for="item in platformList2"
              :key="item.code"
              class="d-flex align-items-center justify-content-between"
              :class="{'sl-item-checked':item.code===currentStoreCode}"
              @click="getChildren(item)"
          >
            <span>
              <el-checkbox v-model="mapping[item.code].checked"
                           :indeterminate="mapping[item.code].indeterminate"
                           :disabled="disabled"
                           @change="platformChangeHandler(item)"
                           @click.native.stop
              />
              <span>{{ item.name }}</span>
              <span class="ms-1">({{ mapping[item.code].checkedList.length }})</span>
            </span>
            <i class="el-icon-arrow-right" />
          </li>
        </ul>
      </div>
    </div>
    <div v-loading="loading" class="sl-right">
      <div v-if="mapping[currentStoreCode]" class="d-flex flex-column h-100">
        <div class="d-flex py-2 px-3 border-bottom justify-content-between">
          <el-checkbox v-model="mapping[currentStoreCode].checked"
                       :indeterminate="mapping[currentStoreCode].indeterminate"
                       :disabled="disabled"
                       @change="checkedAllHandler"
          >
            全选 ({{ mapping[currentStoreCode].checkedList.length }}/{{ mapping[currentStoreCode].list.length }})
          </el-checkbox>
          <el-input v-model="storeKeyword" class="w-50" placeholder="输入关键词进行过滤店铺" />
        </div>
        <div class="overflow-auto h-100 px-3">
          <el-checkbox-group v-model="mapping[currentStoreCode].checkedList" @change="changeHandler">
            <el-checkbox v-for="item in currentStoreList"
                         :key="item.code"
                         :label="item.code"
                         :disabled="disabled"
                         class="my-1 d-inline"
            >
              {{ item.name }}
            </el-checkbox>
          </el-checkbox-group>
          <div v-if="currentStoreList.length===0" class="h-100 d-flex align-items-center justify-content-center text-muted">暂无店铺</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPlatforms, getStoresByPlatformAndKeyword } from '@/api/sams'
export default {
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      platformList: [],
      mapping: {}, // 存储平台对应的店铺列表
      platformKeyword: '',
      currentStoreCode: '',
      storeKeyword: '',
      currentStoreChecked: [],
      isIndeterminate: false,
      cacheResult: null
    }
  },
  computed: {
    currentStoreList() {
      if (this.currentStoreCode === '') return []
      const list = this.mapping[this.currentStoreCode].list || []
      const keyword = this.storeKeyword.trim()
      const r = new RegExp(keyword, 'i')
      return list.filter(item => {
        if (keyword === '') return true
        return r.test(item.name) || r.test(item.code)
      })
    },
    platformList2() {
      const keyword = this.platformKeyword.trim()
      const r = new RegExp(keyword, 'i')
      return this.platformList.filter(item => {
        if (keyword === '') return true
        return r.test(item.name) || r.test(item.code)
      })
    }
  },
  watch: {
    mapping: {
      handler(values) {
        const result = []
        Object.entries(values).forEach(([key, value]) => {
          if (value.checked) {
            result.push({ ifAll: true, platformCode: key, storeCode: [] })
          } else if (value.checkedList.length > 0) {
            result.push({ ifAll: false, platformCode: key, storeCode: [...value.checkedList] })
          }
        })
        this.cacheResult = result
        this.$emit('input', result)
      },
      deep: true
    },
    value(val) {
      if (val === this.cacheResult) return
      this.value.forEach(item => {
        if (this.mapping[item.platformCode]) {
          Object.assign(this.mapping[item.platformCode], {
            checkedList: item.storeCode,
            checked: item.ifAll,
            indeterminate: !item.ifAll && item.storeCode.length > 0
          })
        }
      })
    }
  },
  created() {
    getPlatforms().then(list => {
      this.platformList = list
      const mapping = {}
      list.forEach(item => {
        const code = item.code
        let checkedList = []
        const existItem = this.value.find(item => item.platformCode === code)
        if (existItem) {
          checkedList = existItem.storeCode
        }

        mapping[item.code] = {
          loaded: false, // 是否已获取过下级
          list: [], // 存储下级
          checkedList, // 存储已勾选的下级
          checked: false, // 平台是否勾选
          indeterminate: false // 平台是否是半勾选
        }
      })
      this.mapping = mapping
    })
  },
  methods: {
    getChildren({ code }, callback) {
      if (this.loading) return
      this.loading = true
      this.currentStoreCode = ''
      this.storeKeyword = ''
      if (this.mapping[code].loaded) {
        this.currentStoreCode = code
        this.loading = false
        callback && callback()
      } else {
        getStoresByPlatformAndKeyword(code).then(list => {
          const d = this.mapping[code]
          d.list = list
          d.loaded = true
          this.currentStoreCode = code

          // d.checked 为true，则说明是全选，将获取的店铺列表全局插入到checkedList中
          if (d.checked === true) {
            d.checkedList = list.map(el => el.code)
          } else if (d.list.length > 0 && d.checkedList.length === d.list.length) {
            d.checked = true
          }
          callback && callback()
        }).finally(() => {
          this.loading = false
        })
      }
    },
    // 处理勾选平台时 全选店铺
    platformChangeHandler(data) {
      const code = data.code

      const getCheckedList = () => {
        const d = this.mapping[code]
        if (d.checked) {
          d.checkedList = this.mapping[code].list.map(item => item.code)
        } else {
          d.checkedList = []
        }
        d.indeterminate = false
      }

      if (code !== this.currentStoreCode) {
        this.getChildren(data, () => {
          getCheckedList()
        })
      } else {
        getCheckedList()
      }
    },
    // 根据店铺的勾选 处理平台的勾选状态
    changeHandler(values) {
      const d = Object.assign({}, this.mapping[this.currentStoreCode], {
        checkedList: values,
        indeterminate: values.length > 0 && values.length !== this.currentStoreList.length,
        checked: values.length === this.currentStoreList.length
      })
      this.mapping[this.currentStoreCode] = d
    },
    checkedAllHandler(v) {
      const d = this.mapping[this.currentStoreCode]
      if (v) {
        d.checkedList = d.list.map(item => item.code)
      } else {
        d.checkedList = []
      }
      d.indeterminate = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/element-var.scss';
$height: 240px;
.store-list {
  font-size: $--font-size-base;
  color: $--color-text-regular;
  border: 1px #eee solid;
  border-radius: 4px;
  display: flex;
  .sl-left {
    max-height: $height;
    width: 240px;
    border-right: 1px #eee solid;
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      li {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2px 15px;
        cursor: pointer;
        &:hover {
          background: $--background-color-base;
        }
        &.sl-item-checked {
          color: var(--color-primary);
          font-weight: 700;
        }
      }
    }
  }
  .sl-right {
    width:100%;
    height: $height;
  }
  ::v-deep {
    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
      background: var(--color-primary);
      color: var(--color-primary);
      border-color: var(--color-primary);
    }
    .el-checkbox__input.is-disabled + span.el-checkbox__label {
      color: $--color-text-regular;
    }
  }
}
</style>
