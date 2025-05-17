import { Injectable } from "@nestjs/common";
import { BaseRetrieverInterface } from "@langchain/core/retrievers";
import { createRetrieverTool } from "langchain/tools/retriever";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class RetrieverService {
	retriver: BaseRetrieverInterface<Record<string, any>>;
	toolNode: ToolNode;

	constructor(private databaseService: DatabaseService) {
		this.retriver = this.databaseService.getVectorStore().asRetriver();
		const tool = createRetrieverTool(this.retriver, {
			name: "retrieve_code_files",
			description: "Retrieves code files",
		});

		this.toolNode = new ToolNode([tool]);
	}

	getRetriver() {
		return this.retriver;
	}
}
