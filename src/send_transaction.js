const Web3  =  require('web3');

const web3  =  new Web3("http://localhost:7545");

const from_address  =  '0x9a9Ae7c9b4F7A1741e7020024842e7A748305896';
const to_address  =  '0x49cd100BCC4dcA997A3f116B83Cc00b0A0CB0A8d';

async function eth_transaction(){
    let SingedTransaction = await web3.eth.accounts.signTransaction({
        to:  to_address,
        value: '1000000000',
        gas: 2000000
    },  "c3c1de6dfb8975d3bf18e540606d59da9a1b6d856d36a53936b4c447a5aca4f0"  );

    web3.eth.sendSignedTransaction(SingedTransaction.rawTransaction).then((receipt) => {
        console.log(receipt);
    });
}

eth_transaction();
