const connectDB = () => {
    console.log("DataBase Connected !!!");
}

// User
const createNewUser = async ({ name, username, email, passwordHash }) => {
    return {};
}
const getUserById = async userId => {
    return {};
}
const findOneUser = async filter => {
    return {};
}


module.exports = {
    connectDB,
    User: { createNewUser, getUserById, findOneUser }
}
