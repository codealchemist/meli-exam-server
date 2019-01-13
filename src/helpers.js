function getCategories (items) {
  const categories = items.map(item => item.category_id)
  return [...new Set(categories)] // Unique.
}

function getDecimalsCount (num) {
  const decimals = num.toString().split('.')[1]
  if (!decimals) return 0
  return decimals.length
}

function getItems (items) {
  return items.map(item => itemAdapter(item))
}

function itemAdapter (item) {
  return {
    id: item.id,
    title: item.title,
    price: {
      currency: item.currency_id,
      amount: item.price,
      decimals: getDecimalsCount(item.price)
    },
    picture: item.thumbnail,
    condition: item.condition,
    free_shipping: item.shipping.free_shipping,
    address: item.address
  }
}

module.exports = {
  getCategories,
  getItems,
  itemAdapter
}
