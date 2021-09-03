const functions = {
  dateToString(date) {
    const day = ('0' + String(date.getDate())).slice(-2)
    const month = ('0' + String(date.getMonth() + 1)).slice(-2)
    const year = String(date.getFullYear())
    const dateArray = [year, month, day]
    return dateArray.join('-')
  },
  getIcon: function (categoryName, categories, icon) {
    const category = categories.find(category => category.name === categoryName)
    return category.icon
  }
}

module.exports = functions