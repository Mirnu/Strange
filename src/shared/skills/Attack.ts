import { Workspace } from "@rbxts/services";
import { Character, Skill, SkillDecorator } from "@rbxts/wcs";
import { SuperBall } from "shared/classes/SuperBall";
import { BindleDecorator } from "shared/decorators/BindleDecorator";
import { Stun } from "shared/statusEffects/stun";

@SkillDecorator
@BindleDecorator(Enum.KeyCode.E)
export class Attack extends Skill {
	protected MutualExclusives = [Stun];
	protected OnStartServer(): void {
		const characterModel = this.Character.Instance as Model;
		const position = characterModel.GetPivot().Position;

		const parts = Workspace.GetPartBoundsInRadius(position, 20);
		const nearbyCharacters: Character[] = [];

		for (const part of parts) {
			const model = part.FindFirstAncestorOfClass("Model");
			const humanoid = model?.FindFirstChildOfClass("Humanoid");
			if (!humanoid || !model || model === characterModel) return;

			const character = Character.GetCharacterFromInstance_TS(model);
			character && !nearbyCharacters.includes(character) && nearbyCharacters.push(character);
		}

		this.ApplyCooldown(50);

		if (nearbyCharacters.size() === 0) return;
		for (const character of nearbyCharacters) {
			const stun = new Stun(character);
			stun.Start(2.5);
		}
	}

	protected OnStartClient(StarterParams: unknown): void {
		const superBall = new SuperBall();
		superBall.Start();
	}
}
