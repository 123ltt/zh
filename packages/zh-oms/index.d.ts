export const routes: any[];

export const pageRoutes: any[];

type apiPrefixArr = [string, string][];
type apiPrefixFn = (isSaas: boolean) => apiPrefixArr;
export const apiPrefix: apiPrefixArr | apiPrefixFn;