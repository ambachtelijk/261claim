module.exports = function(db, DataTypes) {
  return db.define("airline", {
    iata: { type: DataTypes.STRING(2), unique: false, index: true },
    icao: { type: DataTypes.STRING(3), unique: true, index: true },
    name: { type: DataTypes.STRING(32), unique: true, index: true }
  }, {
    timestamps: false,
    tableName: 'airline'
  });
};