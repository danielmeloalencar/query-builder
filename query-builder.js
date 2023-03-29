class QueryBuilder {
  constructor(table) {
    this.table = table;
    this.selectCols = [];
    this.whereConditions = [];
  }

  select(...cols) {
    this.selectCols = [...cols];
    return this;
  }

  where(column, operator, value) {
    this.whereConditions.push(`${column} ${operator} '${value}'`);
    return this;
  }

  whereLike(column, value) {
    this.whereConditions.push(`${column} LIKE '${value}'`);
    return this;
  }

  whereIn(column, values) {
    const valueString = values.map((value) => `'${value}'`).join(',');
    this.whereConditions.push(`${column} IN (${valueString})`);
    return this;
  }

  whereNotIn(column, values) {
    const valueString = values.map((value) => `'${value}'`).join(',');
    this.whereConditions.push(`${column} NOT IN (${valueString})`);
    return this;
  }

  whereNull(column) {
    this.whereConditions.push(`${column} IS NULL`);
    return this;
  }

  whereNotNull(column) {
    this.whereConditions.push(`${column} IS NOT NULL`);
    return this;
  }

  build() {
    let query = `SELECT ${this.selectCols.length > 0 ? this.selectCols.join(', ') : '*'} FROM ${this.table}`;
    if (this.whereConditions.length > 0) {
      query += ` WHERE ${this.whereConditions.join(' AND ')}`;
    }
    return query;
  }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = QueryBuilder;
} else {
  window.QueryBuilder = QueryBuilder;
}
