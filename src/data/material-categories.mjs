/**
 * Groups of the materials (nguyên liệu) page: each group is its own page of the guide.
 * The server config does not say which group a material belongs to, so the assignment is kept here.
 * scripts/sync-materials.mjs stops when a material of MMOItems/item/material.yml is not assigned to a group.
 *
 * id:     the group, also written to materials.json (`category`) and used by <MaterialList category="..." />
 * title:  player-facing name of the group
 * ids:    the material ids (as in MMOItems/item/material.yml, upper case) in the group
 */
export const materialCategories = [
	{
		id: 'khoang-san',
		title: 'Khoáng sản',
		ids: ['DA_CUOI_TINH_LUYEN', 'THAN_TINH_LUYEN', 'DONG_TINH_LUYEN', 'SAT_TINH_LUYEN', 'VANG_TINH_LUYEN', 'DA_DO_TINH_LUYEN', 'LUU_LY_TINH_LUYEN', 'KIM_CUONG_TINH_LUYEN', 'LUC_BAO_TINH_LUYEN'],
	},
	{
		id: 'nong-san',
		title: 'Nông sản',
		ids: ['KHOAI_TAY_SIEU_CAP'],
	},
	{
		id: 'dungeon',
		title: 'Dungeon',
		ids: ['DA_NEN'],
	},
];
