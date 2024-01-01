import { Character } from "@rbxts/wcs";

export class Enemy {
	public character?: Character;
	constructor(private model: CharacterModel) {
		this.character = new Character(model);
	}
}
