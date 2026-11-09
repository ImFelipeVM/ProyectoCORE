const fs = require('fs');
const path = require('path');

const ASSET_PATHS = {
    'ui_panel': 'assets/ui/panel.png',
    'ui_button': 'assets/ui/button.png',
    'ui_button_hover': 'assets/ui/button_hover.png',
    'menu_bg': 'assets/backgrounds/main_menu.png',
    'map_bg': 'assets/backgrounds/world_map.png',
    'map_node': 'assets/ui/map_node.png',
    'map_player_icon': 'assets/ui/map_player.png',
    'tiles_interior': 'assets/tilesets/interior_16bit.png',
    'player_sheet': 'assets/characters/player_sheet.png',
    'npc_parents': 'assets/characters/npc_parents.png'
};

console.log("Checking project assets...");
Object.entries(ASSET_PATHS).forEach(([key, filePath]) => {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
        console.log(`✅ ${key}: FOUND`);
    } else {
        console.log(`❌ ${key}: MISSING (${filePath})`);
    }
});
