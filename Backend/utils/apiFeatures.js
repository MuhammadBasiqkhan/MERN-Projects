class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.Keyword;

    const searchQuery = keyword ? {
      name: {
        $regex: keyword,
        $options: "i",
      },
    } : {};

    this.query = this.query.find(searchQuery);
    return this;
  }

  filter() {
    const querycopy = { ...this.queryStr }

    // Remove fields that should not be used for filtering
    const removefield = ["Keyword", "page", "limit"]
    removefield.forEach(element => {
      delete querycopy[element]
    });

    // Advanced filtering for price, etc.
    let queryStr = JSON.stringify(querycopy)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`)

    this.query = this.query.find(JSON.parse(queryStr));
    console.log(queryStr)
    return this;
  }

  pagination(resultperpage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultperpage * (currentPage - 1); 
    const limit = resultperpage; 

    this.query = this.query.skip(skip).limit(limit); // Apply skip and limit to the query
    return this;
  }
}

module.exports = ApiFeatures;
