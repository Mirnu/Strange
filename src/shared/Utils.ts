import { Players, Workspace } from "@rbxts/services";
import { Character } from "@rbxts/wcs";

export const LocalPlayer = Players.LocalPlayer;
export const CurrentCamera = Workspace.CurrentCamera;

export const GetCharacterModel = () => {
	return (LocalPlayer.Character ?? LocalPlayer.CharacterAdded.Wait()[0]) as CharacterModel;
};

export const GetCharacterCFrame = () => {
	return GetCharacterModel().HumanoidRootPart.CFrame;
};

export const GetCurrentWCS_Character = () => {
	const characterModel = LocalPlayer.Character;
	if (!characterModel) return;

	return Character.GetCharacterFromInstance_TS(characterModel);
};
