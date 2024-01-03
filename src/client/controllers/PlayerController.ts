import { Controller, OnStart, OnInit } from "@flamework/core";
import { ReplicatedStorage, UserInputService, Workspace } from "@rbxts/services";
import { CreateClient } from "@rbxts/wcs";
import { GetCurrentWCS_Character } from "shared/Utils";
import { Bindles } from "shared/decorators/BindleDecorator";

@Controller({})
export class PlayerController implements OnStart {
	onStart() {
		this.initClient();
		UserInputService.InputEnded.Connect((input, gameProcessed) => {
			if (gameProcessed) return;

			const character = GetCurrentWCS_Character();
			const skillConstructor = Bindles.get(input.KeyCode);
			if (skillConstructor !== undefined) {
				const skill = character?.GetSkillFromConstructor(skillConstructor);
				skill?.Start([Workspace.CurrentCamera?.CFrame]);
			}
		});
	}

	private initClient() {
		const client = CreateClient();
		client.RegisterDirectory(ReplicatedStorage.TS.movesets);
		client.RegisterDirectory(ReplicatedStorage.TS.skills);
		client.RegisterDirectory(ReplicatedStorage.TS.statusEffects);
		client.Start();
	}
}
