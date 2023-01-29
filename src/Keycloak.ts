import Keycloak from "keycloak-js";

const config = {
    url: "https://keycloak.dev.workspacenow.cloud/auth",
    realm: "officekube",
    clientId: "platform-dev",
   };
const keycloak = new (Keycloak as any)(config) ;

export default keycloak;