class QueryBuilder {
  constructor(db) {
    this.db = db;
    this.reset();
  }

  reset() {
    this.sql = '';
    this.params = [];
    this.clauseAdded = false;
  }

  select(columns) {
    this.reset();
    this.sql = `SELECT ${columns}`;
    return this;
  }

  from(table) {
    return this.addClause('FROM', table);
  }

  where(condition, ...params) {
    return this.addClause('WHERE', condition, ...params);
  }

  orWhere(condition, ...params) {
    return this.addClause('OR', condition, ...params);
  }

  andWhere(condition, ...params) {
    return this.addClause('AND', condition, ...params);
  }

  orderBy(columns, direction = 'ASC') {
    if (typeof columns === 'string') {
      columns = [columns];
    }

    const sql = columns.map((col) => `${col} ${direction}`).join(', ');
    return this.addClause('ORDER BY', sql);
  }

  limit(n) {
    return this.addClause('LIMIT', n);
  }

  addClause(keyword, ...parts) {
    const sql = parts.shift();
    const params = parts;
    const clause = this.clauseAdded ? ` ${keyword} ${sql}` : `${keyword} ${sql}`;
    this.sql += clause;
    this.params.push(...params);
    this.clauseAdded = true;
    return this;
  }

  whereEqual(column, value) {
    return this.where(`${column} = ?`, value);
  }

  whereNotEqual(column, value) {
    return this.where(`${column} <> ?`, value);
  }

  whereLike(column, value) {
    return this.where(`${column} LIKE ?`, `%${value}%`);
  }

  execute() {
    return new Promise((resolve, reject) => {
      this.db.all(this.sql, this.params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}
