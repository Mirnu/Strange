import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { Character, Skill, SkillDecorator } from "@rbxts/wcs";
import { ShakeCamera } from "shared/classes/ShakeCamera";
import { BindleDecorator } from "shared/decorators/BindleDecorator";
import { Stun } from "shared/statusEffects/stun";
@SkillDecorator
@BindleDecorator(Enum.KeyCode.E)
export class FireBallSkill extends Skill {
	public DamageContainer = this.CreateDamageContainer(20);
	private ballRunned?: thread;

	protected MutualExclusives = [Stun];
	protected OnStartServer(params: unknown[]): void {
		const characterModel = this.Character.Instance as CharacterModel;
		const lookVector = (params[0] as CFrame).LookVector;
		this.ApplyCooldown(5);

		const direction = characterModel.HumanoidRootPart.CFrame.add(lookVector.mul(1000));
		const ball = this.createBall(characterModel);
		this.handleTouched(ball, characterModel);
		this.ballRunned = task.delay(1, () => this.runBall(ball, direction));
	}
	protected OnStartClient(): void {
		const shaker = new ShakeCamera((0.1 * this.DamageContainer.Damage) / 5, (30 * this.DamageContainer.Damage) / 5);
		shaker.Shake(0.5);
	}

	public SetDamage(damage: number) {
		this.DamageContainer = this.CreateDamageContainer(damage);
	}

	private handleTouched(ball: FireBall, owner: CharacterModel) {
		const nearbyCharacters: Character[] = [];
		const connect = ball.Touched.Connect((otherPart) => {
			if (otherPart.FindFirstAncestorOfClass("Model") === this.Character.Instance) return;
			const parts = Workspace.GetPartBoundsInRadius(ball.CFrame.Position, 20);

			let lastModel;
			for (const part of parts) {
				const model = part.FindFirstAncestorOfClass("Model");
				const humanoid = model?.FindFirstChildOfClass("Humanoid");
				if (!humanoid || !model || model === owner || lastModel === model) continue;
				lastModel = model;

				const character = Character.GetCharacterFromInstance_TS(model);
				character && !nearbyCharacters.includes(character) && nearbyCharacters.push(character);
			}

			if (nearbyCharacters.size() === 0) return;
			if (this.ballRunned) task.cancel(this.ballRunned);
			ball.Destroy();
			connect.Disconnect();
			for (const character of nearbyCharacters) {
				this.combustionEnemy(character.Instance as CharacterModel);
				this.damageEnemy(character);
				const stun = new Stun(character);
				stun.Start(2.5);
			}
		});
	}

	private damageEnemy(character: Character) {
		task.spawn(() => {
			character.Humanoid.TakeDamage(this.DamageContainer.Damage);
			for (let index = 0; index < 10; index++) {
				task.wait(0.5);
				character.Humanoid.TakeDamage(this.DamageContainer.Damage / 10);
			}
		});
	}

	private combustionEnemy(characterModel: CharacterModel) {
		task.spawn(() => {
			const combustionAttachment = ReplicatedStorage.Prefabs.Skills.Combustion.Attachment;
			const emmiters: ParticleEmitter[] = [];
			for (const part of characterModel.GetChildren()) {
				if (part.ClassName === "MeshPart") {
					const clone = combustionAttachment.Clone();
					clone.Parent = part;

					for (const emmiter of clone.GetChildren() as ParticleEmitter[]) {
						emmiter.Enabled = true;
						emmiters.push(emmiter);
					}
				}
			}
			task.wait(3);
			for (const emmiter of emmiters) {
				emmiter.Enabled = false;
			}
		});
	}

	private createBall(owner: CharacterModel) {
		const fireball = ReplicatedStorage.Prefabs.Skills.FireBall.Clone() as unknown as FireBall;
		fireball.CFrame = owner.HumanoidRootPart.CFrame.add(owner.HumanoidRootPart.CFrame.LookVector.mul(4));
		fireball.Parent = Workspace;
		return fireball;
	}

	private runBall(ball: FireBall, direction: CFrame) {
		for (const emit of ball.Attachment.GetChildren() as ParticleEmitter[]) {
			emit.Enabled = true;
		}
		const tweenInfo = new TweenInfo(1.5, Enum.EasingStyle.Quad, Enum.EasingDirection.In);
		const tween = TweenService.Create(ball, tweenInfo, { CFrame: direction });
		tween.Play();
		task.wait(1.5);
		ball.Destroy();
	}
}
