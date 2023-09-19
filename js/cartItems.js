export const cartArr = {
	items: [
		{
			id: 1,
			discountsArr: [
				{
					value: 0.55,
				},
				{
					value: 0.1,
				},
			],
			price: {
				discounted: 368,
				original: 1051,
			},
			count: 1,
			stock: 2,
			isSelected: true,
		},
		{
			id: 2,
			price: {
				discounted: 4025,
				original: 11500,
			},
			discountsArr: [
				{
					value: 0.55,
				},
				{
					value: 0.1,
				},
			],
			count: 200,
			stock: 1000,
			isSelected: true,
		},
		{
			id: 3,
			price: {
				discounted: 167,
				original: 475,
			},
			discountsArr: [
				{
					value: 0.55,
				},
				{
					value: 0.1,
				},
			],
			count: 1,
			stock: 2,
			isSelected: true,
		},
	],
	selectedIds: [1, 2, 3],
}
