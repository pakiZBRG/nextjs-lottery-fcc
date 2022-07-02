import { ConnectButton } from 'web3uikit';

const Header = () => {
    return (
        <div className='p-3 flex flex-row'>
            <p className='text-xl py-4'>Decentralized lottery</p>
            <div className='ml-auto py-2 px-4'>

                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}

export default Header;