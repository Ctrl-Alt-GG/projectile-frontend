import cs2 from "@/assets/gameicons/cs2.png"
import css from "@/assets/gameicons/css.png"
import factorygame from "@/assets/gameicons/factorygame.png"
import garrysmod from "@/assets/gameicons/garrysmod.png"
import xonotic from "@/assets/gameicons/xonotic.svg"
import scpsl from "@/assets/gameicons/scpsl.png"
import mc from "@/assets/gameicons/mc.png"
import quake3 from "@/assets/gameicons/quake3.png"

import unknown from "@/assets/logo-sarga.svg"

const icons = {
    cs2, css, factorygame, garrysmod, xonotic, scpsl, mc, quake3,
    // alias
    gmod: garrysmod,
    csgo: cs2,
    minecraft: mc,
    csstrike: css
}

export default function getIcon(game) {
    const icon = icons[game];
    if (icon === undefined) {
        return unknown;
    }
    return icon;
}


