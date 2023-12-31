interface ReplicatedStorage extends Instance {
	Prefabs: Folder & {
		Skills: Folder & {
			FireBall: Part & {
				Attachment: Attachment & {
					circle: ParticleEmitter;
				};
			};
		};
	};
	TS: Folder & {
		movesets: Folder;
		skills: Folder;
		statusEffects: Folder;
	};
}
