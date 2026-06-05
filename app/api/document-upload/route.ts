import { NextResponse } from "next/server";
import mammoth from "mammoth";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let text = "";

    if (file.name.endsWith(".docx")) {
      const result = await mammoth.extractRawText({
        buffer,
      });

      text = result.value;
    }

    else if (file.name.endsWith(".txt")) {
      text = buffer.toString("utf8");
    }

    else {
      return NextResponse.json(
        {
          error:
            "Only DOCX and TXT files are supported",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json({
      text,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        error: "File processing failed",
      },
      {
        status: 500,
      }
    );

  }
}