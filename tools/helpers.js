const functions = {
  getIconClassName: function (categoryName, categories) {
    const category = categories.find(category => category.name === categoryName)
    return category.icon
  },

  toDate: function(date){
    return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)
      .toISOString()
      .split('T')[0]
  },
 
  eq: function (v1, v2) { return v1 === v2 },

  inputValidation: function (record) {
    // Required validation
    for (const key in record) {
      if (!record[key]) return false
    }
    // Space name check
    if (record.name.trim().length === 0) return false
    // category select validation
    if (record.category === 'non-select') return false
    // pass validation
    return true
  }
}

module.exports = functions