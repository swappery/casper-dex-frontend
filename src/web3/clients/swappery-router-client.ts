import {
    CLValueBuilder,
    CLValueParsers,
    Keys,
    RuntimeArgs,
    decodeBase16,
    CLList,
    CLPublicKey,
} from "casper-js-sdk";
import blake from "blakejs";
import { concat } from "@ethersproject/bytes";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { helpers, constants, utils } from "casper-js-client-helper";
import ContractClient from "casper-js-client-helper/dist/casper-contract-client";
import { RecipientType } from "casper-js-client-helper/dist/types";
import { RouterEvents, WCSPR_CONTRACT_HASH } from "../config/constant";
import { decode } from "punycode";
import { getAccountHash } from "./utils";
import { contractCallFn } from "./utils";
const {
    setClient,
    contractSimpleGetter,
    createRecipientAddress
} = helpers;
const { DEFAULT_TTL } = constants;

export class SwapperyRouterClient extends ContractClient {
    protected namedKeys?: {
        pairList: string;
    };

    async setContractHash(hash: string) {
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

    async feeTo() {
        return await contractSimpleGetter(
        this.nodeAddress,
        this.contractHash!,
        ["feeto"]
        );
    }

    async feeToSetter() {
        return await contractSimpleGetter(
        this.nodeAddress,
        this.contractHash!,
        ["feeto_setter"]
        );
    }

    async contractCallWithSigner({
        publicKey,
        paymentAmount,
        entryPoint,
        runtimeArgs,
        cb,
        ttl = DEFAULT_TTL,
        dependencies = [],
      }: SwapperyRouterClient.ContractCallWithSignerPayload) {
        if (!this.contractHash) throw Error("Invalid Conract Hash");
        const deployHash = await contractCallFn({
          chainName: this.chainName,
          contractHash: this.contractHash,
          entryPoint,
          paymentAmount,
          nodeAddress: this.nodeAddress,
          publicKey,
          runtimeArgs,
          ttl,
          dependencies,
        });
    
        if (deployHash !== null) {
          cb && cb(deployHash);
          return deployHash;
        } else {
          throw Error("Invalid Deploy");
        }
      }

    async addLiquidity(
        publicKey: CLPublicKey,
        token0: string,
        token1: string,
        amount0Desired: string,
        amount1Desired: string,
        amount0Min: string,
        amount1Min: string,
        paymentAmount: string,
        ttl = DEFAULT_TTL
    ) {
        if (!this.isPairExists(token0, token1)) return;
        const runtimeArgs = RuntimeArgs.fromMap({
            token0: CLValueBuilder.key(
                CLValueBuilder.byteArray(decodeBase16(token0))
              ),
            token1: CLValueBuilder.key(
                CLValueBuilder.byteArray(decodeBase16(token1))
              ),
            amount0_desired: CLValueBuilder.u256(amount0Desired),
            amount1_desired: CLValueBuilder.u256(amount1Desired),
            amount0_min: CLValueBuilder.u256(amount0Min),
            amount1_min: CLValueBuilder.u256(amount1Min),
            to: CLValueBuilder.key(
                CLValueBuilder.byteArray(publicKey.toAccountHash())
              ),
        });

        return await this.contractCallWithSigner({
            publicKey,
            entryPoint: "add_liquidity",
            paymentAmount,
            runtimeArgs,
            cb: (deployHash: string) =>
                this.addPendingDeploy(RouterEvents.AddLiquidity, deployHash),
            ttl,
        } as SwapperyRouterClient.ContractCallWithSignerPayload);
    }

    async removeLiquidity(
        publicKey: CLPublicKey,
        token0: string,
        token1: string,
        liquidity: string,
        amount0Min: string,
        amount1Min: string,
        paymentAmount: string,
        ttl = DEFAULT_TTL
    ) {
        const runtimeArgs = RuntimeArgs.fromMap({
            token0: CLValueBuilder.key(
                CLValueBuilder.byteArray(decodeBase16(token0))
              ),
            token1: CLValueBuilder.key(
                CLValueBuilder.byteArray(decodeBase16(token1))
              ),
            liquidity: CLValueBuilder.u256(liquidity),
            amount0_min: CLValueBuilder.u256(amount0Min),
            amount1_min: CLValueBuilder.u256(amount1Min),
            to: CLValueBuilder.key(
                CLValueBuilder.byteArray(publicKey.toAccountHash())
              ),
        });

        return await this.contractCallWithSigner({
            entryPoint: "remove_liquidity",
            publicKey,
            paymentAmount,
            runtimeArgs,
            cb: (deployHash: string) => 
                this.addPendingDeploy(RouterEvents.RemoveLiquidity, deployHash),
            ttl,
        } as SwapperyRouterClient.ContractCallWithSignerPayload);
    }

    async swapExactTokensForTokens(
        publicKey: CLPublicKey,
        sourceToken: string,
        targetToken: string,
        amountIn: string,
        amountOutMin: string,
        paymentAmount: string,
        ttl = DEFAULT_TTL
    ) {
        let token_path;
        if ( await this.isPairExists(sourceToken, targetToken) ){
            token_path = new CLList([
                CLValueBuilder.key(
                  CLValueBuilder.byteArray(decodeBase16(sourceToken))
                ),
                CLValueBuilder.key(
                  CLValueBuilder.byteArray(decodeBase16(targetToken))
                )
              ]);
        } else if ((await this.isPairExists(sourceToken, WCSPR_CONTRACT_HASH))
                && (await this.isPairExists(WCSPR_CONTRACT_HASH, targetToken))){
            token_path = new CLList([
                CLValueBuilder.key(
                    CLValueBuilder.byteArray(decodeBase16(sourceToken))
                ),
                CLValueBuilder.key(
                    CLValueBuilder.byteArray(decodeBase16(WCSPR_CONTRACT_HASH))
                ),
                CLValueBuilder.key(
                    CLValueBuilder.byteArray(decodeBase16(targetToken))
                ),
            ])
        } else { return; }
        const runtimeArgs = RuntimeArgs.fromMap({
            amount_in: CLValueBuilder.u256(amountIn),
            amount_out_min: CLValueBuilder.u256(amountOutMin),
            path: token_path,
            to: CLValueBuilder.key(
                CLValueBuilder.byteArray(publicKey.toAccountHash())
              ),
        });

        return await this.contractCallWithSigner({
            entryPoint: "swap_exact_tokens_for_tokens",
            publicKey,
            paymentAmount,
            runtimeArgs,
            cb: (deployHash: string) => 
                this.addPendingDeploy(RouterEvents.Swap, deployHash),
            ttl,
        } as SwapperyRouterClient.ContractCallWithSignerPayload);
    }

    async swapTokensForExactTokens(
        publicKey: CLPublicKey,
        sourceToken: string,
        targetToken: string,
        amountOut: string,
        amountInMax: string,
        paymentAmount: string,
        ttl = DEFAULT_TTL
    ) {
        let token_path;
        if ( await this.isPairExists(sourceToken, targetToken) ){
            token_path = new CLList([
                CLValueBuilder.key(
                  CLValueBuilder.byteArray(decodeBase16(sourceToken))
                ),
                CLValueBuilder.key(
                  CLValueBuilder.byteArray(decodeBase16(targetToken))
                )
              ]);
        } else if ((await this.isPairExists(sourceToken, WCSPR_CONTRACT_HASH))
                && (await this.isPairExists(WCSPR_CONTRACT_HASH, targetToken))){
            token_path = new CLList([
                CLValueBuilder.key(
                    CLValueBuilder.byteArray(decodeBase16(sourceToken))
                ),
                CLValueBuilder.key(
                    CLValueBuilder.byteArray(decodeBase16(WCSPR_CONTRACT_HASH))
                ),
                CLValueBuilder.key(
                    CLValueBuilder.byteArray(decodeBase16(targetToken))
                ),
            ])
        } else { return; }
        const runtimeArgs = RuntimeArgs.fromMap({
            amount_out: CLValueBuilder.u256(amountOut),
            amount_in_max: CLValueBuilder.u256(amountInMax),
            path: token_path,
            to: CLValueBuilder.key(
                CLValueBuilder.byteArray(publicKey.toAccountHash())
              ),
        });

        return await this.contractCallWithSigner({
            entryPoint: "swap_tokens_for_exact_tokens",
            publicKey,
            paymentAmount,
            runtimeArgs,
            cb: (deployHash: string) => 
                this.addPendingDeploy(RouterEvents.Swap, deployHash),
            ttl,
        } as SwapperyRouterClient.ContractCallWithSignerPayload);
    }

    async swapExactTokensForTokensSupportingFee(
        publicKey: CLPublicKey,
        sourceToken: string,
        targetToken: string,
        amountIn: string,
        amountOutMin: string,
        paymentAmount: string,
        ttl = DEFAULT_TTL
    ) {
        let token_path;
        if ( await this.isPairExists(sourceToken, targetToken) ){
            token_path = new CLList([
                CLValueBuilder.key(
                  CLValueBuilder.byteArray(decodeBase16(sourceToken))
                ),
                CLValueBuilder.key(
                  CLValueBuilder.byteArray(decodeBase16(targetToken))
                )
              ]);
        } else if ((await this.isPairExists(sourceToken, WCSPR_CONTRACT_HASH))
                && (await this.isPairExists(WCSPR_CONTRACT_HASH, targetToken))){
            token_path = new CLList([
                CLValueBuilder.key(
                    CLValueBuilder.byteArray(decodeBase16(sourceToken))
                ),
                CLValueBuilder.key(
                    CLValueBuilder.byteArray(decodeBase16(WCSPR_CONTRACT_HASH))
                ),
                CLValueBuilder.key(
                    CLValueBuilder.byteArray(decodeBase16(targetToken))
                ),
            ])
        } else { return; }
        const runtimeArgs = RuntimeArgs.fromMap({
            amount_in: CLValueBuilder.u256(amountIn),
            amount_out_min: CLValueBuilder.u256(amountOutMin),
            path: token_path,
            to: CLValueBuilder.key(
                CLValueBuilder.byteArray(publicKey.toAccountHash())
              ),
        });

        return await this.contractCallWithSigner({
            entryPoint: "swap_exact_tokens_for_tokens_supporting_fee",
            publicKey,
            paymentAmount,
            runtimeArgs,
            cb: (deployHash: string) => 
                this.addPendingDeploy(RouterEvents.Swap, deployHash),
            ttl,
        } as SwapperyRouterClient.ContractCallWithSignerPayload);
    }

    async isPairExists(token0: string, token1: string) {
        // TODO: REUSEABLE METHOD
        const token0_hash = CLValueBuilder.key(
            CLValueBuilder.byteArray(decodeBase16(token0))
          );
        const token1_hash = CLValueBuilder.key(
            CLValueBuilder.byteArray(decodeBase16(token1))
          );
        const finalBytes = concat([CLValueParsers.toBytes(token0_hash).unwrap(), CLValueParsers.toBytes(token1_hash).unwrap()]);
        const blaked = blake.blake2b(finalBytes, undefined, 32);
        const encodedBytes = Buffer.from(blaked).toString("hex");

        const result = await utils.contractDictionaryGetter(
        this.nodeAddress,
        encodedBytes,
        this.namedKeys!.pairList
        );
        return result.isCLValue;
    }
}
export namespace SwapperyRouterClient {
    export interface ContractCallWithSignerPayload {
      publicKey: CLPublicKey;
      paymentAmount: BigNumberish;
      entryPoint: string;
      runtimeArgs: RuntimeArgs;
      cb: any;
      ttl: number;
      dependencies: string[];
    }
  }