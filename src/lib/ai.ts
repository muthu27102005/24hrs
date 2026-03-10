import axios from "axios";

export async function detectWaste(imageUrl: string) {
  const response = await axios.post(
    "https://detect.roboflow.com/waste-detection/1",
    {
      image: imageUrl
    },
    {
      params: {
        api_key: process.env.ROBOFLOW_API_KEY
      }
    }
  );

  return response.data;
}