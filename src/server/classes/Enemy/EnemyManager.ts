import { Workspace } from "@rbxts/services";
import { Enemy } from "./Enemy";

export class EnemyManager {
	private Enemies: Enemy[] = [];
	public Init() {
		for (const enemyModel of Workspace.Map.Enemies.GetChildren()) {
			const enemy = new Enemy(enemyModel as CharacterModel);
			this.Enemies.push(enemy);
		}
	}
}
