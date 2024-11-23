import { ai } from '~/open-ai';
import { getAssistant, updateAssistantVectorStore } from './assistant.server';
import { kebab } from '~/utils/string';

export function createVectorStore(name: string) {
    return ai.beta.vectorStores.create({
        name
    });
}

export function getVectorStores() {
    return ai.beta.vectorStores.list();
}

export function getVectorStore(storeId: string) {
    return ai.beta.vectorStores.retrieve(storeId);
}

export function updateVectorStore(storeId: string, name: string) {
    return ai.beta.vectorStores.update(storeId, {
        name
    });
}

export function addFileToVectorStore(vectorStoreId: string, file_id: string) {
    return ai.beta.vectorStores.files.create(vectorStoreId, {
        file_id
    });
}

export function deleteVectorStore(vectorStoreId: string) {
    return ai.beta.vectorStores.del(vectorStoreId);
}

export async function getOrCreateVectorStore(assistantId: string) {
    const assistant = await getAssistant(assistantId);

    // @ts-expect-error if the assistant already has a vector store, return it
    if (assistant.tool_resources?.file_search?.vector_store_ids?.length > 0) {
        // @ts-expect-error should be fine
        return assistant.tool_resources.file_search.vector_store_ids[0];
    }
    // otherwise, create a new vector store and attatch it to the assistant
    const vectorStore = await createVectorStore(
        `${kebab(assistant.name!)}-store`
    );

    await updateAssistantVectorStore(assistantId, vectorStore.id);

    return vectorStore.id;
}
