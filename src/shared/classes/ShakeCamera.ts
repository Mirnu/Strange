import { RunService } from "@rbxts/services";
import { CurrentCamera } from "shared/Utils";

export class ShakeCamera {
	constructor(private shakeIntensity: number, private shakeSpeed: number) {}

	public Shake(during: number) {
		const startShake = os.time();
		const connect = RunService.RenderStepped.Connect(() => {
			if (os.time() > startShake + during) {
				connect.Disconnect();
				return;
			}
			const shakeOffset = new Vector3(
				math.sin(tick() * this.shakeSpeed) * this.shakeIntensity,
				math.sin(tick() * this.shakeSpeed * 1.1) * this.shakeIntensity,
				math.sin(tick() * this.shakeSpeed * 1.1) * this.shakeIntensity,
			);

			CurrentCamera.CFrame = CurrentCamera.CFrame.mul(new CFrame(shakeOffset));
		});
	}
}
