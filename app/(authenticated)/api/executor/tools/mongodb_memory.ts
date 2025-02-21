// Mongodb memories

import OpenAI from "openai";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const baseUrl = process.env.MONGODB_URL;
const apiKey = process.env.MONGODB_KEY;
const headers = {
    "Content-Type": "application/json",
    'Access-Control-Request-Headers': '*',
    'api-key': apiKey,
};

const databaseConfig = {
    collection: "memory",
    database: "connectorzzz",
    dataSource: "Cluster0",
};

// Utility function to handle MongoDB API requests
async function mongodb_request(action: string, method: string, data: any) {
    const url = `${baseUrl}/action/${action}`;
    const body = JSON.stringify({ ...databaseConfig, ...data });

    try {
        const response = await fetch(url, {
            method: method,
            headers: headers,
            body: body
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("There has been a problem with your fetch operation:", error);
        return null;
    }
}

// CRUD Operations

export const get_memory = async (keyword: string) => {
    return mongodb_request("findOne", "POST", {
        filter: { "memory.content": { "$regex": keyword, "$options": "i" } }
    });
};

export const get_memories = async (filter: any, limit: any = 3) => {
    // Construct the MongoDB filter with proper regex handling for keyword searches
    const updatedFilter: any = {};

    // Loop through filter properties and apply regex where necessary
    for (const key in filter) {
        if (filter.hasOwnProperty(key) && filter[key]) {
            updatedFilter[key] = { "$regex": filter[key], "$options": "i" };
        }
    }

    // Prepare the MongoDB request with sorting and limiting
    const requestPayload = {
        filter: updatedFilter,
        sort: { timestamp: -1 }, // Sort by timestamp in descending order
        limit: limit // Limit to the latest 3 documents
    };

    return mongodb_request("find", "POST", requestPayload);
};

export const add_memory = async (memory: any) => {
    const updatedMemoryArray = await Promise.all(memory.memory.map(async (item) => {
        const embeddings = await generate_embeddings(item.content);
        return {
            ...item,
            embeddings: embeddings
        };
    }));

    const updatedMemory = {
        ...memory,
        timestamp: new Date().toISOString(),
        memory: updatedMemoryArray
    };
    return mongodb_request("insertOne", "POST", { document: updatedMemory });
};

export const update_memory = async (filter: any, update: any) => {
    const updated = {
        ...update,
        timestamp: new Date().toISOString()
    };
    return mongodb_request("updateOne", "POST", {
        filter: filter,
        update: updated
    });
};

export const delete_memory = async (filter: any) => {
    return mongodb_request("deleteOne", "POST", { filter });
};

// Vectorized Operations

export const generate_embeddings = async (query: string) => {
    const response = await openai.embeddings.create({
        input: query,
        model: 'text-embedding-ada-002'
    });
    return response.data[0].embedding;
};


export const get_vectors = async (query: string, num_candidates: number = 10, limit: number = 3) => {
    // Generate embeddings for the input query
    console.log("Generating embeddings for query:", query);
    const queryVector = await generate_embeddings(query);
    console.log("Query Vector:", queryVector.length);
    // Send the vector search request to MongoDB
    const response = await mongodb_request("aggregate", "POST", {
        pipeline: [
            {
                "$vectorSearch": {
                    "index": "memory_index",
                    "path": "memory.embeddings",
                    "queryVector": queryVector,
                    "numCandidates": num_candidates,
                    "limit": limit
                
                }}
            // },
            // {
            //     "$project": {
            //         "_id": 1,
            //         "memory": 1, 
            //         "score": { "$meta": "searchScore" }
            //     }
            // }
        ]
    });
    return response;
};