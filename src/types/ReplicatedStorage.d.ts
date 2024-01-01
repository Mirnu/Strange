interface ReplicatedStorage extends Instance {
	Prefabs: Folder & {
		Skills: Folder & {
			FireBall: Part & {
				Attachment: Attachment & {
					circle: ParticleEmitter;
				};
			};
			Combustion: Part & {
				Attachment: Attachment;
			};
		};
	};
	TS: Folder & {
		movesets: Folder;
		skills: Folder;
		statusEffects: Folder;
	};
}
