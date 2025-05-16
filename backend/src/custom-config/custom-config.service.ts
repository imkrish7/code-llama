import { cosmiconfigSync } from "cosmiconfig";

export default (options: Record<string, any>) => {
	console.log("loading config");
	const explorer = cosmiconfigSync("kuzco");
	console.log("ex[plorer setup", explorer);
	const searchPaths = options?.searchPaths || [process.cwd()];
	console.log("searchPaths", ...searchPaths);

	try {
		const result = explorer.search();
		console.log("result", result);
		if (result) {
			return result.config;
		} else {
			return {
				url: "http://localhost:11434",
				model: "llama3.2",
				requestOptions: {
					useMMap: true,
					numThread: 0,
					numGpu: 1,
				},
				database: {
					tableName: "Documents",
					columnName: "match_documents",
				},
				extensions: [".ts", ".js", ".json", ".jsonc", ".md"],
			};
		}
	} catch (error) {
		console.error(error);
	}
};
