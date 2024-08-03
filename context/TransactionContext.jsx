import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../contract/utils";

export const TransactionContext = React.createContext();

export const TransactionProvider = ({ infura_id, infura_secret, children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [statusAccount, setStatusAccount] = useState("");
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const transaction_instance = new ethers.Contract(
      contractAddress,
      contractABI,
      signer,
    );
    return transaction_instance;
  };

  const handleChange = (e, name) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: e.target.value,
    }));
  };

  const getAllTransactions = async () => {
    try {
      if (!window.ethereum) {
        setTransactions([]);
        setStatusAccount(
          <span>
            <p>
              {" "}
              🦊{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://metamask.io/download.html`}
              >
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>,
        );
      }

      const instance = getEthereumContract();
      const transactions = await instance.getAllTransactions();
      const structuredTransaction = transactions.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(
          transaction.timestamp.toNumber() * 1000,
        ).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: parseInt(transaction.amount._hex) / 10 ** 18,
      }));
      return {
        transactions: structuredTransaction.reverse(),
      };
    } catch (error) {
      return {
        transactions: [],
        status: "😥 " + error.message,
      };
    }
  };

  const getCurrentWalletConnected = async () => {
    try {
      if (!window.ethereum) {
        return {
          address: "",
          status: (
            <span>
              <p>
                {" "}
                🦊{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://metamask.io/download.html`}
                >
                  You must install Metamask, a virtual Ethereum wallet, in your
                  browser.
                </a>
              </p>
            </span>
          ),
        };
      }

      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 You can now send a transaction.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (error) {
      return {
        address: "",
        status: "😥 " + error.message,
      };
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        return {
          address: "",
          status: (
            <span>
              <p>
                {" "}
                🦊{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://metamask.io/download.html`}
                >
                  You must install Metamask, a virtual Ethereum wallet, in your
                  browser.
                </a>
              </p>
            </span>
          ),
        };
      }
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setStatusAccount("👆🏽 You can now send a transaction.");
      setCurrentAccount(addressArray[0]);
      const { transactions, status } = await getAllTransactions();
      setTransactions(transactions);
      if (status) setStatusAccount(status);
    } catch (error) {
      return {
        address: "",
        status: "😥 " + error.message,
      };
    }
  };

  const addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          setStatusAccount("👆🏽 You can now send a transaction.");
        } else {
          setCurrentAccount("");
          setStatusAccount(
            "🦊 Connect to Metamask using the top right button.",
          );
        }
      });
    } else {
      setStatusAccount(
        <p>
          {" "}
          🦊{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://metamask.io/download.html`}
          >
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>,
      );
    }
  };

  const sendTransaction = async () => {
    try {
      if (!window.ethereum) {
        return {
          transactions: transactions,
          status: (
            <span>
              <p>
                {" "}
                🦊{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://metamask.io/download.html`}
                >
                  You must install Metamask, a virtual Ethereum wallet, in your
                  browser.
                </a>
              </p>
            </span>
          ),
        };
      }
      const { addressTo, amount, keyword, message } = formData;
      const instance = getEthereumContract();
      const amountParsed = ethers.utils.parseEther(amount);
      const gas = await instance.estimateGas.newTransaction(
        addressTo,
        amountParsed,
        message,
        keyword,
      );

      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", //hex 21000gwei;
            value: amountParsed._hex,
          },
        ],
      });

      const txHash = await instance.newTransaction(
        addressTo,
        amountParsed,
        message,
        keyword,
        {
          gasLimit: gas,
        },
      );
      setIsLoading(true);
      setStatusAccount(
        <span>
          ✅{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://ropsten.etherscan.io/tx/${txHash.hash}`}
          >
            Click here to view the status of your transaction on Etherscan!
          </a>
          <br />
          ℹ️ Once the transaction is verified by the network, the message will
          be updated automatically.
        </span>,
      );
      await txHash.wait();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum object");
    }
  };

  const transactionListener = () => {
    //event OnTransfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);
    const instance = getEthereumContract();
    instance.on(
      "OnTransfer",
      (from, receiver, amount, message, timestamp, keyword) => {
        const ethAmount = parseInt(amount._hex) / 10 ** 18;
        const structuredTransaction = {
          addressTo: receiver,
          addressFrom: from,
          timestamp: new Date(timestamp.toNumber() * 1000).toLocaleString(),
          message: message,
          keyword: keyword,
          amount: ethAmount,
        };
        setTransactions((prevState) => [structuredTransaction, ...prevState]);
        setStatusAccount(
          "🎉 Your transaction has been added to the blockchain from " +
            from +
            " to " +
            receiver +
            " with " +
            ethAmount +
            " ETH",
        );
      },
    );
  };

  useEffect(() => {
    async function fetchTransactions() {
      const { transactions, status } = await getAllTransactions();
      setTransactions(transactions);
      if (status) setStatusAccount(status);
    }

    fetchTransactions();
    transactionListener();
    async function fetchWallet() {
      const { address, status } = await getCurrentWalletConnected();
      setCurrentAccount(address);
      setStatusAccount(status);
    }

    fetchWallet();
    addWalletListener();
  }, [currentAccount]);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        statusAccount,
        formData,
        handleChange,
        sendTransaction,
        transactions,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export async function getStaticProps() {
  return {
    props: {
      infura_id: process.env.INFURA_PROJECT_ID,
      infura_secret: process.env.INFURA_PROJECT_SECRET,
    },
  };
}
