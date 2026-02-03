const colors = {
    cs2: { bg: "#c9a227", text: "#000" },
    css: { bg: "#8A8ADD", text: "#000" },
    satisfactory: { bg: "#475256", text: "#fff" },
    garrysmod: { bg: "#265888", text: "#fff" },
    xonotic: { bg: "#001021", text: "#fff" },
    scpsl: { bg: "#000", text: "#fff" },
    mc: { bg: "#3a7d3a", text: "#fff" },
    quake3: { bg: "#777", text: "#000" },
    dods: { bg: "#5E5F3F", text: "#000" },
    factorio: { bg: "#adadad", text: "#000" },
    openarena: { bg: "#161A23", text: "#fff" },
    openttd: { bg: "#f39940", text: "#000" },
    supertuxkart: { bg: "#af0c0c", text: "#fff" },
    svencoop: { bg: "#5f6d8d", text: "#000" },
    teamspeak: { bg: "#1D2B56", text: "#fff" },
    tf2: { bg: "#8a3613", text: "#fff" },
}

// alias
colors.gmod = colors.garrysmod
colors.csgo = colors.cs2
colors.minecraft = colors.mc
colors.csstrike = colors.css
colors.factorygame = colors.satisfactory
colors.ts3 = colors.teamspeak

export default function getColor(game) {
    const color = colors[game];
    if (color === undefined) {
        return { bg: "#777", text: "#000" };
    }
    return color;
}

