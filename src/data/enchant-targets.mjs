/** Player-facing equipment categories, matched against SkyEnchants' actual material rules. */
export const enchantTargets = [
	{ id: 'sword', label: 'Kiếm', group: 'Vũ khí', materials: ['ALL_SWORD'] },
	{ id: 'axe', label: 'Rìu', group: 'Vũ khí', materials: ['ALL_AXE'] },
	{ id: 'bow', label: 'Cung', group: 'Vũ khí', materials: ['BOW'] },
	{ id: 'helmet', label: 'Mũ', group: 'Giáp', materials: ['ALL_ARMOR', 'ALL_HELMET', 'CHAINMAIL_HELMET', 'PLAYER_HEAD'] },
	{ id: 'chestplate', label: 'Áo giáp', group: 'Giáp', materials: ['ALL_ARMOR', 'ALL_CHESTPLATE', 'CHAINMAIL_CHESTPLATE'] },
	{ id: 'leggings', label: 'Quần', group: 'Giáp', materials: ['ALL_ARMOR', 'ALL_LEGGINGS', 'CHAINMAIL_LEGGINGS'] },
	{ id: 'boots', label: 'Giày', group: 'Giáp', materials: ['ALL_ARMOR', 'ALL_BOOTS', 'CHAINMAIL_BOOTS'] },
	{ id: 'pickaxe', label: 'Cúp', group: 'Dụng cụ', materials: ['ALL_PICKAXE'] },
	{ id: 'shovel', label: 'Xẻng', group: 'Dụng cụ', materials: ['ALL_SHOVEL'] },
	{ id: 'hoe', label: 'Cuốc', group: 'Dụng cụ', materials: ['ALL_HOE'] },
];

export function targetsForEnchant(applies) {
	if (!Array.isArray(applies) || !applies.length) throw new Error('Enchant has no applies material rules');
	for (const material of applies) {
		if (!enchantTargets.some((target) => target.materials.includes(material))) {
			throw new Error(`Unknown enchant material rule: ${material}`);
		}
	}
	return enchantTargets.filter((target) => target.materials.some((material) => applies.includes(material))).map((target) => target.id);
}
