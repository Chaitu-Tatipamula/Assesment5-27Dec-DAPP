"use client"
import React, { useEffect, useState } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import { TokenABI, TokenContract } from '../constants'
import {SellModal} from './SellModal'
import {TransferModal} from './TransferModal'
import { ethers } from 'ethers'
import Button from './button'


export function Home() {
  const { address } = useAccount()
  const [isMintLoading, setIsMintLoading] = useState(false); 
  const [isTransferLoading, setIsTransferLoading] = useState(false); 
  const [openSellModal, setOpenSellModal] = useState(false);
  const [openTransferModal, setOpenTransferModal] = useState(false);
  
  const handleOpenSellModal = () => {
    setIsMintLoading(true)
    setOpenSellModal(true)
  };
  
  const handleOpenTransferModal = () => {
    setIsTransferLoading(true)
    setOpenTransferModal(true)
  };
  
  const handleClose = () => {
    setOpenSellModal(false)
    setOpenTransferModal(false)
    setIsMintLoading(false)
    setIsTransferLoading(false)
  };
  
  const { data : balance } = useContractRead({
    address: TokenContract,
    abi: TokenABI,
    functionName: 'balanceOf',
    args: [address],
  })


  async function mint(to, amount){

    try {
        const provider =  new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        console.log(provider);
        console.log(signer);
        const tokenContract = new ethers.Contract(
            TokenContract,
            TokenABI,
            signer
        )
        const tx = await tokenContract.mint(to,amount)
        await tx.wait()
        
    } catch (error) {
        console.error('Minting NFT failed:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        window.alert(error)
    }
  }
 

  async function transfer(to,amount){
    try {
        const provider =  new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        console.log(provider);
        console.log(signer);
        const tokenContract = new ethers.Contract(
          TokenContract,
          TokenABI,
          signer
        )
        const tx = await tokenContract.transferTokens(to,amount)
        await tx.wait()
        
    } catch (error) {
        console.error('Listing NFT failed:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        window.alert(error)
    }
  }

  useEffect(()=>{
    console.log(balance);
    
  },[address])
  

  return (
    <div className='flex flex-col justify-center align-middle'>
        {/* {console.log(listingFee.toString()*10**(-18))} */}
        {/* {console.log(tokenIds)}
        {console.log(metadataList)} */}
        {/* {console.log(provider)} */}
      <h1>Token Contract DAPP</h1>
      {balance && <h2>Balance of {address} : {BigInt(balance).toString()}</h2>}
      <div className='container p-5'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
          <Button onClick={handleOpenSellModal} isLoading={isMintLoading} >
            Mint
          </Button>
          <Button onClick={handleOpenTransferModal} isLoading={isTransferLoading} >
            Transfer
          </Button>
        </div>
      </div>
     <SellModal open={openSellModal} handleClose={handleClose} mintNft={mint} />
     <TransferModal open={openTransferModal} handleClose={handleClose} address={address} transfer={transfer} />
    </div>
  )
}
