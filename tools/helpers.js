const functions = {
  getIconClassName: function (categoryName, categories) {
    const category = categories.find(category => category.name === categoryName)
    return category.icon
  },

  toDate: function (date) {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)
      .toISOString()
      .split('T')[0]
  },

  eq: function (v1, v2) { return v1 === v2 },

  monthPick: function (months) {
    const monthGroup = []
    months.forEach(month => {
      if (!monthGroup.includes(month)) {
        monthGroup.push(month)
      }
    })
    return monthGroup
  }

}

module.exports = functions