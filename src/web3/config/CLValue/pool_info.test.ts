import { expect } from 'chai';
import { CLPoolInfo,CLPoolInfoBytesParser,CLPoolInfoType } from "./index";
import { BigNumber } from "@ethersproject/bignumber"
import { CLI32, CLI32Type, CLList, CLListBytesParser, CLListType, CLU256, CLU64BytesParser, CLValueBuilder, CLValueParsers, decodeBase16, ToBytes } from 'casper-js-sdk';
import { CLPoolList, CLPoolListBytesParser } from './pool_list';

describe('CLPoolInfo', () => {
  it('Should be able to return proper value by calling .value()', () => {
    // const biddingToken = { price: 2000 };
    // const myHash = new CLBiddingToken(biddingToken);

    // expect(myHash.value()).to.be.deep.eq(biddingToken);
  });

  it('Should be able to return proper value by calling .clType()', () => {
    const expectedBytes = decodeBase16("dca3f6c21068069def598459deb98f63677ebf60af45f2f4a62be44d5f7dd93902e80335d3a8620000000000");
    const parsed = new CLPoolInfoBytesParser().fromBytesWithRemainder(expectedBytes);
    
    const list = new CLPoolList([parsed.result.unwrap()]);
    // console.log(bytes)
    
    // expect(false);
  });

  it('Should be able to return proper byte array by calling toBytes() / fromBytes()', () => {
    const expectedBytes = decodeBase16("01000000dca3f6c21068069def598459deb98f63677ebf60af45f2f4a62be44d5f7dd93902e80335d3a8620000000000")
    const poolInfoArray = new CLPoolListBytesParser().fromBytesWithRemainder(
        expectedBytes,
        );
    const poolInfo = poolInfoArray.result.unwrap();
    console.dir(poolInfo.data[0].data.lpToken);
    expect(false);
  });
})