import { Injectable } from "@nestjs/common";
import { BaseRetrieverInterface } from "@langchain/core/retrievers";
import { createRetrieverTool } from "langchain/tools/retriever";

@Injectable()
export class RetrieverService {}
