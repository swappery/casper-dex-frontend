import { helpers, utils } from "casper-js-client-helper";
import { CLKey, CLValueParsers } from "casper-js-sdk";
import { BigNumber } from "ethers";
import { ERC20SignerClient } from "./erc20signer-client";
import { parseFixed } from "@ethersproject/bignumber";

const { contractSimpleGetter } = helpers;
export class SwapperyPairClient extends ERC20SignerClient {
    async getReserves() {
        let reserves = [];
        reserves.push(BigNumber.from(await contractSimpleGetter(
            this.nodeAddress,
            this.contractHash!,
            ["reserve0"]
        )));
        reserves.push(BigNumber.from(await contractSimpleGetter(
            this.nodeAddress,
            this.contractHash!,
            ["reserve1"]
        )));
        return reserves;
    }
    async getTokens() {
        let tokens = [];
        tokens.push(await contractSimpleGetter(
            this.nodeAddress,
            this.contractHash!,
            ["token0"]
        ));
        tokens.push(await contractSimpleGetter(
            this.nodeAddress,
            this.contractHash!,
            ["token1"]
        ));
        return tokens;
    }

    async getBallanceOfContract(key: CLKey) {
        const keyBytes = CLValueParsers.toBytes(key).unwrap()
        const itemKey = Buffer.from(keyBytes).toString("base64");
        let balance;
        try {
            const result = await utils.contractDictionaryGetter(
                this.nodeAddress,
                itemKey,
                this.namedKeys!.balances
            );
            balance = parseFixed(result.toString());
        } catch (err) {
        // exception when no tokens in user account
            balance = BigNumber.from(0);
        }
        return balance;
    }
}