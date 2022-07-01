import { DependencyContainer } from "tsyringe";

import { IMod } from "@spt-aki/models/external/mod";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";

class Mod implements IMod {
  public load = () => { return; };
  public delayedLoad = (container: DependencyContainer) => {
    // get database from server
    const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");

    // Get all the in-memory json found in /assets/database
    const tables = databaseServer.getTables();

    // find the ledx item by its Id
    const ledx = tables.templates.items["5c0530ee86f774697952d952"];

    // update one of its properties to be true
    ledx._props.CanSellOnRagfair = true;


    // example #2
    // get globals settings and set flea market min level to be 1
    tables.globals.config.RagFair.minUserLevel = 1;
  };
}

module.exports = { mod: new Mod() }
