type AzureRetailPricesResponse = {
    Items: Array<any>;
    NextLink: string;
};

type FilterParams = {
    currencyCode?: string;
    unitOfMeasure?: string;
    serviceName?: string;
    priceType?: string;
    armRegionName?: string;
    meterId?: string;
    meterName?: string;
    productid?: string;
    skuId?: string;
    productName?: string;
    serviceId?: string;
    serviceFamily?: string;
    armSkuName?: string;
};

export const get_azure_retail_prices = async (
    format: "json" = "json",
    filterParams?: FilterParams,
    skip: number = 0,
    top: number = 1000,
    maxLength: number = 10000 // Maximum length of the returned string
): Promise<any> => {
    // Base URL for the Azure Retail Prices API
    const apiUrl = new URL("https://prices.azure.com/api/retail/prices");

    // Append the currencyCode parameter to the URL if it exists
    if (filterParams?.currencyCode) {
        apiUrl.searchParams.append("currencyCode", filterParams.currencyCode);
    }

    // Build the $filter parameter
    const filterConditions = [];
    if (filterParams?.serviceName) filterConditions.push(`serviceName eq '${filterParams.serviceName}'`);
    if (filterParams?.priceType) filterConditions.push(`priceType eq '${filterParams.priceType}'`);
    if (filterParams?.serviceFamily) filterConditions.push(`serviceFamily eq '${filterParams.serviceFamily}'`);
    if (filterParams?.armRegionName) filterConditions.push(`armRegionName eq '${filterParams.armRegionName}'`);
    if (filterParams?.meterId) filterConditions.push(`meterId eq '${filterParams.meterId}'`);
    if (filterParams?.meterName) filterConditions.push(`meterName eq '${filterParams.meterName}'`);
    if (filterParams?.productid) filterConditions.push(`productid eq '${filterParams.productid}'`);
    if (filterParams?.skuId) filterConditions.push(`skuId eq '${filterParams.skuId}'`);
    if (filterParams?.productName) filterConditions.push(`productName eq '${filterParams.productName}'`);
    if (filterParams?.serviceId) filterConditions.push(`serviceId eq '${filterParams.serviceId}'`);
    if (filterParams?.armSkuName) filterConditions.push(`armSkuName eq '${filterParams.armSkuName}'`);

    if (filterConditions.length > 0) {
        apiUrl.searchParams.append("$filter", filterConditions.join(" and "));
    }

    // Handle pagination
    if (skip > 0) {
        apiUrl.searchParams.append("$skip", skip.toString());
    }

    if (top > 0) {
        apiUrl.searchParams.append("$top", top.toString());
    }

    console.log("API URL:", apiUrl.toString());

    try {
        // Fetch data from the API
        const response = await fetch(apiUrl.toString());

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`Error fetching Azure retail prices: ${response.statusText}`);
        }

        // Parse the response JSON
        const data: AzureRetailPricesResponse = await response.json();

        if (!data.Items || data.Items.length === 0) {
            return "It seems there are no current retail prices available.";
        }

        // Create a summary of the items with all possible filter params
        const summary = data.Items.slice(skip, skip + top).map(item => ({
            currencyCode: item.currencyCode,
            unitOfMeasure: item.unitOfMeasure,
            serviceName: item.serviceName,
            priceType: item.priceType,
            armRegionName: item.armRegionName,
            meterName: item.meterName,
            productid: item.productid,
            productName: item.productName,
            serviceId: item.serviceId,
            serviceFamily: item.serviceFamily,
            armSkuName: item.armSkuName,
            retailPrice: item.retailPrice,
        }));

        let result = JSON.stringify(summary, null, 2);

        // Check if the result is too long and truncate if necessary
        if (result.length > maxLength) {
            result = result.substring(0, maxLength) + "... (truncated)";
        }

        return result;

    } catch (error) {
        // Handle any errors
        console.error("Error URL:", apiUrl.toString());
        return `An error occurred: ${error.message}`;
    }
};
