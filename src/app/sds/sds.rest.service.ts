import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import sdsConfig from '../config/sdsconfig.json';
import { SdsConfig } from '../config/sdsconfig.js';

export class SdsStream {
  Id: string;
  Name: string;
  Description: string;
  TypeId: string;
  PropertyOverrides: SdsStreamPropertyOverride[];
  Indexes: SdsStreamIndex[];
}

export class SdsType {
  Id: string;
  Name: string;
  Description: string;
  SdsTypeCode: SdsTypeCode;
  Properties: SdsTypeProperty[];
}

export enum SdsTypeCode {
  Empty = 0,
  Object = 1,
  DBNull = 2,
  Boolean = 3,
  Char = 4,
  SByte = 5,
  Byte = 6,
  Int16 = 7,
  UInt16 = 8,
  Int32 = 9,
  UInt32 = 10,
  Int64 = 11,
  UInt64 = 12,
  Single = 13,
  Double = 14,
  Decimal = 15,
  DateTime = 16,
  String = 18,
  Guid = 19,
  DateTimeOffset = 20,
  TimeSpan = 21,
  Version = 22,
}

export enum SdsStreamMode {
  Continuous = 0,
  StepWiseContinuousLeading = 1,
  StepwiseContinuousTrailing = 2,
  Discrete = 3,
}

export class SdsStreamPropertyOverride {
  SdsTypePropertyId: string;
  Uom: string;
  InterpolationMode: SdsStreamMode;
}

export class SdsStreamIndex {
  SdsTypePropertyId: string;
}

export class SdsTypeProperty {
  Id: string;
  Name: string;
  Description: string;
  SdsType: SdsType;
  IsKey: boolean;
  Order: number;
}

export enum SdsBoundaryType {
  Exact = 0,
  Inside = 1,
  Outside = 2,
  ExactOrCalculated = 3,
}

export class SdsStreamView {
  Id: string;
  Name: string;
  Description: string;
  SourceTypeId: string;
  TargetTypeId: string;
  Properties: SdsStreamViewProperty[];
}

export class SdsStreamViewProperty {
  SourceId: string;
  TargetId: string;
  SdsStreamView: SdsStreamView;
}

export class SdsStreamViewMap {
  SourceTypeId: string;
  TargetTypeId: string;
  Properties: SdsStreamViewProperty[];
}

@Injectable()
export class SdsRestService {
  // Constants
  TenantAdministratorRoleTypeId = '2dc742ab-39ea-4fc0-a39e-2bcb71c26a5f';
  TenantContributorRoleTypeId = 'f1439595-e5a2-487f-8a4f-0627fefe75df';
  TenantDataStewardRoleTypeId = '45b66433-5f57-420b-bbdf-8bbd60c1cd9d';
  TenantMemberRoleTypeId = '7ad2b9ef-5386-4ead-ac9f-ad99c5c5b977';
  TenantViewerRoleTypeId = 'e6cbf91e-0be8-4858-92b5-f88ecafd5574';

  CommunityAdministratorRoleTypeId = 'b50b3349-fa9e-4a03-9220-cf99184b4645';
  CommunityModeratorRoleTypeId = 'f49f69a6-61b2-423e-8ad5-d58841be441c';
  CommunityMemberRoleTypeId = 'f79a55da-7c76-4600-a809-0f62ca9971d9';

  sdsUrl: string;
  tenantId: string;
  namespaceId: string;
  communityId: string;
  apiVersion: string;
  options: any;

  constructor(private authHttp: HttpClient) {
    const config = sdsConfig as SdsConfig;
    this.sdsUrl = config.serviceBaseUri;
    this.tenantId = config.tenantId;
    this.namespaceId = config.namespaceId;
    this.communityId = config.communityId;
    this.apiVersion = config.apiVersion;
    this.options = {
      observe: 'response',
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
    };
  }

  createStream(sdsStream: SdsStream): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/${sdsStream.Id}`;
    return this.authHttp.post(
      url,
      JSON.stringify(sdsStream).toString(),
      this.options
    );
  }

  updateStream(sdsStream: SdsStream): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/${sdsStream.Id}`;
    return this.authHttp.put(
      url,
      JSON.stringify(sdsStream).toString(),
      this.options
    );
  }

  getStream(streamId: string): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/${streamId}`;
    return this.authHttp.get(url, this.options);
  }

  getStreams(query: string): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams?query=${query}`;
    return this.authHttp.get(url, this.options);
  }

  deleteStream(streamId: string): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/${streamId}`;
    return this.authHttp.delete(url, this.options);
  }

  createTags(streamId: string, tags: string[]): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/${streamId}/Tags`;
    return this.authHttp.put(
      url,
      JSON.stringify(tags).toString(),
      this.options
    );
  }

  createMetadata(streamId: string, metadata: object): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/${streamId}/Metadata`;
    return this.authHttp.put(
      url,
      JSON.stringify(metadata).toString(),
      this.options
    );
  }

  patchMetadata(streamId: string, metadata: object): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/${streamId}/Metadata`;
    return this.authHttp.patch(
      url,
      JSON.stringify(metadata).toString(),
      this.options
    );
  }

  getTags(streamId: string): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/${streamId}` +
      `/Tags`;
    return this.authHttp.get(url, this.options);
  }

  getMetadata(streamId: string): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/${streamId}` +
      `/Metadata`;
    return this.authHttp.get(url, this.options);
  }

  getLastValue(streamId: string): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/${streamId}` +
      `/Data/Last`;
    return this.authHttp.get(url, this.options);
  }

  getWindowValues(
    streamId: string,
    start: string | number,
    end: string | number,
    filter: string = ''
  ): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/${streamId}` +
      `/Data?startIndex=${start}&endIndex=${end}` +
      `${filter ? `&filter=${filter}` : ''}`;
    return this.authHttp.get(url, this.options);
  }

  getSampledValues(
    streamId: string,
    start: string | number,
    end: string | number,
    intervals: string | number,
    sampleBy: string,
    filter: string = '',
    streamViewId = ''
  ): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/${streamId}` +
      `/Data/Sampled?startIndex=${start}&endIndex=${end}&intervals=${intervals}&sampleBy=${sampleBy}` +
      `${filter ? `&filter=${filter}` : ''}${
        streamViewId ? `&streamViewId=${streamViewId}` : ''
      }`;
    return this.authHttp.get(url, this.options);
  }

  getWindowValuesInterpolated(
    streamId: string,
    start: string | number,
    end: string | number,
    count: number
  ): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/${streamId}` +
      `/Data/Transform/Interpolated?startIndex=${start}&endIndex=${end}&count=${count}`;
    return this.authHttp.get(url, this.options);
  }

  getRangeValues(
    streamId: string,
    start: string | number,
    count: number,
    boundary: SdsBoundaryType,
    streamViewId: string = ''
  ): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/${streamId}` +
      `/Data/Transform?startIndex=${start}&count=${count}&boundaryType=${boundary}` +
      `${streamViewId ? `&streamViewId=${streamViewId}` : ''}`;
    return this.authHttp.get(url, this.options);
  }

  getRangeValuesHeaders(
    streamId: string,
    start: string | number,
    count: number,
    boundary: SdsBoundaryType,
    streamViewId: string = ''
  ): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/${streamId}` +
      `/Data/Transform?startIndex=${start}&count=${count}&boundaryType=${boundary}` +
      `${streamViewId ? `&streamViewId=${streamViewId}` : ''}&form=tableh`;
    return this.authHttp.get(url, this.options);
  }

  getTypes(skip: number, count: number, query: string = ''): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Types?skip=${skip}&count=${count}` +
      `${query ? `&query=${query}` : ''}`;
    return this.authHttp.get(url, this.options);
  }

  createType(sdsType: SdsType): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Types/${sdsType.Id}`;
    return this.authHttp.post(url, sdsType, this.options);
  }

  updateStreamType(streamId: string, streamViewId: string): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/${streamId}/Type` +
      `?streamViewId=${streamViewId}`;
    return this.authHttp.put(url, '', this.options);
  }

  deleteType(typeId: string): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Types/${typeId}`;
    return this.authHttp.delete(url, this.options);
  }

  insertValues(streamId: string, events: Array<any>): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/${streamId}/Data`;
    return this.authHttp.post(
      url,
      JSON.stringify(events).toString(),
      this.options
    );
  }

  updateValues(streamId: string, events: Array<any>): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/${streamId}/Data`;
    return this.authHttp.put(
      url,
      JSON.stringify(events).toString(),
      this.options
    );
  }

  replaceValues(streamId: string, events: Array<any>): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/${streamId}/Data?allowCreate=false`;
    return this.authHttp.put(
      url,
      JSON.stringify(events).toString(),
      this.options
    );
  }

  createStreamView(sdsStreamView: SdsStreamView): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/StreamViews/${sdsStreamView.Id}`;
    return this.authHttp.post(
      url,
      JSON.stringify(sdsStreamView).toString(),
      this.options
    );
  }

  deleteStreamView(streamViewId: string): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/StreamViews/${streamViewId}`;
    return this.authHttp.delete(url, this.options);
  }

  getStreamViewMap(streamViewId: string): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/StreamViews/${streamViewId}/Map`;
    return this.authHttp.get(url, this.options);
  }

  deleteValue(streamId: string, index: string): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/${streamId}/Data?index=${index}`;
    return this.authHttp.delete(url, this.options);
  }

  deleteWindowValues(
    streamId: string,
    start: string | number,
    end: string | number
  ): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/` +
      `${streamId}/Data?startIndex=${start}&endIndex=${end}`;
    return this.authHttp.delete(url, this.options);
  }

  getTenantRoles(): Observable<any> {
    const url =
      this.sdsUrl + `/api/${this.apiVersion}/Tenants/${this.tenantId}/Roles`;
    return this.authHttp.get(url, this.options);
  }

  patchStreamAccessControl(streamId: string, patch: any[]): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}/Tenants/${this.tenantId}/Namespaces/${this.namespaceId}/Streams/` +
      `${streamId}/AccessControl`;
    return this.authHttp.patch(url, JSON.stringify(patch), this.options);
  }

  getCommunityStreams(query: string): Observable<any> {
    const url =
      this.sdsUrl +
      `/api/${this.apiVersion}-preview/Tenants/${this.tenantId}/Search/Communities/` +
      `${this.communityId}/Streams?query=${query}`;
    return this.authHttp.get(url, this.options);
  }

  getLastValueSelf(self: string): Observable<any> {
    const url = self + '/Data/Last';
    return this.authHttp.get(url, this.options);
  }
}
