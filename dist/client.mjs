// src/client.ts
var steamClient = () => {
  return {
    id: "steam-client",
    $InferServerPlugin: {},
    pathMethods: {
      "/sign-in/steam": "POST"
    }
  };
};
export {
  steamClient
};
