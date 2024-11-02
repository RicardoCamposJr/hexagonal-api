export default class Project {
	constructor(
		public id: number | null | undefined,
		public ownerId: number,
		public name: string,
		public description: string,
		public createdAt: string | null,
	) {}
}
