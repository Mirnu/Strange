import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { Character, Skill, SkillDecorator } from "@rbxts/wcs";
import { BindleDecorator } from "shared/decorators/BindleDecorator";
import { StoneExplosion } from "shared/modules/StoneActions";

@SkillDecorator
@BindleDecorator(Enum.KeyCode.Q)
export class AtomicBombSkill extends Skill {
	public DamageContainer = this.CreateDamageContainer(0.01);
	protected OnStartServer(params: unknown[]): void {
		const characterModel = this.Character.Instance as CharacterModel;
		const cameraCFrame = params[0] as CFrame;
		const raycastParams = new RaycastParams();
		raycastParams.FilterDescendantsInstances = this.Character.Instance.GetDescendants();
		raycastParams.FilterType = Enum.RaycastFilterType.Exclude;
		const raycastResult = Workspace.Raycast(
			cameraCFrame.Position,
			cameraCFrame.LookVector.mul(1000),
			raycastParams,
		);
		if (raycastResult?.Instance !== undefined) {
			this.ApplyCooldown(60);
			const atomicBomb = this.createAtomicBomb(raycastResult.Position);
			StoneExplosion(raycastResult.Position, 1);
			this.killNearbyPlayers(raycastResult.Position, atomicBomb);
			this.expandAtomicBomb(atomicBomb);
			task.delay(20, () => atomicBomb.Destroy());
		}
	}

	private killNearbyPlayers(position: Vector3, atomicBomb: Nuclear) {
		task.spawn(() => {
			while (atomicBomb.Parent === Workspace) {
				const parts = Workspace.GetPartBoundsInRadius(position, 300);

				for (const part of parts) {
					const model = part.FindFirstAncestorOfClass("Model");
					const humanoid = model?.FindFirstChildOfClass("Humanoid");
					if (humanoid) humanoid.Health -= this.DamageContainer.Damage;
				}

				task.wait(1);
			}
		});
	}

	private createAtomicBomb(position: Vector3) {
		const atomicBomb = ReplicatedStorage.Prefabs.Skills.Nuclear.Clone();
		atomicBomb.PivotTo(new CFrame(position.add(new Vector3(0, 10, 0))));
		atomicBomb.Parent = Workspace;
		return atomicBomb;
	}

	private expandAtomicBomb(atomicBomb: Nuclear) {
		task.spawn(() => {
			const tweenInfo_Clouds = new TweenInfo(5, Enum.EasingStyle.Quad, Enum.EasingDirection.In);
			const ts_ShellClouds = TweenService.Create(atomicBomb.ShellClouds, tweenInfo_Clouds, {
				Size: new Vector3(300, 10, 300),
				Transparency: 0.05,
			});
			ts_ShellClouds.Play();
			task.wait(0.5);
			const ts_Clouds = TweenService.Create(atomicBomb.Clouds, tweenInfo_Clouds, {
				Size: new Vector3(200, 10, 200),
				Transparency: 0.05,
			});
			ts_Clouds.Play();
		});
		task.wait(3);
		const tweenInfo_Core = new TweenInfo(10, Enum.EasingStyle.Sine, Enum.EasingDirection.Out);
		const ts_ShellCore = TweenService.Create(atomicBomb.ShellCore, tweenInfo_Core, {
			Size: new Vector3(219.675, 101, 109.838),
			Transparency: 0.8,
		});
		ts_ShellCore.Play();
		const ts_Core = TweenService.Create(atomicBomb.Core, tweenInfo_Core, {
			Size: new Vector3(192.424, 88.471, 96.212),
			Transparency: 0,
		});
		ts_Core.Play();
	}
}
