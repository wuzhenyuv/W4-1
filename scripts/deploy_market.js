let { ethers } = require("hardhat");

async function main() {
    // await run('compile');
    let [owner, second] = await ethers.getSigners();

    let Token = await ethers.getContractFactory("Token");
    let aAmount = ethers.utils.parseUnits("100000", 18);
    let atoken = await Token.deploy(
        "AToken",
        "AToken",
        aAmount);

    await atoken.deployed();
    console.log("AToken:" + atoken.address);

    let MyTokenMarket = await ethers.getContractFactory("MyTokenMarket");

    let routerAddr = "0xd507f9CA60a809358E1F0B88209DAE311cff74Fc";
    let wethAddr = "0x211848E6fe90c84099Ab46cD92b00cAa6952f4d5";

    let market = await MyTokenMarket.deploy(
        atoken.address,
        routerAddr,
        wethAddr,
    );

    await market.deployed();
    console.log("market:" + market.address);

    await atoken.approve(market.address, ethers.constants.MaxUint256);
    console.log("完成授权");

    let ethAmount = ethers.utils.parseUnits("1", 18);
    await market.AddLiquidity(aAmount, { value: ethAmount })
    console.log("添加流动性");

    let b = await atoken.balanceOf(owner.address);
    console.log("持有token:" + ethers.utils.formatUnits(b, 18));

    let buyEthAmount = ethers.utils.parseUnits("0.3", 18);
    out = await market.buyToken("0", { value: buyEthAmount })

    b = await atoken.balanceOf(owner.address);
    console.log("购买到:" + ethers.utils.formatUnits(b, 18));

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });