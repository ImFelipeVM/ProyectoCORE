
export const SVG_ASSETS = {
    backgrounds: {
        bg_home: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
            <rect width="800" height="600" fill="#5d4037"/>
            <rect x="0" y="400" width="800" height="200" fill="#3e2723"/>
            <rect x="100" y="150" width="150" height="250" fill="#8d6e63" stroke="#3e2723" stroke-width="4"/>
            <rect x="120" y="170" width="40" height="60" fill="#fff" opacity="0.5"/>
            <rect x="500" y="200" width="200" height="200" fill="#a1887f" stroke="#3e2723" stroke-width="4"/>
            <path d="M520 350 L680 350 M520 320 L680 320 M520 290 L680 290" stroke="#3e2723" stroke-width="2"/>
            <text x="400" y="100" font-family="monospace" font-size="40" fill="#ffd700" text-anchor="middle" font-weight="bold">EL HOGAR</text>
        </svg>`,
        bg_school: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
            <rect width="800" height="600" fill="#37474f"/>
            <rect x="0" y="400" width="800" height="200" fill="#263238"/>
            <rect x="300" y="250" width="200" height="150" fill="#546e7a" stroke="#263238" stroke-width="4"/>
            <rect x="320" y="270" width="160" height="10" fill="#fff" opacity="0.8"/>
            <rect x="320" y="290" width="160" height="10" fill="#fff" opacity="0.8"/>
            <text x="400" y="100" font-family="monospace" font-size="40" fill="#ffd700" text-anchor="middle" font-weight="bold">LA CONSTRUCCIÓN DEL YO</text>
        </svg>`,
        bg_lab: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
            <rect width="800" height="600" fill="#1a237e"/>
            <rect x="0" y="400" width="800" height="200" fill="#0d47a1"/>
            <rect x="200" y="200" width="400" height="200" fill="#3f51b5" stroke="#0d47a1" stroke-width="4"/>
            <circle cx="300" cy="300" r="40" fill="#fff" opacity="0.3" stroke="#fff" stroke-width="2"/>
            <circle cx="500" cy="300" r="40" fill="#fff" opacity="0.3" stroke="#fff" stroke-width="2"/>
            <text x="400" y="100" font-family="monospace" font-size="40" fill="#ffd700" text-anchor="middle" font-weight="bold">EL ESPEJO INTERIOR</text>
        </svg>`,
        bg_park: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
            <rect width="800" height="600" fill="#2e7d32"/>
            <rect x="0" y="400" width="800" height="200" fill="#1b5e20"/>
            <circle cx="200" cy="200" r="80" fill="#66bb6a" stroke="#1b5e20" stroke-width="4"/>
            <rect x="190" y="120" width="20" height="160" fill="#5d4037"/>
            <text x="400" y="100" font-family="monospace" font-size="40" fill="#ffd700" text-anchor="middle" font-weight="bold">LAS MÁS CARAS Y LA INTIMIDAD</text>
        </svg>`,
        bg_cafe: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
            <rect width="800" height="600" fill="#795548"/>
            <rect x="0" y="400" width="800" height="200" fill="#4e342e"/>
            <rect x="300" y="200" width="200" height="200" fill="#a1887f" stroke="#4e342e" stroke-width="4"/>
            <circle cx="400" cy="300" r="30" fill="#fff" opacity="0.5"/>
            <text x="400" y="100" font-family="monospace" font-size="40" fill="#ffd700" text-anchor="middle" font-weight="bold">EL DILEMA DE LA SINCERIDAD</text>
        </svg>`,
        bg_room: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
            <rect width="800" height="600" fill="#4a148c"/>
            <rect x="0" y="400" width="800" height="200" fill="#311b92"/>
            <rect x="550" y="150" width="150" height="250" fill="#ab47bc" stroke="#311b92" stroke-width="4"/>
            <rect x="570" y="170" width="110" height="80" fill="#000" opacity="0.6"/>
            <text x="400" y="100" font-family="monospace" font-size="40" fill="#ffd700" text-anchor="middle" font-weight="bold">EL MURO DIGITAL</text>
        </svg>`,
        bg_view: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
            <rect width="800" height="600" fill="#01579b"/>
            <rect x="0" y="400" width="800" height="200" fill="#0d47a1"/>
            <path d="M0 400 Q 400 300 800 400" stroke="#29b6f6" stroke-width="10" fill="none"/>
            <circle cx="700" cy="100" r="40" fill="#fff" opacity="0.8"/>
            <text x="400" y="100" font-family="monospace" font-size="40" fill="#ffd700" text-anchor="middle" font-weight="bold">LA SALIDA DEL LABERINTO</text>
        </svg>`,
        bg_office: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
            <rect width="800" height="600" fill="#455a64"/>
            <rect x="0" y="400" width="800" height="200" fill="#263238"/>
            <rect x="300" y="200" width="200" height="150" fill="#90a4ae" stroke="#263238" stroke-width="4"/>
            <rect x="320" y="220" width="160" height="110" fill="#fff" opacity="0.8"/>
            <text x="400" y="100" font-family="monospace" font-size="40" fill="#ffd700" text-anchor="middle" font-weight="bold">EL FUTURO PROFESIONAL</text>
        </svg>`
    },
    characters: {
        male: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <rect x="20" y="24" width="24" height="32" fill="#3498db" stroke="#000" stroke-width="2"/>
            <rect x="22" y="8" width="20" height="20" fill="#ffdbac" stroke="#000" stroke-width="2" rx="4"/>
            <rect x="22" y="8" width="20" height="8" fill="#4b2c20" rx="2"/>
            <circle cx="27" cy="18" r="2" fill="#000"/>
            <circle cx="37" cy="18" r="2" fill="#000"/>
        </svg>`,
        female: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <rect x="20" y="24" width="24" height="32" fill="#e91e63" stroke="#000" stroke-width="2"/>
            <rect x="22" y="8" width="20" height="20" fill="#ffdbac" stroke="#000" stroke-width="2" rx="4"/>
            <rect x="20" y="8" width="24" height="12" fill="#4b2c20" rx="4"/>
            <circle cx="27" cy="18" r="2" fill="#000"/>
            <circle cx="37" cy="18" r="2" fill="#000"/>
        </svg>`
    }
};

export class AssetGenerator {
    static async loadSVGTexture(scene, key, svgString) {
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        scene.load.image(key, url);
        // Cleanup URL after load to prevent memory leaks
        scene.events.once('complete', () => URL.revokeObjectURL(url));
    }
}
