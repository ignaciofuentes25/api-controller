module.exports = {
    hrPool: {
        user: process.env.DB_USR,
        password: process.env.DB_PWD,
        connectString: process.env.DB_CONNSTR,
        poolMin: Number(process.env.DB_POOLMIN || 10),
        poolMax: Number(process.env.DB_POOLMAX || 10),
        poolIncrement: Number(process.env.DB_POOLINCREMENT || 0),
    }
};