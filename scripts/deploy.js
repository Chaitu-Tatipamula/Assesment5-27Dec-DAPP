const hre = require('hardhat')

async function sleep(ms){
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main(){
    const tokenContract = await hre.ethers.deployContract("Token")
    tokenContract.waitForDeployment()
    console.log(`token Contract deployed at : ${tokenContract.target}`);

    await sleep(30 * 1000)

    await hre.run('verify:verify',{
        address : tokenContract.target,
        constructorArguments : []
    })

}

main().catch((err)=>{
    console.error(err);
    process.exitCode(1);
})