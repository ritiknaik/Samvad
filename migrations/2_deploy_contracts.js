const Database = artifacts.require("Database");

module.exports = async function(deployer) {
    await deployer.deploy(Database);
};
