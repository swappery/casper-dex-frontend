import { CLErrorCodes, CLType, CLTypeTag, CLU32BytesParser, CLValue, CLValueBytesParsers, ResultAndRemainder, resultHelper, ToBytesResult } from "casper-js-sdk";
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { MaxUint256, NegativeOne, One, Zero } from '@ethersproject/constants';
import { arrayify, concat } from '@ethersproject/bytes';
import { CLPoolInfo, CLPoolInfoBytesParser, CLPoolInfoType, PoolInfo } from "./pool_info";
import { Ok, Err } from 'ts-results';

export const toBytesNumber = (bitSize: number, signed: boolean) => (
  value: BigNumberish
): Uint8Array => {
  const val = BigNumber.from(value);

  // Check bounds are safe for encoding
  const maxUintValue = MaxUint256.mask(bitSize);

  if (signed) {
    const bounds = maxUintValue.mask(bitSize - 1); // 1 bit for signed
    if (val.gt(bounds) || val.lt(bounds.add(One).mul(NegativeOne))) {
      throw new Error('value out-of-bounds, value: ' + value);
    }
  } else if (val.lt(Zero) || val.gt(maxUintValue.mask(bitSize))) {
    throw new Error('value out-of-bounds, value: ' + value);
  }

  const valTwos = val.toTwos(bitSize).mask(bitSize);

  const bytes = arrayify(valTwos);

  if (valTwos.gte(0)) {
    // for positive number, we had to deal with paddings
    if (bitSize > 64) {
      // if zero just return zero
      if (valTwos.eq(0)) {
        return bytes;
      }
      // for u128, u256, u512, we have to and append extra byte for length
      return concat([bytes, Uint8Array.from([bytes.length])])
        .slice()
        .reverse();
    } else {
      // for other types, we have to add padding 0s
      const byteLength = bitSize / 8;
      return concat([
        bytes.slice().reverse(),
        new Uint8Array(byteLength - bytes.length)
      ]);
    }
  } else {
    return bytes.reverse();
  }
};

export const toBytesU32 = toBytesNumber(32, false);

export class CLPoolListType extends CLType {
    tag = CLTypeTag.List;
    linksTo = CLPoolListType;

    toString(): string {
        return "PoolList";
    }
    toJSON(): string {
        return this.toString();
    }
}
export type PoolList = Array<CLPoolInfo>;

export class CLPoolListBytesParser extends CLValueBytesParsers {
    toBytes(val: CLPoolList): ToBytesResult {
        const {data} = val;
        const valueByteList = data.map(
            e => new CLPoolInfoBytesParser().toBytes(e).unwrap()
            );
        valueByteList.splice(0, 0, toBytesU32(data.length));
        return Ok(concat(valueByteList));
    }
    fromBytesWithRemainder(bytes: Uint8Array): ResultAndRemainder<CLValue, CLErrorCodes> {
        const {
            result: u32Res,
            remainder: u32Rem
        } = new CLU32BytesParser().fromBytesWithRemainder(bytes);
        if (!u32Res.ok) {
        return resultHelper(Err(u32Res.val));
        }

        const size = u32Res.val.value().toNumber();

        const vec = [];

        let remainder = u32Rem;

        const parser = new CLPoolInfoBytesParser();

        for (let i = 0; i < size; i++) {
            if (!remainder) return resultHelper(Err(CLErrorCodes.EarlyEndOfStream));

            const { result: vRes, remainder: vRem } = parser.fromBytesWithRemainder(
                remainder
            );

            if (!vRes.ok) {
                return resultHelper(Err(vRes.val));
            }
            vec.push(vRes.val);
            remainder = vRem;
        }
        if (vec.length === 0) {
            return resultHelper(Ok(new CLPoolList(vec)), remainder);
        }

        return resultHelper(Ok(new CLPoolList(vec)), remainder);
    }
}

export class CLPoolList extends CLValue {
    data: PoolList;

    constructor(v: Array<CLPoolInfo>) {
        super();
        this.data = v;
    }
    value(): Array<CLPoolInfo> {
        return this.data;
    }

    clType(): CLType {
        return new CLPoolListType();
    }

    get(index: number): CLPoolInfo {
        if (index >= this.data.length) {
        throw new Error('List index out of bounds.');
        }
        return this.data[index];
    }

    set(index: number, item: CLPoolInfo): void {
        if (index >= this.data.length) {
        throw new Error('List index out of bounds.');
        }
        this.data[index] = item;
    }

    push(item: CLPoolInfo): void {
        this.data.push(item);
    }

    remove(index: number): void {
        this.data.splice(index, 1);
    }

    pop(): CLPoolInfo | undefined {
        return this.data.pop();
    }

    size(): number {
        return this.data.length;
    }
}
