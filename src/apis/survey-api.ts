import { IApiServerResponseBody } from "../common/interface/interface";
import { fetchToServer } from "./api";
import { ISurveyData } from "./interface/survey.interface";

export default class SurveyApi {
  static async submitSurvey(data: ISurveyData): Promise<IApiServerResponseBody<null>> {
    try {
      const response = await fetchToServer("feedback/test", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const responseBody = await response.json();

      return responseBody;
    } catch (error) {
      throw error;
    }
  }
}
