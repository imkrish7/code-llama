import { Injectable } from "@nestjs/common";
import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { ConfigService } from "@nestjs/config";
import { OllamaService } from "src/ollama/ollama.service";

import { Prisma, PrismaClient } from "@prisma/client";

@Injectable()
export class DatabaseService {
	private vectorStore;
	private readonly prisma = new PrismaClient();

	constructor(
		private ollamaService: OllamaService,
		private configService: ConfigService,
	) {
		this.initVectorStore();
	}

	getVectorStore() {
		console.log("getting vector store");
		return this.vectorStore;
	}

	async addDocuments(documents: any[]): Promise<void> {
		await this.vectorStore.addDocuments(documents);
	}

	async initVectorStore(): Promise<void> {
		console.log("Calling init vectorstore");

		this.vectorStore = new PrismaVectorStore(
			this.ollamaService.getEmbeedings(),
			{
				db: this.prisma,
				prisma: Prisma,
				tableName:
					this.configService.get<string>("database.tableName")!,
				vectorColumnName: this.configService.get<string>(
					"database.columnName",
				)!,
				columns: {
					id: PrismaVectorStore.IdColumn,
					content: PrismaVectorStore.ContentColumn,
				},
			},
		);
	}
}
