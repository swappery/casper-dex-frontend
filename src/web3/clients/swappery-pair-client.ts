import {
    ERC20Client,
    constants as erc20constants,
  } from "casper-erc20-js-client";
  import { constants, utils, helpers } from "casper-js-client-helper";
  import {
    CLAccountHash,
    CLKey,
    CLValueParsers,
    decodeBase16,
    Signer,
    RuntimeArgs,
    CLValueBuilder,
    CasperClient,
    DeployUtil,
    CLPublicKey,
  } from "casper-js-sdk";
  import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
  
  import { contractCallFn } from "./utils";
  import { RecipientType } from "casper-js-client-helper/dist/types";
  
  const { DEFAULT_TTL } = constants;
  const { ERC20Events } = erc20constants;
  const { createRecipientAddress, contractSimpleGetter } = helpers;