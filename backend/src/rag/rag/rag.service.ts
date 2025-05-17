import { Injectable } from "@nestjs/common";
import * as hub from "langchain/hub";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { END, START, MemorySaver, StateGraph } from "@langchain/langgraph";
import { OllamaService } from "src/ollama/ollama.service";
import { RetrieverService } from "../retriever/retriever.service";
import { Utils } from "../utils/utils";

interface RAGState {
	question: string;
	generation: string;
	documents: Document[];
}

@Injectable()
export class RagService {
	ragChain: any;
	graph: any;

	constructor(
		private ollamaService: OllamaService,
		private retrieveService: RetrieverService,
	) {
		hub.pull("sde/rag-prompt").then((module) => {
			this.ragChain = module
				.pipe(this.ollamaService.chat)
				.pipe(new StringOutputParser());
		});
	}

	async run(question: string): Promise<string> {
		const app = this.graph.compile({
			checkpointer: MemorySaver,
		});

		return app.invoke(question);
	}

	async setupGraph(_graphState: RAGState) {
		this.graph = new StateGraph<any, any>({
			channels: _graphState,
		})
			.addNode("retrieve", this.retrieve)
			.addNode("generate", this.generate);
	}

	async retrieve(state: RAGState) {
		const documents = await this.retrieveService
			.getRetriver()
			.invoke(state.question);
		return { documents };
	}

	async generate(state: RAGState) {
		const generation = await this.ragChain.invoke({
			context: Utils.fromDocs(state.documents),
			question: state.question,
		});
		return { generation };
	}
}
