import { ClientSecretCredential } from "@azure/identity";

// Get access token using ClientSecretCredential
async function getAccessToken(): Promise<string> {
  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Missing required environment variables: AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET");
  }

  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
  const tokenResponse = await credential.getToken("https://dynamicsessions.io/.default");
  
  if (!tokenResponse) {
    throw new Error("Failed to get token");
  }

  return tokenResponse.token;
}

export const executor = async (code: string) => {
  const apiUrl = process.env.DYNAMIC_SESSION_URL + "/code/execute?api-version=2024-02-02-preview&identifier=nefuebdd";

  const body = {
    properties: {
        codeInputType: "inline",
        executionType: "synchronous",
        code: code, // No need to JSON.stringify code, it's already a string
    }
  };

  try {
    const token = await getAccessToken();
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return JSON.stringify(data);
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
    return `There has been a problem with your fetch operation: ${error.message}`;
  }
};

export const executor_file = async (file_name: string) => {
  const apiUrl = process.env.DYNAMIC_SESSION_URL + "/files/content/" + file_name + "?api-version=2024-02-02-preview&identifier=nefuebdd";
  const token = await getAccessToken();
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      }
    });

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64File = buffer.toString('base64');
    return base64File;
    } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
    return "There has been a problem with your fetch operation";
  }
};

// export const executor = async (message: string) => {
//     const apiUrl = process.env.LANGCHAIN_EXECUTOR_URL + "?message=" + message;
//     const apiKey = process.env.PROXY_KEY;
//     try {
//       const response = await fetch(apiUrl, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           apiKey: apiKey,
//         },
//       });
  
  
  
//       const data = await response.json();
//       return "```html\n" + JSON.stringify(data.output) + "\n```";
//     } catch (error) {
//       console.error("There has been a problem with your fetch operation:", error);
//       return "There has been a problem with your fetch operation";
//     }
//   };

export const eval_code_in_browser = (code: any) => {
    try {
      const result = `
      <script> ` + JSON.stringify(code) + `
      </script>`;
      return result;
  } catch (error) {
      console.error("There has been a problem with your fetch operation:", error);
      return null;
    }
  }