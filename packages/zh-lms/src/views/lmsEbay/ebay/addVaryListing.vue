<!-- 创建ebay单个 Vary Listing -->
<script>
import addListing from './addListing.vue'

export default {
  name: 'LmsLmsEbayEbayAddVaryListing',
  extends: addListing,
  data() {
    return {
      // Listing类型 Variation Normal Combo
      listingType: 'Variation'
    }
  }
}
</script>
