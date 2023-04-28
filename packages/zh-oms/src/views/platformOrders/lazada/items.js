export default [
  {
    title: '订单信息',
    items: [
      { label: '销售平台', prop: 'platformName' },
      { label: '平台单号', prop: 'orderId' },
      { label: 'OMS单号', prop: 'omOrderId', path: 'oms/orderManagement/details' },

      { label: '订单类型', prop: 'shippingTypeStr' },
      { label: '销售店铺', prop: 'storeName' },
      { label: '平台订单状态', prop: 'platStatusStr' },
      { label: 'OMS订单状态', prop: 'omOrderStatusStr' },
      { label: '订单来源', prop: 'orderTypeStr' },
      { label: '销售站点', prop: 'siteCode' },
      { label: 'COD订单', prop: 'isCod' }
    ]
  },
  {
    title: '费用详情',
    currency: 'currency',
    items: [
      { label: '订单总金额', prop: 'orderAmountWithTax', isPrice: true },
      { label: '平台交易费', prop: 'platformTradeAmount', isPrice: true },
      { label: '买家实付金额', prop: 'platformOrderAmount', isPrice: true },
      { label: '卖家实收金额（除税）', prop: 'sellerIncomeWithoutTax', labelWidth: '120px', isPrice: true },
      { label: '平台优惠金额', prop: 'platFormDiscountAmount', isPrice: true },
      { label: '卖家优惠金额', prop: 'promotionDiscountTotal', isPrice: true },
      { label: '税费', prop: 'taxTotal', isPrice: true },
      { label: '客付运费', prop: 'freightChargesAmount', labelWidth: '120px', isPrice: true },
      { label: '付款方式', prop: 'paymentMethod' }
    ]
  },
  {
    title: '收货地址',
    items: [
      { label: '收件人', prop: 'buyerName' },
      { label: '国家', prop: 'country' },
      { label: '省/州', prop: 'address3' },
      { label: '城市', prop: 'city' },
      { label: '移动电话', prop: 'phone2' },
      { label: '固定电话', prop: 'phone' },
      { label: '邮编', prop: 'postCode' },
      { label: '买家邮箱', prop: 'buyerEmail' },
      { label: '地址一', prop: 'address1', grow: 1 },
      { label: '地址二', prop: 'address2', grow: 1 }
    ]
  },
  {
    title: '物流信息',
    items: [
      { label: '运输类型', prop: 'shippingProviderType' },
      { label: '平台分拣中心', prop: 'shipmentProvider' },
      { label: '最晚发货时间', prop: 'slaTimeStamp' }
    ]
  },
  {
    title: '时间信息',
    items: [
      { label: '订单创建时间', prop: 'createdAt' },
      { label: '抓单时间', prop: 'firstGrabDate' },
      { label: '标记时间', prop: 'omsMarkTime' },
      { label: '平台订单最后更新时间', prop: 'updatedAt', labelWidth: '120px' },
      { label: '实际发货时间', prop: 'deliveryTime' }
    ]
  }
]
