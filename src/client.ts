import type { BetterAuthClientPlugin } from "better-auth/client/types";
import type { steam } from "./index";

export const steamClient = () => {
	return {
		id: "steam-client",
		$InferServerPlugin: {} as ReturnType<typeof steam>,
		pathMethods: {
			"/sign-in/steam": "POST",
		},
	} satisfies BetterAuthClientPlugin;
};
