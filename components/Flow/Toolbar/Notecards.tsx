
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

export function Notecard({content}) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 m-2 w-64">

        <p className="text-gray-700 text-base">{content}</p>
      </div>
    );
  }
  