import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from '../constants'
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react";
import { ethers } from 'ethers';
import { useNotification } from "web3uikit";

const LotteryEntrance = () => {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId = parseInt(chainIdHex)
    const lotteryAddress = chainId in contractAddress ? contractAddress[chainId][0] : null;
    const [entranceFee, setEntranceFee] = useState('');
    const [numPlayers, setNumPlayers] = useState(0);
    const [recentWinner, setRecentWinner] = useState('');

    const dispatch = useNotification();

    const { runContractFunction: enterLottery, isLoading, isFetching } = useWeb3Contract({
        abi,
        contractAddress: lotteryAddress,
        functionName: "enterLottery",
        msgValue: entranceFee // msg.value
    });

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi,
        contractAddress: lotteryAddress,
        functionName: "getEntranceFee",
        params: {}
    });

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi,
        contractAddress: lotteryAddress,
        functionName: "getNumberOfPlayers",
        params: {}
    });

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi,
        contractAddress: lotteryAddress,
        functionName: "getRecentWinner",
        params: {}
    });

    const updateUI = async () => {
        const entranceFeeFromCall = (await getEntranceFee())?.toString();
        const numPlayersFromCall = (await getNumberOfPlayers())?.toString();
        const recentWinnerFromCall = await getRecentWinner();

        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled, numPlayers])

    const handleSuccess = async (tx) => {
        await tx.wait(1);
        handleNewNotification();
        updateUI();
    }

    const handleNewNotification = () => {
        dispatch({
            type: 'info', message: 'Transaction completed!', title: "Success", position: "topR", icon: 'bell'
        })
    }

    return (
        <div className="p-5">
            {lotteryAddress ?
                <div>
                    <button
                        className='bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg'
                        onClick={async () => await enterLottery({
                            onSuccess: handleSuccess,
                            onError: err => console.log(err.message)
                        })}
                        disabled={isLoading || isFetching}
                    >
                        Enter Lottery
                    </button>
                    <p>
                        Entrance Fee: {entranceFee && ethers.utils.formatUnits(entranceFee, "ether")}ETH
                    </p>
                    <p>
                        Number of entries: {numPlayers && numPlayers}
                    </p>
                    <p>
                        Recent winner: {recentWinner && recentWinner}
                    </p>
                </div>
                :
                <div>No Lottery Address detected</div>
            }

        </div>
    )
}

export default LotteryEntrance