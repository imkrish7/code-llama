import { Injectable } from "@nestjs/common";
import * as hub from "langchain/hub";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { END, START, MemorySaver, StateGraph } from "@langchain/langgraph";
import { OllamaService } from "src/ollama/ollama.service";

interface RAGState {
	question: string;
	generation: string;
	documents: Document[];
}

@Injectable()
export class RagService {
	ragChain: any;
	graph: any;

	constructor(private ollamaService: OllamaService) {
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

	async setupGraph(_graphState: typeof graphState) {
		this.graph = new StateGraph({
			channels: _graphState,
		});
	}
}
