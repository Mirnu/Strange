export interface FireBall extends Part {
	Attachment: Attachment & {
		core: ParticleEmitter;
	};
}
