import {
    CasperClient,
    CLPublicKey,
    CLAccountHash,
    CLByteArray,
    CLKey,
    CLString,
    CLTypeBuilder,
    CLValue,
    CLValueBuilder,
    CLValueParsers,
    CLMap,
    DeployUtil,
    EventName,
    EventStream,
    Keys,
    RuntimeArgs,
    Contracts,
} from "casper-js-sdk";
import { Some, None } from "ts-results";
import blake from "blakejs";
import { concat } from "@ethersproject/bytes";
import { RouterEvents } from "./constants";
import { helpers, constants, utils } from "casper-js-client-helper";
import ContractClient from "casper-js-client-helper/dist/casper-contract-client";
import { RecipientType, IPendingDeploy, IClassContractCallParams } from "casper-js-client-helper/dist/types";
const {
    fromCLMap,
    toCLMap,
    installContract,
    setClient,
    contractSimpleGetter,
    contractCallFn,
    createRecipientAddress
} = helpers;
const { DEFAULT_TTL } = constants;

class SwapperyRouterClient extends ContractClient {
    protected namedKeys?: {
        pairList: string;
    };

    public async setContractHash(hash: string) {
        const { contractPackageHash, namedKeys } = await setClient(
            this.nodeAddress,
            hash,
            [
                "pair_list"
            ]
        );
        this.contractHash = hash;
        this.contractPackageHash = contractPackageHash;
        /* @ts-ignore */
        this.namedKeys = namedKeys;
    }

    public async feeTo() {
        return await contractSimpleGetter(
        this.nodeAddress,
        this.contractHash!,
        ["feeto"]
        );
    }

    public async feeToSetter() {
        return await contractSimpleGetter(
        this.nodeAddress,
        this.contractHash!,
        ["feeto_setter"]
        );
    }

    public async addLiquidity(
        keys: Keys.AsymmetricKey,
        token0: string,
        token1: string,
        amount0Desired: string,
        amount1Desired: string,
        amount0Min: string,
        amount1Min: string,
        to: RecipientType,
        paymentAmount: string,
        ttl = DEFAULT_TTL
    ) {
        const runtimeArgs = RuntimeArgs.fromMap({
            token0: CLValueBuilder.string(token0),
            token1: CLValueBuilder.string(token1),
            amount0_desired: CLValueBuilder.u256(amount0Desired),
            amount1_desired: CLValueBuilder.u256(amount1Desired),
            amount0_min: CLValueBuilder.u256(amount0Min),
            amount1_min: CLValueBuilder.u256(amount1Min),
            to: createRecipientAddress(to)
        });

        return await this.contractCall({
        entryPoint: "add_liquidity",
        keys,
        paymentAmount,
        runtimeArgs,
        cb: deployHash => this.addPendingDeploy(RouterEvents.AddLiquidity, deployHash),
        ttl,
        });
    }

    public async removeLiquidity(
        keys: Keys.AsymmetricKey,
        token0: string,
        token1: string,
        liquidity: string,
        amount0Min: string,
        amount1Min: string,
        to: RecipientType,
        paymentAmount: string,
        ttl = DEFAULT_TTL
    ) {
        const runtimeArgs = RuntimeArgs.fromMap({
            token0: CLValueBuilder.string(token0),
            token1: CLValueBuilder.string(token1),
            liquidity: CLValueBuilder.u256(liquidity),
            amount0_min: CLValueBuilder.u256(amount0Min),
            amount1_min: CLValueBuilder.u256(amount1Min),
            to: createRecipientAddress(to)
        });

        return await this.contractCall({
        entryPoint: "remove_liquidity",
        keys,
        paymentAmount,
        runtimeArgs,
        cb: deployHash => this.addPendingDeploy(RouterEvents.RemoveLiquidity, deployHash),
        ttl,
        });
    }

    public async allowances(owner: CLPublicKey, spender: CLPublicKey) {
        // TODO: REUSEABLE METHOD
        const keyOwner = new CLKey(new CLAccountHash(owner.toAccountHash()));
        const keySpender = new CLKey(new CLAccountHash(spender.toAccountHash()));
        const finalBytes = concat([CLValueParsers.toBytes(keyOwner).unwrap(), CLValueParsers.toBytes(keySpender).unwrap()]);
        const blaked = blake.blake2b(finalBytes, undefined, 32);
        const encodedBytes = Buffer.from(blaked).toString("hex");

        const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        encodedBytes,
        this.namedKeys!.pairList
        );

        return result.toString();
    }
}

export default SwapperyRouterClient;
