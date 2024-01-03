import { CreateMoveset } from "@rbxts/wcs";
import { AtomicBombSkill } from "shared/skills/AtomicBombSkill";
import { FireBallSkill } from "shared/skills/FirebalSkilll";

export = CreateMoveset("Base", [FireBallSkill, AtomicBombSkill]);
