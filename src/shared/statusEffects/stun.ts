import { Character, StatusEffect, StatusEffectDecorator } from "@rbxts/wcs";

@StatusEffectDecorator
export class Stun extends StatusEffect {
	constructor(Character: Character) {
		super(Character);

		this.SetHumanoidData({ WalkSpeed: { Value: 0, Mode: "Set" } });
	}
}
