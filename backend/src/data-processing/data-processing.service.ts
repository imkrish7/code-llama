import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TextLoader } from "langchain/document_loaders/fs/text";
import {
	DirectoryLoader,
	UnknownHandling,
} from "langchain/document_loaders/fs/directory";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

@Injectable()
export class DataProcessingService {
	constructor(private configService: ConfigService) {}

	async extratAndStoreData(directory: string): Promise<void> {
		const docs = await this.loadWorkspace(directory);
		const texts = await this.extract(docs);
		await this.storeGraph(texts);
	}

	async loadWorkspace(directory: string) {
		const REPO_PATH =
			directory || this.configService.get<string>("workspace");
		const loaders = this.configService.get<string[]>("loaders") || [
			".js",
			".ts",
			".json",
			".jsonc",
			".md",
		];

		const exclude = this.configService.get<string[]>("exclude");

		const loads = loaders.reduce((acc, curr) => {
			acc[curr] = (path) => new TextLoader(path);
			return acc;
		}, {});

		const loader = new DirectoryLoader(
			REPO_PATH!,
			loads,
			true,
			UnknownHandling.Ignore,
			exclude,
		);

		const docs = await loader.load();
		return docs;
	}

	async extract(docs: any) {
		const javascriptSplitter = RecursiveCharacterTextSplitter.fromLanguage(
			"js",
			{
				chunkOverlap: 200,
				chunkSize: 2000,
			},
		);

		const text = await javascriptSplitter.splitDocuments(docs);

		console.log("Loaded", text.length, "documents.");
		return text;
	}

	async storeGraph(text: any): Promise<any> {
		this.databaseService.addDocuments(text);
	}
}
