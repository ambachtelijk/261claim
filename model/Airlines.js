module.exports = function(db, DataTypes) {
    return db.define("airlines", {
        iata: { type: DataTypes.STRING, primaryKey: true },
        icao: { type: DataTypes.STRING, index: true },
        name: { type: DataTypes.STRING, index: true },
        callsign: { type: DataTypes.STRING, index: true },
        country: { type: DataTypes.STRING, index: true },
        active: { type: DataTypes.BOOLEAN, index: true },
    }, {
        timestamps: false,
    });
};