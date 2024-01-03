interface FireBall extends Part {
	Attachment: Attachment & {
		core: ParticleEmitter;
	};
}

interface Nuclear extends Model {
	Core: Part;
	ShellCore: Part;
	ShellClouds: UnionOperation;
	Clouds: UnionOperation;
}

interface Combustion extends Part {
	Attachment: Attachment;
}
