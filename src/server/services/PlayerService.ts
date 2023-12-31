import { Service, OnStart } from "@flamework/core";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { Character, CreateServer } from "@rbxts/wcs";
import base from "shared/movesets/base";

@Service({})
export class PlayerService implements OnStart {
	onStart() {
		this.initServer();
		Players.PlayerAdded.Connect((player) => {
			player.CharacterAdded.Connect((characterModel) => {
				const WCS_Character = new Character(characterModel);
				WCS_Character.ApplySkillsFromMoveset(base);

				const humanoid = characterModel.WaitForChild("Humanoid") as Humanoid;
				humanoid.Died.Once(() => WCS_Character.Destroy());
			});
		});
	}

	private initServer() {
		const server = CreateServer();
		server.RegisterDirectory(ReplicatedStorage.TS.movesets);
		server.RegisterDirectory(ReplicatedStorage.TS.skills);
		server.RegisterDirectory(ReplicatedStorage.TS.statusEffects);
		server.Start();
	}
}
