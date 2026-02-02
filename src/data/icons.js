import cs2 from "@/assets/gameicons/cs2.png"
import css from "@/assets/gameicons/css.png"
import satisfactory from "@/assets/gameicons/satisfactory.png"
import garrysmod from "@/assets/gameicons/garrysmod.png"
import xonotic from "@/assets/gameicons/xonotic.svg"
import scpsl from "@/assets/gameicons/scpsl.png"
import mc from "@/assets/gameicons/mc.png"
import quake3 from "@/assets/gameicons/quake3.png"
// new in 2026
import dods from "@/assets/gameicons/dods.png"
import factorio from "@/assets/gameicons/factorio.png"
import openarena from "@/assets/gameicons/openarena.png"
import openttd from "@/assets/gameicons/openttd.png"
import supertuxkart from "@/assets/gameicons/supertuxkart.png"
import svencoop from "@/assets/gameicons/svencoop.png"
import teamspeak from "@/assets/gameicons/teamspeak.png"
import tf2 from "@/assets/gameicons/tf2.png"


import unknown from "@/assets/logo-sarga.svg"

const icons = {
    cs2, css, satisfactory, garrysmod, xonotic, scpsl, mc, quake3,
    dods, factorio, openarena, openttd, supertuxkart, svencoop,
    teamspeak, tf2,
    // alias
    gmod: garrysmod,
    csgo: cs2,
    minecraft: mc,
    csstrike: css,
    factorygame: satisfactory,
}

export default function getIcon(game) {
    const icon = icons[game];
    if (icon === undefined) {
        return unknown;
    }
    return icon;
}


