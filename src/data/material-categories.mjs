/**
 * Groups of the materials (nguyên liệu) page: each group is its own page of the guide.
 * The server config does not say which group a material belongs to, so the assignment is kept here.
 * scripts/sync-materials.mjs stops when a material of MMOItems/item/material.yml is not assigned to a group.
 * Items of MMOItems/item/dungeon_material.yml (Ma Thạch, Lõi boss, Đá Cường Hóa...) are materials of the guide only when listed here.
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
		id: 'ma-thach',
		title: 'Ma Thạch',
		ids: ['MA_THACH_PHO_THONG', 'MA_THACH_TINH_LUYEN', 'MA_THACH_CAO_CAP', 'MA_THACH_HIEM', 'MA_THACH_CUC_SAC', 'MA_THACH_TOI_THUONG'],
	},
	{
		id: 'dungeon',
		title: 'Dungeon',
		ids: ['DA_NEN', 'DA_CUONG_HOA_SO_CAP', 'DA_CUONG_HOA_TRUNG_CAP', 'DA_CUONG_HOA_CAO_CAP', 'TINH_THE_DUNG_NHAM',
			'LOI_BOSS_01_SILVERBACK', 'LOI_BOSS_02_ARACHNE', 'LOI_BOSS_03_KIEN_CHUA', 'LOI_BOSS_04_AM_ANH', 'LOI_BOSS_05_ASTERIUS',
			'LOI_BOSS_06_HYDRA', 'LOI_BOSS_07_CERBERUS', 'LOI_BOSS_08_TIEU_LONG', 'LOI_BOSS_09_TINH_THE', 'LOI_BOSS_10_GOLIATH',
			'LOI_BOSS_11_GOLIATH_DEN', 'LOI_BOSS_12_LEVIATHAN', 'LOI_BOSS_13_UDAEUS', 'LOI_BOSS_14_QUAN_NGUC', 'LOI_BOSS_15_BALOR'],
	},
];
