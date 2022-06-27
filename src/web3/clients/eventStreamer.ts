
import { io, Socket } from "socket.io-client";
import { farmEventParser, routerEventParser } from "../../web3";
import { FarmEvents, RouterEvents } from "../config/constant";

const streamer: Socket = io(window.location.origin);

streamer.on('data', (data) => {
    const routerEvents = routerEventParser({
      eventNames: [
        RouterEvents.CreatePair,
        RouterEvents.AddLiquidity,
        RouterEvents.RemoveLiquidity,
        RouterEvents.SwapExactIn,
        RouterEvents.SwapExactOut
      ]
    }, data);

    if (routerEvents && routerEvents.success) {
      console.log("*** EVENT ***");
      console.log(routerEvents.data);
      console.log("*** ***");
    }

    const farmEvents = farmEventParser({
      eventNames: [
        FarmEvents.Construct,
        FarmEvents.UpdateMultiplier,
        FarmEvents.AddPool,
        FarmEvents.SetPool,
        FarmEvents.UpdatePool,
        FarmEvents.MassUpdatePools,
        FarmEvents.Deposit,
        FarmEvents.Withdraw,
        FarmEvents.EnterStaking,
        FarmEvents.LeaveStaking,
        FarmEvents.Harvest,
      ]
    }, data);

    if (farmEvents && farmEvents.success) {
      console.log("*** EVENT ***");
      console.log(farmEvents.data);
      console.log("*** ***");
    }
 })