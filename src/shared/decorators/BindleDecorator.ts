import { Constructor } from "@flamework/core/out/utility";
import { Skill } from "@rbxts/wcs";

export const BindleDecorator = (keycode: Enum.KeyCode) => {
	return (constructor: Constructor<Skill<unknown, unknown, unknown>>) => {
		Bindles.set(keycode, constructor);
	};
};

export const Bindles = new Map<Enum.KeyCode, Constructor<Skill<unknown, unknown, unknown>>>();
