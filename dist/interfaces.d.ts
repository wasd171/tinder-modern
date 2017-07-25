export declare type XAuthTokenType = string | null;
export declare type LastActivityType = Date;
export declare type UserIdType = string | null;
export declare type DefaultsType = any;
export interface IConstructorArgs {
    lastActivityDate?: LastActivityType;
}
export interface IGeneralRequestHeadersParams {
    'Accept-Language': string;
    'app-version': string;
    'Content-Type': string;
    'User-Agent': string;
    os_version: string;
    platform: string;
    [key: string]: string;
}
export interface IAuthRequestHeadersParams {
    'X-Auth-Token': string;
}
export declare type IRequestHeadersParams = IGeneralRequestHeadersParams & (IGeneralRequestHeadersParams | IAuthRequestHeadersParams);
export interface IHTTPArgs {
    data: any | void;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
}
export interface IAuthorizeArgs {
    fbId: string;
    fbToken: string;
}
export interface ISetAuthTokenArgs {
    token: string;
}
export interface IGetRecommendationsArgs {
    limit: number;
}
export interface ISendMessageArgs {
    matchId: string;
    message: string;
}
export interface ILikeArgs {
    userId: string;
}
export interface IUnmatchArgs {
    matchId: string;
}
export interface IUpdatePositionArgs {
    lat: number;
    lon: number;
}
export interface IUpdateGenderArgs {
    gender: 0 | 1;
}
export interface IUpdateBioArgs {
    bio: string;
}
export interface IUpdateJobArgs {
    id: string;
}
export interface IUpdateSchoolArgs {
    id: string;
}
export interface IUpdatePreferencesArgs {
    ageMax: number;
    ageMin: number;
    discovery: boolean;
    distance: number;
    gender: -1 | 0 | 1;
}
export interface IGetUserArgs {
    userId: string;
}
export interface IUploadPictureArgs {
    file: Blob;
}
export interface IUploadFBPictureArgs {
    pictureId: string;
    xdistance_percent: number;
    xoffset_percent: number;
    ydistance_percent: number;
    yoffset_percent: number;
}
export interface IDeletePictureArgs {
    pictureId: string;
}
export interface IGetShareLinkArgs {
    userId: string;
}
export interface IReportArgs {
    causeId: 0 | 1 | 4;
    causeText: string;
    userId: string;
}
export interface IReportData {
    cause: 0 | 1 | 4;
    text?: string;
}
export interface ICreateUsernameArgs {
    username: string;
}
export interface IUpdatePassportArgs {
    lat: number;
    lon: number;
}
