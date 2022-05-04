import { helpers } from "casper-js-client-helper";
import {
    CLPublicKey,
} from "casper-js-sdk";
import { ERC20SignerClient } from "./erc20signer-client";

const { contractSimpleGetter } = helpers;
export class SwapperyPairClient extends ERC20SignerClient {
    async getReserves(publicKey: CLPublicKey) {
        let reserves = [];
        reserves.push(parseInt(await contractSimpleGetter(
            this.nodeAddress,
            this.contractHash!,
            ["reserve0"]
        )));
        reserves.push(parseInt(await contractSimpleGetter(
            this.nodeAddress,
            this.contractHash!,
            ["reserve1"]
        )));
        return reserves;
    }
}