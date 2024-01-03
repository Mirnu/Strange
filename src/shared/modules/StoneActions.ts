import { Workspace } from "@rbxts/services";

export const SpawnRandomStone = (scale: number) => {
	const stone = new Instance("Part");
	stone.Color = Color3.fromRGB(97, 97, 97);
	stone.Size = Vector3.one.mul(math.random(1 * scale, 10 * scale));
	stone.CanCollide = false;
	return stone;
};

export const StoneExplosion = (position: Vector3, scale: number) => {
	for (let index = 0; index < 30 * scale; index++) {
		task.delay(0.5 / scale, () => {
			const stone = SpawnRandomStone(scale);
			stone.CFrame = new CFrame(position);
			stone.Parent = Workspace;
			const impulseVector = new Vector3(
				math.random(-5000 * scale, 5000 * scale),
				math.random(5000 * scale, 25000 * scale),
				math.random(-5000 * scale, 5000 * scale),
			);
			print(impulseVector);
			stone.ApplyImpulse(impulseVector);
			task.wait(5);
			stone.Destroy();
		});
	}
};
