module.exports = function(db, DataTypes) {
  return db.define("airline", {
    id: { type: DataTypes.INTEGER(11), primaryKey: true },
    iata: { type: DataTypes.STRING(2), unique: false, index: true },
    icao: { type: DataTypes.STRING(3), unique: true, index: true },
    name: { type: DataTypes.STRING(64), unique: false, index: true },
    alt_name: { type: DataTypes.STRING(255), unique: false, index: true },
    city: { type: DataTypes.STRING(64), unique: false, index: true },
    country: { type: DataTypes.STRING(2), unique: false, index: true },
    timezone: { type: DataTypes.STRING(32) },
    lat: { type: DataTypes.FLOAT() },
    lng: { type: DataTypes.FLOAT() },
    wiki: { type: DataTypes.STRING(255) }
  }, {
    timestamps: false,
    tableName: 'airport'
  });
};