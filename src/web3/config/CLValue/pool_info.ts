import { CLByteArrayBytesParser, CLByteArrayType, CLErrorCodes, CLKey, CLKeyBytesParser, CLType, CLTypeTag, CLU256, CLU256BytesParser, CLU64, CLU64BytesParser, CLValue, CLValueBuilder, CLValueBytesParsers, ResultAndRemainder, resultHelper, ToBytesResult } from "casper-js-sdk";
import { BigNumberish } from "ethers";
import {concat} from "@ethersproject/bytes";
import { Ok, Err } from 'ts-results';
export class CLPoolInfoType extends CLType {
  tag = CLTypeTag.Any;
  linksTo = CLPoolInfo;

  toString(): string {
    return "PoolInfo";
  }

  toJSON(): string {
    return this.toString();
  }
}

export type PoolInfo = {
    lpToken: CLKey,
    allocPoint: BigNumberish,
    lastRewardBlockTime: BigNumberish,
    accCakePerShare: BigNumberish    
}

export class CLPoolInfoBytesParser extends CLValueBytesParsers {
    toBytes(val: CLPoolInfo): ToBytesResult {
        const {data} = val;
        let result = new CLKeyBytesParser().toBytes(data.lpToken).unwrap();
        result = concat([result, new CLU256BytesParser().toBytes(new CLU256(data.allocPoint)).unwrap()]);
        result = concat([result, new CLU64BytesParser().toBytes(new CLU64(data.lastRewardBlockTime)).unwrap()]);
        result = concat([result, new CLU256BytesParser().toBytes(new CLU256(data.accCakePerShare)).unwrap()]);
        return Ok(new Uint8Array(result));
    }

    fromBytesWithRemainder(bytes: Uint8Array): ResultAndRemainder<CLPoolInfo, CLErrorCodes> {
        let {result: lpTokenResult, remainder: remainder1} = new CLByteArrayBytesParser().fromBytesWithRemainder(bytes,new CLByteArrayType(32));
        let {result: allocPointResult, remainder: remainder2} = new CLU256BytesParser().fromBytesWithRemainder(remainder1!);
        let {result: lastRewardBlockTimeResult, remainder: remainder3} = new CLU64BytesParser().fromBytesWithRemainder(remainder2!);
        let {result: accCakePerShareResult, remainder: remainder4} = new CLU256BytesParser().fromBytesWithRemainder(remainder3!);
        if (lpTokenResult.ok && allocPointResult.ok && lastRewardBlockTimeResult.ok && accCakePerShareResult.ok) {
            let pool: PoolInfo = {lpToken: CLValueBuilder.key(lpTokenResult.val), allocPoint: allocPointResult.val.value(), lastRewardBlockTime: lastRewardBlockTimeResult.val.value(), accCakePerShare: accCakePerShareResult.val.value()};
            return resultHelper(Ok(new CLPoolInfo(pool)), remainder4);
        }
        return resultHelper(Err(CLErrorCodes.Formatting));
    }
}

export class CLPoolInfo extends CLValue {
  data: PoolInfo;
  bytesParser: CLPoolInfoBytesParser;

  constructor(v: PoolInfo) {
    super();
    this.bytesParser = new CLPoolInfoBytesParser();
    this.data = v;
  }

  clType(): CLType {
    return new CLPoolInfoType();
  }

  value(): PoolInfo {
    return this.data;
  }

  toBytes(): ToBytesResult{
    return new CLPoolInfoBytesParser().toBytes(this);
  }
}