module.exports = function(db, DataTypes) {
  return db.define('user_claim', {
    id: { type: DataTypes.INTEGER(10), primaryKey: true },
    user_id: { type: DataTypes.INTEGER(10), unique: true, index: true },
    agency: { type: DataTypes.STRING(64), unique: false, index: false },
    reference: { type: DataTypes.STRING(16), unique: false, index: false },
    traveller: { type: DataTypes.STRING(64), unique: false, index: false },
    price: { type: DataTypes.FLOAT(), unique: false, index: false }
  }, {
    timestamps: false,
    tableName: 'user_claim',
    underscore: true
  });
};