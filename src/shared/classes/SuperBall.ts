import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";
import { CurrentCamera, GetCharacterCFrame } from "shared/Utils";
import { FireBall } from "types/Skills";

export class SuperBall {
	public Start() {
		const direction = GetCharacterCFrame().add(CurrentCamera!.CFrame.LookVector.mul(100));
		const ball = this.createBall();
		task.wait(1);
		this.runBall(ball, direction);
	}

	private createBall() {
		const fireball = ReplicatedStorage.Prefabs.Skills.FireBall.Clone() as unknown as FireBall;
		fireball.CFrame = GetCharacterCFrame().add(GetCharacterCFrame().LookVector.mul(4));
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
		tween.Completed.Connect(() => ball.Destroy());
	}
}
