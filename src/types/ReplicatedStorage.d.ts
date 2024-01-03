interface ReplicatedStorage extends Instance {
	Prefabs: Folder & {
		Skills: Folder & {
			FireBall: FireBall;
			Combustion: Combustion;
			Nuclear: Nuclear;
		};
	};
	TS: Folder & {
		movesets: Folder;
		skills: Folder;
		statusEffects: Folder;
	};
}
