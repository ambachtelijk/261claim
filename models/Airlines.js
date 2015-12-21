module.exports = function(db, DataTypes) {
    return db.define("airlines", {
        iata: { type: DataTypes.STRING, primaryKey: true }
    }, {
        timestamps: false,
    });
};