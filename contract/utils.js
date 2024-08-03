import contract from "./Transactions.json";

export const contractABI = contract.abi;
export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
