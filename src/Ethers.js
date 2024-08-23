import { ethers } from 'ethers';
import artifact from './usd.json';

const rpc =
  'https://still-broken-hill.matic-amoy.quiknode.pro/8709bf5eb7f5a10aa1d549e0b3e378d5b9372a96/';
const provider = new ethers.JsonRpcProvider(rpc);
export const ethersGetBalance = async (address) => {
  try {
    const checkBalance = await provider.getBalance(address);
    const balanceInEth = ethers.formatEther(checkBalance);

    return balanceInEth.toString();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const ethersGetBalanceUSDT = async (tokenAddress, address) => {
  try {
    const contract = new ethers.Contract(tokenAddress, artifact.abi, provider);
    const checkBalance = await contract.balanceOf(address);
    const balanceInEth = Number(ethers.formatEther(checkBalance)) * 10 ** 12;

    return balanceInEth.toString();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const ethersGetBalanceUSDC = async (tokenAddress, address) => {
  try {
    const contract = new ethers.Contract(tokenAddress, artifact.abi, provider);
    const checkBalance = await contract.balanceOf(address);
    const balanceInEth = ethers.formatEther(checkBalance) * 10 ** 12;

    return balanceInEth.toString();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
