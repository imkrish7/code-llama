import type { Document } from "@langchain/core/documents";
export class Utils {
	static fromDocs(documents: Document<Record<string, any>>[]) {
		return documents.map((doc) => doc.pageContent).join("\n\n");
	}
}
