import { IApiServerResponseBody } from "../common/interface/interface";
import { PaginatedResponse } from "../common/type/type";
import { fetchToServer } from "./api";
import { IPaginationParams } from "./interface/common-api.interface";
import { IPlace, ISearchResultItem } from "./interface/place.interface";

export class PlaceApi {
  static async getPlaceWithToiletList({
    take = 20,
    lastItemId,
  }: {
    take?: number;
    lastItemId?: number | null;
  }): Promise<IApiServerResponseBody<PaginatedResponse<IPlace, "places">>> {
    try {
      let url = `places/toilet?take=${take}`;
      if (lastItemId) {
        url += `&lastItemId=${lastItemId}`;
      }
      const response = await fetchToServer(url);
      if (response.status !== 200) {
        throw new Error(`response.status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  static async searchPlacesByTerm(
    searchTerm: string
  ): Promise<IApiServerResponseBody<ISearchResultItem[]>> {
    try {
      const response = await fetchToServer(`search/places?value=${searchTerm}`, {
        method: "GET",
      });

      const responseBody = await response.json();
      if (responseBody.statusCode !== 200) {
        throw new Error(responseBody.statusCode);
      }
      return responseBody;
    } catch (error) {
      console.log("searchPlacesByTerm", error);

      throw error;
    }
  }
}
