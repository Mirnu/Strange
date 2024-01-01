import { Service, OnStart } from "@flamework/core";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { Character, CreateServer } from "@rbxts/wcs";
import { EnemyManager } from "server/classes/Enemy/EnemyManager";
import base from "shared/movesets/base";
import { FireBallSkill } from "shared/skills/FirebalSkilll";

@Service({})
export class PlayerService implements OnStart {
	public damageContainers = [];
	onStart() {
		this.initServer();
		this.initManagers();
		Players.PlayerAdded.Connect((player) => this.initCharacterAdded(player));
	}

	private initCharacterAdded(player: Player) {
		player.CharacterAdded.Connect((characterModel) => {
			const WCS_Character = new Character(characterModel);
			WCS_Character.ApplySkillsFromMoveset(base);

			const humanoid = characterModel.WaitForChild("Humanoid") as Humanoid;
			humanoid.Died.Once(() => WCS_Character.Destroy());
		});
	}

	private initManagers() {
		new EnemyManager().Init();
	}

	private initServer() {
		const server = CreateServer();
		server.RegisterDirectory(ReplicatedStorage.TS.movesets);
		server.RegisterDirectory(ReplicatedStorage.TS.skills);
		server.RegisterDirectory(ReplicatedStorage.TS.statusEffects);
		server.Start();
	}
}
