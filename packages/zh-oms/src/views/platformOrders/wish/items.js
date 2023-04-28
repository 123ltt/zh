export default [
  {
    title: '订单信息',
    items: [
      { label: '销售平台', prop: 'platformName' },
      { label: '平台单号', prop: 'platOrderId' },
      { label: 'OMS单号', prop: 'omOrderId', path: 'oms/orderManagement/details' },
      { label: '订单来源', prop: 'orderTypeStr', labelWidth: '120px' },
      { label: '销售店铺', prop: 'storeName' },
      { label: '平台订单状态', prop: 'orderStatusStr' },
      { label: 'OMS订单状态', prop: 'omOrderStatusStr' },
      { label: '交易号', prop: 'transactionId', labelWidth: '120px' }
    ]
  },
  {
    title: '费用详情',
    labelWidth: '120px',
    items: [
      { label: '订单总金额', prop: 'orderAmountWithTax', isPrice: true },
      { label: '平台交易费', prop: 'platformTradeAmount', isPrice: true },
      { label: '买家实付金额', prop: 'platformOrderAmount', isPrice: true },
      { label: '卖家实收金额（除税）', prop: 'sellerIncomeWithoutTax', labelWidth: '120px', isPrice: true },
      { label: '物流补贴', prop: 'chinaPostSubsidyAmount', isPrice: true },
      { label: '税费', prop: 'transactionTax', isPrice: true },
      { label: '客付运费', prop: 'freightChargesAmount', isPrice: true },
      { label: '实收运费', prop: 'sellerIncomeFreight', labelWidth: '120px', isPrice: true }
    ]
  },
  {
    title: '收货地址',
    items: [
      { label: '收件人', prop: 'buyerName' },
      { label: '国家', prop: 'buyerCountryStr' },
      { label: '省/州', prop: 'buyerState' },
      { label: '城市', prop: 'buyerCity', labelWidth: '120px' },
      { label: '移动电话', prop: 'buyerPhoneNumber' },
      { label: '固定电话', prop: 'buyerPhoneNumber' },
      { label: '邮编', prop: 'buyerZipcode' },
      { label: '买家邮箱', prop: 'buyerEmail', labelWidth: '120px' },
      { label: '地址一', prop: 'buyerStreetAddress' },
      { label: '地址二', prop: 'buyerStreetAddress2' },
      { label: '个人税号', prop: 'customerIdentityNumber' },
      { label: 'EPC/A+目的国家', prop: 'epcOrAdvancedOrderCountry', labelWidth: '120px' }
    ]
  },
  {
    title: '物流信息',
    items: [
      { label: '物流渠道', prop: 'shippingProvider' },
      { label: '跟踪号', prop: 'trackingNumber' }
    ]
  },
  {
    title: '时间信息',
    items: [
      { label: '订单创建时间', prop: 'orderTime' },
      { label: '允许发货时间', prop: 'releasedToMerchantTime' },
      { label: '抓单时间', prop: 'firstGrabDate' },
      { label: '平台订单最后更新时间', prop: 'lastModifiedTime', labelWidth: '120px' },
      { label: '标记时间', prop: 'omsMarkTime' },
      { label: '实际发货时间', prop: 'omsDeliveryTime' },
      { label: '退款时间', prop: 'refundedTime' }
    ]
  },
  {
    title: '商品信息',
    type: 'table',
    key: 'goodList',
    items: [
      { label: '商品图片', prop: 'productImageUrl', type: 'image', width: 80 },
      {
        label: '商品信息',
        type: 'table',
        width: 200,
        itemData: [
          { label: '在线SKU', prop: 'sellerSku', labelWidth: '50px', type: 'text' },
          { label: '商品名称', prop: 'productName', labelWidth: '50px', type: 'text' },
          { label: 'ItemID', prop: 'productId', labelWidth: '50px', type: 'text' },
          { label: 'SKU编码', prop: 'pmsSkuBriefList', labelWidth: '50px', type: 'code' }
        ]
      },
      { label: '单价', prop: 'price', type: 'money', width: 130 },
      { label: '数量', prop: 'quantity', type: 'text', width: 120 },
      { label: '销售金额', prop: 'salesAmount', type: 'money', width: 120 }
    ]
  }
]
